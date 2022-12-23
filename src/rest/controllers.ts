import type { Request, Response } from "express"

import { prisma } from "../client"

export async function createAccount(req: Request, res: Response) {
  try {
    if (!req.authenticated) {
      res.status(401).send("Unauthorized")
    } else {
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

        console.log("account created done")
      }

      res.status(200).json({ status: "Ok" })
    }
  } catch (error) {
    console.error((error as any).message)
    res.status(500).send((error as any).message)
  }
}
