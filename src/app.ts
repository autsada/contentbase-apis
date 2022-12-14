import path from "path"
import dotenv from "dotenv"
dotenv.config({ path: path.join(__dirname, "../.env") })
import express from "express"
import cors from "cors"
import http from "http"
import workerpool from "workerpool"
import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache"

import { schema } from "./schema"
import { context, Context } from "./context"
import { restRouter } from "./rest/router"
import { webhookRouter } from "./webhooks/router"
import { Environment } from "./types"

const { PORT, NODE_ENV } = process.env
const env = NODE_ENV as Environment

// Create a worker pool to run a worker for Ethereum event listeners.
const pool = workerpool.pool(
  path.resolve(
    __dirname,
    "listeners",
    env === "development" ? "worker-dev.js" : "worker.js"
  ),
  {
    minWorkers: 1,
    maxWorkers: 1,
    workerType: "thread",
  }
)
pool
  .exec("start", [], {
    on: (payload) => {
      if (payload.status === "start") {
        console.log("Start listeners")
      }
    },
  })
  .then(() => {})
  .catch((error) => {
    console.error("error: ", error)
  })

async function startServer() {
  const app = express()

  app.use(
    express.json({
      verify: (req, res, buf) => {
        req.rawBody = buf.toString("utf-8")
      },
    })
  )
  app.use(express.urlencoded({ extended: true }))
  app.use(cors<cors.CorsRequest>())

  // Rest api route.
  app.use("/api", restRouter)

  // Webhooks api route.
  app.use("/webhooks", webhookRouter)

  const httpServer = http.createServer(app)

  // Set up ApolloServer.
  const server = new ApolloServer<Context>({
    schema,
    csrfPrevention: true,
    cache: new InMemoryLRUCache({
      // ~100MiB
      maxSize: Math.pow(2, 20) * 100,
      // 5 minutes (in milliseconds)
      ttl: 300_000,
    }),
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
    expressMiddleware(server, {
      context: async () => context,
    })
  )

  await new Promise<void>((resolver) => {
    httpServer.listen({ port: Number(PORT) }, resolver)
  })
  console.log(`APIs ready at port: ${PORT}`)

  return { server, app }
}

startServer()
