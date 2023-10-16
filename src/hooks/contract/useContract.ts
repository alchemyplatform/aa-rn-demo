// import { useWalletContext } from "@context/wallet";
// import { useCallback } from "react";
// import { Abi, Hex, getContract } from "viem";

// type UseContractReturn = {
//   contract: GetContractReturnType | undefined;
//   getEncodedTxData: (
//     methodName: string,
//     params?: any,
//   ) => EncodedTxData | undefined;
//   callMethod: <R>(methodName: string, params?: any[]) => Promise<R | undefined>;
// };

// const useContract = ({
//   address,
//   abi,
// }: {
//   address: Hex;
//   abi: Abi;
// }): UseContractReturn => {
//   const { provider } = useWalletContext();

//   const contract = getContract({
//     abi,
//     address,
//     publicClient: provider?.rpcClient,
//   });

//   const getEncodedTxData = useCallback(
//     (methodName: string, params?: any) => {
//       if (!contract) {
//         return undefined;
//       }

//       const jsonInterface = contract?.options.jsonInterface.find(
//         (x) => x.name === methodName,
//       );

//       if (jsonInterface && web3) {
//         return web3.eth.abi.encodeFunctionCall(
//           jsonInterface,
//           params,
//         ) as EncodedTxData;
//       }
//     },
//     [contract, web3],
//   );

//   const callMethod = async <R>(
//     methodName: string,
//     params?: any[],
//   ): Promise<R | undefined> => {
//     if (contract) {
//       const method = contract.methods[methodName];
//       const target = params ? method(...params) : method();
//       return target.call() as R;
//     }
//   };

//   return {
//     contract,
//     getEncodedTxData,
//     callMethod,
//   };
// };

// export default useContract;
