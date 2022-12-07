import {
  extendType,
  objectType,
  nullable,
  nonNull,
  intArg,
  stringArg,
} from "nexus"
import { NexusGenObjects } from "../typegen"

export const Profile = objectType({
  name: "Profile",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("tokenId")
    t.nonNull.field("createdAt", { type: "DateTime" })
    t.field("updatedAt", { type: "DateTime" })
    t.nonNull.string("owner")
    t.nonNull.string("handle")
    t.nonNull.string("originalHandle")
    t.string("imageURI")
    t.nonNull.boolean("default")
    // t.field("account", {
    //   type: "Account",
    //   resolve: (parent, _, { prisma }) => {
    //     return prisma.profile
    //       .findUnique({
    //         where: { id: parent.id },
    //       })
    //       .account({
    //         select: {
    //           address: true
    //         }
    //       })
    //   },
    // })
    t.nonNull.list.field("following", {
      type: "Follow",
      resolve: async (parent, _, { prisma }) => {
        const following = await prisma.profile
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .following({
            select: {
              followee: {
                select: {
                  id: true,
                  tokenId: true,
                  createdAt: true,
                  handle: true,
                  imageURI: true,
                  originalHandle: true,
                },
              },
            },
          })

        if (!following || following.length === 0) {
          return []
        } else {
          return following.map((fol) => {
            const followee = fol.followee
            return { ...followee, tokenId: followee.tokenId.toString() }
          }) as unknown as NexusGenObjects["Follow"][]
        }
      },
    })
    t.nonNull.list.field("followers", {
      type: "Follow",
      resolve: async (parent, _, { prisma }) => {
        const followers = await prisma.profile
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .followers({
            select: {
              follower: {
                select: {
                  id: true,
                  tokenId: true,
                  createdAt: true,
                  handle: true,
                  imageURI: true,
                  originalHandle: true,
                },
              },
            },
          })

        if (!followers || followers.length === 0) {
          return []
        } else {
          return followers.map((fol) => {
            const follower = fol.follower
            return { ...follower, tokenId: follower.tokenId.toString() }
          }) as unknown as NexusGenObjects["Follow"][]
        }
      },
    })
  },
})

export const Follow = objectType({
  name: "Follow",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("tokenId")
    t.nonNull.field("createdAt", { type: "DateTime" })
    t.nonNull.string("handle")
    t.nonNull.string("originalHandle")
    t.string("imageURI")
  },
})

// export const Follow = objectType({
//   name: "Follow",
//   definition(t) {
//     t.nonNull.string("tokenId")
//     t.nonNull.field("createdAt", { type: "DateTime" })
//     t.nonNull.int("followerId")
//     t.nonNull.int("followeeId")
//     t.nonNull.field("follower", {
//       type: "Profile",
//       resolve: async (parent, _, { prisma }) => {
//         const follower = await prisma.follow
//           .findUnique({
//             where: {
//               followerId_followeeId: {
//                 followerId: parent.followerId,
//                 followeeId: parent.followeeId,
//               },
//             },
//           })
//           .follower()

//         return follower as unknown as NexusGenObjects["Profile"]
//       },
//     })
//     t.nonNull.field("followee", {
//       type: "Profile",
//       resolve: async (parent, _, { prisma }) => {
//         const followee = await prisma.follow
//           .findUnique({
//             where: {
//               followerId_followeeId: {
//                 followerId: parent.followerId,
//                 followeeId: parent.followeeId,
//               },
//             },
//           })
//           .followee()

//         return followee as unknown as NexusGenObjects["Profile"]
//       },
//     })
//   },
// })

export const FrofileQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getProfile", {
      type: nullable("Profile"),
      args: { id: nonNull("Int") },
      async resolve(_parent, { id }, { prisma }) {
        try {
          const profile = (await prisma.profile.findUnique({
            where: { id },
          })) as unknown as NexusGenObjects["Profile"]
          profile.tokenId = profile.tokenId.toString()

          return profile
        } catch (error) {
          throw error
        }
      },
    })
  },
})
