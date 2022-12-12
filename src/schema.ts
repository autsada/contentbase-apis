import path from "path"
import { makeSchema } from "nexus"

import * as types from "./graphql"

const { NODE_ENV } = process.env

export const schema = makeSchema({
  types,
  //   plugins: [],
  outputs: {
    typegen: path.join(process.cwd(), "src/typegen.ts"),
    schema: path.join(process.cwd(), "src/schema.graphql"),
  },
  contextType: {
    module: path.join(
      process.cwd(),
      `src/${NODE_ENV === "development" ? "context.ts" : "context.js"}`
    ),
    export: "Context",
  },
})
