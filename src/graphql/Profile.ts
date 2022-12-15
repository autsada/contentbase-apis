import {
  extendType,
  objectType,
  nullable,
  nonNull,
  inputObjectType,
} from "nexus"

import { NexusGenInputs } from "../typegen"
import { badRequestErrMessage } from "./Publish"

/**
 * A preview version of the Profile.
 * @dev Use this type where we just need to know a profile briefly and don't need to knew the detail and relation of that profile.
 */
export const PreviewProfile = objectType({
  name: "PreviewProfile",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("tokenId")
    t.nonNull.string("originalHandle")
    t.string("imageURI")
  },
})

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

    /**
     * Number of following.
     */
    t.nonNull.field("followingCount", {
      type: "Int",
      resolve: (parent, _, { prisma }) => {
        return prisma.follow.count({
          where: {
            followerId: parent.id,
          },
        })
      },
    })

    /**
     * Following profiles list.
     */
    t.nonNull.list.field("following", {
      type: "PreviewProfile",
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
                  originalHandle: true,
                  imageURI: true,
                },
              },
            },
          })

        if (!following) return []
        else return following.map((fol) => fol.followee)
      },
    })

    /**
     * Followers count.
     */
    t.nonNull.field("followersCount", {
      type: "Int",
      resolve: (parent, _, { prisma }) => {
        return prisma.follow.count({
          where: {
            followeeId: parent.id,
          },
        })
      },
    })

    /**
     * Follower profiles list.
     */
    t.nonNull.list.field("followers", {
      type: "PreviewProfile",
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
                  originalHandle: true,
                  imageURI: true,
                },
              },
            },
          })

        if (!followers) return []
        else return followers.map((fol) => fol.follower)
      },
    })

    /**
     * A boolean to check whether a profile (who makes the query) is following the target profile or not, if no `userId` provided resolve to null.
     */
    t.nullable.field("isFollowing", {
      type: "Boolean",
      resolve: async (parent, _, { prisma }, info) => {
        const { input } = info.variableValues as {
          input: NexusGenInputs["GetProfileByIdInput"]
        }

        if (!input || !input.userId) return null
        const { userId } = input

        const following = await prisma.follow.findUnique({
          where: {
            followerId_followeeId: {
              followerId: userId,
              followeeId: parent.id,
            },
          },
        })

        return !!following
      },
    })

    /**
     * Profile's publishes count.
     */
    t.nonNull.field("publishesCount", {
      type: "Int",
      resolve: (parent, _, { prisma }) => {
        return prisma.publish.count({
          where: {
            creatorId: parent.id,
          },
        })
      },
    })
  },
})

/**
 * An input type for use to get a profile by id.
 */
export const GetProfileByIdInput = inputObjectType({
  name: "GetProfileByIdInput",
  definition(t) {
    // A profile id of the target profile.
    t.nonNull.int("profileId")
    // A profile id of the requestor that will be used to identify if the requestor is following the target profile, this arg will be used in the field resolver.
    t.nullable.int("userId")
  },
})

export const FrofileQuery = extendType({
  type: "Query",
  definition(t) {
    /**
     * Ge profile by id.
     */
    t.field("getProfileById", {
      type: nullable("Profile"),
      args: { input: nonNull("GetProfileByIdInput") },
      resolve(_parent, { input }, { prisma }) {
        try {
          if (!input) throw new Error(badRequestErrMessage)
          const { profileId } = input

          if (!profileId) throw new Error(badRequestErrMessage)

          return prisma.profile.findUnique({
            where: { id: profileId },
          })
        } catch (error) {
          throw error
        }
      },
    })
  },
})
