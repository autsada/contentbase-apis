"use strict";
/**
 * Profile Contract's Event Listeners
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultProfileUpdatedListener = exports.profileImageUpdatedListener = exports.profileCreatedListener = exports.profileContract = void 0;
const client_1 = require("../client");
const ethers_1 = require("./ethers");
const ContentBaseProfileV1_json_1 = __importDefault(require("../abi/ContentBaseProfileV1.json"));
/**
 * Get the contract for listening to events
 */
function getProfileContractForWs() {
    return (0, ethers_1.getContractForWs)({
        address: ContentBaseProfileV1_json_1.default.address,
        contractInterface: ContentBaseProfileV1_json_1.default.abi,
    });
}
exports.profileContract = getProfileContractForWs();
/**
 * Handler for `ProfileCreated` Event
 */
const profileCreatedListener = async (...args) => {
    const [tokenId, owner, handle, imageURI, originalHandle, isDefault, timestamp,] = args;
    // Need to lower case the address so it can be used for comparision.
    const formattedAddress = owner.toLowerCase();
    // 1. Get the account by the lowercased address.
    let account = await client_1.prisma.account.findUnique({
        where: { address: formattedAddress },
    });
    // If no account found, it means this is the first profile of the caller (owner) so we need to create an account first.
    if (!account) {
        // 2. Create an account (if not exist).
        account = await client_1.prisma.account.create({
            data: {
                createdAt: new Date(timestamp.toNumber() * 1000),
                address: formattedAddress,
            },
        });
    }
    // 3. Create a Profile.
    await client_1.prisma.profile.create({
        data: {
            tokenId: tokenId.toBigInt(),
            createdAt: new Date(timestamp.toNumber() * 1000),
            accountId: account.id,
            owner: formattedAddress,
            handle,
            originalHandle,
            imageURI,
            default: isDefault,
        },
    });
};
exports.profileCreatedListener = profileCreatedListener;
/**
 * Handler for `ProfileImageUpdated` Event
 */
const profileImageUpdatedListener = async (...args) => {
    const [tokenId, imageURI, timestamp] = args;
    // 1. Get the profile.
    const profile = await client_1.prisma.profile.findUnique({
        where: { tokenId: tokenId.toBigInt() },
    });
    // 2. Update the profile.
    if (profile) {
        await client_1.prisma.profile.update({
            where: { id: profile.id },
            data: { imageURI, updatedAt: new Date(timestamp.toNumber() * 1000) },
        });
    }
};
exports.profileImageUpdatedListener = profileImageUpdatedListener;
/**
 * Handler for `DefaultProfileUpdated` Event
 */
const defaultProfileUpdatedListener = async (...args) => {
    const [newProfileId, oldProfileId, timestamp] = args;
    // 1. Get the new default profile.
    const newProfile = await client_1.prisma.profile.findUnique({
        where: { tokenId: newProfileId.toBigInt() },
    });
    if (newProfile && !newProfile.default) {
        // 2. Update the new default profile.
        await client_1.prisma.profile.update({
            where: { id: newProfile.id },
            data: {
                default: true,
                updatedAt: new Date(timestamp.toNumber() * 1000),
            },
        });
    }
    // 3. Get the old default profile.
    const oldProfile = await client_1.prisma.profile.findUnique({
        where: { tokenId: oldProfileId.toBigInt() },
    });
    if (oldProfile && oldProfile.default) {
        // 4. Update the old default profile.
        await client_1.prisma.profile.update({
            where: { id: oldProfile.id },
            data: {
                default: false,
                updatedAt: new Date(timestamp.toNumber() * 1000),
            },
        });
    }
};
exports.defaultProfileUpdatedListener = defaultProfileUpdatedListener;
// // Listen to `ProfileCreated` Event
// profileContract.on(
//   "ProfileCreated",
//   profileCreatedListener as unknown as Listener
// )
// // Listen to `ProfileImageUpdated` Event
// profileContract.on(
//   "ProfileImageUpdated",
//   profileImageUpdatedListener as unknown as Listener
// )
// // Listen to `DefaultProfileUpdated` Event
// profileContract.on(
//   "DefaultProfileUpdated",
//   defaultProfileUpdatedListener as unknown as Listener
// )
