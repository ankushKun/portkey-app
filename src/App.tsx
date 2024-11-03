import Arweave from "arweave";
import { useEffect, useState } from "react";
import { generateMnemonic, getKeyFromMnemonic } from 'arweave-mnemonic-keys';

const ar = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

// async function scan() {
//   console.log("User clicked scan button");

//   // alert(window.NDEFReader)

//   try {
//     const ndef = new NDEFReader();
//     await ndef.scan();
//     console.log("> Scan started");

//     ndef.addEventListener("readingerror", () => {
//       console.log("Argh! Cannot read data from the NFC tag. Try another one?");
//       alert("Argh! Cannot read data from the NFC tag. Try another one?");
//     });

//     ndef.addEventListener("reading", (e) => {
//       console.log("NFC tag detected: ", e);
//       alert("NFC tag detected: " + JSON.stringify(e));
//       // console.log(serialNumber, message);
//       // console.log(`> Serial Number: ${serialNumber}`);
//       // console.log(`> Records: (${message.records.length})`);
//     });
//   } catch (error) {
//     console.log("Argh! " + error);
//   }

// }

async function write(data: string) {
  console.log("User clicked write button");

  try {
    const ndef = new NDEFReader();
    await ndef.write(data);
    console.log("> Message written");
    alert("Message written");
  } catch (error) {
    console.log("Argh! " + error);
    alert("Argh! " + error);
    throw error;
  }

}

// async function readOnly() {
//   console.log("User clicked make read-only button");

//   try {
//     const ndef = new NDEFReader();
//     await ndef.makeReadOnly();
//     console.log("> NFC tag has been made permanently read-only");
//   } catch (error) {
//     console.log("Argh! " + error);
//   }
// }

function App() {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [jwk, setJwk] = useState();
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    async function load() {
      if (!mnemonic) return;
      if (mnemonic.split(" ").length !== 12) return;
      const jwk = await getKeyFromMnemonic(mnemonic);
      setJwk(jwk);
    }
    load();
  }, [mnemonic])

  useEffect(() => {
    async function load() {
      if (!jwk) return;
      const w = await ar.wallets.jwkToAddress(jwk);
      console.log(w);
      setAddress(w);
    }
    load();
  }, [jwk])

  async function handleWriteWallet() {
    await write(mnemonic);
    console.log(mnemonic);
    alert("Wallet written to NFC tag");
  }


  async function genWallet() {
    console.log("gen wallet");
    const m = await generateMnemonic();
    setMnemonic(m);
  }

  async function readNfc() {
    console.log("read wallet");
    const ndef = new NDEFReader();
    await ndef.scan();
    console.log("> Scan started");

    ndef.addEventListener("readingerror", () => {
      console.log("Argh! Cannot read data from the NFC tag. Try another one?");
      alert("Argh! Cannot read data from the NFC tag. Try another one?");
    });

    ndef.addEventListener("reading", async (e) => {
      console.log("NFC tag detected: ", e);
      const message = e.message;
      console.log(message);
      const decoder = new TextDecoder();
      const text = decoder.decode(message.records[0].data);
      console.log(text);
      setMnemonic(text);
    });
  }

  return (
    <>
      <div>NFC: {("NDEFReader" in window).toString()}</div>
      {/* <button onClick={scan}>scan</button><br /><br /> */}

      <div><pre>{address}</pre></div>
      <input type="text" value={mnemonic} onChange={(e) => setMnemonic(e.target.value)} />
      <button onClick={handleWriteWallet}>write {new TextEncoder().encode(mnemonic).length}</button><br />

      <button onClick={genWallet}>gen wallet</button>

      <br />
      <br />
      <button onClick={readNfc}>read wallet</button>
    </>
  )
}

export default App
