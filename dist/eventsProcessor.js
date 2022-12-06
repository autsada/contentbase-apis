"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const listeners_1 = require("./listeners");
function main() {
    console.log("start listeners");
    // Listen to Profile Contract events
    listeners_1.profileContract.on("ProfileCreated", listeners_1.profileCreatedListener);
    listeners_1.profileContract.on("ProfileImageUpdated", listeners_1.profileImageUpdatedListener);
    listeners_1.profileContract.on("DefaultProfileUpdated", listeners_1.defaultProfileUpdatedListener);
    // Listen to Follow Contract events
    listeners_1.followContract.on("Following", listeners_1.followingListener);
    listeners_1.followContract.on("UnFollowing", listeners_1.unFollowingListener);
    // Listen to Publish Contract events
    listeners_1.publishContract.on("PublishCreated", listeners_1.publishCreatedListener);
    listeners_1.publishContract.on("PublishUpdated", listeners_1.publishUpdatedListener);
    listeners_1.publishContract.on("PublishDeleted", listeners_1.publishDeletedListener);
    // Listen to Comment Contract events
    listeners_1.commentContract.on("CommentCreated", listeners_1.commentCreatedListener);
    listeners_1.commentContract.on("CommentUpdated", listeners_1.commentUpdatedListener);
    listeners_1.commentContract.on("CommentDeleted", listeners_1.commentDeletedListener);
    listeners_1.commentContract.on("CommentLiked", listeners_1.commentLikedListener);
    listeners_1.commentContract.on("CommentUnLiked", listeners_1.commentUnLikedListener);
    listeners_1.commentContract.on("CommentDisLiked", listeners_1.commentDisLikedListener);
    listeners_1.commentContract.on("CommentUndoDisLiked", listeners_1.commentUndoDisLikedListener);
    // Listen to Like Contract events
    listeners_1.likeContract.on("PublishLiked", listeners_1.publishLikedListener);
    listeners_1.likeContract.on("PublishUnLiked", listeners_1.publishUnLikedListener);
    listeners_1.likeContract.on("PublishDisLiked", listeners_1.publishDisLikedListener);
    listeners_1.likeContract.on("PublishUndoDisLiked", listeners_1.publishUndoDisLikedListener);
}
main();
