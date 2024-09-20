"use client";
import { useState } from "react";

export const useKalpApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [walletAddr,setWalletAddr]=useState("")

  const setWallet=(wallet:string)=>{
    setWalletAddr(wallet);

  }

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const callApi = async (endpoint: string, args: { [key: string]: any }) => {
    setError(null);
    const params = {
      network: "TESTNET",
      blockchain: "KALP",
      walletAddress: walletAddr,
      args: args,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey!,
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      setLoading(false);
      return data;
    } catch (err: any) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const claim = async (address: string) => {
    setLoading(true);
    const endpoint =
      "https://gateway-api.kalp.studio/v1/contract/kalp/invoke/bdIpMC02ksiIzboxpg3mgMzsnzMiscZn1726844387923/Claim";
    const args = {
      amount: 100,
      address: address,
    };
    return callApi(endpoint, args);
  };

  const balanceOf = async (account: string) => {
    const endpoint =
      "https://gateway-api.kalp.studio/v1/contract/kalp/query/bdIpMC02ksiIzboxpg3mgMzsnzMiscZn1726844387923/BalanceOf";
    const args = {
      account: account,
    };
    return callApi(endpoint, args);
  };

  const totalSupply = async () => {
    const endpoint =
      "https://gateway-api.kalp.studio/v1/contract/kalp/query/bdIpMC02ksiIzboxpg3mgMzsnzMiscZn1726844387923/TotalSupply";
    const args = {};
    return callApi(endpoint, args);
  };

  const Transfer = async (toWallet:string,value:number) => {
    const endpoint="https://gateway-api.kalp.studio/v1/contract/kalp/invoke/bdIpMC02ksiIzboxpg3mgMzsnzMiscZn1726844387923/TransferFrom"
    const args = {
      from: walletAddr,
      to: toWallet,
      value: value,
    };
    return callApi(endpoint,args);
  };

  return { claim, balanceOf, totalSupply, loading, error,setWallet ,Transfer};
};
