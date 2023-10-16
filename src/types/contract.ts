import { NominalType } from "./global";

export type EncodedTxData = string & NominalType<"EncodedTxData">;

export enum NftType {
  ERC721 = "ERC721",
  ERC1155 = "ERC1155",
}
