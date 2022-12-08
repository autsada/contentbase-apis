/**
 * Profile Contract's Event Listeners
 */

import { prisma } from "../client"
import { getContractForWs } from "./ethers"
import ProfileContract from "../abi/ContentBaseProfileV1.json"
import { ContentBaseProfileV1 as Profile } from "../typechain-types"
import {
  ProfileCreatedEvent,
  ProfileImageUpdatedEvent,
  DefaultProfileUpdatedEvent,
} from "../typechain-types/contracts/profile/ContentBaseProfileV1"
import { generateTokenId } from "../utils"

/**
 * Get the contract for listening to events
 */
export function getProfileContractForWs() {
  const contract = getContractForWs({
    address: ProfileContract.address,
    contractInterface: ProfileContract.abi,
  }) as Profile

  return contract
}

/**
 * Handler for `ProfileCreated` Event
 */
export const profileCreatedListener = async (
  ...args: ProfileCreatedEvent["args"]
) => {
  try {
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

    // 1. Get the account by the lowercased address.
    let account = await prisma.account.findUnique({
      where: { address: formattedAddress },
    })

    // If no account found, it means this is the first profile of the caller (owner) so we need to create an account first.
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
        tokenId: generateTokenId(tokenId),
        createdAt: new Date(timestamp.toNumber() * 1000),
        accountId: account.id,
        owner: formattedAddress,
        handle,
        originalHandle,
        imageURI,
        default: isDefault,
      },
    })
  } catch (error) {
    console.log("error -->", error)
  }
}

/**
 * Handler for `ProfileImageUpdated` Event
 */
export const profileImageUpdatedListener = async (
  ...args: ProfileImageUpdatedEvent["args"]
) => {
  try {
    const [tokenId, imageURI, timestamp] = args

    // 1. Get the profile.
    const profile = await prisma.profile.findUnique({
      where: { tokenId: generateTokenId(tokenId) },
    })

    console.log("profile -->", profile)
    // 2. Update the profile.
    if (profile) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: { imageURI, updatedAt: new Date(timestamp.toNumber() * 1000) },
      })
    }
  } catch (error) {
    console.log("error -->", error)
  }
}

/**
 * Handler for `DefaultProfileUpdated` Event
 */
export const defaultProfileUpdatedListener = async (
  ...args: DefaultProfileUpdatedEvent["args"]
) => {
  try {
    const [newProfileId, oldProfileId, timestamp] = args

    // 1. Get the new default profile.
    const newProfile = await prisma.profile.findUnique({
      where: { tokenId: generateTokenId(newProfileId) },
    })

    if (newProfile && !newProfile.default) {
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
      where: { tokenId: generateTokenId(oldProfileId) },
    })

    console.log("new default -->", newProfile)
    if (oldProfile && oldProfile.default) {
      // 4. Update the old default profile.
      await prisma.profile.update({
        where: { id: oldProfile.id },
        data: {
          default: false,
          updatedAt: new Date(timestamp.toNumber() * 1000),
        },
      })
    }
  } catch (error) {
    console.log("error -->", error)
  }
}
