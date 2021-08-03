const ethers = require("ethers");
const provider = ethers.getDefaultProvider("ropsten", {
  infura: "fd71293b54954e358ed95da002a73549",
});
module.exports = provider;
