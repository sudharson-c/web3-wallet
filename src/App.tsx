import { useEffect, useState } from "react";
import "./App.css";
import { createMnemonic, mnemonicToKeypair } from "./utils/keys";
import ShowContent from "./ShowContent";

type Wallet = {
  index: number;
  publicKey: string;
  privateKey: string;
};

function App() {
  const [mnemonic, setMnemonic] = useState<string | null>("");
  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    const savedMnemonic = localStorage.getItem("mnemonic");
    if (savedMnemonic) {
      setMnemonic(savedMnemonic);
    }
    const savedWallets = localStorage.getItem("wallets");
    if (savedWallets) {
      setWallets(JSON.parse(savedWallets));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("mnemonic", mnemonic || "");
    if (wallets.length > 0) {
      localStorage.setItem("wallets", JSON.stringify(wallets));
    }
  }, [mnemonic, wallets]);
  const handleAddMnemonic = () => {
    const newMnemonic = createMnemonic();
    setMnemonic(newMnemonic);
  };
  const handleAddWallet = () => {
    if (!mnemonic) return;

    const keypair = mnemonicToKeypair(mnemonic, wallets.length);
    setWallets([...wallets, keypair]);
  };
  const handleDeleteWallet = (index: number) => {
    const confirmed = prompt(
      "Are you sure you want to delete this wallet? This action cannot be undone.(Enter yes to confirm)"
    );
    if (confirmed === "yes") {
      setWallets(wallets.filter((wallet) => wallet.index !== index));
    }
  };
  return (
    <div className="">
      {!mnemonic ? (
        <div>
          <button onClick={handleAddMnemonic}>Create Mnemonic</button>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-8 text-blue-700">
            Your Mnemonic
          </h1>
          <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6">
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Mnemonic:</span>
              <span className="ml-2 break-all text-gray-900">{mnemonic}</span>
            </div>
          </div>

          <hr />
          <button onClick={handleAddWallet}>Add Wallet</button>
          {wallets.length > 0 && (
            <div>
              {wallets.map((wallet) => (
                <div key={wallet.index}>
                  <p>Wallet {wallet.index + 1}</p>
                  <p>Public Key: {wallet.publicKey}</p>
                  <p>
                    Private Key: <ShowContent text={wallet.privateKey} />
                  </p>
                  <button onClick={() => handleDeleteWallet(wallet.index)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
