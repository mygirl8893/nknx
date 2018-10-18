<template>
    <div class='assets-wrapper'>
        <app-section-loader :status="loader"></app-section-loader>
        <v-card v-for="(wallet, index) in walletsCopy" v-bind:key="index" class='assets d-md-full'>
            <div class="assets-item">
                <div class="assets-preview">
                    <div class="assets-preview__text">{{wallet.preview}}</div>
                </div>
                <div class="assets-label">{{wallet.label}}</div>
                <div class="assets-balance">
                    <div class="assets-balance__wallet">{{wallet.address}}</div>
                    <div class="assets-balance__label">{{$t('message.balance')}}</div>
                    <div class="assets-balance__item">{{wallet.balance}} NKN</div>
                    <div class="assets-balance__item">≈${{wallet.balanceUsd}}</div>
                </div>
            </div>
        </v-card>
    </div>
</template>
<script>
import axios from "axios";

export default {
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
        
    },
    methods: {
        getWalletsBalance(){
        const self = this;
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
            })
            .catch((error) =>{
                console.log(error)
            })


        self.loader = false;

        }
    
    }
};
</script>