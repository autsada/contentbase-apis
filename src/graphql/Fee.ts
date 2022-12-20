import { objectType, extendType, nonNull, list, intArg } from "nexus"

/**
 * A Fee type that map to the prisma LikeFee model.
 */
export const Fee = objectType({
  name: "Fee",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.field("createdAt", { type: "DateTime" })
    t.nonNull.string("amount")
    t.nonNull.string("fee")

    /**
     * A like that the fee links to
     */
    t.nullable.field("likeTokenId", {
      type: "String",
      resolve: async (parent, _, { prisma }) => {
        const like = await prisma.likeFee
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .like({
            select: {
              tokenId: true,
            },
          })

        return like ? like.tokenId : null
      },
    })

    /**
     * A publish that the fee belongs to.
     */
    t.nullable.field("publish", {
      type: "PreviewPublish",
      resolve: (parent, _, { prisma }) => {
        return prisma.likeFee
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .publish({})
      },
    })

    /**
     * A sender of the fee.
     */
    t.field("sender", {
      type: "PreviewProfile",
      resolve: (parent, _, { prisma }) => {
        return prisma.likeFee
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .sender({
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
     * A receiver of the fee.
     */
    t.field("receiver", {
      type: "PreviewProfile",
      resolve: (parent, _, { prisma }) => {
        return prisma.likeFee
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .receiver({
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

export const FeeQuery = extendType({
  type: "Query",
  definition(t) {
    // List sent fees of a profile
    // TODO: Implement pagination
    t.field("listSentFees", {
      type: nonNull(list("Fee")),
      args: { profileId: nonNull(intArg()) },
      async resolve(_parent, { profileId }, { prisma }) {
        try {
          return prisma.likeFee.findMany({
            where: {
              senderId: profileId,
            },
          })
        } catch (error) {
          throw error
        }
      },
    })

    // List received fees of a profile
    // TODO: Implement pagination
    t.field("listReceivedFees", {
      type: nonNull(list("Fee")),
      args: { profileId: nonNull(intArg()) },
      async resolve(_parent, { profileId }, { prisma }) {
        try {
          return prisma.likeFee.findMany({
            where: {
              receiverId: profileId,
            },
          })
        } catch (error) {
          throw error
        }
      },
    })
  },
})
