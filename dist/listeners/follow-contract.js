"use strict";
/**
 * Profile Contract's Event Listeners
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unFollowingListener = exports.followingListener = exports.followContract = void 0;
const client_1 = require("../client");
const ethers_1 = require("./ethers");
const ContentBaseFollowV1_json_1 = __importDefault(require("../abi/ContentBaseFollowV1.json"));
/**
 * Get the contract for listening to events
 */
function getFollowContractForWs() {
    return (0, ethers_1.getContractForWs)({
        address: ContentBaseFollowV1_json_1.default.address,
        contractInterface: ContentBaseFollowV1_json_1.default.abi,
    });
}
exports.followContract = getFollowContractForWs();
/**
 * Handler for `Following` Event
 */
const followingListener = async (...args) => {
    const [tokenId, followerId, followeeId, timestamp] = args;
    // 1. Get the follower profile.
    const follower = await client_1.prisma.profile.findUnique({
        where: { tokenId: followerId.toBigInt() },
    });
    // 2. Get the followee profile.
    const followee = await client_1.prisma.profile.findUnique({
        where: { tokenId: followeeId.toBigInt() },
    });
    if (follower && followee) {
        // 3. Create a Follow.
        await client_1.prisma.follow.create({
            data: {
                tokenId: tokenId.toBigInt(),
                createdAt: new Date(timestamp.toNumber() * 1000),
                followerId: follower.id,
                followeeId: followee.id,
            },
        });
    }
};
exports.followingListener = followingListener;
/**
 * Handler for `UnFollowing` Event
 */
const unFollowingListener = async (...args) => {
    const [tokenId] = args;
    // 1. Get the follow by tokenId.
    const follow = await client_1.prisma.follow.findUnique({
        where: { tokenId: tokenId.toBigInt() },
    });
    if (follow) {
        // 2. Delete the follow.
        await client_1.prisma.follow.delete({ where: { tokenId: tokenId.toBigInt() } });
    }
};
exports.unFollowingListener = unFollowingListener;
// // Listen to `Following` Event
// followContract.on("Following", followingListener as unknown as Listener)
// // Listen to `UnFollowing` Eventf
// followContract.on("UnFollowing", unFollowingListener as unknown as Listener)
