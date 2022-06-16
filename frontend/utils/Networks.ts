import { ethers } from "ethers";

export const switchNetwork = async (
  web3Provider: ethers.providers.Web3Provider
) => {
  try {
    await web3Provider.provider.request!({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: toHex(1) }],
    });
  } catch (error) {
    console.log("Switch Network Error", error);
  }
};

export const truncateAddress = (address: string) => {
  if (!address) return "No Account";
  const match = address.match(
    /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

export const toHex = (num: Number) => {
  return "0x" + num.toString(16);
};
