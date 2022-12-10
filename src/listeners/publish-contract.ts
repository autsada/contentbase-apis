/**
 * Publish Contract's Event Listeners
 */

import { prisma } from "../client"
import { getContractForWs } from "./ethers"
import PublishContract from "../abi/ContentBasePublishV1.json"
import { ContentBasePublishV1 as Publish } from "../typechain-types"
import {
  PublishCreatedEvent,
  PublishUpdatedEvent,
  PublishDeletedEvent,
} from "../typechain-types/contracts/publish/ContentBasePublishV1"
import { generateTokenId, getKeyOfCategory } from "../utils"
import type { Category } from "@prisma/client"

/**
 * Get the contract for listening to events
 */
export function getPublishContractForWs() {
  const contract = getContractForWs({
    address: PublishContract.address,
    contractInterface: PublishContract.abi,
  }) as Publish

  return contract
}

/**
 * Handler for `PublishCreated` Event
 */
export const publishCreatedListener = async (
  ...args: PublishCreatedEvent["args"]
) => {
  try {
    const [
      tokenId,
      creatorId,
      owner,
      imageURI,
      contentURI,
      metadataURI,
      title,
      description,
      primaryCategory,
      secondaryCategory,
      tertiaryCategory,
      timestamp,
    ] = args
    // 1. Get the profile's token id (creatorId).
    const profile = await prisma.profile.findUnique({
      where: { tokenId: generateTokenId(creatorId) },
    })

    if (profile) {
      // 2. Create a Publish.
      console.log("primary -->", getKeyOfCategory(primaryCategory))
      console.log("secondary -->", getKeyOfCategory(secondaryCategory))
      console.log("tertiary -->", getKeyOfCategory(tertiaryCategory))
      await prisma.publish.create({
        data: {
          tokenId: generateTokenId(tokenId),
          createdAt: new Date(timestamp.toNumber() * 1000),
          creatorId: profile.id,
          creatorTokenId: profile.tokenId,
          imageURI,
          contentURI,
          metadataURI,
          title,
          description,
          primaryCategory: getKeyOfCategory(primaryCategory) as Category,
          secondaryCategory: getKeyOfCategory(secondaryCategory) as Category,
          tertiaryCategory: getKeyOfCategory(tertiaryCategory) as Category,
        },
      })
    }
  } catch (error) {
    console.log("error -->", error)
  }
}

/**
 * Handler for `PublishUpdated` Event
 */
export const publishUpdatedListener = async (
  ...args: PublishUpdatedEvent["args"]
) => {
  try {
    const [
      tokenId,
      creatorId,
      owner,
      imageURI,
      contentURI,
      metadataURI,
      title,
      description,
      primaryCategory,
      secondaryCategory,
      tertiaryCategory,
      timestamp,
    ] = args

    // 1. Get the publish by its tokenId.
    const publish = await prisma.publish.findUnique({
      where: { tokenId: generateTokenId(tokenId) },
    })

    if (publish) {
      // 2. Update the Publish.
      await prisma.publish.update({
        where: { id: publish.id },
        data: {
          updatedAt: new Date(timestamp.toNumber() * 1000),
          imageURI,
          contentURI,
          metadataURI,
          title,
          description,
          primaryCategory: getKeyOfCategory(primaryCategory) as Category,
          secondaryCategory: getKeyOfCategory(secondaryCategory) as Category,
          tertiaryCategory: getKeyOfCategory(tertiaryCategory) as Category,
        },
      })

      console.log("publish updated done")
    }
  } catch (error) {
    console.log("error -->", error)
  }
}

/**
 * Handler for `PublishDeleted` Event
 */
export const publishDeletedListener = async (
  ...args: PublishDeletedEvent["args"]
) => {
  try {
    const [tokenId] = args

    // 1. Get the publish by its tokenId.
    const publish = await prisma.publish.findUnique({
      where: { tokenId: generateTokenId(tokenId) },
    })

    if (publish) {
      // 2. Delete the Publish.
      await prisma.publish.delete({
        where: { id: publish.id },
      })

      console.log("publish deleted done")
    }
  } catch (error) {
    console.log("error -->", error)
  }
}
