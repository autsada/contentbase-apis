/**
 * Comment Contract's Event Listeners
 */

import { Listener } from "@ethersproject/abstract-provider"

import { prisma } from "../client"
import { getContractForWs } from "."
import CommentContract from "../abi/ContentBaseCommentV1.json"
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
import { getKeyOfCommentType } from "../utils"
import type { CommentType } from "@prisma/client"

/**
 * Get contract for listening to events
 */
export function getCommentContractForWs() {
  return getContractForWs({
    address: CommentContract.address,
    contractInterface: CommentContract.abi,
  }) as Comment
}

/**
 * A function to start listeners.
 */
export function startListeners() {
  const commentContract = getCommentContractForWs()

  /**
   * Handler for `CommentCreated` Event
   */
  const commentCreatedListener = async (
    ...args: CommentCreatedEvent["args"]
  ) => {
    try {
      const [
        tokenId,
        parentId,
        creatorId,
        owner,
        contentURI,
        commentType,
        timestamp,
      ] = args

      // 1. Get the profile of the creator.
      const profile = await prisma.profile.findUnique({
        where: {
          tokenId: creatorId.toBigInt(),
        },
      })

      if (profile) {
        // `parentId` can be the token id of a publish or a comment, depending of the commentType.
        const typeEnum = getKeyOfCommentType(commentType) as CommentType

        console.log("comment type -->", typeEnum)
        if (typeEnum === "PUBLISH") {
          // A. `parentId` is a publish.
          // A.1. Get the publish.
          const publish = await prisma.publish.findUnique({
            where: {
              tokenId: parentId.toBigInt(),
            },
          })

          if (publish) {
            // A.2. Create a new comment.
            await prisma.comment.create({
              data: {
                tokenId: tokenId.toBigInt(),
                createdAt: new Date(timestamp.toNumber() * 1000),
                owner,
                creatorId: profile.id,
                publishId: publish.id,
                commentType: "PUBLISH",
                contentURI,
              },
            })
          }
        } else if (typeEnum === "COMMENT") {
          // B. `parentId` is a comment.
          // B.1. Get the comment.
          const comment = await prisma.comment.findUnique({
            where: {
              tokenId: parentId.toBigInt(),
            },
          })

          if (comment) {
            // B.2. Create a new comment.
            await prisma.comment.create({
              data: {
                tokenId: tokenId.toBigInt(),
                createdAt: new Date(timestamp.toNumber() * 1000),
                owner,
                creatorId: profile.id,
                publishId: comment.publishId,
                commentId: comment.id,
                commentType: "COMMENT",
                contentURI,
              },
            })
          }
        }
      }
    } catch (error) {
      console.log("error -->", error)
    }
  }

  /**
   * Handler for `CommentUpdated` Event
   */
  const commentUpdatedListener = async (
    ...args: CommentUpdatedEvent["args"]
  ) => {
    try {
      const [tokenId, contentURI, timestamp] = args

      // 1. Get the comment by its token id.
      const comment = await prisma.comment.findUnique({
        where: {
          tokenId: tokenId.toBigInt(),
        },
      })

      if (comment) {
        // 2. Update the comment.
        await prisma.comment.update({
          where: {
            id: comment.id,
          },
          data: {
            contentURI,
            updatedAt: new Date(timestamp.toNumber() * 1000),
          },
        })
      }
    } catch (error) {
      console.log("error -->", error)
    }
  }

  /**
   * Handler for `CommentDeleted` Event
   */
  const commentDeletedListener = async (
    ...args: CommentDeletedEvent["args"]
  ) => {
    try {
      const [tokenId] = args

      // 1. Get the comment by its token id.
      const comment = await prisma.comment.findUnique({
        where: {
          tokenId: tokenId.toBigInt(),
        },
      })

      if (comment) {
        // 2. Delete the comment.
        await prisma.comment.delete({
          where: {
            id: comment.id,
          },
        })
      }
    } catch (error) {
      console.log("error -->", error)
    }
  }

  /**
   * Handler for `CommentLiked`
   */
  const commentLikedListener = async (...args: CommentLikedEvent["args"]) => {
    try {
      const [commentId, profileId, timestamp] = args

      // 1. Get the profile by the profile token id (profileId).
      const profile = await prisma.profile.findUnique({
        where: {
          tokenId: profileId.toBigInt(),
        },
      })

      if (profile) {
        // 2. Get the comment by its token id.
        const comment = await prisma.comment.findUnique({
          where: {
            tokenId: commentId.toBigInt(),
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
        }
      }
    } catch (error) {
      console.log("error -->", error)
    }
  }

  /**
   * Handler for `CommentUnLiked` Event
   */
  const commentUnLikedListener = async (
    ...args: CommentUnLikedEvent["args"]
  ) => {
    try {
      const [commentId, profileId] = args

      // 1. Get the profile by the profile token id (profileId).
      const profile = await prisma.profile.findUnique({
        where: {
          tokenId: profileId.toBigInt(),
        },
      })

      if (profile) {
        // 2. Get the comment.
        const comment = await prisma.comment.findUnique({
          where: {
            tokenId: commentId.toBigInt(),
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
        }
      }
    } catch (error) {
      console.log("error -->", error)
    }
  }

  /**
   * Handler for `CommentDisLiked`
   */
  const commentDisLikedListener = async (
    ...args: CommentDisLikedEvent["args"]
  ) => {
    try {
      const [commentId, profileId, timestamp] = args

      // 1. Get the profile by the profile token id (profileId).
      const profile = await prisma.profile.findUnique({
        where: {
          tokenId: profileId.toBigInt(),
        },
      })

      if (profile) {
        // 2. Get the comment by its token id.
        const comment = await prisma.comment.findUnique({
          where: {
            tokenId: commentId.toBigInt(),
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
        }
      }
    } catch (error) {
      console.log("error -->", error)
    }
  }

  /**
   * Handler for `CommentUndoDisLiked` Event
   */
  const commentUndoDisLikedListener = async (
    ...args: CommentUndoDisLikedEvent["args"]
  ) => {
    try {
      const [commentId, profileId] = args

      // 1. Get the profile by the profile token id (profileId).
      const profile = await prisma.profile.findUnique({
        where: {
          tokenId: profileId.toBigInt(),
        },
      })

      if (profile) {
        // 2. Get the comment.
        const comment = await prisma.comment.findUnique({
          where: {
            tokenId: commentId.toBigInt(),
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
        }
      }
    } catch (error) {
      console.log("error -->", error)
    }
  }

  while (true) {
    // Listen to `CommentCreated` Event
    commentContract.on(
      "CommentCreated",
      commentCreatedListener as unknown as Listener
    )

    // Listen to `CommentUpdated` Event
    commentContract.on(
      "CommentUpdated",
      commentUpdatedListener as unknown as Listener
    )

    // Listen to `CommentDeleted` Event
    commentContract.on(
      "CommentDeleted",
      commentDeletedListener as unknown as Listener
    )

    // Listen to `CommentLiked` Event
    commentContract.on(
      "CommentLiked",
      commentLikedListener as unknown as Listener
    )

    // Listen to `CommentUnLiked` Event
    commentContract.on(
      "CommentUnLiked",
      commentUnLikedListener as unknown as Listener
    )

    // Listen to `CommentDisLiked` Event
    commentContract.on(
      "CommentDisLiked",
      commentDisLikedListener as unknown as Listener
    )

    // Listen to `CommentUndoDisLiked` Event
    commentContract.on(
      "CommentUndoDisLiked",
      commentUndoDisLikedListener as unknown as Listener
    )
  }
}
