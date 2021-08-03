const ethers = require("ethers");
const wallet = require("./wallet");
const provider = require("./provider");

async function main(args) {
  const account = wallet.connect(provider);

  // Define balanceOf and transfer functions in the contract
  const usdc = new ethers.Contract(
    "0x68ec573C119826db2eaEA1Efbfc2970cDaC869c4",
    [
      "function balanceOf(address _owner) public view returns (uint256 balance)",
      "function transfer(address _to, uint256 _value) public returns (bool success)",
    ],
    account
  );

  let to, value;

  // Parse the first argument - recipient address
  try {
    to = ethers.utils.getAddress(args[0]);
  } catch {
    console.error(`Invalid address: ${args[0]}`);
    process.exit(1);
  }

  // Parse the second argument - amount
  try {
    value = ethers.utils.parseUnits(args[1], 6);
    if (value.isNegative()) {
      throw new Error();
    }
  } catch {
    console.error(`Invalid amount: ${args[1]}`);
    process.exit(1);
  }
  const valueFormatted = ethers.utils.formatUnits(value, 6);

  // Check that the account has sufficient balance
  const balance = await usdc.balanceOf(account.address);
  if (balance.lt(value)) {
    const balanceFormatted = ethers.utils.formatUnits(balance, 6);

    console.error(
      `Insufficient balance to send ${valueFormatted} (You have ${balanceFormatted})`
    );
    process.exit(1);
  }

  console.log(`Transferring ${valueFormatted} USDC to ${to}...`);

  // Submit a transaction to call the transfer function
  const tx = await usdc.transfer(to, value, { gasPrice: 20e9 });
  console.log(`Transaction hash: ${tx.hash}`);

  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
}

main(process.argv.slice(2));
