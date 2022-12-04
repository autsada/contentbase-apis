/**
 * Profile Contract's Event Listeners
 */

import { Listener } from "@ethersproject/abstract-provider"

import { prisma } from "../client"
import { getContractForWs } from "./ethers"
import FollowContract from "../abi/ContentBaseFollowV1.json"
import { ContentBaseFollowV1 as Follow } from "../typechain-types"
import {
  FollowingEvent,
  UnFollowingEvent,
} from "../typechain-types/contracts/profile/ContentBaseFollowV1"

/**
 * Get the contract for listening to events
 */
function getFollowContractForWs() {
  return getContractForWs({
    address: FollowContract.address,
    contractInterface: FollowContract.abi,
  }) as Follow
}

/**
 * A function to start listeners.
 */
export function startListeners() {
  console.log("follow start -->")
  const followContract = getFollowContractForWs()

  /**
   * Handler for `Following` Event
   */
  const followingListener = async (...args: FollowingEvent["args"]) => {
    const [tokenId, followerId, followeeId, timestamp] = args

    // 1. Get the follower profile.
    const follower = await prisma.profile.findUnique({
      where: { tokenId: followerId.toBigInt() },
    })

    // 2. Get the followee profile.
    const followee = await prisma.profile.findUnique({
      where: { tokenId: followeeId.toBigInt() },
    })

    if (follower && followee) {
      // 3. Create a Follow.
      await prisma.follow.create({
        data: {
          tokenId: tokenId.toBigInt(),
          createdAt: new Date(timestamp.toNumber() * 1000),
          followerId: follower.id,
          followeeId: followee.id,
        },
      })
    }
  }

  /**
   * Handler for `UnFollowing` Event
   */
  const unFollowingListener = async (...args: UnFollowingEvent["args"]) => {
    const [tokenId] = args

    // 1. Get the follow by tokenId.
    const follow = await prisma.follow.findUnique({
      where: { tokenId: tokenId.toBigInt() },
    })

    if (follow) {
      // 2. Delete the follow.
      await prisma.follow.delete({ where: { tokenId: tokenId.toBigInt() } })
    }
  }

  while (true) {
    // Listen to `Following` Event
    followContract.on("Following", followingListener as unknown as Listener)

    // Listen to `UnFollowing` Eventf
    followContract.on("UnFollowing", unFollowingListener as unknown as Listener)
  }
}

startListeners()
