<template>
    <div>
    <page-title-bar></page-title-bar>
        <v-container fluid pt-0 grid-list-xl>
            <v-layout>
                <v-flex xs3>
                    <v-form v-model="valid" class="mb-4">
                        <v-text-field 
                            :label="$t('message.nknWalletAddress')" 
                            v-model="addAddress"
                            required
                            :rules='addressRules'
                        ></v-text-field>
                        <v-text-field 
                            :label="$t('message.walletLabel')" 
                            v-model="addLabel" 
                            required
                            :rules='labelRules'
                        ></v-text-field>
                        <div>
                            <v-btn :disabled="!valid"  large @click="addWallet" block color="warning">{{$t('message.addWallet')}}</v-btn>
                        </div>
                    </v-form>
                </v-flex>
            </v-layout>
            <app-card
                    colClasses="xl12"
                    customClasses=""
                    :fullScreen="true"
                    :fullBlock="true"
                    :footer="true"
                    v-if="wallets.length>0"
                >
                <div class='assets-wrapper'>
                    <app-section-loader :status="loader"></app-section-loader>
                    <v-card v-for="(wallet, index) in wallets" v-bind:key="index" class='assets d-md-full'>
                        <div class="assets-item">
                            <div class="assets-preview">
                                <div class="assets-preview__text">{{wallet.preview}}</div>
                            </div>
                            <div class="assets-label">{{wallet.label}}

                            <v-btn
                            color="red"
                            dark
                            small
                            absolute
                            top
                            right
                            fab
                            @click='removeWallet(wallet)'
                            >
                                <v-icon>delete_outline</v-icon>
                            </v-btn>
                            </div>
                            <div class="assets-balance">
                                <div class="assets-balance__wallet">{{wallet.address}}</div>
                                <div class="assets-balance__label">{{$t('message.balance')}}</div>
                                <div class="assets-balance__item">{{wallet.balance}} NKN</div>
                                <div class="assets-balance__item">≈${{wallet.balanceUsd}}</div>
                            </div>
                        </div>
                    </v-card>
                </div>
            </app-card>

     </v-container>
</div>
</template>
<script>
import axios from "axios";

export default {
    data() {
        return {
            interval: null,
            loader: true,
            valid: false,
            addLabel: '',
            addAddress: '',
            addressRules: [
            v => !!v || "NKN Address is required!",
            v =>
            /(^N).*/.test(v) ||
            "NKN address must be valid"
            ],
            labelRules: [v => !!v || "Label is required"],
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
    addWallet(){
        const self = this;
        self.wallets.push({'address':self.addAddress, 'label':self.addLabel, 'balance':null, 'balanceUsd':null,'preview':null})
        this.getWalletsBalance();
    },
    removeWallet(wallet) {
        const self = this;
        self.wallets.splice(self.wallets.indexOf(wallet), 1)
    },
    getWalletsBalance(){
        const self = this;
        axios.get('https://api.coinmarketcap.com/v2/ticker/2780/')
        .then(response => {
            self.nknPrice = response.data.data.quotes.USD.price
        })
        for(let i in self.wallets){

            axios.post("https://nknx.org:30003/",
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