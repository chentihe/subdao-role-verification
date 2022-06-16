import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { useCallback, useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import Web3Modal from "web3modal";
import {
  Web3Action,
  web3InitialState,
  Web3ProviderState,
  web3Reducer,
} from "../reducers";
import { verifyHeadDAO } from "../utils/ContractLoader";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    },
  },
};

let web3Modal: Web3Modal | null;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions,
  });
}

type Web3Client = Web3ProviderState & {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
};

export const useWeb3 = () => {
  const [state, dispatch] = useReducer(web3Reducer, web3InitialState);
  const { provider, web3Provider, address, network } = state;

  const connect = useCallback(async () => {
    if (web3Modal) {
      try {
        const provider = await web3Modal.connect();
        const web3Provider = new ethers.providers.Web3Provider(provider);
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();
        const network = await web3Provider.getNetwork();
        toast.success("Connected to Web3");

        // for user to use the service on correct chain.
        // if (network.chainId !== 1) {
        //   switchNetwork(web3Provider);
        // }

        verifyHeadDAO(address, web3Provider);

        dispatch({
          type: "SET_WEB3_PROVIDER",
          provider,
          web3Provider,
          address,
          network,
        } as Web3Action);
      } catch (error) {
        console.log("connect error", error);
      }
    } else {
      console.log("No Web3Modal");
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (web3Modal) {
      web3Modal.clearCachedProvider();
      if (provider?.disconnect && typeof provider.disconnect === "function") {
        await provider.disconnect();
      }
      toast.error("Disconnected from Web3");
      dispatch({
        type: "RESET_WEB3_PROVIDER",
      } as Web3Action);
    } else {
      console.error("No Web3Modal");
    }
  }, [provider]);

  // Auto connect to the cached provider
  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      connect();
    }
  }, [connect]);

  // EIP-1193 events
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        toast.info("Changed Web3 Account");
        dispatch({
          type: "SET_ADDRESS",
          address: accounts[0],
        } as Web3Action);
      };

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId: string) => {
        if (typeof window !== "undefined") {
          console.log("switched to chain...", _hexChainId);
          toast.info("WEb3 Network Changed");
          window.location.reload();
        }
      };

      const handleDisconnet = (error: { code: number; message: string }) => {
        // eslint-disable-next-line no-console
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChaned", handleChainChanged);
      provider.on("disconnect", handleDisconnet);

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChaned", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnet);
        }
      };
    }
  }, [provider, disconnect]);

  return {
    provider,
    web3Provider,
    address,
    network,
    connect,
    disconnect,
  } as Web3Client;
};
