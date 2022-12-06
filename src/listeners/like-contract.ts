/**
 * Like Contract's Event Listeners
 */

import { utils } from "ethers"

import { prisma } from "../client"
import { getContractForWs } from "./ethers"
import LikeContract from "../abi/ContentBaseLikeV1.json"
import { ContentBaseLikeV1 as Like } from "../typechain-types"
import {
  PublishLikedEvent,
  PublishUnLikedEvent,
  PublishDisLikedEvent,
  PublishUndoDisLikedEvent,
} from "../typechain-types/contracts/publish/ContentBaseLikeV1"

/**
 * Get contract for listening to events
 */
export function getLikeContractForWs() {
  const contract = getContractForWs({
    address: LikeContract.address,
    contractInterface: LikeContract.abi,
  }) as Like

  return contract
}

/**
 * Handler for `PublishLiked` Event
 */
export const publishLikedListener = async (
  ...args: PublishLikedEvent["args"]
) => {
  try {
    const [tokenId, publishId, profileId, fee, timestamp] = args

    // 1. Get the profile of the user that liked the publish by its tokenId.
    const profile = await prisma.profile.findUnique({
      where: {
        tokenId: profileId.toBigInt(),
      },
    })

    if (profile) {
      // 2. Get the publish by its tokenId.
      const publish = await prisma.publish.findUnique({
        where: {
          tokenId: publishId.toBigInt(),
        },
      })

      if (publish) {
        // 3. Create a new Fee.
        const feeEntity = await prisma.fee.create({
          data: {
            createdAt: new Date(timestamp.toNumber() * 1000),
            senderId: profile.id,
            publishId: publish.id,
            receiverId: publish.creatorId,
            amount: utils.formatEther(fee),
          },
        })

        // 4. Create a new Like.
        await prisma.like.create({
          data: {
            tokenId: tokenId.toBigInt(),
            createdAt: new Date(timestamp.toNumber() * 1000),
            profileId: profile.id,
            publishId: publish.id,
            feeId: feeEntity.id,
          },
        })

        // 5. Check if the user disliked the publish before, if so we need to delete the existing disLike as well.
        const disLike = await prisma.disLike.findUnique({
          where: {
            identifier: {
              profileId: profile.id,
              publishId: publish.id,
            },
          },
        })

        if (disLike) {
          await prisma.disLike.delete({
            where: {
              identifier: {
                profileId: profile.id,
                publishId: publish.id,
              },
            },
          })
        }

        console.log("publish liked done")
      }
    }
  } catch (error) {
    console.log("error -->", error)
  }
}

/**
 * Handler for `PublishUnLiked` Event
 */
export const publishUnLikedListener = async (
  ...args: PublishUnLikedEvent["args"]
) => {
  try {
    const [tokenId] = args

    // 1. Get the like by its tokenId.
    const like = await prisma.like.findUnique({
      where: {
        tokenId: tokenId.toBigInt(),
      },
    })

    if (like) {
      // 2. Delete the like
      await prisma.like.delete({
        where: {
          id: like.id,
        },
      })

      console.log("publish unliked done")
    }
  } catch (error) {
    console.log("error -->", error)
  }
}

/**
 * Handler for `PublishDisLiked` Event
 */
export const publishDisLikedListener = async (
  ...args: PublishDisLikedEvent["args"]
) => {
  try {
    const [publishId, profileId, timestamp] = args

    // 1. Get the profile of the user that disliked the publish by its tokenId.
    const profile = await prisma.profile.findUnique({
      where: {
        tokenId: profileId.toBigInt(),
      },
    })

    if (profile) {
      // 2. Get the publish by its tokenId.
      const publish = await prisma.publish.findUnique({
        where: {
          tokenId: publishId.toBigInt(),
        },
      })

      if (publish) {
        // 3. Create a new disLike
        await prisma.disLike.create({
          data: {
            createdAt: new Date(timestamp.toNumber() * 1000),
            publishId: publish.id,
            profileId: profile.id,
          },
        })

        // 4. Check if the user liked the publish before, if so we need to delete the existing like as well.
        const like = await prisma.like.findUnique({
          where: {
            identifier: {
              profileId: profile.id,
              publishId: publish.id,
            },
          },
        })

        if (like) {
          await prisma.like.delete({
            where: {
              identifier: {
                profileId: profile.id,
                publishId: publish.id,
              },
            },
          })
        }

        console.log("publish disliked done")
      }
    }
  } catch (error) {
    console.log("error -->", error)
  }
}

/**
 * Handler for `PublishUndoDisLiked` Event
 */
export const publishUndoDisLikedListener = async (
  ...args: PublishUndoDisLikedEvent["args"]
) => {
  try {
    const [publishId, profileId] = args

    // 1. Get the profile of the user that undo-disliked the publish by its tokenId.
    const profile = await prisma.profile.findUnique({
      where: {
        tokenId: profileId.toBigInt(),
      },
    })

    if (profile) {
      // 2. Get the publish by its tokenId.
      const publish = await prisma.publish.findUnique({
        where: {
          tokenId: publishId.toBigInt(),
        },
      })

      if (publish) {
        // 3. Delete the disLike.
        await prisma.disLike.delete({
          where: {
            identifier: {
              publishId: publish.id,
              profileId: profile.id,
            },
          },
        })

        console.log("publish undo disliked done")
      }
    }
  } catch (error) {
    console.log("error -->", error)
  }
}