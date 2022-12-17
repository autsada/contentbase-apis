/**
 * Publish Contract's Event Listeners
 */
import type { Category, PublishKind } from "@prisma/client"

import { prisma } from "../client"
import { getContractForWs } from "./ethers"
import DevPublishContract from "../abi/localhost/ContentBasePublishV1.json"
import StagingPublishContract from "../abi/testnet/ContentBasePublishV1.json"
import ProdPublishContract from "../abi/mainnet/ContentBasePublishV1.json"
import { ContentBasePublishV1 as Publish } from "../typechain-types"
import {
  PublishCreatedEvent,
  PublishUpdatedEvent,
  PublishDeletedEvent,
} from "../typechain-types/contracts/publish/ContentBasePublishV1"
import {
  generateTokenId,
  getKeyOfCategory,
  getKeyOfPublishKind,
} from "../utils"
import type { Environment } from "../types"

const { NODE_ENV } = process.env
const env = NODE_ENV as Environment

/**
 * Get the contract for listening to events
 */
export function getPublishContractForWs() {
  const contract = getContractForWs({
    address:
      env === "production"
        ? ProdPublishContract.address
        : env === "staging"
        ? StagingPublishContract.address
        : DevPublishContract.address,
    contractInterface:
      env === "production"
        ? ProdPublishContract.abi
        : env === "staging"
        ? StagingPublishContract.abi
        : DevPublishContract.abi,
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
      kind,
      timestamp,
    ] = args
    // 1. Get the profile's token id (creatorId).
    const profile = await prisma.profile.findUnique({
      where: { tokenId: generateTokenId(creatorId) },
    })

    if (profile) {
      const tokenIdString = generateTokenId(tokenId)

      // Check if the publish already exists.
      const publish = await prisma.publish.findUnique({
        where: {
          tokenId: tokenIdString,
        },
      })

      if (!publish) {
        // 2. Create a Publish if not exists.
        await prisma.publish.create({
          data: {
            tokenId: tokenIdString,
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
            kind: getKeyOfPublishKind(kind) as PublishKind,
            views: 0,
          },
        })

        console.log("create publish done")
      }
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
