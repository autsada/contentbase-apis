/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./context"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  GetProfileByIdInput: { // input type
    profileId: number; // Int!
    userId?: number | null; // Int
  }
  GetPublishByIdInput: { // input type
    profileId?: number | null; // Int
    publishId: number; // Int!
  }
  ListCommentsByParentIdInput: { // input type
    parentId: number; // Int!
    profileId?: number | null; // Int
  }
}

export interface NexusGenEnums {
  AccountType: "TRADITIONAL" | "WALLET"
  Category: "Animals" | "Children" | "Education" | "Empty" | "Entertainment" | "Food" | "Gaming" | "LifeStyle" | "Men" | "Movies" | "Music" | "News" | "NotExist" | "Other" | "Programming" | "Science" | "Sports" | "Technology" | "Travel" | "Vehicles" | "Women"
  CommentType: "COMMENT" | "PUBLISH"
  PublishKind: "Audio" | "Blog" | "Post" | "Short" | "Video"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
}

export interface NexusGenObjects {
  Account: { // root type
    address: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    type?: NexusGenEnums['AccountType'] | null; // AccountType
    uid?: string | null; // String
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Comment: { // root type
    commentType: NexusGenEnums['CommentType']; // CommentType!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    text?: string | null; // String
    tokenId: string; // String!
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Edge: { // root type
    cursor?: string | null; // String
    node?: NexusGenRootTypes['Profile'] | null; // Profile
  }
  Fee: { // root type
    amount: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    fee: string; // String!
    id: number; // Int!
  }
  Like: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    likeFeeId: string; // String!
    tokenId: string; // String!
  }
  PageInfo: { // root type
    endCursor?: string | null; // String
    hasNextPage?: boolean | null; // Boolean
  }
  Playback: { // root type
    dash: string; // String!
    duration: number; // Float!
    hls: string; // String!
    id: number; // Int!
    preview: string; // String!
    thumbnail: string; // String!
  }
  PreviewComment: { // root type
    commentType: NexusGenEnums['CommentType']; // CommentType!
    id: number; // Int!
    text?: string | null; // String
  }
  PreviewProfile: { // root type
    id: number; // Int!
    imageURI?: string | null; // String
    originalHandle: string; // String!
    tokenId: string; // String!
  }
  PreviewPublish: { // root type
    contentURI: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    kind: NexusGenEnums['PublishKind']; // PublishKind!
    primaryCategory: NexusGenEnums['Category']; // Category!
    secondaryCategory: NexusGenEnums['Category']; // Category!
    tertiaryCategory: NexusGenEnums['Category']; // Category!
    title: string; // String!
    tokenId: string; // String!
    views: number; // Int!
  }
  Profile: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    default: boolean; // Boolean!
    handle: string; // String!
    id: number; // Int!
    imageURI?: string | null; // String
    originalHandle: string; // String!
    owner: string; // String!
    tokenId: string; // String!
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Publish: { // root type
    contentURI: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    creatorTokenId: string; // String!
    description?: string | null; // String
    id: number; // Int!
    kind: NexusGenEnums['PublishKind']; // PublishKind!
    primaryCategory: NexusGenEnums['Category']; // Category!
    secondaryCategory: NexusGenEnums['Category']; // Category!
    tertiaryCategory: NexusGenEnums['Category']; // Category!
    title: string; // String!
    tokenId: string; // String!
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
    views: number; // Int!
  }
  Query: {};
  Response: { // root type
    edges: Array<NexusGenRootTypes['Edge'] | null>; // [Edge]!
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Account: { // field return type
    address: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    profiles: Array<NexusGenRootTypes['Profile'] | null>; // [Profile]!
    type: NexusGenEnums['AccountType'] | null; // AccountType
    uid: string | null; // String
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Comment: { // field return type
    commentType: NexusGenEnums['CommentType']; // CommentType!
    commentsCount: number; // Int!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    creator: NexusGenRootTypes['PreviewProfile'] | null; // PreviewProfile
    disLiked: boolean | null; // Boolean
    id: number; // Int!
    liked: boolean | null; // Boolean
    likes: Array<NexusGenRootTypes['PreviewProfile'] | null>; // [PreviewProfile]!
    likesCount: number; // Int!
    text: string | null; // String
    tokenId: string; // String!
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Edge: { // field return type
    cursor: string | null; // String
    node: NexusGenRootTypes['Profile'] | null; // Profile
  }
  Fee: { // field return type
    amount: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    fee: string; // String!
    id: number; // Int!
    likeTokenId: string | null; // String
    publish: NexusGenRootTypes['PreviewPublish'] | null; // PreviewPublish
    receiver: NexusGenRootTypes['PreviewProfile'] | null; // PreviewProfile
    sender: NexusGenRootTypes['PreviewProfile'] | null; // PreviewProfile
  }
  Like: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    likeFeeId: string; // String!
    profile: NexusGenRootTypes['PreviewProfile'] | null; // PreviewProfile
    tokenId: string; // String!
  }
  PageInfo: { // field return type
    endCursor: string | null; // String
    hasNextPage: boolean | null; // Boolean
  }
  Playback: { // field return type
    dash: string; // String!
    duration: number; // Float!
    hls: string; // String!
    id: number; // Int!
    preview: string; // String!
    thumbnail: string; // String!
  }
  PreviewComment: { // field return type
    commentType: NexusGenEnums['CommentType']; // CommentType!
    creator: NexusGenRootTypes['PreviewProfile'] | null; // PreviewProfile
    id: number; // Int!
    text: string | null; // String
  }
  PreviewProfile: { // field return type
    id: number; // Int!
    imageURI: string | null; // String
    originalHandle: string; // String!
    tokenId: string; // String!
  }
  PreviewPublish: { // field return type
    contentURI: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    creator: NexusGenRootTypes['PreviewProfile'] | null; // PreviewProfile
    id: number; // Int!
    kind: NexusGenEnums['PublishKind']; // PublishKind!
    playback: NexusGenRootTypes['Playback'] | null; // Playback
    primaryCategory: NexusGenEnums['Category']; // Category!
    secondaryCategory: NexusGenEnums['Category']; // Category!
    tertiaryCategory: NexusGenEnums['Category']; // Category!
    title: string; // String!
    tokenId: string; // String!
    views: number; // Int!
  }
  Profile: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    default: boolean; // Boolean!
    followers: Array<NexusGenRootTypes['PreviewProfile'] | null>; // [PreviewProfile]!
    followersCount: number; // Int!
    following: Array<NexusGenRootTypes['PreviewProfile'] | null>; // [PreviewProfile]!
    followingCount: number; // Int!
    handle: string; // String!
    id: number; // Int!
    imageURI: string | null; // String
    isFollowing: boolean | null; // Boolean
    originalHandle: string; // String!
    owner: string; // String!
    publishesCount: number; // Int!
    tokenId: string; // String!
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Publish: { // field return type
    commentsCount: number; // Int!
    contentURI: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    creator: NexusGenRootTypes['PreviewProfile'] | null; // PreviewProfile
    creatorTokenId: string; // String!
    description: string | null; // String
    disLiked: boolean | null; // Boolean
    disLikesCount: number; // Int!
    id: number; // Int!
    kind: NexusGenEnums['PublishKind']; // PublishKind!
    lastComment: NexusGenRootTypes['PreviewComment'] | null; // PreviewComment
    liked: boolean | null; // Boolean
    likes: Array<NexusGenRootTypes['PreviewProfile'] | null>; // [PreviewProfile]!
    likesCount: number; // Int!
    playback: NexusGenRootTypes['Playback'] | null; // Playback
    primaryCategory: NexusGenEnums['Category']; // Category!
    secondaryCategory: NexusGenEnums['Category']; // Category!
    tertiaryCategory: NexusGenEnums['Category']; // Category!
    title: string; // String!
    tokenId: string; // String!
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
    views: number; // Int!
  }
  Query: { // field return type
    fetchPublishes: Array<NexusGenRootTypes['PreviewPublish'] | null>; // [PreviewPublish]!
    getAccount: NexusGenRootTypes['Account'] | null; // Account
    getProfileById: NexusGenRootTypes['Profile'] | null; // Profile
    getPublishById: NexusGenRootTypes['Publish'] | null; // Publish
    listCommentsByCommentId: Array<NexusGenRootTypes['Comment'] | null>; // [Comment]!
    listCommentsByPublishId: Array<NexusGenRootTypes['Comment'] | null>; // [Comment]!
    listLikesByPublishId: Array<NexusGenRootTypes['Like'] | null>; // [Like]!
    listPublishesByCategory: Array<NexusGenRootTypes['PreviewPublish'] | null>; // [PreviewPublish]!
    listPublishesByCreatorId: Array<NexusGenRootTypes['PreviewPublish'] | null>; // [PreviewPublish]!
    listPublishesByCreatorTokenId: Array<NexusGenRootTypes['PreviewPublish'] | null>; // [PreviewPublish]!
    listReceivedFees: Array<NexusGenRootTypes['Fee'] | null>; // [Fee]!
    listSentFees: Array<NexusGenRootTypes['Fee'] | null>; // [Fee]!
  }
  Response: { // field return type
    edges: Array<NexusGenRootTypes['Edge'] | null>; // [Edge]!
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
}

export interface NexusGenFieldTypeNames {
  Account: { // field return type name
    address: 'String'
    createdAt: 'DateTime'
    id: 'Int'
    profiles: 'Profile'
    type: 'AccountType'
    uid: 'String'
    updatedAt: 'DateTime'
  }
  Comment: { // field return type name
    commentType: 'CommentType'
    commentsCount: 'Int'
    createdAt: 'DateTime'
    creator: 'PreviewProfile'
    disLiked: 'Boolean'
    id: 'Int'
    liked: 'Boolean'
    likes: 'PreviewProfile'
    likesCount: 'Int'
    text: 'String'
    tokenId: 'String'
    updatedAt: 'DateTime'
  }
  Edge: { // field return type name
    cursor: 'String'
    node: 'Profile'
  }
  Fee: { // field return type name
    amount: 'String'
    createdAt: 'DateTime'
    fee: 'String'
    id: 'Int'
    likeTokenId: 'String'
    publish: 'PreviewPublish'
    receiver: 'PreviewProfile'
    sender: 'PreviewProfile'
  }
  Like: { // field return type name
    createdAt: 'DateTime'
    id: 'Int'
    likeFeeId: 'String'
    profile: 'PreviewProfile'
    tokenId: 'String'
  }
  PageInfo: { // field return type name
    endCursor: 'String'
    hasNextPage: 'Boolean'
  }
  Playback: { // field return type name
    dash: 'String'
    duration: 'Float'
    hls: 'String'
    id: 'Int'
    preview: 'String'
    thumbnail: 'String'
  }
  PreviewComment: { // field return type name
    commentType: 'CommentType'
    creator: 'PreviewProfile'
    id: 'Int'
    text: 'String'
  }
  PreviewProfile: { // field return type name
    id: 'Int'
    imageURI: 'String'
    originalHandle: 'String'
    tokenId: 'String'
  }
  PreviewPublish: { // field return type name
    contentURI: 'String'
    createdAt: 'DateTime'
    creator: 'PreviewProfile'
    id: 'Int'
    kind: 'PublishKind'
    playback: 'Playback'
    primaryCategory: 'Category'
    secondaryCategory: 'Category'
    tertiaryCategory: 'Category'
    title: 'String'
    tokenId: 'String'
    views: 'Int'
  }
  Profile: { // field return type name
    createdAt: 'DateTime'
    default: 'Boolean'
    followers: 'PreviewProfile'
    followersCount: 'Int'
    following: 'PreviewProfile'
    followingCount: 'Int'
    handle: 'String'
    id: 'Int'
    imageURI: 'String'
    isFollowing: 'Boolean'
    originalHandle: 'String'
    owner: 'String'
    publishesCount: 'Int'
    tokenId: 'String'
    updatedAt: 'DateTime'
  }
  Publish: { // field return type name
    commentsCount: 'Int'
    contentURI: 'String'
    createdAt: 'DateTime'
    creator: 'PreviewProfile'
    creatorTokenId: 'String'
    description: 'String'
    disLiked: 'Boolean'
    disLikesCount: 'Int'
    id: 'Int'
    kind: 'PublishKind'
    lastComment: 'PreviewComment'
    liked: 'Boolean'
    likes: 'PreviewProfile'
    likesCount: 'Int'
    playback: 'Playback'
    primaryCategory: 'Category'
    secondaryCategory: 'Category'
    tertiaryCategory: 'Category'
    title: 'String'
    tokenId: 'String'
    updatedAt: 'DateTime'
    views: 'Int'
  }
  Query: { // field return type name
    fetchPublishes: 'PreviewPublish'
    getAccount: 'Account'
    getProfileById: 'Profile'
    getPublishById: 'Publish'
    listCommentsByCommentId: 'Comment'
    listCommentsByPublishId: 'Comment'
    listLikesByPublishId: 'Like'
    listPublishesByCategory: 'PreviewPublish'
    listPublishesByCreatorId: 'PreviewPublish'
    listPublishesByCreatorTokenId: 'PreviewPublish'
    listReceivedFees: 'Fee'
    listSentFees: 'Fee'
  }
  Response: { // field return type name
    edges: 'Edge'
    pageInfo: 'PageInfo'
  }
}

export interface NexusGenArgTypes {
  Query: {
    getAccount: { // args
      address: string; // String!
    }
    getProfileById: { // args
      input: NexusGenInputs['GetProfileByIdInput']; // GetProfileByIdInput!
    }
    getPublishById: { // args
      input: NexusGenInputs['GetPublishByIdInput']; // GetPublishByIdInput!
    }
    listCommentsByCommentId: { // args
      input: NexusGenInputs['ListCommentsByParentIdInput']; // ListCommentsByParentIdInput!
    }
    listCommentsByPublishId: { // args
      input: NexusGenInputs['ListCommentsByParentIdInput']; // ListCommentsByParentIdInput!
    }
    listLikesByPublishId: { // args
      publishId: number; // Int!
    }
    listPublishesByCategory: { // args
      category: NexusGenEnums['Category']; // Category!
    }
    listPublishesByCreatorId: { // args
      id: number; // Int!
    }
    listPublishesByCreatorTokenId: { // args
      creatorTokenId: string; // String!
    }
    listReceivedFees: { // args
      profileId: number; // Int!
    }
    listSentFees: { // args
      profileId: number; // Int!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}