import { atom } from "recoil";

import { StreamResultType } from "types/postTx";
import { Hex } from "viem";
import storeKeys from "./storeKeys";

const postTxResult = atom<{ [key: Hex]: StreamResultType }>({
  key: storeKeys.postTx.postTxResult,
  default: {},
});

export default {
  postTxResult,
};
