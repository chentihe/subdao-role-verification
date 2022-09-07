import { ethers } from "ethers";
import {
  HEADDAO_HOLDER_ABI,
  HEADDAO_HOLDER_ADDRESS,
  HEADDAO_STAKER_ABI,
  HEADDAO_STAKER_ADDRESS,
} from "./contracts";

export async function verifyHeadDAO(
  address: string,
  web3Provider: ethers.providers.Web3Provider
) {
  const headDAONFT = new ethers.Contract(
    HEADDAO_HOLDER_ADDRESS,
    HEADDAO_HOLDER_ABI,
    web3Provider
  );
  const headDAOSTAKE = new ethers.Contract(
    HEADDAO_STAKER_ADDRESS,
    HEADDAO_STAKER_ABI,
    web3Provider
  );

  try {
    const holder = await headDAONFT.balanceOf(address);
    const staker = await headDAOSTAKE.depositsOf(address);

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/verifications?holder=${Number(holder)}&staker=${staker.length}`
    );
    if (!response.ok) {
        throw Error("Request failed!");
    }
  } catch (error) {
      console.log("Error occured during fetch data from Ethereum", error);
  }
}
