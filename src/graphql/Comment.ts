import {
  objectType,
  enumType,
  extendType,
  nonNull,
  list,
  inputObjectType,
} from "nexus"

import { NexusGenInputs } from "../typegen"
import { badRequestErrMessage } from "./Publish"

export const CommentType = enumType({
  name: "CommentType",
  members: ["PUBLISH", "COMMENT"],
})

/**
 * A type for comment's comments that map to the prisma Comment model.
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
    t.nonNull.field("commentType", { type: "CommentType" })

    /**
     * Comment's creator
     */
    t.field("creator", {
      type: "Profile",
      resolve: (parent, _, { prisma }) => {
        return prisma.comment
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .creator({})
      },
    })

    /**
     * Likes count.
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
     * Liked profiles list.
     */
    t.nonNull.list.field("likes", {
      type: "Profile",
      resolve: async (parent, _, { prisma }) => {
        const likes = await prisma.comment
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
          input: NexusGenInputs["ListCommentsByPublishIdInput"]
        }

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
     * DisLikes count.
     */
    t.nonNull.field("disLikesCount", {
      type: "Int",
      resolve: (parent, _, { prisma }) => {
        return prisma.commentDisLike.count({
          where: {
            commentId: parent.id,
          },
        })
      },
    })

    /**
     * A boolean to check whether a profile (who makes the query) disliked the comment or not.
     */
    t.nonNull.field("disLiked", {
      type: "Boolean",
      resolve: async (parent, _, { prisma }, info) => {
        const {
          input: { profileId },
        } = info.variableValues as {
          input: NexusGenInputs["ListCommentsByPublishIdInput"]
        }

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
  },
})

/**
 * A type for publish's comments that map to the prisma Comment model.
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
      type: "Profile",
      resolve: (parent, _, { prisma }) => {
        return prisma.comment
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .creator({})
      },
    })

    /**
     * Comments list
     */
    t.nonNull.list.field("comments", {
      type: "SubComment",
      resolve: async (parent, _, { prisma }) => {
        const comments = await prisma.comment
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .comments({})

        if (!comments || comments.length === 0) {
          return []
        } else {
          return comments
        }
      },
    })

    /**
     * Likes count.
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
     * Liked profiles list.
     */
    t.nonNull.list.field("likes", {
      type: "Profile",
      resolve: async (parent, _, { prisma }) => {
        const likes = await prisma.comment
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
          input: NexusGenInputs["ListCommentsByPublishIdInput"]
        }

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
     * DisLikes count.
     */
    t.nonNull.field("disLikesCount", {
      type: "Int",
      resolve: (parent, _, { prisma }) => {
        return prisma.commentDisLike.count({
          where: {
            commentId: parent.id,
          },
        })
      },
    })

    /**
     * A boolean to check whether a profile (who makes the query) disliked the comment or not.
     */
    t.nonNull.field("disLiked", {
      type: "Boolean",
      resolve: async (parent, _, { prisma }, info) => {
        const {
          input: { profileId },
        } = info.variableValues as {
          input: NexusGenInputs["ListCommentsByPublishIdInput"]
        }

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
  },
})

/**
 * An input type for use to get comments list by a publish id.
 */
export const ListCommentsByPublishIdInput = inputObjectType({
  name: "ListCommentsByPublishIdInput",
  definition(t) {
    t.nonNull.int("publishId")
    // The profileId will be used to identify if a profile `liked`/`disliked` the publish, this arg will be used in the field resolver.
    t.nonNull.int("profileId")
  },
})

export const CommentQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("listCommentsByPublishId", {
      type: nonNull(list("Comment")),
      args: { input: nonNull("ListCommentsByPublishIdInput") },
      async resolve(_parent, { input }, { prisma }) {
        try {
          if (!input) throw new Error(badRequestErrMessage)
          const { publishId } = input
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
