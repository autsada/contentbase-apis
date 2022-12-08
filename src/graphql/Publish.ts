import {
  extendType,
  objectType,
  enumType,
  nullable,
  nonNull,
  list,
} from "nexus"
import { resolve } from "path"
import { NexusGenObjects } from "../typegen"

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
 * A publish/comment creator type which extract only 4 fields from the `AccountProfile` type.
 */
export const ShortProfile = objectType({
  name: "ShortProfile",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("tokenId")
    t.nonNull.string("originalHandle")
    t.string("imageURI")
  },
})

/**
 * A Publish type that map to the prisma Publish model that includes all relations.
 * @dev Use this type for fetching specific publish only.
 */
export const PublishDetail = objectType({
  name: "PublishDetail",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("tokenId")
    t.nonNull.field("createdAt", { type: "DateTime" })
    t.field("updatedAt", { type: "DateTime" })
    t.nonNull.string("imageURI")
    t.nonNull.string("contentURI")
    t.nonNull.string("metadataURI")
    t.nonNull.string("title")
    t.string("description")
    t.nonNull.field("primaryCategory", { type: "Category" })
    t.nonNull.field("secondaryCategory", { type: "Category" })
    t.nonNull.field("tertiaryCategory", { type: "Category" })
    t.field("creator", {
      type: "ShortProfile",
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
              originalHandle: true,
              imageURI: true,
            },
          })
      },
    })
    t.nonNull.list.field("likes", {
      type: "ShortProfile",
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
                  originalHandle: true,
                  imageURI: true,
                },
              },
            },
          })

        if (!likes || likes.length === 0) {
          return []
        } else {
          return likes.map((like) => like.profile)
        }
      },
    })
    t.nonNull.list.field("disLikes", {
      type: "ShortProfile",
      resolve: async (parent, _, { prisma }) => {
        const disLikes = await prisma.publish
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .disLikes({
            select: {
              profile: {
                select: {
                  id: true,
                  tokenId: true,
                  originalHandle: true,
                  imageURI: true,
                },
              },
            },
          })

        if (!disLikes || disLikes.length === 0) {
          return []
        } else {
          return disLikes.map((disLike) => disLike.profile)
        }
      },
    })
  },
})

/**
 * A brief version of the PublishDetail type that only has one relation.
 * @dev Use this type for fetching publishes.
 */
export const Publish = objectType({
  name: "Publish",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("tokenId")
    t.nonNull.field("createdAt", { type: "DateTime" })
    t.field("updatedAt", { type: "DateTime" })
    t.nonNull.string("imageURI")
    t.nonNull.string("contentURI")
    t.nonNull.string("title")
    t.nonNull.field("primaryCategory", { type: "Category" })
    t.nonNull.field("secondaryCategory", { type: "Category" })
    t.nonNull.field("tertiaryCategory", { type: "Category" })
    t.field("creator", {
      type: "ShortProfile",
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
              originalHandle: true,
              imageURI: true,
            },
          })
      },
    })
  },
})

export const PublishQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getPublishById", {
      type: nullable("PublishDetail"),
      args: { id: nonNull("Int") },
      resolve(_parent, { id }, { prisma }) {
        return prisma.publish.findUnique({
          where: {
            id,
          },
        })
      },
    })

    t.field("fetchPublishes", {
      type: nonNull(list("Publish")),
      async resolve(_parent, _, { prisma }) {
        return prisma.publish.findMany({})
      },
    })
  },
})