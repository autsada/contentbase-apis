"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeyOfCommentType = exports.getIndexOfCommentType = exports.getKeyOfCategory = exports.getIndexOfCategory = exports.CommentType = exports.Category = void 0;
/**
 * Category of the publish struct
 */
var Category;
(function (Category) {
    Category["Empty"] = "Empty";
    Category["Music"] = "Music";
    Category["Movies"] = "Movies";
    Category["Entertainment"] = "Entertainment";
    Category["Sports"] = "Sports";
    Category["Food"] = "Food";
    Category["Travel"] = "Travel";
    Category["Gaming"] = "Gaming";
    Category["News"] = "News";
    Category["Animals"] = "Animals";
    Category["Education"] = "Education";
    Category["Science"] = "Science";
    Category["Technology"] = "Technology";
    Category["Programming"] = "Programming";
    Category["LifeStyle"] = "LifeStyle";
    Category["Vehicles"] = "Vehicles";
    Category["Children"] = "Children";
    Category["Women"] = "Women";
    Category["Men"] = "Men";
    Category["Other"] = "Other";
    Category["NotExist"] = "NotExist";
})(Category = exports.Category || (exports.Category = {}));
/**
 * CommentType in Comment Struct
 */
var CommentType;
(function (CommentType) {
    CommentType["PUBLISH"] = "PUBLISH";
    CommentType["COMMENT"] = "COMMENT";
})(CommentType = exports.CommentType || (exports.CommentType = {}));
// A helper function to get Category index.
function getIndexOfCategory(cat) {
    return Object.keys(Category).indexOf(cat);
}
exports.getIndexOfCategory = getIndexOfCategory;
// A helper function to get Category key.
function getKeyOfCategory(index) {
    return Object.keys(Category)[index];
}
exports.getKeyOfCategory = getKeyOfCategory;
// A helper function to get CommentTYpe index.
function getIndexOfCommentType(ct) {
    return Object.keys(CommentType).indexOf(ct);
}
exports.getIndexOfCommentType = getIndexOfCommentType;
// A helper function to get CommentType key.
function getKeyOfCommentType(index) {
    return Object.keys(CommentType)[index];
}
exports.getKeyOfCommentType = getKeyOfCommentType;
