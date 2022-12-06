/**
 * A script to run as a separate service from the main server.
 */

import { Listener } from "@ethersproject/abstract-provider"

import {
  getProfileContractForWs,
  profileCreatedListener,
  profileImageUpdatedListener,
  defaultProfileUpdatedListener,
  getFollowContractForWs,
  followingListener,
  unFollowingListener,
  getPublishContractForWs,
  publishCreatedListener,
  publishUpdatedListener,
  publishDeletedListener,
  getCommentContractForWs,
  commentCreatedListener,
  commentDisLikedListener,
  commentLikedListener,
  commentUndoDisLikedListener,
  commentUnLikedListener,
  commentUpdatedListener,
  commentDeletedListener,
  getLikeContractForWs,
  publishDisLikedListener,
  publishLikedListener,
  publishUndoDisLikedListener,
  publishUnLikedListener,
} from "./listeners"

async function main() {
  console.log("start listeners")

  // Listen to Profile Contract events
  const profileContract = getProfileContractForWs()
  profileContract.on(
    "ProfileCreated",
    profileCreatedListener as unknown as Listener
  )
  profileContract.on(
    "ProfileImageUpdated",
    profileImageUpdatedListener as unknown as Listener
  )
  profileContract.on(
    "DefaultProfileUpdated",
    defaultProfileUpdatedListener as unknown as Listener
  )

  // Listen to Follow Contract events
  const followContract = getFollowContractForWs()
  followContract.on("Following", followingListener as unknown as Listener)
  followContract.on("UnFollowing", unFollowingListener as unknown as Listener)

  // Listen to Publish Contract events
  const publishContract = getPublishContractForWs()
  publishContract.on(
    "PublishCreated",
    publishCreatedListener as unknown as Listener
  )
  publishContract.on(
    "PublishUpdated",
    publishUpdatedListener as unknown as Listener
  )
  publishContract.on(
    "PublishDeleted",
    publishDeletedListener as unknown as Listener
  )

  // Listen to Comment Contract events
  const commentContract = getCommentContractForWs()
  commentContract.on(
    "CommentCreated",
    commentCreatedListener as unknown as Listener
  )
  commentContract.on(
    "CommentUpdated",
    commentUpdatedListener as unknown as Listener
  )
  commentContract.on(
    "CommentDeleted",
    commentDeletedListener as unknown as Listener
  )
  commentContract.on(
    "CommentLiked",
    commentLikedListener as unknown as Listener
  )
  commentContract.on(
    "CommentUnLiked",
    commentUnLikedListener as unknown as Listener
  )
  commentContract.on(
    "CommentDisLiked",
    commentDisLikedListener as unknown as Listener
  )
  commentContract.on(
    "CommentUndoDisLiked",
    commentUndoDisLikedListener as unknown as Listener
  )

  // Listen to Like Contract events
  const likeContract = getLikeContractForWs()
  likeContract.on("PublishLiked", publishLikedListener as unknown as Listener)
  likeContract.on(
    "PublishUnLiked",
    publishUnLikedListener as unknown as Listener
  )
  likeContract.on(
    "PublishDisLiked",
    publishDisLikedListener as unknown as Listener
  )
  likeContract.on(
    "PublishUndoDisLiked",
    publishUndoDisLikedListener as unknown as Listener
  )
}

main()
