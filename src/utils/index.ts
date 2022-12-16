import { BigNumber } from "ethers"

/**
 * Category of the publish struct
 */
export enum Category {
  Empty = "Empty",
  Music = "Music",
  Movies = "Movies",
  Entertainment = "Entertainment",
  Sports = "Sports",
  Food = "Food",
  Travel = "Travel",
  Gaming = "Gaming",
  News = "News",
  Animals = "Animals",
  Education = "Education",
  Science = "Science",
  Technology = "Technology",
  Programming = "Programming",
  LifeStyle = "LifeStyle",
  Vehicles = "Vehicles",
  Children = "Children",
  Women = "Women",
  Men = "Men",
  Other = "Other",
  NotExist = "NotExist",
}

/**
 * Pubish's kind
 */
export enum PublishKind {
  Video = "Video",
  Short = "Short",
  Audio = "Audio",
  Blog = "Blog",
  Post = "Post",
}

/**
 * CommentType in Comment Struct
 */
export enum CommentType {
  PUBLISH = "PUBLISH",
  COMMENT = "COMMENT",
}

// A helper function to get Category index.
export function getIndexOfCategory(cat: Category) {
  return Object.keys(Category).indexOf(cat)
}

// A helper function to get Category key.
export function getKeyOfCategory(index: number) {
  return Object.keys(Category)[index]
}

// A helper function to get CommentTYpe index.
export function getIndexOfCommentType(ct: CommentType) {
  return Object.keys(CommentType).indexOf(ct)
}

// A helper function to get CommentType key.
export function getKeyOfCommentType(index: number) {
  return Object.keys(CommentType)[index]
}

export function generateTokenId(tokenId: BigNumber) {
  return tokenId.toBigInt().toString()
}

// A helper function to get Publish kind.
export function getIndexOfPublishKind(kind: PublishKind) {
  return Object.keys(PublishKind).indexOf(kind)
}

// A helper function to get Publish kind.
export function getKeyOfPublishKind(index: number) {
  return Object.keys(PublishKind)[index]
}
