import { Router } from "express"

import { validateSignature } from "./middlewares"
import {
  createTranscodeWebhook,
  deleteTranscodeWebhook,
  onTranscodingFinished,
} from "./controllers"

export const webhookRouter = Router()

// An endpoint to create a transcoding webhook
webhookRouter.post("/transcode", createTranscodeWebhook)
// An endpoint to delete a transcoding webhook
webhookRouter.delete("/transcode", deleteTranscodeWebhook)
// An endpoint to be called from the transcoder when the video transcoding is done.
webhookRouter.post(
  "/transcode/callback",
  validateSignature,
  onTranscodingFinished
)
