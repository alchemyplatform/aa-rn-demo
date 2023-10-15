import { useAlertContext } from "@context/alert";
import {
  Alchemy,
  GetContractsForOwnerResponse,
  Network,
  NftFilters,
  OwnedNftsResponse,
} from "alchemy-sdk";
import { useCallback } from "react";
import Config from "react-native-config";
import { Hex } from "viem";

export const useAlchemy = () => {
  const { dispatchAlert } = useAlertContext();

  const settings = {
    apiKey: Config.ALCHEMY_KEY,
    network: Network.ETH_SEPOLIA,
  };

  const alchemy = new Alchemy(settings);

  const getNftCollections = useCallback(
    async (
      owner: Hex,
      pageKey?: string,
    ): Promise<GetContractsForOwnerResponse | null> => {
      try {
        const res = await alchemy.nft.getContractsForOwner(owner, {
          pageKey,
          excludeFilters: [NftFilters.SPAM, NftFilters.AIRDROPS],
        });
        return res;
      } catch (error) {
        console.error(error);
        dispatchAlert({
          type: "open",
          alertType: "error",
          message: `Error getting user nft collection for owner ${owner}`,
        });
        return null;
      }
    },
    [alchemy.nft, dispatchAlert],
  );

  const getNfts = useCallback(
    async (
      owner: Hex,
      contract: Hex,
      pageKey?: string,
    ): Promise<OwnedNftsResponse | null> => {
      try {
        const res = await alchemy.nft.getNftsForOwner(owner, {
          pageKey,
          contractAddresses: [contract],
          excludeFilters: [NftFilters.SPAM, NftFilters.AIRDROPS],
        });
        return res;
      } catch (error) {
        console.error(error);
        dispatchAlert({
          type: "open",
          alertType: "error",
          message: `Error getting user nfts for contract ${contract} owned by owner ${owner}`,
        });
        return null;
      }
    },
    [alchemy.nft, dispatchAlert],
  );

  return {
    alchemy,
    getNftCollections,
    getNfts,
  };
};
