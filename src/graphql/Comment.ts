import {
  objectType,
  enumType,
  interfaceType,
  extendType,
  inputObjectType,
  nonNull,
} from "nexus"

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
  },
})
