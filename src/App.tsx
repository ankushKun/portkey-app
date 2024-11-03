import Arweave from "arweave";

const ar = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

async function scan() {
  console.log("User clicked scan button");

  // alert(window.NDEFReader)

  try {
    const ndef = new NDEFReader();
    await ndef.scan();
    console.log("> Scan started");

    ndef.addEventListener("readingerror", () => {
      console.log("Argh! Cannot read data from the NFC tag. Try another one?");
      alert("Argh! Cannot read data from the NFC tag. Try another one?");
    });

    ndef.addEventListener("reading", (e) => {
      console.log("NFC tag detected: ", e);
      alert("NFC tag detected: " + JSON.stringify(e));
      // console.log(serialNumber, message);
      // console.log(`> Serial Number: ${serialNumber}`);
      // console.log(`> Records: (${message.records.length})`);
    });
  } catch (error) {
    console.log("Argh! " + error);
  }

}

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

  async function handleWriteWallet() {
    const w = await ar.wallets.generate();
    await write(JSON.stringify(w));
    console.log(w);
    alert("Wallet written to NFC tag");
  }

  return (
    <>
      <div>NFC: {("NDEFReader" in window).toString()}</div>
      <button onClick={scan}>scan</button>
      <button onClick={handleWriteWallet}>write wallet</button>
    </>
  )
}

export default App
