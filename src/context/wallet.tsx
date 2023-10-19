import { AlchemyProvider } from "@alchemy/aa-alchemy";
import {
  Address,
  LocalAccountSigner,
  SmartAccountSigner,
} from "@alchemy/aa-core";
// import { magic, useMagicContext } from "@context/magic";
import { useAlchemyProvider } from "@hooks/useAlchemyProvider";
import { useAsyncEffect } from "@hooks/useAsyncEffect";
// import { OAuthRedirectResult } from "@magic-ext/react-native-bare-oauth";
import { chain, entryPointAddress, privateKey } from "@shared-config/env";
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
// import { MagicAuth, MagicAuthType } from "types/magic";
import { type } from "os";
import { Auth } from "types/auth";
import { WalletClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { useAlertContext } from "./alert";

type WalletContextProps = {
  // Functions
  login: (email?: string, phoneNumber?: string) => Promise<void>;
  logout: () => Promise<void>;

  // Properties
  provider: AlchemyProvider;
  scaAddress?: Address;
  auth: Auth;
  walletClient: WalletClient;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultUnset: any = null;
const WalletContext = createContext<WalletContextProps>({
  // Default Values
  provider: defaultUnset,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  auth: defaultUnset,
  walletClient: defaultUnset,
});

export const useWalletContext = () => useContext(WalletContext);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { dispatchAlert } = useAlertContext();

  const account = privateKeyToAccount(privateKey);

  const client = createWalletClient({
    account,
    chain,
    transport: http(),
  });

  const [auth, setAuth] = useState<Auth>({
    address: account.address,
    isLoggedIn: false,
  });
  const [scaAddress, setScaAddress] = useState<Address>();
  const [signer, setSigner] = useState<SmartAccountSigner>();

  // const { signer, login: magicLogin, logout: magicLogout } = useMagicContext();
  const { provider, connectProviderToAccount, disconnectProviderFromAccount } =
    useAlchemyProvider({ entryPointAddress });

  const login = useCallback(
    async (email?: string, phoneNumber?: string) => {
      try {
        setAuth({
          address: account.address,
          isLoggedIn: true,
          email,
          phoneNumber,
        });

        const _signer = new LocalAccountSigner(account);
        setSigner(_signer);

        dispatchAlert({
          type: "open",
          alertType: "success",
          message: `Logged in using ${type}`,
        });
      } catch (error) {
        console.error(error);
        setAuth({
          address: account.address,
          isLoggedIn: false,
        });
        setSigner(undefined);
        dispatchAlert({
          type: "open",
          alertType: "error",
          message: `Error logging in using ${type}`,
        });
      }
    },
    [account, dispatchAlert],
  );

  useAsyncEffect(async () => {
    if (!auth.isLoggedIn || !signer) {
      return;
    }
    if (!provider.isConnected()) {
      console.log("new login, connecting provider to account");
      await connectProviderToAccount(signer);
      setScaAddress(await provider.getAddress());
      return;
    }
  }, [auth.isLoggedIn]);

  const logout = useCallback(async () => {
    try {
      console.log("logging out");
      disconnectProviderFromAccount();
    } catch (error) {
      console.error(error);
    } finally {
      setAuth({
        address: account.address,
        isLoggedIn: false,
      });
      setSigner(undefined);
      setScaAddress(undefined);
      dispatchAlert({
        type: "open",
        alertType: "info",
        message: "Logged out",
      });
    }
  }, [disconnectProviderFromAccount, account.address, dispatchAlert]);

  return (
    <WalletContext.Provider
      value={{
        login,
        logout,
        auth,
        walletClient: client,
        provider,
        scaAddress,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
