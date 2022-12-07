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
      //   NODE_ENV === "production" || NODE_ENV === "staging"
      NODE_ENV === "production" ? "context.js" : "src/context.ts"
    ),
    export: "Context",
  },
})
