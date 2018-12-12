<template>
    <div>
    <page-title-bar></page-title-bar>
        <v-container fluid pt-0 grid-list-xl>
        <div class="network-block">
            <div class='network-card'>
                <div class="network-card__item">
                    <div class="network-card__item-title">{{$t('message.networth')}}</div>
                    <div class="network-card__item-value"><span v-html="networthIcon" class="icon"></span>{{networth}}</div>
                </div>
                <div class="network-card__item">
                    <div class="network-card__item-title">{{$t('message.myWallets')}}</div>
                    <div class="network-card__item-value"><span v-html="walletIcon" class="icon"></span>{{wallets.length}}</div>
                </div>
                <div class="network-card__item">
                    <div class="network-card__item-title">{{$t('message.networkControl')}}</div>
                    <div class="network-card__item-value"><span v-html="miningIcon" class="icon"></span>{{networkControl}}</div>
                </div>
                <div class="network-card__item">
                    <div class="network-card__item-title">{{$t('message.myNodes')}}</div>
                    <div class="network-card__item-value"><span v-html="nodeIcon" class="icon"></span>{{userNodes}}</div>
                </div>
                <div class="network-card__item">
                    <div class="network-card__item-title">{{$t('message.blocksMined')}}</div>
                    <div class="network-card__item-value"><span v-html="miningIcon" class="icon"></span>{{miningPercent}}</div>
                </div>
            </div>
        </div>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-layout justify-end>
                        <v-btn color="primary" large @click='addWalletModal'><span v-html="addWalletIcon" class="icon"></span>{{$t('message.addWallet')}}</v-btn>  
                    </v-layout>  
                </v-flex>
            </v-layout>
            <v-layout row wrap v-for='wallet in wallets' :key='wallet.id'>
                <v-flex xs12 sm12 md6 lg5 xl5>
                    <wallet-card :address="wallet.address" :deleteCallback="removeWallet"></wallet-card>
                </v-flex>
                <v-flex  xs12 sm12 md12 lg7 xl7 mb-4>
                    <h2>{{$t('message.miningStats')}}</h2>
                    <WalletChart :currentId='wallet.id' :height="100" style='height:100%'></WalletChart>
                </v-flex>
            </v-layout>

     </v-container>
    <v-dialog v-model="addWalletDialog" max-width="500px">
        <v-card class='card-light'>
          <v-card-title>
            <span class="headline">{{ $t('message.newWallet') }}</span>
          </v-card-title>

          <v-card-text>
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
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">{{ $t('message.cancel') }}</v-btn>
            <v-btn color="blue darken-1" flat @click="addWallet">{{ $t('message.addWallet') }}</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
</div>
</template>
<script>
import axios from "axios";
import MarketStats from "Components/Widgets/MarketStats";
import WalletChart from "Components/Charts/WalletChart";
import WalletCard from "Components/WalletCard/WalletCard";
import { Timeouts } from "Constants/timeouts";
import feather from 'feather-icons';


export default {
    components: {
        WalletCard,
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
            nknPrice: null,
            currentId: '',
            select: '',
            networth: 0,
            miningPercent: 0,
            addWalletDialog: false,
            dailyBlocks: 0,
            networkControl: 0,
            userNodes: 0
        };
    },
    destroyed() {
        clearInterval(this.interval);
    },
    created: function() {
        const self = this;
        this.getWalletsBalance();
        this.getUserNodes();
    },
    mounted: function() {
        this.interval = setInterval(this.getWalletsBalance, Timeouts.short);
        this.interval = setInterval(this.getUserNodes, Timeouts.short);
    },
    computed: {
        walletIcon: function () {
            return feather.icons['credit-card'].toSvg()
        },
        nodeIcon: function () {
            return feather.icons['droplet'].toSvg()
        },
        networthIcon: function () {
            return feather.icons['dollar-sign'].toSvg()
        },
        miningIcon: function () {
            return feather.icons['percent'].toSvg()
        },
        addWalletIcon: function () {
            return feather.icons['plus'].toSvg()
        }
    },
    methods: {
    getUserNodes(){
        const self = this;
        axios.get('crawledNodes', {})
                .then((crawledNodes) => {
                axios.get('nodes', {})
                .then((nodes) => {
                    let networkControl = (nodes.data.length/crawledNodes.data.length)*100
                    self.userNodes = nodes.data.length
                    self.networkControl = networkControl.toFixed(2)
                })
                })
    },
    addWalletModal(){
        const self = this;
        self.addWalletDialog = true
    },
    close(){
        const self = this;
        self.addWalletDialog = false
    },
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
    removeWallet(walletAddr) {
        let wallet = null;
        this.wallets.forEach(function(singleWallet) {
             if (singleWallet.address == walletAddr){
                 wallet = singleWallet;
             }
        });
        const self = this;
        if(wallet){
            let id = wallet.id
            axios.delete('walletAddresses/'+id, {
                    })
            .then((response) => {
                this.getWalletsBalance()
            })
        }
    },
    getDailyBlocks(){

    },
    getWalletsBalance(){
        const self = this;
        self.networth = 0
        axios.get('https://min-api.cryptocompare.com/data/price?fsym=NKN&tsyms=USD')
        .then(price => {
            self.nknPrice = price.data.USD

        axios.get('walletAddresses/', {
            })
            .then((response) => {
                for(let i in response.data){
                    response.data[i].balanceUsd = Number((response.data[i].balance*self.nknPrice/5).toFixed(0))
                    self.networth += response.data[i].balanceUsd
                    response.data[i].preview = response.data[i].label.charAt(0)
                }
                self.wallets = response.data
                self.select = response.data[0]
                self.currentId = self.select.id

                let userTotalBlocks = 0
                let miningPercent = 0
                self.miningPercent = 0
                //Getting total blocks mined today
                axios.get('statistics/daily/blocks')
                .then(blocks => {
                    self.dailyBlocks = blocks.data[0].count

                    //getting sum of blocks mined by all user wallets today
                    for(let i =0; i< self.wallets.length; i++){
                        axios.get('walletAddresses/'+self.wallets[i].id+'/miningOutputDaily').then(function(addr){
                            if(addr.data.length > 0){
                                userTotalBlocks += addr.data[0].count
                                miningPercent = (userTotalBlocks/self.dailyBlocks*100)
                                self.miningPercent = miningPercent.toFixed(2)
                            }
                        })
                    }
                })
            })
        })
            .catch((error) =>{
            })
            self.loader = false;
        }
    
    }
};
</script>