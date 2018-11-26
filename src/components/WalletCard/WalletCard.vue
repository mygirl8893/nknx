<template>
    <div class="wallet-card">
        <div class="close-wallet" @click="deleteCallback(address)" v-html="IconClose"></div>
        <v-flex xs12>
            <span class="active">{{$t('message.activeWallet')}}</span>
            <span><router-link :to="{ path: '/address/'+address}">{{ address }}</router-link></span>
            <div class="balance">
                <span v-html="IconEye" @click='showBalance' class="eye-toggle"></span><span v-if='isHidden != true' class="blue-gradient--text mb-0">{{balance}} NKN ≈ {{balanceUSD}} USD</span></div>
        </v-flex>
    </div>
</template>

<script>
import axios from "axios";
import feather from 'feather-icons'
export default {
    props: {
        address: String,
        deleteCallback: { type: Function }
    },
    data() {
      return {
          balance:0,
          balanceUSD:0,
          newbalance:0,
          nknPrice:0,
          isHidden: false,
          activeClass: "eye"
      }

    },
    watch:{
		address: function () {
			this.getBalance()
		}
	},
    computed: {
            IconClose: function () {
                return feather.icons['x'].toSvg()
            },
            IconEye: function () {
                if(this.activeClass === 'eye'){
                    return feather.icons['eye'].toSvg()
                } else{
                    return feather.icons['eye-off'].toSvg()
                }
                
            }
        },
    methods: {
        getBalance(){
			if(this.address){
                var self = this;
                axios.get('https://api.coinmarketcap.com/v2/ticker/2780/')
                .then(response => {
                    self.nknPrice = response.data.data.quotes.USD.price
                })
				axios.post('https://nknx.org:30003',{
					"jsonrpc": "2.0",
					"method":  "getunspendoutput",
					"params": {
						"address" : this.address, 
						"assetid" : "4945ca009174097e6614d306b66e1f9cb1fce586cb857729be9e1c5cc04c9c02"
					},
					"id": 1
				}).then(function(response){
					self.newbalance = 0;
                    if(response.data.result != null){
                        response.data.result.forEach(function(unspendoutput) {
                            self.newbalance = self.newbalance + Number(unspendoutput.Value);
                        });
                    }
                    self.balance = self.newbalance;
                    self.balanceUSD = (self.balance*self.nknPrice/5).toFixed(0)
				});

			}
		},
        showBalance(){
            const self = this;
            self.isHidden = !self.isHidden
            if(self.isHidden === false){
                self.activeClass = 'eye'
            } else{
                self.activeClass = 'eye-off'
            }
        }

    },
    mounted() {
        this.getBalance();
        this.interval = setInterval(this.getBalance, 10000);
    },
   
}
</script>