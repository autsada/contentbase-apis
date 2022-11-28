import path from "path"
import dotenv from "dotenv"
dotenv.config({ path: path.join(__dirname, "../.env") })
import express from "express"
import cors from "cors"
import http from "http"

import { startProfileContractListening } from "./lib/profile-contract"
import { prisma } from "./client"

const { PORT } = process.env

const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())

app.get("/test", async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      include: { publishes: true },
    })

    res.status(200).json({ profiles })
  } catch (error) {
    console.log("error -->", error)
    res.status(500)
  }
})

// Create the HTTP server
const httpServer = http.createServer(app)

httpServer.listen({ port: PORT || 8080 }, () => {
  console.log(`Server ready at port: ${PORT}`)
})

startProfileContractListening()

// list auth: gcloud auth list
// logout: cloud auth revoke <email>
// login: cloud auth login
// set project: gcloud config set project <project_id>
// set default zone: gcloud config set compute/zone <us-central1-a>
// Artifact registry
// 1. gcloud auth configure-docker us-docker.pkg.dev
// 2. gcloud builds submit --tag us-docker.pkg.dev/${GOOGLE_CLOUD_PROJECT}/events/events-service:0.0.1 .
// 3. gcloud run deploy events-service --image us-docker.pkg.dev/content-base-b78d7/events/events-service:0.0.1 --platform managed --allow unauthenticated --add cloudsql-instances $CONNECTION_NAME
