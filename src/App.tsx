import { useEffect, useState, useCallback } from "react";
import { createMnemonic, mnemonicToKeypair } from "./utils/keys";
import ShowContent from "./ShowContent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Trash, PlusCircle, Key, Copy } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

type Wallet = {
  index: number;
  publicKey: string;
  privateKey: string;
};

export default function App() {
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  // Load from localStorage once on mount
  useEffect(() => {
    const savedMnemonic = localStorage.getItem("mnemonic");
    if (savedMnemonic) setMnemonic(savedMnemonic);

    const savedWallets = localStorage.getItem("wallets");
    if (savedWallets) {
      try {
        setWallets(JSON.parse(savedWallets));
      } catch {
        console.error("Failed to parse saved wallets");
      }
    }
  }, []);

  // Save whenever data changes
  useEffect(() => {
    if (mnemonic) localStorage.setItem("mnemonic", mnemonic);
    if (wallets.length > 0)
      localStorage.setItem("wallets", JSON.stringify(wallets));
  }, [mnemonic, wallets]);

  const handleAddMnemonic = () => {
    const newMnemonic = createMnemonic();
    setMnemonic(newMnemonic);
    setWallets([]); // reset wallets for new mnemonic
  };

  const handleAddWallet = () => {
    if (!mnemonic) return;
    const index = wallets.length; // next wallet index
    const keypair = mnemonicToKeypair(mnemonic, index);
    setWallets((prev) => [...prev, { ...keypair, index }]);
  };

  const handleDeleteWallet = (index: number) => {
    const confirmed = prompt(
      "Are you sure you want to delete this wallet? This action cannot be undone. (Type yes to confirm)"
    );
    if (confirmed?.toLowerCase() === "yes") {
      setWallets((prev) => prev.filter((w) => w.index !== index));
    }
  };

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex flex-col items-center text-gray-900 dark:text-gray-100">
      <div className="max-w-3xl w-full space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Solana Wallet Manager
          </h1>
          <ThemeToggle />
        </div>

        {/* MNEMONIC SECTION */}
        {!mnemonic ? (
          <div className="flex justify-center items-center py-12">
            <Button onClick={handleAddMnemonic} size="lg" className="gap-2">
              <Key className="h-5 w-5" /> Create Mnemonic
            </Button>
          </div>
        ) : (
          <>
            <Card className="shadow-sm">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>Your Mnemonic</CardTitle>
                  <CardDescription>
                    Keep this safe! Losing this means losing access to your
                    wallets.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(mnemonic)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="break-words text-gray-900 bg-gray-100 p-4 rounded-lg border text-sm font-mono">
                  {mnemonic}
                </p>
              </CardContent>
            </Card>

            {/* WALLET HEADER */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Wallets</h2>
              <Button
                variant="outline"
                onClick={handleAddWallet}
                className="gap-2"
              >
                <PlusCircle className="h-4 w-4" /> Add Wallet
              </Button>
            </div>

            {/* WALLET LIST */}
            {wallets.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {wallets.map((wallet) => (
                  <Card
                    key={wallet.index}
                    className="border border-gray-200 shadow-sm hover:shadow-md transition"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-lg">
                        Wallet {wallet.index + 1}
                      </CardTitle>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteWallet(wallet.index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-gray-700 break-all font-mono">
                        <strong>Public Key:</strong> {wallet.publicKey}
                      </p>
                      <p className="text-sm text-gray-700 break-all font-mono">
                        <strong>Private Key:</strong>{" "}
                        <ShowContent text={wallet.privateKey} />
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 italic">
                No wallets created yet.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
