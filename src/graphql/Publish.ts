import {
  extendType,
  objectType,
  enumType,
  nullable,
  nonNull,
  list,
  inputObjectType,
  intArg,
  stringArg,
} from "nexus"

import { NexusGenInputs, NexusGenObjects } from "../typegen"

export const badRequestErrMessage = "Bad Request"

/**
 * Publish's category.
 */
export const Category = enumType({
  name: "Category",
  members: [
    "Empty",
    "Music",
    "Movies",
    "Entertainment",
    "Sports",
    "Food",
    "Travel",
    "Gaming",
    "News",
    "Animals",
    "Education",
    "Science",
    "Technology",
    "Programming",
    "LifeStyle",
    "Vehicles",
    "Children",
    "Women",
    "Men",
    "Other",
    "NotExist",
  ],
})

/**
 * A preview verion of the Publish type.
 * @dev Use this type for publishes listing queries that doesn't require to have much details of a publish.
 */
export const PreviewPublish = objectType({
  name: "PreviewPublish",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("tokenId")
    t.nonNull.field("createdAt", { type: "DateTime" })
    t.nonNull.string("imageURI")
    t.nonNull.string("contentURI")
    t.nonNull.string("title")
    t.nonNull.field("primaryCategory", { type: "Category" })
    t.nonNull.field("secondaryCategory", { type: "Category" })
    t.nonNull.field("tertiaryCategory", { type: "Category" })
    t.nonNull.int("views")

    /**
     * Publish's creator.
     */
    t.field("creator", {
      type: "PreviewProfile",
      resolve: (parent, _, { prisma }) => {
        return prisma.publish
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .creator({
            select: {
              id: true,
              tokenId: true,
              createdAt: true,
              originalHandle: true,
              imageURI: true,
            },
          })
      },
    })
  },
})

/**
 * A Publish type.
 * @dev Use this type for the queries that need detail of the publish such as `getPublishById`.
 */
