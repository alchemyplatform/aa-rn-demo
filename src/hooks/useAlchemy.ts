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
  const settings = {
    apiKey: Config.ALCHEMY_KEY,
    network: Network.ETH_SEPOLIA,
  };

  const alchemy = new Alchemy(settings);

  const getNftCollections = useCallback(
    async (
      owner: Hex,
      {
        pageKey,
        onError,
      }: {
        pageKey?: string;
        onError?: (error: unknown) => void;
      },
    ): Promise<GetContractsForOwnerResponse | null> => {
      try {
        const res = await alchemy.nft.getContractsForOwner(owner, {
          pageKey,
          excludeFilters: [NftFilters.SPAM, NftFilters.AIRDROPS],
        });
        return res;
      } catch (error) {
        console.error(error);
        onError?.(error);
        return null;
      }
    },
    [alchemy.nft],
  );

  const getNfts = useCallback(
    async (
      owner: Hex,
      {
        contract,
        pageKey,
        onError,
      }: {
        contract?: Hex;
        pageKey?: string;
        onError?: (error: unknown) => void;
      },
    ): Promise<OwnedNftsResponse | null> => {
      try {
        const res = await alchemy.nft.getNftsForOwner(owner, {
          pageKey,
          contractAddresses: contract ? [contract] : undefined,
          excludeFilters: [NftFilters.SPAM, NftFilters.AIRDROPS],
        });
        return res;
      } catch (error) {
        console.error(error);
        onError?.(error);
        return null;
      }
    },
    [alchemy.nft],
  );

  return {
    alchemy,
    getNftCollections,
    getNfts,
  };
};
