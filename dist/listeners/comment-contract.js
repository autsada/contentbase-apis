"use strict";
/**
 * Comment Contract's Event Listeners
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentUndoDisLikedListener = exports.commentDisLikedListener = exports.commentUnLikedListener = exports.commentLikedListener = exports.commentDeletedListener = exports.commentUpdatedListener = exports.commentCreatedListener = exports.commentContract = void 0;
const client_1 = require("../client");
const ethers_1 = require("./ethers");
const ContentBaseCommentV1_json_1 = __importDefault(require("../abi/ContentBaseCommentV1.json"));
const utils_1 = require("../utils");
/**
 * Get contract for listening to events
 */
function getCommentContractForWs() {
    return (0, ethers_1.getContractForWs)({
        address: ContentBaseCommentV1_json_1.default.address,
        contractInterface: ContentBaseCommentV1_json_1.default.abi,
    });
}
exports.commentContract = getCommentContractForWs();
/**
 * Handler for `CommentCreated` Event
 */
const commentCreatedListener = async (...args) => {
    try {
        const [tokenId, parentId, creatorId, owner, contentURI, commentType, timestamp,] = args;
        // 1. Get the profile of the creator.
        const profile = await client_1.prisma.profile.findUnique({
            where: {
                tokenId: creatorId.toBigInt(),
            },
        });
        if (profile) {
            // `parentId` can be the token id of a publish or a comment, depending of the commentType.
            const typeEnum = (0, utils_1.getKeyOfCommentType)(commentType);
            console.log("comment type -->", typeEnum);
            if (typeEnum === "PUBLISH") {
                // A. `parentId` is a publish.
                // A.1. Get the publish.
                const publish = await client_1.prisma.publish.findUnique({
                    where: {
                        tokenId: parentId.toBigInt(),
                    },
                });
                if (publish) {
                    // A.2. Create a new comment.
                    await client_1.prisma.comment.create({
                        data: {
                            tokenId: tokenId.toBigInt(),
                            createdAt: new Date(timestamp.toNumber() * 1000),
                            owner,
                            creatorId: profile.id,
                            publishId: publish.id,
                            commentType: "PUBLISH",
                            contentURI,
                        },
                    });
                }
            }
            else if (typeEnum === "COMMENT") {
                // B. `parentId` is a comment.
                // B.1. Get the comment.
                const comment = await client_1.prisma.comment.findUnique({
                    where: {
                        tokenId: parentId.toBigInt(),
                    },
                });
                if (comment) {
                    // B.2. Create a new comment.
                    await client_1.prisma.comment.create({
                        data: {
                            tokenId: tokenId.toBigInt(),
                            createdAt: new Date(timestamp.toNumber() * 1000),
                            owner,
                            creatorId: profile.id,
                            publishId: comment.publishId,
                            commentId: comment.id,
                            commentType: "COMMENT",
                            contentURI,
                        },
                    });
                }
            }
        }
    }
    catch (error) {
        console.log("error -->", error);
    }
};
exports.commentCreatedListener = commentCreatedListener;
/**
 * Handler for `CommentUpdated` Event
 */
const commentUpdatedListener = async (...args) => {
    try {
        const [tokenId, contentURI, timestamp] = args;
        // 1. Get the comment by its token id.
        const comment = await client_1.prisma.comment.findUnique({
            where: {
                tokenId: tokenId.toBigInt(),
            },
        });
        if (comment) {
            // 2. Update the comment.
            await client_1.prisma.comment.update({
                where: {
                    id: comment.id,
                },
                data: {
                    contentURI,
                    updatedAt: new Date(timestamp.toNumber() * 1000),
                },
            });
        }
    }
    catch (error) {
        console.log("error -->", error);
    }
};
exports.commentUpdatedListener = commentUpdatedListener;
/**
 * Handler for `CommentDeleted` Event
 */
const commentDeletedListener = async (...args) => {
    try {
        const [tokenId] = args;
        // 1. Get the comment by its token id.
        const comment = await client_1.prisma.comment.findUnique({
            where: {
                tokenId: tokenId.toBigInt(),
            },
        });
        if (comment) {
            // 2. Delete the comment.
            await client_1.prisma.comment.delete({
                where: {
                    id: comment.id,
                },
            });
        }
    }
    catch (error) {
        console.log("error -->", error);
    }
};
exports.commentDeletedListener = commentDeletedListener;
/**
 * Handler for `CommentLiked`
 */
