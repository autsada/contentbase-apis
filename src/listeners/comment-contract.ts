/**
 * Comment Contract's Event Listeners
 */
import type { CommentType } from "@prisma/client"

import { prisma } from "../client"
import { getContractForWs } from "./ethers"
import DevCommentContract from "../abi/localhost/ContentBaseCommentV1.json"
import StagingCommentContract from "../abi/testnet/ContentBaseCommentV1.json"
import ProdCommentContract from "../abi/mainnet/ContentBaseCommentV1.json"
import { ContentBaseCommentV1 as Comment } from "../typechain-types"
import {
  CommentCreatedEvent,
  CommentUpdatedEvent,
  CommentDeletedEvent,
  CommentLikedEvent,
  CommentUnLikedEvent,
  CommentDisLikedEvent,
  CommentUndoDisLikedEvent,
} from "../typechain-types/contracts/publish/ContentBaseCommentV1"
import { generateTokenId, getKeyOfCommentType } from "../utils"
import type { Environment } from "../types"

const { NODE_ENV } = process.env
const env = NODE_ENV as Environment

/**
 * Get contract for listening to events
 */
export function getCommentContractForWs() {
  const contract = getContractForWs({
    address:
      env === "production"
        ? ProdCommentContract.address
        : env === "staging"
        ? StagingCommentContract.address
        : DevCommentContract.address,
    contractInterface:
      env === "production"
        ? ProdCommentContract.abi
        : env === "staging"
        ? StagingCommentContract.abi
        : DevCommentContract.abi,
  }) as Comment

  return contract
}

/**
 * Handler for `CommentCreated` Event
 */
export const commentCreatedListener = async (
  ...args: CommentCreatedEvent["args"]
) => {
  try {
    const [tokenId, parentId, creatorId, owner, text, commentType, timestamp] =
      args

    // 1. Get the profile of the creator.
    const profile = await prisma.profile.findUnique({
      where: {
        tokenId: generateTokenId(creatorId),
      },
    })

    if (profile) {
      // `parentId` can be the token id of a publish or a comment, depending of the commentType.
      const typeEnum = getKeyOfCommentType(commentType) as CommentType

      const tokenIdString = generateTokenId(tokenId)

      // Check if the comment already exists.
      const comment = await prisma.comment.findUnique({
        where: {
          tokenId: tokenIdString,
        },
      })

      if (!comment) {
        if (typeEnum === "PUBLISH") {
          // A. `parentId` is a publish.
          // A.1. Get the publish.
          const publish = await prisma.publish.findUnique({
            where: {
              tokenId: generateTokenId(parentId),
            },
          })

          if (publish) {
            // A.2. Create a new comment.
            await prisma.comment.create({
              data: {
                tokenId: tokenIdString,
                createdAt: new Date(timestamp.toNumber() * 1000),
                creatorId: profile.id,
                publishId: publish.id,
                text,
                commentType: "PUBLISH",
              },
            })
          }
        } else if (typeEnum === "COMMENT") {
          // B. `parentId` is a comment.
          // B.1. Get the comment.
          const comment = await prisma.comment.findUnique({
            where: {
              tokenId: generateTokenId(parentId),
            },
          })

          if (comment) {
            // B.2. Create a new comment.
            await prisma.comment.create({
              data: {
                tokenId: tokenIdString,
                createdAt: new Date(timestamp.toNumber() * 1000),
                creatorId: profile.id,
                publishId: comment.publishId,
                commentId: comment.id,
                text,
                commentType: "COMMENT",
              },
            })
          }
        }

        console.log("comment created done")
      }
    }
  } catch (error) {
    console.error((error as any).message)
  }
}

/**
 * Handler for `CommentUpdated` Event
 */
export const commentUpdatedListener = async (
  ...args: CommentUpdatedEvent["args"]
) => {
  try {
    const [tokenId, creatorId, owner, text, timestamp] = args

    // 1. Get the comment by its token id.
    const comment = await prisma.comment.findUnique({
      where: {
        tokenId: generateTokenId(tokenId),
      },
    })

    if (comment) {
      // 2. Update the comment.
      await prisma.comment.update({
        where: {
          id: comment.id,
        },
        data: {
          text,
          updatedAt: new Date(timestamp.toNumber() * 1000),
        },
      })

      console.log("comment updated done")
    }
  } catch (error) {
    console.error((error as any).message)
  }
}

/**
 * Handler for `CommentDeleted` Event
 */
export const commentDeletedListener = async (
  ...args: CommentDeletedEvent["args"]
) => {
  try {
    const [tokenId] = args

    // 1. Get the comment by its token id.
    const comment = await prisma.comment.findUnique({
      where: {
        tokenId: generateTokenId(tokenId),
      },
    })

    if (comment) {
      // 2. Delete the comment.
      await prisma.comment.delete({
        where: {
          id: comment.id,
        },
      })

      console.log("comment deleted done")
    }
  } catch (error) {
    console.error((error as any).message)
  }
}

