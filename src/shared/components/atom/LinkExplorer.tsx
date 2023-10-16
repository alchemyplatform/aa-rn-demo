import React, { ReactElement, ReactNode } from "react";
import { Linking, TouchableOpacity } from "react-native";

import Link from "./Link";
import useExplorer from "@hooks/useExplorer";
import { truncate } from "@shared-utils";

const LinkExplorer = ({
  address,
  tokenId,
  type,
  children,
}: {
  address: string;
  tokenId?: string;
  type: "tx" | "address" | "nft";
  children?: ReactNode;
}): ReactElement => {
  const { getLink } = useExplorer();

  return children ? (
    <TouchableOpacity
      onPress={(): void => {
        Linking.openURL(getLink({ address, type, tokenId }));
      }}
    >
      {children}
    </TouchableOpacity>
  ) : (
    <Link
      text={truncate(address, [10, 10])}
      url={getLink({ address, type, tokenId })}
    />
  );
};

export default LinkExplorer;