const commentLikedListener = async (...args) => {
    try {
        const [commentId, profileId, timestamp] = args;
        // 1. Get the profile by the profile token id (profileId).
        const profile = await client_1.prisma.profile.findUnique({
            where: {
                tokenId: profileId.toBigInt(),
            },
        });
        if (profile) {
            // 2. Get the comment by its token id.
            const comment = await client_1.prisma.comment.findUnique({
                where: {
                    tokenId: commentId.toBigInt(),
                },
            });
            if (comment) {
                // 3. Create a commentLike.
                await client_1.prisma.commentLike.create({
                    data: {
                        createdAt: new Date(timestamp.toNumber() * 1000),
                        commentId: comment.id,
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
exports.commentLikedListener = commentLikedListener;
/**
 * Handler for `CommentUnLiked` Event
 */
const commentUnLikedListener = async (...args) => {
    try {
        const [commentId, profileId] = args;
        // 1. Get the profile by the profile token id (profileId).
        const profile = await client_1.prisma.profile.findUnique({
            where: {
                tokenId: profileId.toBigInt(),
            },
        });
        if (profile) {
            // 2. Get the comment.
            const comment = await client_1.prisma.comment.findUnique({
                where: {
                    tokenId: commentId.toBigInt(),
                },
            });
            if (comment) {
                // 3. Delete the commentLike.
                await client_1.prisma.commentLike.delete({
                    where: {
                        identifier: {
                            commentId: comment.id,
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
exports.commentUnLikedListener = commentUnLikedListener;
/**
 * Handler for `CommentDisLiked`
 */
const commentDisLikedListener = async (...args) => {
    try {
        const [commentId, profileId, timestamp] = args;
        // 1. Get the profile by the profile token id (profileId).
        const profile = await client_1.prisma.profile.findUnique({
            where: {
                tokenId: profileId.toBigInt(),
            },
        });
        if (profile) {
            // 2. Get the comment by its token id.
            const comment = await client_1.prisma.comment.findUnique({
                where: {
                    tokenId: commentId.toBigInt(),
                },
            });
            if (comment) {
                // 3. Create a commentDisLike.
                await client_1.prisma.commentDisLike.create({
                    data: {
                        createdAt: new Date(timestamp.toNumber() * 1000),
                        commentId: comment.id,
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
exports.commentDisLikedListener = commentDisLikedListener;
/**
 * Handler for `CommentUndoDisLiked` Event
 */
const commentUndoDisLikedListener = async (...args) => {
    try {
        const [commentId, profileId] = args;
        // 1. Get the profile by the profile token id (profileId).
        const profile = await client_1.prisma.profile.findUnique({
            where: {
                tokenId: profileId.toBigInt(),
            },
        });
        if (profile) {
            // 2. Get the comment.
            const comment = await client_1.prisma.comment.findUnique({
                where: {
                    tokenId: commentId.toBigInt(),
                },
            });
            if (comment) {
                // 3. Delete the commentDisLike.
                await client_1.prisma.commentDisLike.delete({
                    where: {
                        identifier: {
                            commentId: comment.id,
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
exports.commentUndoDisLikedListener = commentUndoDisLikedListener;
// // Listen to `CommentCreated` Event
// commentContract.on(
//   "CommentCreated",
//   commentCreatedListener as unknown as Listener
// )
// // Listen to `CommentUpdated` Event
// commentContract.on(
//   "CommentUpdated",
//   commentUpdatedListener as unknown as Listener
// )
// // Listen to `CommentDeleted` Event
// commentContract.on(
//   "CommentDeleted",
//   commentDeletedListener as unknown as Listener
// )
// // Listen to `CommentLiked` Event
// commentContract.on("CommentLiked", commentLikedListener as unknown as Listener)
// // Listen to `CommentUnLiked` Event
// commentContract.on(
//   "CommentUnLiked",
//   commentUnLikedListener as unknown as Listener
// )
// // Listen to `CommentDisLiked` Event
// commentContract.on(
//   "CommentDisLiked",
//   commentDisLikedListener as unknown as Listener
// )
// // Listen to `CommentUndoDisLiked` Event
// commentContract.on(
//   "CommentUndoDisLiked",
//   commentUndoDisLikedListener as unknown as Listener
// )
