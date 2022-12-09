import { objectType, enumType, extendType, nonNull, list, intArg } from "nexus"

export const CommentType = enumType({
  name: "CommentType",
  members: ["PUBLISH", "COMMENT"],
})

/**
 * A type for comment's comment
 */
export const SubComment = objectType({
  name: "SubComment",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("tokenId")
    t.nonNull.field("createdAt", { type: "DateTime" })
    t.field("updatedAt", { type: "DateTime" })
    t.nonNull.string("contentURI")
    t.string("text")
    t.string("mediaURI")
    t.nonNull.field("commentType", { type: "CommentType" })
    t.field("creator", {
      type: "ShortProfile",
      resolve: (parent, _, { prisma }) => {
        return prisma.comment
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
        const likes = await prisma.comment
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
    t.nonNull.list.field("disLikes", {
      type: "Int",
      resolve: async (parent, _, { prisma }) => {
        const disLikes = await prisma.comment
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
  },
})

/**
 * A type for publish's comment
 */
export const MainComment = objectType({
  name: "MainComment",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("tokenId")
    t.nonNull.field("createdAt", { type: "DateTime" })
    t.field("updatedAt", { type: "DateTime" })
    t.nonNull.string("contentURI")
    t.string("text")
    t.string("mediaURI")
    t.nonNull.field("commentType", { type: "CommentType" })
    t.field("creator", {
      type: "ShortProfile",
      resolve: (parent, _, { prisma }) => {
        return prisma.comment
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
    t.nonNull.list.field("comments", {
      type: "SubComment",
      resolve: async (parent, _, { prisma }) => {
        const comments = await prisma.comment
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .comments()

        if (!comments || comments.length === 0) {
          return []
        } else {
          return comments
        }
      },
    })
    t.nonNull.list.field("likes", {
      type: "ShortProfile",
      resolve: async (parent, _, { prisma }) => {
        const likes = await prisma.comment
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
    t.nonNull.list.field("disLikes", {
      type: "Int",
      resolve: async (parent, _, { prisma }) => {
        const disLikes = await prisma.comment
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
  },
})

export const CommentQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getCommentsByPublishId", {
      type: nonNull(list("MainComment")),
      args: { publishId: nonNull(intArg()) },
      async resolve(_parent, { publishId }, { prisma }) {
        try {
          return prisma.comment.findMany({
            where: {
              AND: [
                {
                  publishId,
                },
                {
                  commentType: "PUBLISH",
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
