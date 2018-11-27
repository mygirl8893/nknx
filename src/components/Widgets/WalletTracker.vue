<template>
    <div class='assets-wrapper'>
        <app-section-loader :status="loader"></app-section-loader>
        <div v-for="(wallet, index) in walletsCopy" v-bind:key="index" class='assets d-md-full' style="width:47%">
            <wallet-card :address="wallet.address"></wallet-card>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import WalletCard from "Components/WalletCard/WalletCard";
import { Timeouts } from "Constants/timeouts";

export default {
    components: {
        WalletCard
    },
    data() {
        return {
            interval: null,
            loader: true,
            wallets: [],
            walletsCopy: [],
            nknPrice: null
        };
    },
    destroyed() {
        clearInterval(this.interval);
    },
    created: function() {
        this.getWalletsBalance();
    },
    mounted: function() {
        this.interval = setInterval(this.getWalletsBalance, Timeouts.short);
    },
    methods: {
        getWalletsBalance(){
        const self = this;
        self.loader = true;
        axios.get('https://api.coinmarketcap.com/v2/ticker/2780/')
        .then(response => {
            self.nknPrice = response.data.data.quotes.USD.price
        })

        axios.get('walletAddresses/', {
            })
            .then((response) => {
                for(let i in response.data){
                    response.data[i].balanceUsd = (response.data[i].balance*self.nknPrice/5).toFixed(0)
                    response.data[i].preview = response.data[i].label.charAt(0)
                }
                self.wallets = response.data

                if(self.wallets.length >=4){
                    self.walletsCopy = self.wallets.slice(0, 4)
                } else{
                    self.walletsCopy = self.wallets
                }
                self.loader = false;
            })
            .catch((error) =>{
                console.log(error)
            })

        }
    
    }
};
</script>