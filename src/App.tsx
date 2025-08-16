import { useEffect, useState, useCallback } from "react";
import { createMnemonic, mnemonicToKeypair } from "./utils/keys";
import ShowContent from "./ShowContent";
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

  useEffect(() => {
    if (mnemonic) localStorage.setItem("mnemonic", mnemonic);
    if (wallets.length > 0)
      localStorage.setItem("wallets", JSON.stringify(wallets));
  }, [mnemonic, wallets]);

  const handleAddMnemonic = () => {
    const newMnemonic = createMnemonic();
    setMnemonic(newMnemonic);
    setWallets([]);
  };

  const handleAddWallet = () => {
    if (!mnemonic) return;
    const index = wallets.length;
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-6 flex flex-col items-center text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-4xl w-full space-y-8">
        {/* HEADER */}
        <header className="flex justify-center items-center py-4 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight ">
            Solana Wallet Manager
          </h1>
          {/* <ThemeToggle /> */}
        </header>

        {/* MNEMONIC SECTION */}
        {!mnemonic ? (
          <div className="flex justify-center items-center py-16">
            <button
              onClick={handleAddMnemonic}
              className="group flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105"
            >
              <Key className="h-5 w-5" /> Generate Mnemonic
            </button>
          </div>
        ) : (
          <>
            {/* Mnemonic Card */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Your Mnemonic Phrase
                  </h2>
                  <p className="text-sm text-red-500 dark:text-red-400 font-medium pt-3">
                    Store this securely! Losing it means losing access to your
                    wallets.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(mnemonic)}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <Copy className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="break-words text-sm font-mono text-gray-900 dark:text-gray-100">
                  {mnemonic}
                </p>
              </div>
            </div>

            {/* WALLET HEADER */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Your Wallets
              </h2>
              <button
                onClick={handleAddWallet}
                className="group flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105"
              >
                <PlusCircle className="h-5 w-5" /> Add Wallet
              </button>
            </div>

            {/* WALLET LIST */}
            {wallets.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {wallets.map((wallet) => (
                  <div
                    key={wallet.index}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Wallet {wallet.index + 1}
                      </h3>
                      <button
                        onClick={() => handleDeleteWallet(wallet.index)}
                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm break-all font-mono text-gray-700 dark:text-gray-300">
                        <strong>Public Key:</strong> {wallet.publicKey}
                      </p>
                      <p className="text-sm break-all font-mono text-gray-700 dark:text-gray-300">
                        <strong>Private Key:</strong>{" "}
                        <ShowContent text={wallet.privateKey} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 italic">
                No wallets created yet. Click "Add Wallet" to get started.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
