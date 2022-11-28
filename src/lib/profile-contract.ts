/**
 * This file contains the functions for Profile Contract.
 */

import { Listener } from "@ethersproject/abstract-provider"

import { getContractForWs } from "."
import ProfileContract from "../abi/ContentBaseProfileV1.json"
import { ContentBaseProfileV1 as Profile } from "../typechain-types"
import {
  ContentBaseProfileV1Interface,
  ProfileCreatedEvent,
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

export function startProfileContractListening() {
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
    // Get the account.
    let account = await prisma.account.findUnique({
      where: { address: owner },
    })

    // If no account found, it means this is the first profile of the caller (owner) so we need to create`Account` first.
    if (!account) {
      account = await prisma.account.create({
        data: {
          createdAt: new Date(timestamp.toNumber()),
          address: owner,
        },
      })
    }

    await prisma.profile.create({
      data: {
        id: tokenId.toBigInt(),
        owner,
        accountId: account.id,
        handle,
        originalHandle,
        imageURI,
        default: isDefault,
        createdAt: new Date(timestamp.toNumber()),
      },
    })
  }
  profileContract.on(
    "ProfileCreated",
    profileCreatedListener as unknown as Listener
  )
}
