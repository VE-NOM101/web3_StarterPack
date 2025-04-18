require("@nomicfoundation/hardhat-toolbox");

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
      url: "https://eth-sepolia.g.alchemy.com/v2/xobN7-uuWALX3Avn9K-YvSMnUjrfj0pI",
      accounts: ["53f622b9df6a59f3e6473d7a6e668261732f66704172083d9db26f678031a668"],
    }
  },
};
