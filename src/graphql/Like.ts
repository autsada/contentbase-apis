import { objectType, extendType, nonNull, list, intArg } from "nexus"
import { NexusGenObjects } from "../typegen"

export const SentFee = objectType({
  name: "SentFee",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("amount")
    t.nonNull.string("fee")
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
    t.field("receiver", {
      type: "ShortProfile",
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
              originalHandle: true,
              imageURI: true,
            },
          })
      },
    })
  },
})

export const ReceivedFee = objectType({
  name: "ReceivedFee",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("amount")
    t.nonNull.string("fee")
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
    t.field("sender", {
      type: "ShortProfile",
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
    t.field("listProfileSentFees", {
      type: nonNull(list("SentFee")),
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

    t.field("listProfileReceivedFees", {
      type: nonNull(list("ReceivedFee")),
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
