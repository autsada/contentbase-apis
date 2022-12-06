// eslint-disable-next-line @typescript-eslint/ban-ts-comment      <-- Necessary for my ESLint setup
// @ts-ignore: Unreachable code error                              <-- BigInt does not have `toJSON` method
BigInt.prototype.toJSON = function (): string {
  return this.toString()
}

import path from "path"
import dotenv from "dotenv"
dotenv.config({ path: path.join(__dirname, "../.env") })
import express from "express"
import cors from "cors"
import http from "http"

import { prisma } from "./client"

const { PORT } = process.env

const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())

app.get("/test", async (req, res) => {
  try {
    // const account = await prisma.account.findUnique({
    //   where: {
    //     // address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8".toLowerCase(),
    //     address: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc".toLowerCase(),
    //   },
    //   include: {
    //     profiles: {
    //       include: {
    //         followers: {
    //           include: { follower: true },
    //         },
    //         following: { include: { followee: true } },
    //       },
    //     },
    //   },ƒ
    // })
    const profiles = await prisma.profile.findMany({
      include: {
        followers: {
          select: {
            tokenId: true,
            followerId: true,
            follower: {
              select: {
                id: true,
                handle: true,
              },
            },
          },
        },
        following: {
          select: {
            tokenId: true,
            followeeId: true,
            followee: {
              select: {
                id: true,
                handle: true,
              },
            },
          },
        },
        publishes: {
          include: {
            comments: {
              include: { comments: true, likes: true, disLikes: true },
            },
          },
        },
      },
    })
    // const accounts = await prisma.account.findMany()
    // const follows = await prisma.follow.findMany()
    // const publishes = await prisma.publish.findMany()
    // await prisma.account.deleteMany({})

    res.status(200).json({ profiles })
    // res.status(200).json({ accounts })
    // res.status(200).json({ follows })
    // res.status(200).json({ publishes })
    // res.status(200).json({ status: "Ok" })
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

// list auth: gcloud auth list
// logout: cloud auth revoke <email>
// login: cloud auth login
// set project: gcloud config set project <project_id>
// set default zone: gcloud config set compute/zone <us-central1-a>
// Artifact registry
// 1. gcloud auth configure-docker us-docker.pkg.dev
// 2. gcloud builds submit --tag us-docker.pkg.dev/${GOOGLE_CLOUD_PROJECT}/events/events-service:0.0.1 .
// 3. gcloud run deploy events-service --image us-docker.pkg.dev/content-base-b78d7/events/events-service:0.0.1 --platform managed --allow unauthenticated --add cloudsql-instances $CONNECTION_NAME
