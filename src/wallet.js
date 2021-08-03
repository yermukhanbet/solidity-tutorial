const ethers = require("ethers");
const mnemonic =
  "index fuel target dumb rhythm ozone quit donkey crater vivid dynamic dwarf";
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
console.log(`Mnemonic: ${wallet.mnemonic.phrase}`);
console.log(`Address: ${wallet.address}`);
module.exports = wallet;
