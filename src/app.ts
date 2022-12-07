// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Unreachable code error
BigInt.prototype.toJSON = function (): string {
  return this.toString()
}

import path from "path"
import dotenv from "dotenv"
dotenv.config({ path: path.join(__dirname, "../.env") })
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import http from "http"
import workerpool from "workerpool"
import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"
import { Profile, Prisma } from "@prisma/client"

import { schema } from "./schema"
import { context, Context } from "./context"
import { prisma } from "./client"
import { Environment } from "./types"

const { PORT, NODE_ENV } = process.env
const env = NODE_ENV as Environment

// // Create a worker pool to run a worker for Ethereum event listeners.
// const pool = workerpool.pool(
//   path.resolve(__dirname, "listeners", "worker.js"),
//   {
//     minWorkers: 1,
//     maxWorkers: 1,
//     workerType: "thread",
//   }
// )
// pool
//   .exec("start", [], {
//     on: (payload) => {
//       if (payload.status === "start") {
//         console.log("Start listeners")
//       }
//     },
//   })
//   .then(() => {})
//   .catch((error) => {
//     console.log("error -->", error)
//   })

async function startServer() {
  const app = express()
  // app.use(express.json()) // for parsing application/json
  // app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
  // app.use(cors())

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
      //   },
      // })
      const profiles = await prisma.profile.findMany({
        include: {
          // account: {
          //   select: {
          //     address: true,
          //   },
          // },
          followers: {
            select: {
              follower: {
                select: {
                  id: true,
                  tokenId: true,
                  createdAt: true,
                  handle: true,
                  imageURI: true,
                  originalHandle: true,
                },
              },
            },
          },
          following: {
            select: {
              followee: {
                select: {
                  id: true,
                  tokenId: true,
                  createdAt: true,
                  handle: true,
                  imageURI: true,
                  originalHandle: true,
                },
              },
            },
          },
          // publishes: {
          //   include: {
          //     comments: {
          //       include: {
          //         comments: true,
          //         likes: true,
          //         disLikes: true,
          //       },
          //     },
          //     likes: true,
          //     disLikes: true,
          //   },
          // },
          // sentFees: true,
          // receivedFees: true,
        },
      })

      const test = profiles.map((profile) => {
        const followers = profile.followers.map((fol) => fol.follower)
        const following = profile.following.map((fol) => fol.followee)

        return { ...profile, followers, following }
      })
      // const accounts = await prisma.account.findMany()
      // const follows = await prisma.follow.findMany()
      // const publishes = await prisma.publish.findMany()
      // await prisma.account.deleteMany({})

      res.status(200).json({ profiles: test })
      // res.status(200).json({ accounts })
      // res.status(200).json({ follows })
      // res.status(200).json({ publishes })
      // res.status(200).json({ status: "Ok" })
    } catch (error) {
      console.log("error -->", error)
      res.status(500)
    }
  })

  const httpServer = http.createServer(app)

  // Set up ApolloServer.
  const server = new ApolloServer<Context>({
    schema,
    csrfPrevention: true,
    // cache: '',
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    introspection: env !== "production", // Only in development and staging env.
  })

  await server.start()
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async () => context,
    })
  )
  // server.applyMiddleware({ app })

  await new Promise<void>((resolver) => {
    httpServer.listen({ port: Number(PORT) }, resolver)
  })

  console.log(`APIs ready at port: ${PORT}`)
  // httpServer.listen({ port: PORT || 8080 }, () => {
  //   console.log(`Server ready at port: ${PORT}`)
  // })

  return { server, app }
}

startServer()

// list auth: gcloud auth list
// logout: cloud auth revoke <email>
// login: cloud auth login
// set project: gcloud config set project <project_id>
// set default zone: gcloud config set compute/zone <us-central1-a>
// Artifact registry
// 1. gcloud auth configure-docker us-docker.pkg.dev
// 2. gcloud builds submit --tag us-docker.pkg.dev/${GOOGLE_CLOUD_PROJECT}/events/events-service:0.0.1 .
// 3. gcloud run deploy events-service --image us-docker.pkg.dev/content-base-b78d7/events/events-service:0.0.1 --platform managed --allow unauthenticated --add cloudsql-instances $CONNECTION_NAME
