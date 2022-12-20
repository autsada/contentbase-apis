import { objectType, extendType, nonNull, list, intArg } from "nexus"

import { NexusGenObjects } from "../typegen"
import { throwError, badInputErrMessage } from "./Error"

/**
 * A type for Like.
 */
export const Like = objectType({
  name: "Like",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("tokenId")
    t.nonNull.field("createdAt", { type: "DateTime" })
    t.nonNull.string("likeFeeId")

    /**
     * A profile that owns the like
     */
    t.field("profile", {
      type: "PreviewProfile",
      resolve: (parent, _, { prisma }) => {
        return prisma.like
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .profile({
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

export const LikeQuery = extendType({
  type: "Query",
  definition(t) {
    /**
     * List likes by publish id.
     */
    // TODO: Implement pagination
    t.field("listLikesByPublishId", {
      type: nonNull(list("Like")),
      args: { publishId: nonNull(intArg()) },
      async resolve(_parent, { publishId }, { prisma }) {
        try {
          if (!publishId) throwError(badInputErrMessage, "BAD_USER_INPUT")

          return prisma.like.findMany({
            where: {
              publishId,
            },
            select: {
              id: true,
              tokenId: true,
              createdAt: true,
              likeFeeId: true,
              profile: true,
            },
          }) as unknown as NexusGenObjects["Like"][]
        } catch (error) {
          throw error
        }
      },
    })
  },
})
