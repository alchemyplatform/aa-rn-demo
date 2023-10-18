import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { Address } from "@alchemy/aa-core";
import { useAlchemyProvider } from "@hooks/useAlchemyProvider";
import { useAsyncEffect } from "@hooks/useAsyncEffect";
import { useMagicSigner } from "@hooks/useMagicSigner";
import { OAuthRedirectResult } from "@magic-ext/react-native-bare-oauth";
import { entryPointAddress } from "@shared-config/env";
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { MagicAuth, MagicAuthType } from "types/magic";
import { useAlertContext } from "./alert";

type WalletContextProps = {
  loading: boolean;
  // Functions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  login: (type: MagicAuthType, ...params: any[]) => Promise<void>;
  logout: () => Promise<void>;

  // Properties
  provider: AlchemyProvider;
  scaAddress?: Address;
  magicAuth?: MagicAuth;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultUnset: any = null;
const WalletContext = createContext<WalletContextProps>({
  loading: false,
  // Default Values
  provider: defaultUnset,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

export const useWalletContext = () => useContext(WalletContext);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { dispatchAlert } = useAlertContext();

  const [magicAuth, setMagicAuth] = useState<MagicAuth>();
  const [scaAddress, setScaAddress] = useState<Address>();
  const [loading, setLoading] = useState<boolean>(true);

  const {
    magic,
    signer,
    login: magicLogin,
    logout: magicLogout,
  } = useMagicSigner();
  const { provider, connectProviderToAccount, disconnectProviderFromAccount } =
    useAlchemyProvider({ entryPointAddress });

  const login = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (type: MagicAuthType, ...params: any[]) => {
      try {
        const res = await magicLogin(type, ...params);
        const metaData = await magic.user.getInfo();
        console.log("metaData", metaData);
        console.log("res", res);
        setMagicAuth({
          address: metaData.publicAddress,
          isLoggedIn: true,
          metaData,
          did: type === "email" || type === "sms" ? String(res) : undefined,
          email: metaData.email,
          phoneNumber: metaData.phoneNumber,
          oAuthRedirectResult:
            type === "google" || type === "apple"
              ? (res as OAuthRedirectResult)
              : undefined,
        });
        dispatchAlert({
          type: "open",
          alertType: "success",
          message: `Logged in using ${type}`,
        });
      } catch (error) {
        console.error(error);
        setMagicAuth({
          address: null,
          isLoggedIn: false,
          metaData: null,
        });
        dispatchAlert({
          type: "open",
          alertType: "error",
          message: `Error logging in using ${type}`,
        });
      }
    },
    [magicLogin, magic.user, dispatchAlert],
  );

  useAsyncEffect(
    async () => {
      if (magicAuth === undefined || !magicAuth.isLoggedIn) {
        return;
      }
      if (!provider.isConnected()) {
        console.log("new login, connecting provider to account");
        await connectProviderToAccount(signer);
        setScaAddress(await provider.getAddress());
        return;
      }
    },
    () => Promise.resolve(),
    [magicAuth?.isLoggedIn],
  );

  const logout = useCallback(async () => {
    try {
      await magicLogout();
    } catch (error) {
      console.error(error);
    } finally {
      setMagicAuth({
        address: null,
        isLoggedIn: false,
        metaData: null,
      });
      disconnectProviderFromAccount();
      setScaAddress(undefined);
      dispatchAlert({
        type: "open",
        alertType: "info",
        message: "Logged out",
      });
    }
  }, [magicLogout, disconnectProviderFromAccount, dispatchAlert]);

  useAsyncEffect(
    async () => {
      if (magicAuth) {
        return;
      }

      const isLoggedIn = await magic.user.isLoggedIn();
      if (!isLoggedIn) {
        setLoading(false);
        setMagicAuth({
          address: null,
          isLoggedIn: false,
          metaData: null,
        });
        return;
      }

      const metaData = await magic.user.getInfo();
      setMagicAuth({
        address: metaData.publicAddress,
        isLoggedIn: true,
        metaData,
        email: metaData.email,
        phoneNumber: metaData.phoneNumber,
      });

      console.log("User already logged in", metaData, provider.isConnected());
      if (provider.isConnected()) {
        setScaAddress(await provider.getAddress());
      } else {
        console.log("alread logged in, connecting provider to account");
        await connectProviderToAccount(signer);
        console.log("connected provider to account", provider.isConnected());
        setScaAddress(await provider.getAddress());
      }
      setLoading(false);
    },
    () => Promise.resolve(),
    [],
  );

  return (
    <WalletContext.Provider
      value={{
        loading,
        login,
        logout,
        magicAuth,
        provider,
        scaAddress,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
