/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "AggregatorV3Interface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AggregatorV3Interface__factory>;
    getContractFactory(
      name: "AccessControlUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AccessControlUpgradeable__factory>;
    getContractFactory(
      name: "IAccessControlUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControlUpgradeable__factory>;
    getContractFactory(
      name: "IERC1822ProxiableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1822ProxiableUpgradeable__factory>;
    getContractFactory(
      name: "IBeaconUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IBeaconUpgradeable__factory>;
    getContractFactory(
      name: "ERC1967UpgradeUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1967UpgradeUpgradeable__factory>;
    getContractFactory(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Initializable__factory>;
    getContractFactory(
      name: "UUPSUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UUPSUpgradeable__factory>;
    getContractFactory(
      name: "ERC721Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721Upgradeable__factory>;
    getContractFactory(
      name: "ERC721BurnableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721BurnableUpgradeable__factory>;
    getContractFactory(
      name: "IERC721MetadataUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721MetadataUpgradeable__factory>;
    getContractFactory(
      name: "IERC721ReceiverUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721ReceiverUpgradeable__factory>;
    getContractFactory(
      name: "IERC721Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Upgradeable__factory>;
    getContractFactory(
      name: "ContextUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ContextUpgradeable__factory>;
    getContractFactory(
      name: "ERC165Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165Upgradeable__factory>;
    getContractFactory(
      name: "IERC165Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165Upgradeable__factory>;
    getContractFactory(
      name: "ContentBaseFollowV1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ContentBaseFollowV1__factory>;
    getContractFactory(
      name: "ContentBaseProfileV1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ContentBaseProfileV1__factory>;
    getContractFactory(
      name: "IContentBaseFollowV1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IContentBaseFollowV1__factory>;
    getContractFactory(
      name: "IContentBaseProfileV1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IContentBaseProfileV1__factory>;
    getContractFactory(
      name: "ContentBaseCommentV1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ContentBaseCommentV1__factory>;
    getContractFactory(
      name: "ContentBaseLikeV1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ContentBaseLikeV1__factory>;
    getContractFactory(
      name: "ContentBasePublishV1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ContentBasePublishV1__factory>;
    getContractFactory(
      name: "IContentBaseCommentV1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IContentBaseCommentV1__factory>;
    getContractFactory(
      name: "IContentBaseLikeV1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IContentBaseLikeV1__factory>;
    getContractFactory(
      name: "IContentBasePublishV1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IContentBasePublishV1__factory>;

    getContractAt(
      name: "AggregatorV3Interface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AggregatorV3Interface>;
    getContractAt(
      name: "AccessControlUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AccessControlUpgradeable>;
    getContractAt(
      name: "IAccessControlUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControlUpgradeable>;
    getContractAt(
      name: "IERC1822ProxiableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1822ProxiableUpgradeable>;
    getContractAt(
      name: "IBeaconUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IBeaconUpgradeable>;
    getContractAt(
      name: "ERC1967UpgradeUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1967UpgradeUpgradeable>;
    getContractAt(
      name: "Initializable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializable>;
    getContractAt(
      name: "UUPSUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UUPSUpgradeable>;
    getContractAt(
      name: "ERC721Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721Upgradeable>;
    getContractAt(
      name: "ERC721BurnableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721BurnableUpgradeable>;
    getContractAt(
      name: "IERC721MetadataUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721MetadataUpgradeable>;
    getContractAt(
      name: "IERC721ReceiverUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721ReceiverUpgradeable>;
    getContractAt(
      name: "IERC721Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Upgradeable>;
    getContractAt(
      name: "ContextUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ContextUpgradeable>;
    getContractAt(
      name: "ERC165Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165Upgradeable>;
    getContractAt(
      name: "IERC165Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165Upgradeable>;
    getContractAt(
      name: "ContentBaseFollowV1",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ContentBaseFollowV1>;
    getContractAt(
      name: "ContentBaseProfileV1",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ContentBaseProfileV1>;
    getContractAt(
      name: "IContentBaseFollowV1",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IContentBaseFollowV1>;
    getContractAt(
      name: "IContentBaseProfileV1",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IContentBaseProfileV1>;
    getContractAt(
      name: "ContentBaseCommentV1",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ContentBaseCommentV1>;
    getContractAt(
      name: "ContentBaseLikeV1",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ContentBaseLikeV1>;
    getContractAt(
      name: "ContentBasePublishV1",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ContentBasePublishV1>;
    getContractAt(
      name: "IContentBaseCommentV1",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IContentBaseCommentV1>;
    getContractAt(
      name: "IContentBaseLikeV1",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IContentBaseLikeV1>;
    getContractAt(
      name: "IContentBasePublishV1",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IContentBasePublishV1>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
