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
      await axios({
        method: "PUT",
        url: `${CLOUDFLAR_BASE_URL}/${CLOUDFLAR_ACCOUNT_ID}/stream/webhook`,
        headers: {
          Authorization: `Bearer ${CLOUDFLAR_API_TOKEN}`,
        },
        data: {
          notificationUrl: webhookURL,
        },
      })

      res.status(200).json({ status: "Ok" })
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

export function onTranscodingFinished(req: Request, res: Response) {
  try {
    if (!req.isWebhookSignatureValid) {
      res.status(403).send("Forbidden")
    } else {
      console.log("body -->", req.body)

      res.status(200).end()
    }
  } catch (error) {
    console.log("error -->", error)
    res.status(500).end()
  }
}

// const reqBody = {
//   uid: '7dd31fc52804c0470d398787f7eb0dd5',
//   creator: null,
//   thumbnail: 'https://customer-ndc778ybs24fn8ir.cloudflarestream.com/7dd31fc52804c0470d398787f7eb0dd5/thumbnails/thumbnail.jpg',
//   thumbnailTimestampPct: 0,
//   readyToStream: true,
//   status: {
//     state: 'ready',
//     step: 'encoding',
//     pctComplete: '33.000000',
//     errorReasonCode: '',
//     errorReasonText: ''
//   },
//   meta: {
//     'downloaded-from': 'https://storage.googleapis.com/content-base-b78d7.appspot.com/videos/vid1.mp4?GoogleAccessId=content-base-b78d7%40appspot.gserviceaccount.com&Expires=1671769402&Signature=ZUMiD2rMih3Gr%2FFKoXWHwtZU8wUbTKaakYnmKfNLgmGMRCsH%2BdkTASRPtgE5RpDr6lbPreoHiB1Jw6PEYM4ntk8o7BhlIigczYWC%2FHgHY0QPgq0PvbrWBgx6Sm%2F4NB6qKv%2FB7DjnvXlNVQ4iN%2Bo2JGxKl8cvFlWbu804jT8dSll1foU6XhK2WzBnwQn1cQLzs9CNh1AMXS%2FJWcPqlj9lg5YUfvafFzbFlNBsO2ZEMGIWQ3Jnm9o7SQVf4yu7z86460EjQHuS0Sexmx6PEqueR95zzEJliU4nx23l1OuKgHSjKsyoltMPPkGP1i0i1Awd%2BYYgKRLNkxKq04%2FLFlZ6xA%3D%3D',
//     name: 'vid1.mp4',
//     path: 'videos/vid1.mp4'
//   },
//   created: '2022-12-23T03:23:22.372084Z',
//   modified: '2022-12-23T03:23:29.534221Z',
//   size: 5110353,
//   preview: 'https://customer-ndc778ybs24fn8ir.cloudflarestream.com/7dd31fc52804c0470d398787f7eb0dd5/watch',
//   allowedOrigins: [],
//   requireSignedURLs: false,
//   uploaded: '2022-12-23T03:23:22.372074Z',
//   uploadExpiry: null,
//   maxSizeBytes: null,
//   maxDurationSeconds: null,
//   duration: 14.6,
//   input: { width: 720, height: 1280 },
//   playback: {
//     hls: 'https://customer-ndc778ybs24fn8ir.cloudflarestream.com/7dd31fc52804c0470d398787f7eb0dd5/manifest/video.m3u8',
//     dash: 'https://customer-ndc778ybs24fn8ir.cloudflarestream.com/7dd31fc52804c0470d398787f7eb0dd5/manifest/video.mpd'
//   },
//   watermark: null,
//   clippedFrom: null,
//   publicDetails: null
// }
