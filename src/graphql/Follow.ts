import {
  extendType,
  objectType,
  nullable,
  nonNull,
  intArg,
  stringArg,
} from "nexus"
import { NexusGenObjects } from "../typegen"

export const Follow = objectType({
  name: "Follow",
  definition(t) {
    t.nonNull.string("id")
    t.nonNull.string("tokenId")
  },
})
