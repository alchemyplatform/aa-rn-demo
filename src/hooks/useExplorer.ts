import { useCallback } from "react";

export type UseExplorerReturn = {
  getLink: (props: {
    address: string;
    tokenId?: string;
    type: "tx" | "address" | "nft";
  }) => string;
};

const useExplorer = (): UseExplorerReturn => {
  const getLink = useCallback(
    ({
      address,
      type,
      tokenId,
    }: {
      address: string;
      tokenId?: string;
      type: "tx" | "address" | "nft";
    }): string => {
      if (type === "tx") {
        return `https://sepolia.etherscan.io/${type}/${address}`;
      }

      tokenId =
        tokenId &&
        Number(tokenId) >= 0 &&
        Number(tokenId) < Number.MAX_SAFE_INTEGER
          ? `${Number(tokenId)}`
          : tokenId;

      return tokenId
        ? `https://sepolia.etherscan.io/${type}/${address}/${tokenId}`
        : `https://sepolia.etherscan.io/${type}/${address}`;
    },
    [],
  );

  return { getLink };
};

export default useExplorer;
