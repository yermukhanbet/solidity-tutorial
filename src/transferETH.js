const ethers = require("ethers");
const wallet = require("./wallet");
const provider = require("./provider");

async function main(args) {
  const account = wallet.connect(provider);
  let to, value;

  // Parse the first argument - recipient address
  try {
    to = ethers.utils.getAddress(args[0]);
  } catch {
    console.error(`Invalid recipient address: ${args[0]}`);
    process.exit(1);
  }

  // Parse the second argument - amount
  try {
    value = ethers.utils.parseEther(args[1]);
    if (value.isNegative()) {
      throw new Error();
    }
  } catch {
    console.error(`Invalid amount: ${args[1]}`);
    process.exit(1);
  }
  const valueFormatted = ethers.utils.formatEther(value);

  // Check that the account has sufficient balance
  const balance = await account.getBalance();
  if (balance.lt(value)) {
    const balanceFormatted = ethers.utils.formatEther(balance);

    console.error(
      `Insufficient balance to send ${valueFormatted} (You have ${balanceFormatted})`
    );
    process.exit(1);
  }

  console.log(`Transferring ${valueFormatted} ETH to ${to}...`);

  // Submit transaction
  const tx = await account.sendTransaction({ to, value, gasPrice: 20e9 });
  console.log(`Transaction hash: ${tx.hash}`);

  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
}

main(process.argv.slice(2));
