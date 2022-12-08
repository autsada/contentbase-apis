import {
  extendType,
  objectType,
  nullable,
  nonNull,
  intArg,
  stringArg,
} from "nexus"

/**
 * A Profile type that map to the prisma Profile model.
 */
export const Profile = objectType({
  name: "Profile",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("tokenId")
    t.nonNull.field("createdAt", { type: "DateTime" })
    t.field("updatedAt", { type: "DateTime" })
    t.nonNull.string("owner")
    t.nonNull.string("handle")
    t.nonNull.string("originalHandle")
    t.string("imageURI")
    t.nonNull.boolean("default")
    t.nonNull.list.field("following", {
      type: "Follow",
      resolve: async (parent, _, { prisma }) => {
        const following = await prisma.profile
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .following({
            select: {
              followee: {
                select: {
                  id: true,
                  tokenId: true,
                  createdAt: true,
                  imageURI: true,
                  originalHandle: true,
                },
              },
            },
          })

        if (!following || following.length === 0) {
          return []
        } else {
          return following.map((fol) => fol.followee)
        }
      },
    })
    t.nonNull.list.field("followers", {
      type: "Follow",
      resolve: async (parent, _, { prisma }) => {
        const followers = await prisma.profile
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .followers({
            select: {
              follower: {
                select: {
                  id: true,
                  tokenId: true,
                  createdAt: true,
                  imageURI: true,
                  originalHandle: true,
                },
              },
            },
          })

        if (!followers || followers.length === 0) {
          return []
        } else {
          return followers.map((fol) => fol.follower)
        }
      },
    })
  },
})

/**
 * Create a Follow type that different than the prisma model because
 * 1. We don't need relation here.
 * 2. The Follow type here refer to the Profile model (not a Follow model that represent a Follow token) but with only some fields that we need to show a profile's `followers` and `following`.
 */
export const Follow = objectType({
  name: "Follow",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("tokenId")
    t.nonNull.field("createdAt", { type: "DateTime" })
    t.nonNull.string("originalHandle")
    t.string("imageURI")
  },
})

export const FrofileQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getProfile", {
      type: nullable("Profile"),
      args: { id: nonNull("Int") },
      resolve(_parent, { id }, { prisma }) {
        try {
          return prisma.profile.findUnique({
            where: { id },
          })
        } catch (error) {
          throw error
        }
      },
    })
  },
})