export const Publish = objectType({
  name: "Publish",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("tokenId")
    t.nonNull.field("createdAt", { type: "DateTime" })
    t.field("updatedAt", { type: "DateTime" })
    t.nonNull.string("creatorTokenId")
    t.nonNull.string("imageURI")
    t.nonNull.string("contentURI")
    t.nonNull.string("metadataURI")
    t.nonNull.string("title")
    t.string("description")
    t.nonNull.field("primaryCategory", { type: "Category" })
    t.nonNull.field("secondaryCategory", { type: "Category" })
    t.nonNull.field("tertiaryCategory", { type: "Category" })
    t.nonNull.int("views")

    /**
     * Publish's creator.
     */
    t.field("creator", {
      type: "PreviewProfile",
      resolve: (parent, _, { prisma }) => {
        return prisma.publish
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .creator({
            select: {
              id: true,
              tokenId: true,
              createdAt: true,
              originalHandle: true,
              imageURI: true,
            },
          })
      },
    })

    /**
     * Number of likes a publish has.
     */
    t.nonNull.field("likesCount", {
      type: "Int",
      resolve: (parent, _, { prisma }) => {
        return prisma.like.count({
          where: {
            publishId: parent.id,
          },
        })
      },
    })

    /**
     * A list of profiles that liked the publish.
     */
    t.nonNull.list.field("likes", {
      type: "PreviewProfile",
      resolve: async (parent, _, { prisma }) => {
        const likes = await prisma.publish
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .likes({
            select: {
              profile: {
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

        if (!likes) return []
        else return likes.map((like) => like.profile)
      },
    })

    /**
     * A boolean to check whether a profile (who makes the query) liked the publish or not, if no `profileId` provided resolve to null.
     */
    t.nullable.field("liked", {
      type: "Boolean",
      resolve: async (parent, _, { prisma }, info) => {
        const { input } = info.variableValues as {
          input: NexusGenInputs["GetPublishByIdInput"]
        }

        if (!input || !input.profileId) return null
        const { profileId } = input

        const like = await prisma.like.findUnique({
          where: {
            identifier: {
              publishId: parent.id,
              profileId,
            },
          },
        })

        return !!like
      },
    })

    /**
     * Number of dislikes a publish has.
     */
    t.nonNull.field("disLikesCount", {
      type: "Int",
      resolve: (parent, _, { prisma }) => {
        return prisma.disLike.count({
          where: {
            publishId: parent.id,
          },
        })
      },
    })

    /**
     * A boolean to check whether a profile (who makes the query) disliked the publish or not, if no `profileId` provided resolve to null.
     */
    t.nullable.field("disLiked", {
      type: "Boolean",
      resolve: async (parent, _, { prisma }, info) => {
        const { input } = info.variableValues as {
          input: NexusGenInputs["GetPublishByIdInput"]
        }

        if (!input || !input.profileId) return null
        const { profileId } = input

        const disLike = await prisma.disLike.findUnique({
          where: {
            identifier: {
              publishId: parent.id,
              profileId,
            },
          },
        })

        return !!disLike
      },
    })

    /**
     * Number of comments a publish has.
     */
    t.nonNull.field("commentsCount", {
      type: "Int",
      resolve: (parent, _, { prisma }) => {
        return prisma.comment.count({
          where: {
            publishId: parent.id,
          },
        })
      },
    })

    /**
     * A publish's last comment.
     */
    t.nullable.field("lastComment", {
      type: "Comment",
      resolve: async (parent, _, { prisma }) => {
        return prisma.comment.findFirst({
          where: {
            AND: [
              {
                publishId: parent.id,
              },
              {
                commentType: "PUBLISH",
              },
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
        })
      },
    })
  },
})

/**
 * An input type for use to get a publish by id.
 */
export const GetPublishByIdInput = inputObjectType({
  name: "GetPublishByIdInput",
  definition(t) {
    t.nonNull.int("publishId")
    // The profileId will be used to identify if a profile `liked`/`disliked` the publish, this arg will be used in the field resolver.
    t.nullable.int("profileId")
  },
})

export const PublishQuery = extendType({
  type: "Query",
  definition(t) {
    /**
     * Get a publish by id.
     */
    t.field("getPublishById", {
      type: nullable("Publish"),
      args: { input: nonNull("GetPublishByIdInput") },
      resolve(_parent, { input }, { prisma }) {
        try {
          if (!input) throw new Error(badRequestErrMessage)
          const { publishId } = input

          if (!publishId) throw new Error(badRequestErrMessage)

          return prisma.publish.findUnique({
            where: {
              id: publishId,
            },
          })
        } catch (error) {
          throw error
        }
      },
    })

    /**
     * Fetch publishes.
     */
    // TODO: Implement pagination
    t.field("fetchPublishes", {
      type: nonNull(list("PreviewPublish")),
      resolve(_parent, _, { prisma }) {
        try {
          return prisma.publish.findMany({})
        } catch (error) {
          throw error
        }
      },
    })

    /**
     * Fetch publishes by category.
     */
    // TODO: Implement pagination
    t.field("listPublishesByCategory", {
      type: nonNull(list("PreviewPublish")),
      args: { category: nonNull("Category") },
      resolve(_parent, { category }, { prisma }) {
        try {
          if (!category) throw new Error(badRequestErrMessage)

          return prisma.publish.findMany({
            where: {
              OR: [
                {
                  primaryCategory: category,
                },
                {
                  secondaryCategory: category,
                },
                {
                  tertiaryCategory: category,
                },
              ],
            },
          })
        } catch (error) {
          throw error
        }
      },
    })

    /**
     * Fetch publishes by creator id.
     * @dev the `id` is a database id of the creator's profile.
     */
    // TODO: Implement pagination
    t.field("listPublishesByCreatorId", {
      type: nonNull(list("PreviewPublish")),
      args: { id: nonNull(intArg()) },
      resolve(_parent, { id }, { prisma }) {
        try {
          if (!id) throw new Error(badRequestErrMessage)

          return prisma.publish.findMany({
            where: {
              creatorId: id,
            },
          })
        } catch (error) {
          throw error
        }
      },
    })

    /**
     * Similare to `listPublishesByCreatorId` above but uses a creator profile token id as the filter.
     */
    // TODO: Implement pagination
    t.field("listPublishesByCreatorTokenId", {
      type: nonNull(list("PreviewPublish")),
      args: { creatorTokenId: nonNull(stringArg()) },
      resolve(_parent, { creatorTokenId }, { prisma }) {
        try {
          if (!creatorTokenId) throw new Error(badRequestErrMessage)

          return prisma.publish.findMany({
            where: {
              creatorTokenId,
            },
          })
        } catch (error) {
          throw error
        }
      },
    })
  },
})
