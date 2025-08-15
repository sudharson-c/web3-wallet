import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import bs58 from "bs58";
import { Buffer } from 'buffer'; // Import Buffer for hex conversion


export function createMnemonic() {
    const mnemonic = generateMnemonic(128);
    console.log(Buffer.from(mnemonic).toString()); // Works now
    return mnemonic;
}

export function mnemonicToKeypair(mnemonic, index = 0) {
    const seed = mnemonicToSeedSync(mnemonic);
    const path = `m/44'/501'/${index}'/0'`;
    const derivedPath = derivePath(path, seed.toString('hex')).key;
    const keypair = Keypair.fromSeed(derivedPath);

    return {
        index,
        publicKey: keypair.publicKey.toString(),
        privateKey: bs58.encode(keypair.secretKey),
    }
}