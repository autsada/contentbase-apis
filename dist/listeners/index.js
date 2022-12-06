"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./profile-contract"), exports);
__exportStar(require("./follow-contract"), exports);
__exportStar(require("./publish-contract"), exports);
__exportStar(require("./comment-contract"), exports);
__exportStar(require("./like-contract"), exports);
// import { Listener } from "@ethersproject/abstract-provider"
// import {
//   profileContract,
//   profileCreatedListener,
//   profileImageUpdatedListener,
//   defaultProfileUpdatedListener,
// } from "./profile-contract"
// export function startListeners() {
//   console.log("start listeners")
//   // Listen to Profile Contract events
//   profileContract.on(
//     "ProfileCreated",
//     profileCreatedListener as unknown as Listener
//   )
//   profileContract.on(
//     "ProfileImageUpdated",
//     profileImageUpdatedListener as unknown as Listener
//   )
//   profileContract.on(
//     "DefaultProfileUpdated",
//     defaultProfileUpdatedListener as unknown as Listener
//   )
// }
// import { fork } from "child_process"
// import path from "path"
// // Create a chid process for each contract.
// const profileProcess = fork(path.join(__dirname, "profile-contract.ts"))
// const followProcess = fork(path.join(__dirname, "follow-contract.ts"))
// const publishProcess = fork(path.join(__dirname, "publish-contract.ts"))
// const commentProcess = fork(path.join(__dirname, "comment-contract.ts"))
// const likeProcess = fork(path.join(__dirname, "like-contract.ts"))
// profileProcess.on("message", (msg) => {
//   console.log("profile ", msg)
// })
// followProcess.on("message", (msg) => {
//   console.log("follow ", msg)
// })
// publishProcess.on("message", (msg) => {
//   console.log("publish ", msg)
// })
// commentProcess.on("message", (msg) => {
//   console.log("comment ", msg)
// })
// likeProcess.on("message", (msg) => {
//   console.log("like ", msg)
// })
