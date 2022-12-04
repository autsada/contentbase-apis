/**
 * Publish Contract's Event Listeners
 */

import { Listener } from "@ethersproject/abstract-provider"

import { prisma } from "../client"
import { getContractForWs } from "./ethers"
import PublishContract from "../abi/ContentBasePublishV1.json"
import { ContentBasePublishV1 as Publish } from "../typechain-types"
import {
  PublishCreatedEvent,
  PublishUpdatedEvent,
  PublishDeletedEvent,
} from "../typechain-types/contracts/publish/ContentBasePublishV1"
import { getKeyOfCategory } from "../utils"
import type { Category } from "@prisma/client"

/**
 * Get the contract for listening to events
 */
function getPublishContractForWs() {
  return getContractForWs({
    address: PublishContract.address,
    contractInterface: PublishContract.abi,
  }) as Publish
}

/**
 * A function to start listeners.
 */
export function startListeners() {
  console.log("publish start -->")
  const publishContract = getPublishContractForWs()

  /**
   * Handler for `PublishCreated` Event
   */
  const publishCreatedListener = async (
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

      // Need to lower case the address.
      const formattedAddress = owner.toLowerCase()

      // 1. Get the profile's token id (creatorId).
      const profile = await prisma.profile.findUnique({
        where: { tokenId: creatorId.toBigInt() },
      })

      if (profile) {
        // 2. Create a Publish.
        console.log("primary -->", getKeyOfCategory(primaryCategory))
        console.log("secondary -->", getKeyOfCategory(secondaryCategory))
        console.log("tertiary -->", getKeyOfCategory(tertiaryCategory))
        await prisma.publish.create({
          data: {
            tokenId: tokenId.toBigInt(),
            createdAt: new Date(timestamp.toNumber() * 1000),
            owner: formattedAddress,
            creatorId: profile.id,
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
  const publishUpdatedListener = async (
    ...args: PublishUpdatedEvent["args"]
  ) => {
    try {
      const [
        tokenId,
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
        where: { tokenId: tokenId.toBigInt() },
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
      }
    } catch (error) {
      console.log("error -->", error)
    }
  }

  /**
   * Handler for `PublishDeleted` Event
   */
  const publishDeletedListener = async (
    ...args: PublishDeletedEvent["args"]
  ) => {
    try {
      const [tokenId] = args

      // 1. Get the publish by its tokenId.
      const publish = await prisma.publish.findUnique({
        where: { tokenId: tokenId.toBigInt() },
      })

      if (publish) {
        // 2. Delete the Publish.
        await prisma.publish.delete({
          where: { id: publish.id },
        })
      }
    } catch (error) {
      console.log("error -->", error)
    }
  }

  while (true) {
    // Listen to `PublishCreated` Event
    publishContract.on(
      "PublishCreated",
      publishCreatedListener as unknown as Listener
    )

    // Listen to `PublishUpdated` Event
    publishContract.on(
      "PublishUpdated",
      publishUpdatedListener as unknown as Listener
    )

    // Listen to `PublishDeleted` Event
    publishContract.on(
      "PublishDeleted",
      publishDeletedListener as unknown as Listener
    )
  }
}

startListeners()
