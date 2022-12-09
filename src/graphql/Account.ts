import { extendType, objectType, nullable, nonNull, stringArg } from "nexus"

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

/**
 * A short version of the Profile type.
 */
export const AccountProfile = objectType({
  name: "AccountProfile",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("tokenId")
    t.nonNull.field("createdAt", { type: "DateTime" })
    t.nonNull.string("originalHandle")
    t.string("imageURI")
    t.nonNull.boolean("default")
  },
})

/**
 * A Account type that map to the prisma Account model.
 */
export const Account = objectType({
  name: "Account",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.field("createdAt", { type: "DateTime" })
    t.field("updatedAt", { type: "DateTime" })
    t.nonNull.string("address")
    t.nonNull.list.field("profiles", {
      type: "AccountProfile",
      resolve: async (parent, _, { prisma }) => {
        const profiles = await prisma.account
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .profiles({
            select: {
              id: true,
              tokenId: true,
              createdAt: true,
              originalHandle: true,
              imageURI: true,
              default: true,
            },
          })

        if (!profiles || profiles.length === 0) return []
        else return profiles
      },
    })
  },
})

export const AccountQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getAccount", {
      type: nullable("Account"),
      args: { address: nonNull(stringArg()) },
      resolve(_parent, { address }, { prisma }) {
        try {
          return prisma.account.findUnique({
            where: {
              address,
            },
          })
        } catch (error) {
          throw error
        }
      },
    })
  },
})
