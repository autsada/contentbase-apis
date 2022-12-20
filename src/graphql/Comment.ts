import {
  objectType,
  enumType,
  extendType,
  nonNull,
  list,
  inputObjectType,
} from "nexus"

import { NexusGenInputs } from "../typegen"
import { throwError, badInputErrMessage } from "./Error"

export const CommentType = enumType({
  name: "CommentType",
  members: ["PUBLISH", "COMMENT"],
})

/**
 * A preview version of the Comment type.
 */
export const PreviewComment = objectType({
  name: "PreviewComment",
  definition(t) {
    t.nonNull.int("id")
    t.string("text")
    t.nonNull.field("commentType", { type: "CommentType" })

    /**
     * Comment's creator
     */
    t.field("creator", {
      type: "PreviewProfile",
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
 * A type for publish's comments.
 */
export const Comment = objectType({
  name: "Comment",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("tokenId")
    t.nonNull.field("createdAt", { type: "DateTime" })
    t.field("updatedAt", { type: "DateTime" })
    t.nonNull.string("contentURI")
    t.string("text")
    t.nonNull.field("commentType", { type: "CommentType" })

    /**
     * Comment's creator
     */
    t.field("creator", {
      type: "PreviewProfile",
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
              tokenId: true,
              createdAt: true,
              originalHandle: true,
              imageURI: true,
            },
          })
      },
    })

    /**
     * Number of likes a comment has.
     */
    t.nonNull.field("likesCount", {
      type: "Int",
      resolve: (parent, _, { prisma }) => {
        return prisma.commentLike.count({
          where: {
            commentId: parent.id,
          },
        })
      },
    })

    /**
     * A list of profiles that liked the comment.
     */
    t.nonNull.list.field("likes", {
      type: "PreviewProfile",
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
          input: NexusGenInputs["ListCommentsByParentIdInput"]
        }

        if (!input || !input.profileId) return null
        const { profileId } = input

        const like = await prisma.commentLike.findUnique({
          where: {
            identifier: {
              commentId: parent.id,
              profileId,
            },
          },
        })

        return !!like
      },
    })

    /**
     * A boolean to check whether a profile (who makes the query) disliked the comment or not, if no `profileId` provided resolve to null.
     */
    t.nullable.field("disLiked", {
      type: "Boolean",
      resolve: async (parent, _, { prisma }, info) => {
        const { input } = info.variableValues as {
          input: NexusGenInputs["ListCommentsByParentIdInput"]
        }

        if (!input || !input.profileId) return null
        const { profileId } = input

        const disLike = await prisma.commentDisLike.findUnique({
          where: {
            identifier: {
              commentId: parent.id,
              profileId,
            },
          },
        })

        return !!disLike
      },
    })

    /**
     * Number of sub-comments a publish has.
     */
    t.nonNull.field("commentsCount", {
      type: "Int",
      resolve: (parent, _, { prisma }) => {
        return prisma.comment.count({
          where: {
            commentId: parent.id,
          },
        })
      },
    })
  },
})

/**
 * An input type for use to get comments list by a publish id.
 */
export const ListCommentsByParentIdInput = inputObjectType({
  name: "ListCommentsByParentIdInput",
  definition(t) {
    t.nonNull.int("parentId")
    // The profileId will be used to identify if a profile `liked`/`disliked` the publish, this arg will be used in the field resolver.
    t.nullable.int("profileId")
  },
})

export const CommentQuery = extendType({
  type: "Query",
  definition(t) {
    /**
     * List comments by publish id.
     */
    // TODO: Implement pagination
    t.field("listCommentsByPublishId", {
      type: nonNull(list("Comment")),
      args: { input: nonNull("ListCommentsByParentIdInput") },
      async resolve(_parent, { input }, { prisma }) {
        try {
          if (!input) throwError(badInputErrMessage, "BAD_USER_INPUT")
          const { parentId } = input

          if (!parentId) throwError(badInputErrMessage, "BAD_USER_INPUT")

          return prisma.comment.findMany({
            where: {
              AND: [
                {
                  publishId: parentId,
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

    /**
     * List comments by parent (comment) id.
     */
    // TODO: Implement pagination
    t.field("listCommentsByCommentId", {
      type: nonNull(list("Comment")),
      args: { input: nonNull("ListCommentsByParentIdInput") },
      async resolve(_parent, { input }, { prisma }) {
        try {
          if (!input) throwError(badInputErrMessage, "BAD_USER_INPUT")
          const { parentId } = input

          if (!parentId) throwError(badInputErrMessage, "BAD_USER_INPUT")

          return prisma.comment.findMany({
            where: {
              AND: [
                {
                  commentId: parentId,
                },
                {
                  commentType: "COMMENT",
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
