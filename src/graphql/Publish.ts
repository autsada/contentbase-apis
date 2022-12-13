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
 * A Publish type that map to the prisma Publish model.
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
    t.nonNull.field("creator", {
      type: "Profile",
      resolve: (parent, _, { prisma }) => {
        return prisma.publish
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .creator({}) as unknown as NexusGenObjects["Profile"]
      },
    })

    /**
     * Likes count.
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
     * Liked profiles list
     */
    t.nonNull.list.field("likes", {
      type: "Profile",
      resolve: async (parent, _, { prisma }) => {
        const likes = await prisma.publish
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .likes({
            select: {
              profile: true,
            },
          })

        if (!likes) return []
        else return likes.map((like) => like.profile)
      },
    })

    /**
     * A boolean to check whether a profile (who makes the query) liked the publish or not.
     */
    t.nonNull.field("liked", {
      type: "Boolean",
      resolve: async (parent, _, { prisma }, info) => {
        const {
          input: { profileId },
        } = info.variableValues as {
          input: NexusGenInputs["GetPublishByIdInput"]
        }

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
     * DisLikes count.
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
     * Disliked profiles list
     */
    t.nonNull.list.field("disLikes", {
      type: "Profile",
      resolve: async (parent, _, { prisma }) => {
        const disLikes = await prisma.publish
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .disLikes({
            select: {
              profile: true,
            },
          })

        if (!disLikes) return []
        else return disLikes.map((disLike) => disLike.profile)
      },
    })

    /**
     * A boolean to check whether a profile (who makes the query) disliked the publish or not.
     */
    t.nonNull.field("disLiked", {
      type: "Boolean",
      resolve: async (parent, _, { prisma }, info) => {
        const {
          input: { profileId },
        } = info.variableValues as {
          input: NexusGenInputs["GetPublishByIdInput"]
        }

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
     * Comments count.
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
     * Last comments.
     */
    t.field("lastComment", {
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
    t.nonNull.int("profileId")
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
    t.field("fetchPublishes", {
      type: nonNull(list("Publish")),
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
    t.field("listPublishesByCategory", {
      type: nonNull(list("Publish")),
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
     * Fetch publishes that a profile (database id) is the creator.
     * @dev the `id` arg is a database table id.
     */
    t.field("listPublishesByProfileId", {
      type: nonNull(list("Publish")),
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
     * Fetch publishes that a profile (token id) is the creator.
     * @dev the `tokenId` arg is a profile token id of the creator.
     */
    t.field("listPublishesByProfileTokenId", {
      type: nonNull(list("Publish")),
      args: { tokenId: nonNull(stringArg()) },
      resolve(_parent, { tokenId }, { prisma }) {
        try {
          if (!tokenId) throw new Error(badRequestErrMessage)

          return prisma.publish.findMany({
            where: {
              creatorTokenId: tokenId,
            },
          })
        } catch (error) {
          throw error
        }
      },
    })

    /**
     * Fetch last 50 publishes of a profile
     * @dev the `id` arg is a database table id.
     */
    t.field("listMostRecentPublishesByProfileId", {
      type: nonNull(list("Publish")),
      args: { id: nonNull(intArg()) },
      resolve(_parent, { id }, { prisma }) {
        try {
          if (!id) throw new Error(badRequestErrMessage)

          return prisma.publish.findMany({
            where: {
              creatorId: id,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 50,
          })
        } catch (error) {
          throw error
        }
      },
    })

    /**
     * Fetch last 50 publishes of a profile
     * @dev the `tokenId` arg is a profile token id of the creator.
     */
    t.field("listMostRecentPublishesByProfileTokenId", {
      type: nonNull(list("Publish")),
      args: { tokenId: nonNull(stringArg()) },
      resolve(_parent, { tokenId }, { prisma }) {
        try {
          if (!tokenId) throw new Error(badRequestErrMessage)

          return prisma.publish.findMany({
            where: {
              creatorTokenId: tokenId,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 50,
          })
        } catch (error) {
          throw error
        }
      },
    })
  },
})
