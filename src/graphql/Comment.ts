import { objectType, extendType, inputObjectType, nonNull } from "nexus"

export const Comment = objectType({
  name: "Comment",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("tokenId")
    t.nonNull.field("createdAt", { type: "DateTime" })
    t.field("updatedAt", { type: "DateTime" })
    t.nonNull.string("contentURI")
    t.string("text")
    t.string("mediaURI")
  },
})
