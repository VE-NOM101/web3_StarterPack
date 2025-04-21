<script setup>
import { ref, watchEffect, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { ethers, formatEther, parseEther, hexlify } from "ethers";

const { ethereum } = window;

const address = ref('0x11');  // Corrected typo: "ox11" → "0x11"
const balance = ref('0');


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
            <h1>{{ address }}</h1>
            <h1>{{ balance }}</h1>
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
    </div>
</template>
