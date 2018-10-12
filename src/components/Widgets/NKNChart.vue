<template>
   <div class="mt-4 visitor-area-chart">
		<div class="d-custom-flex justify-space-between px-4 mb-4 label-wrap">
			<h4>Market</h4>
			<div class="d-custom-flex w-50 w-xs-full">
				<div class="w-20 d-md-half-block w-xs-full">
					<h4 class="green--text mb-0">${{nknCap}}M</h4>
					<p class="fs-12 grey--text mb-0">Marketcap</p>
				</div>
				<div class="w-20 d-md-half-block w-xs-full">
					<h4 class="green--text mb-0">${{nknVolume}}K</h4>
					<p class="fs-12 grey--text mb-0">Daily Bolume</p>
				</div>
				<div class="w-20 d-md-half-block w-xs-full">
					<h4 class="green--text mb-0">#{{nknRank}}</h4>
					<p class="fs-12 grey--text mb-0">Market Rank</p>
				</div>
				<div class="w-20 d-md-half-block w-xs-full">
					<h4 class="green--text mb-0">{{nkn24}}%</h4>
					<p class="fs-12 grey--text mb-0">Change 24 hours</p>
				</div>
			</div>
			<div class="d-custom-flex w-20 w-xs-full">
				<div class="w-50 d-md-full w-xs-full">
					<h4 class="secondary--text mb-0">ETH {{nknETH}}</h4>
					<p class="fs-12 grey--text mb-0">NKN/ETH</p>
				</div>
				<div class="w-50 d-md-full w-xs-full">
					<h4 class="primary--text mb-0">$ {{nknUSD}}</h4>
					<p class="fs-12 grey--text mb-0">NKN/USD</p>
				</div>
			</div>
		</div>
		<div class="px-4 pos-relative">
			<NKNChart :height="220"></NKNChart>
		</div>
	</div>
</template>

<script>
import NKNChart from "Components/Charts/NKNChart";
import axios from "axios";
export default {
  components: {
    NKNChart
	},
	methods:{
		getMarketPrice(){
			var self = this;
			axios.get("https://min-api.cryptocompare.com/data/price?fsym=NKN&tsyms=USD,ETH").then(function(response){
				self.nknUSD = response.data.USD;
				self.nknETH = response.data.ETH
			}).catch(function(error) {
				console.log(error);
				self.nknUSD  = 'error';
				self.nknETH  = 'error';
			})

			axios.get('https://api.coinmarketcap.com/v2/ticker/2780/')
                .then(response => {
                    self.nknRank = response.data.data.rank
                    self.nknCap = ((response.data.data.quotes.USD.market_cap) / 1000000).toFixed(2)
                    self.nknVolume = ((response.data.data.quotes.USD.volume_24h) / 1000).toFixed(2)
                    self.nkn24 = response.data.data.quotes.USD.percent_change_24h
                    self.nknWeekly = response.data.data.quotes.USD.percent_change_7d
                })

		}
	},
	destroyed () {
		clearInterval(this.interval);
	},
	mounted: function(){

		this.getMarketPrice();
		this.interval = setInterval(this.getMarketPrice, 10000);

	},

	data(){
		return {
			interval:null,
			nknUSD: 0,
			nknETH: 0,
			nknRank: 0,
			nknCap: 0,
			nknVolume: 0,
			nkn24: 0,
			nknWeekly: 0
		}
	}
};
</script>

