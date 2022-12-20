/**
 * Profile Contract's Event Listeners
 */

import { prisma } from "../client"
import { getContractForWs } from "./ethers"
import DevProfileContract from "../abi/localhost/ContentBaseProfileV1.json"
import StagingProfileContract from "../abi/testnet/ContentBaseProfileV1.json"
import ProdProfileContract from "../abi/mainnet/ContentBaseProfileV1.json"
import { ContentBaseProfileV1 as Profile } from "../typechain-types"
import {
  ProfileCreatedEvent,
  ProfileImageUpdatedEvent,
  DefaultProfileUpdatedEvent,
} from "../typechain-types/contracts/profile/ContentBaseProfileV1"
import { generateTokenId } from "../utils"
import type { Environment } from "../types"

const { NODE_ENV } = process.env
const env = NODE_ENV as Environment

/**
 * Get the contract for listening to events
 */
export function getProfileContractForWs() {
  const contract = getContractForWs({
    address:
      env === "production"
        ? ProdProfileContract.address
        : env === "staging"
        ? StagingProfileContract.address
        : DevProfileContract.address,
    contractInterface:
      env === "production"
        ? ProdProfileContract.abi
        : env === "staging"
        ? StagingProfileContract.abi
        : DevProfileContract.abi,
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

    const tokenIdString = generateTokenId(tokenId)

    // Check if the profile already exists.
    const profile = await prisma.profile.findUnique({
      where: {
        tokenId: tokenIdString,
      },
    })

    if (!profile) {
      // 3. Create a Profile if not exists.
      await prisma.profile.create({
        data: {
          tokenId: tokenIdString,
          createdAt: new Date(timestamp.toNumber() * 1000),
          accountId: account.id,
          owner: formattedAddress,
          handle,
          originalHandle,
          imageURI,
          default: isDefault,
        },
      })

      console.log("Profile created done")
    }
  } catch (error) {
    console.error((error as any).message)
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

    // 2. Update the profile.
    if (profile) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: { imageURI, updatedAt: new Date(timestamp.toNumber() * 1000) },
      })

      console.log("Profile updated done")
    }
  } catch (error) {
    console.error((error as any).message)
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

    if (oldProfile && oldProfile.default) {
      // 4. Update the old default profile.
      await prisma.profile.update({
        where: { id: oldProfile.id },
        data: {
          default: false,
          updatedAt: new Date(timestamp.toNumber() * 1000),
        },
      })

      console.log("update default profile done")
    }
  } catch (error) {
    console.error((error as any).message)
  }
}
