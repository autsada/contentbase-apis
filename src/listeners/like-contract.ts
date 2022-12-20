/**
 * Like Contract's Event Listeners
 */

import { utils } from "ethers"

import { prisma } from "../client"
import { getContractForWs } from "./ethers"
import DevLikeContract from "../abi/localhost/ContentBaseLikeV1.json"
import StagingLikeContract from "../abi/testnet/ContentBaseLikeV1.json"
import ProdLikeContract from "../abi/mainnet/ContentBaseLikeV1.json"
import { ContentBaseLikeV1 as Like } from "../typechain-types"
import {
  PublishLikedEvent,
  PublishUnLikedEvent,
  PublishDisLikedEvent,
  PublishUndoDisLikedEvent,
} from "../typechain-types/contracts/publish/ContentBaseLikeV1"
import { generateTokenId } from "../utils"
import { logger } from "../utils/logger"
import type { Environment } from "../types"

const { NODE_ENV } = process.env
const env = NODE_ENV as Environment

/**
 * Get contract for listening to events
 */
export function getLikeContractForWs() {
  const contract = getContractForWs({
    address:
      env === "production"
        ? ProdLikeContract.address
        : env === "staging"
        ? StagingLikeContract.address
        : DevLikeContract.address,
    contractInterface:
      env === "production"
        ? ProdLikeContract.abi
        : env === "staging"
        ? StagingLikeContract.abi
        : DevLikeContract.abi,
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
    const [tokenId, publishId, profileId, amount, fee, timestamp] = args

    // 1. Get the profile of the user that liked the publish by its tokenId.
    const profile = await prisma.profile.findUnique({
      where: {
        tokenId: generateTokenId(profileId),
      },
    })

    if (profile) {
      // 2. Get the publish by its tokenId.
      const publish = await prisma.publish.findUnique({
        where: {
          tokenId: generateTokenId(publishId),
        },
      })

      if (publish) {
        // 3. Create a new LikeFee and Like if not exist.
        const tokenIdString = generateTokenId(tokenId)
        const like = await prisma.like.findUnique({
          where: {
            tokenId: tokenIdString,
          },
        })
        if (!like) {
          const feeEntity = await prisma.likeFee.create({
            data: {
              createdAt: new Date(timestamp.toNumber() * 1000),
              senderId: profile.id,
              publishId: publish.id,
              receiverId: publish.creatorId,
              amount: utils.formatEther(amount),
              fee: utils.formatEther(fee),
            },
          })

          await prisma.like.create({
            data: {
              tokenId: tokenIdString,
              createdAt: new Date(timestamp.toNumber() * 1000),
              profileId: profile.id,
              publishId: publish.id,
              likeFeeId: feeEntity.id,
            },
          })
        }

        // 4. Check if the user disliked the publish before, if so we need to delete the existing disLike as well.
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

        logger.info("like publish done")
      }
    }
  } catch (error) {
    logger.error((error as any).message)
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
        tokenId: generateTokenId(tokenId),
      },
    })

    if (like) {
      // 2. Delete the like
      await prisma.like.delete({
        where: {
          id: like.id,
        },
      })

      logger.info("unlike publish done")
    }
  } catch (error) {
    logger.error((error as any).message)
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
        tokenId: generateTokenId(profileId),
      },
    })

    if (profile) {
      // 2. Get the publish by its tokenId.
      const publish = await prisma.publish.findUnique({
        where: {
          tokenId: generateTokenId(publishId),
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

        logger.info("dislike publish done")
      }
    }
  } catch (error) {
    logger.error((error as any).message)
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
        tokenId: generateTokenId(profileId),
      },
    })

    if (profile) {
      // 2. Get the publish by its tokenId.
      const publish = await prisma.publish.findUnique({
        where: {
          tokenId: generateTokenId(publishId),
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

        logger.info("undo dislike publish done")
      }
    }
  } catch (error) {
    logger.error((error as any).message)
  }
}