/**
 * Handler for `CommentLiked`
 */
export const commentLikedListener = async (
  ...args: CommentLikedEvent["args"]
) => {
  try {
    const [commentId, profileId, timestamp] = args

    // 1. Get the profile by the profile token id (profileId).
    const profile = await prisma.profile.findUnique({
      where: {
        tokenId: generateTokenId(profileId),
      },
    })

    if (profile) {
      // 2. Get the comment by its token id.
      const comment = await prisma.comment.findUnique({
        where: {
          tokenId: generateTokenId(commentId),
        },
      })

      if (comment) {
        // 3. Create a commentLike.
        await prisma.commentLike.create({
          data: {
            createdAt: new Date(timestamp.toNumber() * 1000),
            commentId: comment.id,
            profileId: profile.id,
          },
        })

        // 4. Check if the user disliked the comment before, if so we need to delete the existing commentDisLike as well.
        const commentDisLike = await prisma.commentDisLike.findUnique({
          where: {
            identifier: {
              commentId: comment.id,
              profileId: profile.id,
            },
          },
        })

        if (commentDisLike) {
          await prisma.commentDisLike.delete({
            where: {
              identifier: {
                commentId: comment.id,
                profileId: profile.id,
              },
            },
          })
        }

        console.log("comment liked done")
      }
    }
  } catch (error) {
    console.error((error as any).message)
  }
}

/**
 * Handler for `CommentUnLiked` Event
 */
export const commentUnLikedListener = async (
  ...args: CommentUnLikedEvent["args"]
) => {
  try {
    const [commentId, profileId] = args

    // 1. Get the profile by the profile token id (profileId).
    const profile = await prisma.profile.findUnique({
      where: {
        tokenId: generateTokenId(profileId),
      },
    })

    if (profile) {
      // 2. Get the comment.
      const comment = await prisma.comment.findUnique({
        where: {
          tokenId: generateTokenId(commentId),
        },
      })

      if (comment) {
        // 3. Delete the commentLike.
        await prisma.commentLike.delete({
          where: {
            identifier: {
              commentId: comment.id,
              profileId: profile.id,
            },
          },
        })

        console.log("comment unliked done")
      }
    }
  } catch (error) {
    console.error((error as any).message)
  }
}

/**
 * Handler for `CommentDisLiked`
 */
export const commentDisLikedListener = async (
  ...args: CommentDisLikedEvent["args"]
) => {
  try {
    const [commentId, profileId, timestamp] = args

    // 1. Get the profile by the profile token id (profileId).
    const profile = await prisma.profile.findUnique({
      where: {
        tokenId: generateTokenId(profileId),
      },
    })

    if (profile) {
      // 2. Get the comment by its token id.
      const comment = await prisma.comment.findUnique({
        where: {
          tokenId: generateTokenId(commentId),
        },
      })

      if (comment) {
        // 3. Create a commentDisLike.
        await prisma.commentDisLike.create({
          data: {
            createdAt: new Date(timestamp.toNumber() * 1000),
            commentId: comment.id,
            profileId: profile.id,
          },
        })

        // 4. Check if the user liked the comment before, if so we need to delete the existing commentLike as well.
        const commentLike = await prisma.commentLike.findUnique({
          where: {
            identifier: {
              commentId: comment.id,
              profileId: profile.id,
            },
          },
        })

        if (commentLike) {
          await prisma.commentLike.delete({
            where: {
              identifier: {
                commentId: comment.id,
                profileId: profile.id,
              },
            },
          })
        }

        console.log("comment disliked done")
      }
    }
  } catch (error) {
    console.error((error as any).message)
  }
}

/**
 * Handler for `CommentUndoDisLiked` Event
 */
export const commentUndoDisLikedListener = async (
  ...args: CommentUndoDisLikedEvent["args"]
) => {
  try {
    const [commentId, profileId] = args

    // 1. Get the profile by the profile token id (profileId).
    const profile = await prisma.profile.findUnique({
      where: {
        tokenId: generateTokenId(profileId),
      },
    })

    if (profile) {
      // 2. Get the comment.
      const comment = await prisma.comment.findUnique({
        where: {
          tokenId: generateTokenId(commentId),
        },
      })

      if (comment) {
        // 3. Delete the commentDisLike.
        await prisma.commentDisLike.delete({
          where: {
            identifier: {
              commentId: comment.id,
              profileId: profile.id,
            },
          },
        })

        console.log("comment undo disliked done")
      }
    }
  } catch (error) {
    console.error((error as any).message)
  }
}
