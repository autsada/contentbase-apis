"use strict";
/**
 * Like Contract's Event Listeners
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishUndoDisLikedListener = exports.publishDisLikedListener = exports.publishUnLikedListener = exports.publishLikedListener = exports.likeContract = void 0;
const ethers_1 = require("ethers");
const client_1 = require("../client");
const ethers_2 = require("./ethers");
const ContentBaseLikeV1_json_1 = __importDefault(require("../abi/ContentBaseLikeV1.json"));
/**
 * Get contract for listening to events
 */
function getLikeContractForWs() {
    return (0, ethers_2.getContractForWs)({
        address: ContentBaseLikeV1_json_1.default.address,
        contractInterface: ContentBaseLikeV1_json_1.default.abi,
    });
}
exports.likeContract = getLikeContractForWs();
/**
 * Handler for `PublishLiked` Event
 */
const publishLikedListener = async (...args) => {
    try {
        const [tokenId, publishId, profileId, fee, timestamp] = args;
        // 1. Get the profile of the user that liked the publish by its tokenId.
        const profile = await client_1.prisma.profile.findUnique({
            where: {
                tokenId: profileId.toBigInt(),
            },
        });
        if (profile) {
            // 2. Get the publish by its tokenId.
            const publish = await client_1.prisma.publish.findUnique({
                where: {
                    tokenId: publishId.toBigInt(),
                },
            });
            if (publish) {
                // 3. Create a new Fee.
                const feeEntity = await client_1.prisma.fee.create({
                    data: {
                        createdAt: new Date(timestamp.toNumber() * 1000),
                        senderId: profile.id,
                        publishId: publish.id,
                        receiverId: publish.creatorId,
                        amount: ethers_1.utils.formatEther(fee),
                    },
                });
                // 4. Create a new Like.
                await client_1.prisma.like.create({
                    data: {
                        tokenId: tokenId.toBigInt(),
                        createdAt: new Date(timestamp.toNumber() * 1000),
                        profileId: profile.id,
                        publishId: publish.id,
                        feeId: feeEntity.id,
                    },
                });
            }
        }
    }
    catch (error) {
        console.log("error -->", error);
    }
};
exports.publishLikedListener = publishLikedListener;
/**
 * Handler for `PublishUnLiked` Event
 */
const publishUnLikedListener = async (...args) => {
    try {
        const [tokenId] = args;
        // 1. Get the like by its tokenId.
        const like = await client_1.prisma.like.findUnique({
            where: {
                tokenId: tokenId.toBigInt(),
            },
        });
        if (like) {
            // 2. Delete the like
            await client_1.prisma.like.delete({
                where: {
                    id: like.id,
                },
            });
        }
    }
    catch (error) {
        console.log("error -->", error);
    }
};
exports.publishUnLikedListener = publishUnLikedListener;
/**
 * Handler for `PublishDisLiked` Event
 */
const publishDisLikedListener = async (...args) => {
    try {
        const [publishId, profileId, timestamp] = args;
        // 1. Get the profile of the user that disliked the publish by its tokenId.
        const profile = await client_1.prisma.profile.findUnique({
            where: {
                tokenId: profileId.toBigInt(),
            },
        });
        if (profile) {
            // 2. Get the publish by its tokenId.
            const publish = await client_1.prisma.publish.findUnique({
                where: {
                    tokenId: publishId.toBigInt(),
                },
            });
            if (publish) {
                // 3. Create a new disLike
                await client_1.prisma.disLike.create({
                    data: {
                        createdAt: new Date(timestamp.toNumber() * 1000),
                        publishId: publish.id,
                        profileId: profile.id,
                    },
                });
            }
        }
    }
    catch (error) {
        console.log("error -->", error);
    }
};
exports.publishDisLikedListener = publishDisLikedListener;
/**
 * Handler for `PublishUndoDisLiked` Event
 */
const publishUndoDisLikedListener = async (...args) => {
    try {
        const [publishId, profileId] = args;
        // 1. Get the profile of the user that undo-disliked the publish by its tokenId.
        const profile = await client_1.prisma.profile.findUnique({
            where: {
                tokenId: profileId.toBigInt(),
            },
        });
        if (profile) {
            // 2. Get the publish by its tokenId.
            const publish = await client_1.prisma.publish.findUnique({
                where: {
                    tokenId: publishId.toBigInt(),
                },
            });
            if (publish) {
                // 3. Delete the disLike.
                await client_1.prisma.disLike.delete({
                    where: {
                        identifier: {
                            publishId: publish.id,
                            profileId: profile.id,
                        },
                    },
                });
            }
        }
    }
    catch (error) {
        console.log("error -->", error);
    }
};
exports.publishUndoDisLikedListener = publishUndoDisLikedListener;
// // Listen to `PublishLiked` Event
// likeContract.on("PublishLiked", publishLikedListener as unknown as Listener)
// // Listen to `PublishUnLiked` Event
// likeContract.on("PublishUnLiked", publishUnLikedListener as unknown as Listener)
// // Listen to `PublishDisLiked` Event
// likeContract.on(
//   "PublishDisLiked",
//   publishDisLikedListener as unknown as Listener
// )
// // Listen to `PublishUndoDisLiked` Event
// likeContract.on(
//   "PublishUndoDisLiked",
//   publishUndoDisLikedListener as unknown as Listener
// )
