<script setup>
import { ref, watchEffect, onMounted } from 'vue'
import { ethers, formatEther, parseEther, } from "ethers";
import token_contract from '../Token.sol/Token.json';
const { ethereum } = window;

const address = ref('0x11');  // Corrected typo: "ox11" → "0x11"
const balance = ref('0');

const tokenAccount = ref(null);
const tokenBal = ref('0');
const tokenAmount = ref(null);

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";//paste the contract address when u deployed it in testnet
//Note: for localhost this address might change after each time you run the scripts. So update that
const contractDeployer = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
//Provider for getting or requesting data
const testNetProvider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");//use alchemy or infura api link here for testnet

//Provider for wallet interaction->cost gas
const walletProvider = new ethers.BrowserProvider(ethereum);

//getting data from the contract,
const ContractData = new ethers.Contract(
    contractAddress,
    token_contract.abi,
    testNetProvider
);

const getTokenBalance = async () => {

    const signer = await walletProvider.getSigner();
    const token_address = await signer.getAddress();
    const data = await ContractData.balanceOf(token_address);
    tokenBal.value = data;
}
//For transaction->writing to smart contract we need signer to pass with contract-address
const transferToken = async () => {

    if (!tokenAccount.value || !tokenAmount.value) {
        console.log("⚠️ Enter valid address and amount");
        return;
    }
    try {
        const signer = await walletProvider.getSigner();
        const TxContract = new ethers.Contract(contractAddress, token_contract.abi, signer);

        const tx = await TxContract.transfer(
            tokenAccount.value,
            parseInt(tokenAmount.value)
        );

        console.log("⏳ Transaction sent:", tx.hash);
        await tx.wait();
        console.log("✅ Transaction confirmed");

        // Optional: Refresh balance after sending
        await getTokenBalance();
    } catch (error) {
        console.error("❌ Transfer failed:", error);
    }
}

onMounted(() => {
    if (ethereum) {
        ethereum.on("accountsChanged", (accounts) => {
            address.value = accounts[0] || '';
            const req = async () => {
                // Get balance of the first account
                const val = await ethereum.request({
                    method: 'eth_getBalance',
                    params: [address.value, 'latest']
                });
                // Convert from hex to ether
                balance.value = await formatEther(val) + ' ETH';
            }

            req();
        });

        // Handle chain switching
        ethereum.on("chainChanged", (chainId) => {
            console.log("Chain changed:", chainId);
            // You can also store it in a ref or reload if needed
            // location.reload(); // MetaMask recommends reloading
        });
    }
});

// Instead of onMounted it also can be used
// watchEffect(() => {
//   if (ethereum) {
//     const handleAccountsChanged = (accounts) => {
//       address.value = accounts[0] || 'Not connected'
//     }

//     ethereum.on('accountsChanged', handleAccountsChanged)

//     // Cleanup (optional, avoids multiple listeners if component re-uses)
//     return () => {
//       ethereum.removeListener('accountsChanged', handleAccountsChanged)
//     }
//   }
// })

const requestAccount = async () => {
    try {
        //First method
        // // Request permissions to access wallet
        // await ethereum.request({
        //     method: 'wallet_requestPermissions',
        //     params: [{ eth_accounts: {} }]
        // });

        // // Get list of accounts
        // const accounts = await ethereum.request({
        //     method: 'eth_requestAccounts'
        // });

        //Second method
        const accounts = await ethereum.request({
            method: 'eth_requestAccounts',
            params: []
        });

        address.value = accounts[0]; // Assign correctly

        // Get balance of the first account
        const val = await ethereum.request({
            method: 'eth_getBalance',
            params: [address.value, 'latest']
        });

        // Convert from hex to ether
        balance.value = await formatEther(val) + ' ETH';
    } catch (error) {
        console.error('Error connecting to wallet:', error);
    }
};

const addChain = async () => {
    try {
        await ethereum.request({
            "method": "wallet_addEthereumChain",
            "params": [
                {
                    chainId: "0x64",
                    chainName: "Gnosis",
                    rpcUrls: [
                        "https://rpc.gnosischain.com"
                    ],
                    iconUrls: [
                        "https://xdaichain.com/fake/example/url/xdai.svg",
                        "https://xdaichain.com/fake/example/url/xdai.png"
                    ],
                    nativeCurrency: {
                        name: "XDAI",
                        symbol: "XDAI",
                        decimals: 18
                    },
                    blockExplorerUrls: [
                        "https://blockscout.com/poa/xdai/"
                    ]
                }
            ],
        });

    } catch (error) {
        console.log(error);
    }
}

const switchChain = async () => {
    try {
        await ethereum.request({
            "method": "wallet_switchEthereumChain",
            "params": [
                {
                    chainId: "0x1"
                }
            ],
        });
    } catch (error) {
        console.log(error);
    }
}

const sendTransaction = async () => {
    try {
        await ethereum.request({
            method: "eth_sendTransaction",
            params: [
                {
                    from: address.value,
                    to: "0xa55eE4c9A0EeC9D3121B24C89c5799E23d98D34F",
                    value: `0x${(parseEther("0.05")).toString(16)}`,
                    chainId: '0xaa36a7'
                }
            ],
        });
    } catch (error) {
        console.log(error);
    }
};
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen border p-4 rounded-2xl">
        <div class="border-4 mt-3 border-amber-400 text-4xl text-center rounded-3xl p-4">
            <h1>Account:{{ address }}</h1>
            <h1>ETH: {{ balance }}</h1>
            <hr class="mb-2 mt-2" />
            <h1>Token Balance: {{ tokenBal }}</h1>
            <h1>ContractDeployer: {{ contractDeployer }}</h1>
        </div>
        <button @click="requestAccount"
            class="text-center p-2 m-2 border-2 border-blue-700 hover:bg-blue-700 hover:text-white rounded-2xl">
            Connect Wallet
        </button>


        <button @click="addChain"
            class="text-center p-2 m-2 border-2 border-blue-700 hover:bg-blue-700 hover:text-white rounded-2xl">
            Add Chain </button>


        <button @click="switchChain"
            class="text-center p-2 m-2 border-2 border-blue-700 hover:bg-blue-700 hover:text-white rounded-2xl">
            Switch Chain </button>


        <button @click="sendTransaction"
            class="text-center p-2 m-2 border-2 border-blue-700 hover:bg-blue-700 hover:text-white rounded-2xl">
            Send Transaction </button>

        <button @click="getTokenBalance"
            class="text-center p-2 m-2 border-2 border-blue-700 hover:bg-blue-700 hover:text-white rounded-2xl">
            getTokenBalance </button>

        <div class="flex">
            <input type="text" class="p-2 border-2 w-[400px]" v-model="tokenAccount" placeholder="Send token to" />
            <input type="text" class="p-2 border-2 w-[400px]" v-model="tokenAmount" placeholder="Amount" />

            <button @click="transferToken"
                class="text-center p-2 m-2 border-2 border-blue-700 hover:bg-blue-700 hover:text-white rounded-2xl">
                Send Token </button>
        </div>
    </div>
</template>
