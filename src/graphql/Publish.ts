import {
  extendType,
  objectType,
  enumType,
  nullable,
  nonNull,
  list,
  intArg,
} from "nexus"

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
 * A publish/comment creator type which extract only 3 fields from the `Profile` type.
 */
export const ShortProfile = objectType({
  name: "ShortProfile",
  definition(t) {
    t.nonNull.int("id")
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

    /**
     * For `disLikes` we just need to know the profile id for use to display like icon and dislikes count on the UI, we don't need to know the profile detail, so just resolve to an array of profile ids.
     */
    t.nonNull.list.field("disLikes", {
      type: "Int",
      resolve: async (parent, _, { prisma }) => {
        const disLikes = await prisma.publish
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .disLikes({
            select: {
              profileId: true,
            },
          })

        if (!disLikes || disLikes.length === 0) {
          return []
        } else {
          return disLikes.map((disLike) => disLike.profileId)
        }
      },
    })
    t.nonNull.list.field("comments", {
      type: "MainComment",
      resolve: async (parent, _, { prisma }) => {
        const comments = await prisma.publish
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .comments({
            where: {
              commentType: "PUBLISH",
            },
          })

        if (!comments || comments.length === 0) {
          return []
        } else {
          return comments
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
    /**
     * Get publish by id.
     * @return publishDetail
     */
    t.field("getPublishById", {
      type: nullable("PublishDetail"),
      args: { id: nonNull(intArg()) },
      resolve(_parent, { id }, { prisma }) {
        try {
          return prisma.publish.findUnique({
            where: {
              id,
            },
          })
        } catch (error) {
          throw error
        }
      },
    })

    /**
     * Fetch publishes.
     * @return an array of Publishes
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
     * @return an array of Publishes
     */
    t.field("listPublishesByCategory", {
      type: nonNull(list("Publish")),
      args: { category: nonNull("Category") },
      resolve(_parent, { category }, { prisma }) {
        try {
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
  },
})
