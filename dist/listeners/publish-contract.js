"use strict";
/**
 * Publish Contract's Event Listeners
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishDeletedListener = exports.publishUpdatedListener = exports.publishCreatedListener = exports.publishContract = void 0;
const client_1 = require("../client");
const ethers_1 = require("./ethers");
const ContentBasePublishV1_json_1 = __importDefault(require("../abi/ContentBasePublishV1.json"));
const utils_1 = require("../utils");
/**
 * Get the contract for listening to events
 */
function getPublishContractForWs() {
    return (0, ethers_1.getContractForWs)({
        address: ContentBasePublishV1_json_1.default.address,
        contractInterface: ContentBasePublishV1_json_1.default.abi,
    });
}
exports.publishContract = getPublishContractForWs();
/**
 * Handler for `PublishCreated` Event
 */
const publishCreatedListener = async (...args) => {
    try {
        const [tokenId, creatorId, owner, imageURI, contentURI, metadataURI, title, description, primaryCategory, secondaryCategory, tertiaryCategory, timestamp,] = args;
        // Need to lower case the address.
        const formattedAddress = owner.toLowerCase();
        // 1. Get the profile's token id (creatorId).
        const profile = await client_1.prisma.profile.findUnique({
            where: { tokenId: creatorId.toBigInt() },
        });
        if (profile) {
            // 2. Create a Publish.
            console.log("primary -->", (0, utils_1.getKeyOfCategory)(primaryCategory));
            console.log("secondary -->", (0, utils_1.getKeyOfCategory)(secondaryCategory));
            console.log("tertiary -->", (0, utils_1.getKeyOfCategory)(tertiaryCategory));
            await client_1.prisma.publish.create({
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
                    primaryCategory: (0, utils_1.getKeyOfCategory)(primaryCategory),
                    secondaryCategory: (0, utils_1.getKeyOfCategory)(secondaryCategory),
                    tertiaryCategory: (0, utils_1.getKeyOfCategory)(tertiaryCategory),
                },
            });
        }
    }
    catch (error) {
        console.log("error -->", error);
    }
};
exports.publishCreatedListener = publishCreatedListener;
/**
 * Handler for `PublishUpdated` Event
 */
const publishUpdatedListener = async (...args) => {
    try {
        const [tokenId, imageURI, contentURI, metadataURI, title, description, primaryCategory, secondaryCategory, tertiaryCategory, timestamp,] = args;
        // 1. Get the publish by its tokenId.
        const publish = await client_1.prisma.publish.findUnique({
            where: { tokenId: tokenId.toBigInt() },
        });
        if (publish) {
            // 2. Update the Publish.
            await client_1.prisma.publish.update({
                where: { id: publish.id },
                data: {
                    updatedAt: new Date(timestamp.toNumber() * 1000),
                    imageURI,
                    contentURI,
                    metadataURI,
                    title,
                    description,
                    primaryCategory: (0, utils_1.getKeyOfCategory)(primaryCategory),
                    secondaryCategory: (0, utils_1.getKeyOfCategory)(secondaryCategory),
                    tertiaryCategory: (0, utils_1.getKeyOfCategory)(tertiaryCategory),
                },
            });
        }
    }
    catch (error) {
        console.log("error -->", error);
    }
};
exports.publishUpdatedListener = publishUpdatedListener;
/**
 * Handler for `PublishDeleted` Event
 */
const publishDeletedListener = async (...args) => {
    try {
        const [tokenId] = args;
        // 1. Get the publish by its tokenId.
        const publish = await client_1.prisma.publish.findUnique({
            where: { tokenId: tokenId.toBigInt() },
        });
        if (publish) {
            // 2. Delete the Publish.
            await client_1.prisma.publish.delete({
                where: { id: publish.id },
            });
        }
    }
    catch (error) {
        console.log("error -->", error);
    }
};
exports.publishDeletedListener = publishDeletedListener;
// // Listen to `PublishCreated` Event
// publishContract.on(
//   "PublishCreated",
//   publishCreatedListener as unknown as Listener
// )
// // Listen to `PublishUpdated` Event
// publishContract.on(
//   "PublishUpdated",
//   publishUpdatedListener as unknown as Listener
// )
// // Listen to `PublishDeleted` Event
// publishContract.on(
//   "PublishDeleted",
//   publishDeletedListener as unknown as Listener
// )
