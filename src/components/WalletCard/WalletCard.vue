<template>
    <div class="wallet-card">
        <div class="close-wallet" v-on:click="deleteCallback"><i class="zmdi zmdi-close"></i></div>
        <v-flex xs12>
            <span class="active">{{$t('message.activeWallet')}}</span>
            <span><router-link :to="{ path: '/address/'+address}">{{ address }}</router-link></span>
            <div class="balance">
                <i class="zmdi zmdi-eye"></i><span class="blue-gradient--text mb-0">{{balance}} NKN ≈ {{balanceUSD}} USD</span></div>
        </v-flex>
    </div>
</template>

<script>
import axios from "axios";
export default {
    props: {
        address: String,
        deleteCallback:null
    },
    data() {
      return {
          balance:0,
          balanceUSD:0,
          newbalance:0,
          nknPrice:0
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
					response.data.result.forEach(function(unspendoutput) {
						self.newbalance = self.newbalance + Number(unspendoutput.Value);
					});
                    self.balance = self.newbalance;
                    self.balanceUSD = (self.balance*self.nknPrice/5).toFixed(0)
				});

			}
		}

    },
    mounted() {
        this.getBalance();
        this.interval = setInterval(this.getBalance, 10000);
    },
   
}
</script>