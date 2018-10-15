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
            wallets: [
            {
                "label": "lightmyfire",
                "address": "NhWjY9iwD5Ad8DafiEWbTo4buLpBomdttH",
                "balance": null,
                "balanceUsd": null,
                "preview": ""
            },
            {
                "label": "Ebudka",
                "address": "NVKDBKYAJ55pXJSNj3TNFYaeZDGa8mT9V3",
                "balance": null,
                "balanceUsd": null,
                "preview": ""
            },
            {
                "label": "Karlik",
                "address": "Ne45tkwdzQzvYbSG28W4nP45MVUpV3sY55",
                "balance": null,
                "balanceUsd": null,
                "preview": ""
            },
            {
                "label": "ChrisT",
                "address": "NNP6M8EGZcWSZNgA2ebQfMVyNkwX6sGBQW",
                "balance": null,
                "balanceUsd": null,
                "preview": ""
            }
            ],
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
        //Max 4 wallets in a widget
        if(self.wallets.length >=4){
                self.walletsCopy = self.wallets.slice(0, 4)
            } else{
                self.walletsCopy = self.wallets
            }
        axios.get('https://api.coinmarketcap.com/v2/ticker/2780/')
        .then(response => {
            self.nknPrice = response.data.data.quotes.USD.price
        })
        for(let i in self.wallets){

            axios.post("http://testnet-node-0001.nkn.org:30003/",
            { 
                "jsonrpc": "2.0",
                "method": "getunspendoutput",
                "params": 
                    { 
                        "address": self.wallets[i].address, 
                        "assetid": "4945ca009174097e6614d306b66e1f9cb1fce586cb857729be9e1c5cc04c9c02"
                    },
                "id": 1
            }).then(function(response){
                let balance = 0;
                self.wallets[i].preview = self.wallets[i].label.charAt(0)
                response.data.result.forEach(function(element) {
                    self.wallets[i].balance = self.wallets[i].balance + element["Value"];
                });
                self.wallets[i].balanceUsd = (self.wallets[i].balance*self.nknPrice/5).toFixed(0)
            }).catch(function(error) {
                self.wallets[i].balance = 'Query balance fail.'
            })

        }

        self.loader = false;

        }
    
    }
};
</script>