import { extendType, objectType, nullable } from "nexus"

import { NexusGenObjects } from "../typegen"

export const Edge = objectType({
  name: "Edge",
  definition(t) {
    t.string("cursor")
    t.field("node", { type: "Profile" })
  },
})

export const PageInfo = objectType({
  name: "PageInfo",
  definition(t) {
    t.string("endCursor")
    t.boolean("hasNextPage")
  },
})

export const Response = objectType({
  name: "Response",
  definition(t) {
    t.nonNull.field("pageInfo", { type: "PageInfo" })
    t.nonNull.list.field("edges", { type: "Edge" })
  },
})

export const Account = objectType({
  name: "Account",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.field("createdAt", { type: "DateTime" })
    t.field("updatedAt", { type: "DateTime" })
    t.nonNull.string("address")
    t.nonNull.list.field("profiles", {
      type: "Profile",
      resolve: async (parent, _, { prisma }) => {
        const profiles = await prisma.account
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .profiles()

        if (!profiles || profiles.length === 0) return []
        else return profiles as unknown as NexusGenObjects["Profile"][]
      },
    })
  },
})

export const AccountQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getMyAccount", {
      type: nullable("String"),
      async resolve() {
        return ""
      },
    })
  },
})
