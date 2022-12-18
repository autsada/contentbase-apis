import type { Request, Response } from "express"

import { prisma } from "../client"
import { logger } from "../utils/logger"

const { API_ACCESS_TOKEN } = process.env

export async function createAccount(req: Request, res: Response) {
  try {
    // Verify the headers.
    const authorization = req.headers["authorization"]
    if (!authorization) throw new Error("Not allow")

    const accessToken = authorization.split(" ")[1]
    if (!accessToken || accessToken !== API_ACCESS_TOKEN)
      throw new Error("Not allow")

    const { address, uid, accountType } = req.body as {
      address: string
      uid: string
      accountType: "TRADITIONAL" | "WALLET"
    }
    const formattedAddress = address.toLowerCase()

    let account = await prisma.account.findUnique({
      where: {
        address: formattedAddress,
      },
    })

    if (!account) {
      await prisma.account.create({
        data: {
          createdAt: new Date(),
          address: formattedAddress,
          uid: uid,
          type: accountType,
        },
      })

      logger.info("account created done")
    }

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    logger.error((error as any).message)
    res.status(500).send((error as any).message)
  }
}
