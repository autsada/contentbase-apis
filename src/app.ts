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
import * as lw from "@google-cloud/logging-winston"

import { schema } from "./schema"
import { context, Context } from "./context"
import { createAccount } from "./rest"
import { logger } from "./utils/logger"
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
        logger.info("Start listeners")
      }
    },
  })
  .then(() => {})
  .catch((error) => {
    logger.error("error: ", error)
  })

async function startServer() {
  // Create a middleware that will use the provided logger.
  // A Cloud Logging transport will be created automatically
  // and added onto the provided logger.
  const mw = await lw.express.makeMiddleware(logger)
  const app = express()

  // Use the logging middleware.
  app.use(mw)
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cors<cors.CorsRequest>())

  // Rest api for creating account.
  app.post("/account/create", createAccount)

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
  logger.info(`APIs ready at port: ${PORT}`)

  return { server, app }
}

startServer()
