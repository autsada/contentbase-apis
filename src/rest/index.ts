import type { Request, Response } from "express"

import { prisma } from "../client"

const { API_ACCESS_TOKEN } = process.env

export async function createAccount(req: Request, res: Response) {
  try {
    // Verify the headers.
    const authorization = req.headers["Authorization"]
    if (!authorization) throw new Error("Not allow")

    console.log("headers: ", req.headers)
    const accessToken = (authorization as string).split(" ")[1]
    console.log("token -->", accessToken, " : ", API_ACCESS_TOKEN)
    if (!accessToken || accessToken !== API_ACCESS_TOKEN)
      throw new Error("Not allow")

    const { address, uid, accountType } = req.body as {
      address: string
      uid: string
      accountType: "TRADITIONAL" | "WALLET"
    }
    console.log("address: ", address)
    console.log("uid: ", uid)
    console.log("accountType: ", accountType)
    const formattedAddress = address.toLowerCase()

    let account = await prisma.account.findUnique({
      where: {
        address: formattedAddress,
      },
    })

    console.log("account: ", account)
    if (!account) {
      await prisma.account.create({
        data: {
          createdAt: new Date(),
          address: formattedAddress,
          uid: uid,
          type: accountType,
        },
      })
    }

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    console.log("error", error)
    res.status(500).send((error as any).message)
  }
}
