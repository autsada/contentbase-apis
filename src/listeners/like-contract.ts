/**
 * Like Contract's Event Listeners
 */

import { utils } from "ethers"
import { Listener } from "@ethersproject/abstract-provider"

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
function getLikeContractForWs() {
  return getContractForWs({
    address: LikeContract.address,
    contractInterface: LikeContract.abi,
  }) as Like
}

/**
 * A function to start listeners.
 */
export function startListeners() {
  console.log("like start -->")
  const likeContract = getLikeContractForWs()

  /**
   * Handler for `PublishLiked` Event
   */
  const publishLikedListener = async (...args: PublishLikedEvent["args"]) => {
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
        }
      }
    } catch (error) {
      console.log("error -->", error)
    }
  }

  /**
   * Handler for `PublishUnLiked` Event
   */
  const publishUnLikedListener = async (
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
      }
    } catch (error) {
      console.log("error -->", error)
    }
  }

  /**
   * Handler for `PublishDisLiked` Event
   */
  const publishDisLikedListener = async (
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
        }
      }
    } catch (error) {
      console.log("error -->", error)
    }
  }

  /**
   * Handler for `PublishUndoDisLiked` Event
   */
  const publishUndoDisLikedListener = async (
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
        }
      }
    } catch (error) {
      console.log("error -->", error)
    }
  }

  while (true) {
    // Listen to `PublishLiked` Event
    likeContract.on("PublishLiked", publishLikedListener as unknown as Listener)

    // Listen to `PublishUnLiked` Event
    likeContract.on(
      "PublishUnLiked",
      publishUnLikedListener as unknown as Listener
    )

    // Listen to `PublishDisLiked` Event
    likeContract.on(
      "PublishDisLiked",
      publishDisLikedListener as unknown as Listener
    )

    // Listen to `PublishUndoDisLiked` Event
    likeContract.on(
      "PublishUndoDisLiked",
      publishUndoDisLikedListener as unknown as Listener
    )
  }
}

startListeners()
