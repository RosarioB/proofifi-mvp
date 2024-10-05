"use client";

import { BASE_SEPOLIA_PROOFIFI_ERC721_ADDRESS } from "@/lib/constants";
import { Button, Input, Divider } from "@nextui-org/react";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { CopyIcon, CheckIcon, Send, LogOut } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { encodeFunctionData } from "viem";
import { baseSepolia } from "viem/chains";
import { useReadContract } from "wagmi";
import { proofifiAbi } from "@/lib/proofifiAbi";
import { createEnsName, getData } from "@/lib/namestone";

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
  const [nftTitle, setNftTitle] = useState("");
  const [nftDescription, setNftDescription] = useState("");

  const [ensName, setEnsName] = useState("");
  const [errorEns, setErrorEns] = useState("");

  const { login } = useLogin();
  const { client } = useSmartWallets();

  const { data: totalSupply } = useReadContract({
    abi: proofifiAbi,
    address: BASE_SEPOLIA_PROOFIFI_ERC721_ADDRESS,
    functionName: "totalSupply",
  });

  const mintNftTransaction = async () => {
    setIsLoadingMintNft(true);
    if (!client) {
      console.error("No smart account client found");
      return;
    }

    setErrorMessageMintNft("");

    console.log(nftTitle);
    console.log(nftDescription);
    console.log(recipientNftAddress);

    try {
      const tx = await client.sendTransaction({
        chain: baseSepolia,
        to: BASE_SEPOLIA_PROOFIFI_ERC721_ADDRESS,
        value: BigInt(0),
        data: encodeFunctionData({
          abi: proofifiAbi,
          functionName: "safeMint",
          args: [recipientNftAddress as `0x${string}`, nftTitle, nftDescription],
        }),
      });

      await createEnsName(ensName, smartWalletAddress || "");

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

  useEffect(() => {
    if (user?.wallet?.address) {
      setEmbeddedWalletAddress(user.wallet.address);
    }
    if (client?.account.address) {
      setSmartWalletAddress(client.account.address);
    }
  }, [user, client]);

  const handleLogout = () => {
    // Reset all input fields
    setMessage("");

    setRecipientNftAddress("");
    /* setNftTitle("");
    setNftDescription(""); */
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setErrorEns("");
    setEnsName(value);

    const validateENS = (name: string): boolean => {
      const ensRegex = /^[a-z0-9]+$/i;
      return ensRegex.test(name.toLowerCase());
    };

    // Validate ENS name
    if (!validateENS(value)) {
      setErrorEns("Invalid ENS name. It must be alphanumeric.");
    } else {
      setErrorEns("");
    }
  };

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
                    value={ensName}
                    onChange={(e) => handleChange(e)}
                    placeholder="Enter ENS name"
                    label="ENS name"
                  />
                  {errorEns && (
                    <div className="text-red-500 text-xs text-center mt-1">
                      {errorEns}
                    </div>
                  )}
                  <Input
                    size="sm"
                    value={nftTitle}
                    onChange={(e) => setNftTitle(e.target.value)}
                    placeholder="Enter label title"
                    label="Label title"
                  />
                  <Input
                    size="sm"
                    value={nftDescription}
                    onChange={(e) => setNftDescription(e.target.value)}
                    placeholder="Enter label description"
                    label="Label description"
                  />
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
                  isDisabled={!recipientNftAddress || !ensName}
                >
                  Create label
                </Button>
                {errorMessageMintNft && (
                  <div className="text-red-500 text-xs text-center mt-1">
                    {errorMessageMintNft}
                  </div>
                )}
                <div className="text-xs mt-1">
                  <span className="font-semibold">
                    Labels created: {totalSupply?.toString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
