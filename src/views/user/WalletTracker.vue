<template>
    <div>
    <page-title-bar></page-title-bar>
        <v-container fluid pt-0 grid-list-xl>
            <div class="card-stats">
                <market-stats></market-stats>
            </div>
            <div class="d-custom-flex w-100 mb-4">
                <v-flex xl3 md12>
                    <v-card style='height:100%'>
                    <v-card-title primary-title style='height:100%'>
                    <h4>{{$t('message.newWallet')}}</h4>
                    <v-form v-model="valid" class="mb-4 w-100">
                        <v-text-field 
                            :label="$t('message.nknWalletAddress')" 
                            v-model="addAddress"
                            required
                            :rules='addressRules'
                        ></v-text-field>
                        <v-alert
                                v-if='isMultiCopy===true'
                                v-model='isMultiError'
                                type="error"
                                dismissible
                                class='w-100'
                                >
                                {{isMultiError}}
                        </v-alert>
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
                </v-card-title>
                    </v-card>
                </v-flex>
                <v-flex xl9 md12 v-if='wallets.length>0'>
                    <wallet-chart :wallets='wallets'></wallet-chart>
                </v-flex>
            </div>
            <app-card
                    colClasses="xl12"
                    customClasses="transparent no-box-shadow"
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
import MarketStats from "Components/Widgets/MarketStats";
import WalletChart from "Components/Widgets/WalletChart";

export default {
    components: {
        MarketStats,
        WalletChart
  },
    data() {
        return {
            interval: null,
            loader: true,
            valid: false,
            addLabel: '',
            addAddress: '',
            isMultiCopy: false,
            isMultiError: '',
            addressRules: [
            v => !!v || "NKN Address is required!",
            v =>
            /(^N).*/.test(v) ||
            "NKN address must be valid"
            ],
            labelRules: [v => !!v || "Label is required"],
            wallets: [],
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
        this.interval = setInterval(this.getWalletsBalance, 30000);
    },
    methods: {
    addWallet(){
        const self = this;
        axios.post('walletAddresses/', {
            'address':self.addAddress, 'label':self.addLabel
                })
        .then((response) => {
            this.getWalletsBalance()
        })
        .catch((error) =>{
           self.isMultiCopy = true
           self.isMultiError = error.response.data.msg
        })
    },
    removeWallet(wallet) {
        const self = this;
        let id = wallet.id
        axios.delete('walletAddresses/'+id, {
                })
        .then((response) => {
            this.getWalletsBalance()
        })
    },
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
            })
            .catch((error) =>{
                console.log(error)
            })
        self.loader = false;

        }
    
    }
};
</script>