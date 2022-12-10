import { objectType, extendType, nonNull, list, intArg } from "nexus"
import { NexusGenObjects } from "../typegen"

/**
 * A Fee type that map to the prisma LikeFee model.
 */
export const Fee = objectType({
  name: "Fee",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("amount")
    t.nonNull.string("fee")

    /**
     * A publish that the fee belongs to.
     */
    t.nonNull.field("publish", {
      type: "Publish",
      resolve: (parent, _, { prisma }) => {
        return prisma.likeFee
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .publish() as unknown as NexusGenObjects["Publish"]
      },
    })

    /**
     * A sender of the fee.
     */
    t.field("sender", {
      type: "Profile",
      resolve: (parent, _, { prisma }) => {
        return prisma.likeFee
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .sender({})
      },
    })

    /**
     * A receiver of the fee.
     */
    t.field("receiver", {
      type: "Profile",
      resolve: (parent, _, { prisma }) => {
        return prisma.likeFee
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .receiver({})
      },
    })
  },
})

export const FeeQuery = extendType({
  type: "Query",
  definition(t) {
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
