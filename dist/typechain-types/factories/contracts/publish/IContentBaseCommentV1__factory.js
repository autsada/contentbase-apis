"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IContentBaseCommentV1__factory = void 0;
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "commentId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "creatorId",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "contentURI",
                        type: "string",
                    },
                ],
                internalType: "struct DataTypes.CreateCommentOnCommentData",
                name: "createCommentOnCommentData",
                type: "tuple",
            },
        ],
        name: "commentOnComment",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "publishId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "creatorId",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "contentURI",
                        type: "string",
                    },
                ],
                internalType: "struct DataTypes.CreateCommentOnPublishData",
                name: "createCommentOnPublishData",
                type: "tuple",
            },
        ],
        name: "commentOnPublish",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "creatorId",
                type: "uint256",
            },
        ],
        name: "deleteComment",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "commentId",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "profileId",
                type: "uint256",
            },
        ],
        name: "disLikeComment",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "getCommentById",
        outputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "owner",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "creatorId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "parentId",
                        type: "uint256",
                    },
                    {
                        internalType: "enum DataTypes.CommentType",
                        name: "commentType",
                        type: "uint8",
                    },
                    {
                        internalType: "string",
                        name: "contentURI",
                        type: "string",
                    },
                ],
                internalType: "struct DataTypes.Comment",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getProfileContract",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getPublishContract",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "commentId",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "profileId",
                type: "uint256",
            },
        ],
        name: "likeComment",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "creatorId",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "newContentURI",
                        type: "string",
                    },
                ],
                internalType: "struct DataTypes.UpdateCommentData",
                name: "updateCommentData",
                type: "tuple",
            },
        ],
        name: "updateComment",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "contractAddress",
                type: "address",
            },
        ],
        name: "updateProfileContract",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "contractAddress",
                type: "address",
            },
        ],
        name: "updatePublishContract",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
class IContentBaseCommentV1__factory {
    static createInterface() {
        return new ethers_1.utils.Interface(_abi);
    }
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.IContentBaseCommentV1__factory = IContentBaseCommentV1__factory;
IContentBaseCommentV1__factory.abi = _abi;
