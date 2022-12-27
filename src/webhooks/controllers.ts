import type { Request, Response } from "express"
import axios from "axios"

import { prisma } from "../client"

const { CLOUDFLAR_BASE_URL, CLOUDFLAR_API_TOKEN, CLOUDFLAR_ACCOUNT_ID } =
  process.env

/**
 * TODO: add authorization for the admin user only.
 */
export async function createTranscodeWebhook(req: Request, res: Response) {
  try {
    const { webhookURL } = req.body as { webhookURL: string }
    if (!webhookURL) {
      res.status(400).send("Bad Request")
    } else {
      const response = await axios({
        method: "PUT",
        url: `${CLOUDFLAR_BASE_URL}/${CLOUDFLAR_ACCOUNT_ID}/stream/webhook`,
        headers: {
          Authorization: `Bearer ${CLOUDFLAR_API_TOKEN}`,
        },
        data: {
          notificationUrl: webhookURL,
        },
      })

      res
        .status(200)
        .json({ result: response.data.result, success: response.data.success })
    }
  } catch (error) {
    res.status(500).end()
  }
}

/**
 * TODO: add authorization for the admin user only.
 */
export async function deleteTranscodeWebhook(req: Request, res: Response) {
  try {
    await axios({
      method: "DELETE",
      url: `${CLOUDFLAR_BASE_URL}/${CLOUDFLAR_ACCOUNT_ID}/stream/webhook`,
      headers: {
        Authorization: `Bearer ${CLOUDFLAR_API_TOKEN}`,
      },
    })

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).end()
  }
}

export async function onTranscodingFinished(req: Request, res: Response) {
  try {
    if (!req.isWebhookSignatureValid) {
      res.status(403).send("Forbidden")
    } else {
      const body = req.body

      // `readyToStream` is a boolean that indicate if the playback urls are ready.
      if (body.readyToStream) {
        // Create (if not exist) or update (if exists) a playback in the database.
        const playback = await prisma.playback.findUnique({
          where: {
            contentRef: body.meta?.path,
          },
        })

        if (!playback) {
          await prisma.playback.create({
            data: {
              thumbnail: body.thumbnail,
              preview: body.preview,
              duration: body.duration,
              hls: body.playback?.hls,
              dash: body.playback?.dash,
              contentRef: body.meta?.path,
            },
          })
        } else {
          await prisma.playback.update({
            where: {
              contentRef: playback.contentRef,
            },
            data: {
              thumbnail: body.thumbnail,
              preview: body.preview,
              duration: body.duration,
              hls: body.playback?.hls,
              dash: body.playback?.dash,
              contentRef: body.meta?.path,
            },
          })
        }
      }

      res.status(200).end()
    }
  } catch (error) {
    res.status(500).end()
  }
}
