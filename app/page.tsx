"use client";

import {
  BASE_SEPOLIA_PROOFIFI_ERC721_ADDRESS,
  BASE_SEPOLIA_USDC_ADDRESS,
  BASE_USDC_ADDRESS,
} from "@/lib/constants";
import { Button, Image, Link, Input, Divider } from "@nextui-org/react";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { CopyIcon, CheckIcon, Send, LogOut } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { encodeFunctionData, erc20Abi, parseUnits } from "viem";
import { base, baseSepolia } from "viem/chains";
import { useChainId, useSwitchChain, useBalance, useReadContract } from "wagmi";
import { proofifiAbi } from "@/lib/proofifiAbi";

export default function Home() {
  const { ready, authenticated, logout, user } = usePrivy();
  const [message, setMessage] = useState("");
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);
  const [embeddedWalletAddress, setEmbeddedWalletAddress] = useState<
    string | undefined
  >();
  const [smartWalletAddress, setSmartWalletAddress] = useState<
    string | undefined
  >();

  const [isLoadingMintNft, setIsLoadingMintNft] = useState(false);
  const [errorMessageMintNft, setErrorMessageMintNft] = useState("");
  const [recipientNftAddress, setRecipientNftAddress] = useState("");

  const { login } = useLogin();
  const { client } = useSmartWallets();
  const chainId = useChainId();

  const mintNftTransaction = async () => {
    setIsLoadingMintNft(true);
    if (!client) {
      console.error("No smart account client found");
      return;
    }

    setErrorMessageMintNft("");

    /* if (smartUsdcBalance && amount > smartUsdcBalance) {
      setErrorMessage("Insufficient USDC balance");
      return;
    } */

    try {
      const tx = await client.sendTransaction({
        chain: baseSepolia,
        to: BASE_SEPOLIA_PROOFIFI_ERC721_ADDRESS,
        value: BigInt(0),
        data: encodeFunctionData({
          abi: proofifiAbi,
          functionName: "safeMint",
          args: [recipientNftAddress as `0x${string}`],
        }),
        account: client.account,
      });
      console.log("tx", tx);
    } catch (error) {
      console.error("Transaction failed:", error);
      setErrorMessageMintNft("Transaction failed. Please try again.");
    }
    setIsLoadingMintNft(false);
  };

  const copyToClipboard = useCallback(
    async (text: string, walletType: string) => {
      await navigator.clipboard.writeText(text);
      setCopiedWallet(walletType);
      setTimeout(() => setCopiedWallet(null), 2000);
    },
    []
  );

  const handleLogout = () => {
    // Reset all input fields
    setMessage("");

    setRecipientNftAddress("");
    setErrorMessageMintNft("");
    // Call the Privy logout function
    logout();
  };

  useEffect(() => {
    if (user?.wallet?.address) {
      setEmbeddedWalletAddress(user.wallet.address);
    }
    if (client?.account.address) {
      setSmartWalletAddress(client.account.address);
    }
  }, [user, client]);

  return (
    <div className="min-h-screen min-w-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 h-screen text-black">
        <div className="col-span-2 bg-gray-50 p-12 h-full flex flex-col lg:flex-row items-center justify-center space-y-2">
          <div className="flex flex-col justify-evenly h-full">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2"></div>
              <div className="text-3xl lg:text-6xl font-black">Proofifi</div>
              <div className="text-md lg:text-lg">
                Create NFT labels for your second hand items.
              </div>

              {ready && !authenticated && (
                <Button
                  radius="sm"
                  color="primary"
                  className="bg-secondary text-white lg:w-fit w-full"
                  onClick={() => login()}
                >
                  Start now
                </Button>
              )}
              {ready && authenticated && (
                <Button
                  radius="sm"
                  color="danger"
                  className="w-fit"
                  onClick={handleLogout}
                  startContent={<LogOut className="w-4 h-4" />}
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-2 bg-white h-full p-12 lg:p-48 flex flex-col lg:flex-row items-center justify-center w-full space-y-4">
          {!user && <div className="lg:w-1/2"></div>}
          {user && (
            <div className="lg:flex lg:flex-row justify-center w-full">
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Input
                          size="sm"
                          value={user.wallet?.address}
                          label="Embedded Wallet"
                          isReadOnly
                          className="flex-grow"
                          endContent={
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  user.wallet?.address || "",
                                  "embedded"
                                )
                              }
                            >
                              {copiedWallet === "embedded" ? (
                                <CheckIcon className="w-4 h-4 text-green-500" />
                              ) : (
                                <CopyIcon className="w-4 h-4" />
                              )}
                            </button>
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Input
                          size="sm"
                          value={client?.account.address}
                          label="Smart Wallet"
                          isReadOnly
                          className="flex-grow"
                          endContent={
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  client?.account.address || "",
                                  "smart"
                                )
                              }
                            >
                              {copiedWallet === "smart" ? (
                                <CheckIcon className="w-4 h-4 text-green-500" />
                              ) : (
                                <CopyIcon className="w-4 h-4" />
                              )}
                            </button>
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Divider />
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-semibold">Create label</div>
                  <Input
                    size="sm"
                    value={recipientNftAddress}
                    onChange={(e) => setRecipientNftAddress(e.target.value)}
                    placeholder="Enter recipient address"
                    label="Recipient Address"
                  />
                </div>
                <Button
                  size="sm"
                  color="primary"
                  onClick={() => mintNftTransaction()}
                  startContent={<Send className="w-4 h-4" />}
                  isLoading={isLoadingMintNft}
                  className="w-full"
                  isDisabled={!recipientNftAddress}
                >
                  Create label
                </Button>
                {errorMessageMintNft && (
                  <div className="text-red-500 text-xs text-center mt-1">
                    {errorMessageMintNft}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
