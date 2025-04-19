require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Load .env variables

task("accounts", "Prints the list of accounts").setAction(
  async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    console.log(accounts);
    for (const account of accounts) {
      const address = await account.getAddress();
      const balance = await hre.ethers.provider.getBalance(address);
      const formattedBalance = hre.ethers.formatEther(balance); // ✅ Fixed here
      console.log(`${address}: ${formattedBalance} ETH`);
    }
  }
);

task("chainid", "Prints the current chain ID").setAction(async (taskArgs, hre) => {
  const network = await hre.ethers.provider.getNetwork();
  console.log(`Chain ID: ${network.chainId}`);
});


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_ACCOUNT_KEY1],
    }
  },
};
