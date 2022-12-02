/**
 * This file contains the functions for Profile Contract.
 */

import { Listener } from "@ethersproject/abstract-provider"

import { getContractForWs } from "."
import ProfileContract from "../abi/ContentBaseProfileV1.json"
import { ContentBaseProfileV1 as Profile } from "../typechain-types"
import {
  ProfileCreatedEvent,
  ProfileImageUpdatedEvent,
  DefaultProfileUpdatedEvent,
  FollowNFTMintedEvent,
  FollowNFTBurnedEvent,
} from "../typechain-types/contracts/profile/ContentBaseProfileV1"
import { prisma } from "../client"

/**
 * Get contract for listening to events
 */
export function getProfileContractForWs() {
  return getContractForWs({
    address: ProfileContract.address,
    contractInterface: ProfileContract.abi,
  }) as Profile
}

/**
 * A function to start listeners.
 */
export function startProfileContractListeners() {
  const profileContract = getProfileContractForWs()

  /**
   * `ProfileCreated` Event
   */
  const profileCreatedListener = async (
    ...args: ProfileCreatedEvent["args"]
  ) => {
    const [
      tokenId,
      owner,
      handle,
      imageURI,
      originalHandle,
      isDefault,
      timestamp,
    ] = args
    // Need to lower case the address so it can be used for comparision.
    const formattedAddress = owner.toLowerCase()
    // 1. Get the account.
    let account = await prisma.account.findUnique({
      where: { address: formattedAddress },
    })
    // If no account found, it means this is the first profile of the caller (owner) so we need to create`Account` first.
    if (!account) {
      // 2. Create an account (if not exist).
      account = await prisma.account.create({
        data: {
          createdAt: new Date(timestamp.toNumber() * 1000),
          address: formattedAddress,
        },
      })
    }

    // 3. Create a Profile.
    await prisma.profile.create({
      data: {
        tokenId: tokenId.toBigInt(),
        createdAt: new Date(timestamp.toNumber() * 1000),
        owner: formattedAddress,
        accountId: account.id,
        handle,
        originalHandle,
        imageURI,
        default: isDefault,
        revenue: `0`,
      },
    })
  }
  profileContract.on(
    "ProfileCreated",
    profileCreatedListener as unknown as Listener
  )

  /**
   * `ProfileImageUpdated` Event
   */
  const profileImageUpdatedListener = async (
    ...args: ProfileImageUpdatedEvent["args"]
  ) => {
    const [tokenId, imageURI, timestamp] = args
    // 1. Get the profile.
    const profile = await prisma.profile.findUnique({
      where: { tokenId: tokenId.toBigInt() },
    })
    // 2. Update the profile.
    if (profile) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: { imageURI, updatedAt: new Date(timestamp.toNumber() * 1000) },
      })
    }
  }
  profileContract.on(
    "ProfileImageUpdated",
    profileImageUpdatedListener as unknown as Listener
  )

  /**
   * `DefaultProfileUpdated` Event
   */
  const defaultProfileUpdatedListener = async (
    ...args: DefaultProfileUpdatedEvent["args"]
  ) => {
    const [newProfileId, oldProfileId, timestamp] = args
    // 1. Get the new default profile.
    const newProfile = await prisma.profile.findUnique({
      where: { tokenId: newProfileId.toBigInt() },
    })
    if (newProfile) {
      // 2. Update the new default profile.
      await prisma.profile.update({
        where: { id: newProfile.id },
        data: {
          default: true,
          updatedAt: new Date(timestamp.toNumber() * 1000),
        },
      })
    }

    // 3. Get the old default profile.
    const oldProfile = await prisma.profile.findUnique({
      where: { tokenId: oldProfileId.toBigInt() },
    })
    if (oldProfile) {
      // 4. Update the old default profile.
      await prisma.profile.update({
        where: { id: oldProfile.id },
        data: {
          default: false,
          updatedAt: new Date(timestamp.toNumber() * 1000),
        },
      })
    }
  }
  profileContract.on(
    "DefaultProfileUpdated",
    defaultProfileUpdatedListener as unknown as Listener
  )

  /**
   * `FollowNFTMinted` Event
   */
  const followEventListener = async (...args: FollowNFTMintedEvent["args"]) => {
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
          followerId: follower.id,
          followeeId: followee.id,
          createdAt: new Date(timestamp.toNumber() * 1000),
        },
      })
    }
  }
  profileContract.on(
    "FollowNFTMinted",
    followEventListener as unknown as Listener
  )

  /**
   * `FollowNFTBurned` Event
   */
  const unFollowEventListener = async (
    ...args: FollowNFTBurnedEvent["args"]
  ) => {
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
  profileContract.on(
    "FollowNFTBurned",
    unFollowEventListener as unknown as Listener
  )
}
