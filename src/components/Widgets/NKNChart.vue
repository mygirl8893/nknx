<template>
   <div class="mt-4 visitor-area-chart">
		<div class="d-custom-flex justify-space-between px-4 mb-40 label-wrap">
			<h3>Market</h3>
			<div class="d-custom-flex w-50 w-xs-full" style='border-right: 2px solid #E1E1E5; margin-bottom: 30px'>
				<div class="w-20 d-md-half-block">
					<p class="fs-12 gray-dark--text fw-semi-bold mb-15">{{$t('message.marketcap')}}</p>
					<h4 class="blue-dark--text mb-0">${{nknCap}}M</h4>
				</div>
				<div class="w-20 d-md-half-block">
					<p class="fs-12 gray-dark--text fw-semi-bold mb-15">{{$t('message.dailyVolume')}}</p>
					<h4 class="blue-dark--text mb-0">${{nknVolume}}K</h4>
				</div>
				<div class="w-20 d-md-half-block">
					<p class="fs-12 gray-dark--text fw-semi-bold mb-15">{{$t('message.marketRank')}}</p>
					<h4 class="blue-dark--text mb-0">#{{nknRank}}</h4>
				</div>
				<div class="w-20 d-md-half-block">
					<p class="fs-12 gray-dark--text fw-semi-bold mb-15">{{$t('message.change24')}}</p>
					<h4 class="mb-0" v-bind:class="priceClass">{{nkn24}}%</h4>
				</div>
			</div>
			<div class="d-custom-flex w-20 w-xs-full">
				<div class="w-50 d-md-full w-xs-full">
					<p class="fs-12 gray-dark--text fw-semi-bold mb-15">NKN/ETH</p>
					<h4 class="orange-gradient--text mb-0">ETH {{nknETH}}</h4>
				</div>
				<div class="w-50 d-md-full w-xs-full">
					<p class="fs-12 gray-dark--text fw-semi-bold mb-15">NKN/USD</p>
					<h4 class="blue-gradient--text mb-0">$ {{nknUSD}}</h4>
				</div>
			</div>
		</div>
		<div class="px-4 pos-relative">
			<NKNChart 
				v-if="!loading"
				:height="220"       
				:chartdata="chartdata"/>
		</div>
	</div>
</template>

<script>
import NKNChart from "Components/Charts/NKNChart";
import axios from "axios";
import { Timeouts } from "Constants/timeouts";
export default {
  	components: {
    	NKNChart
	},
	mounted () {
		this.getMarketPrice();
		this.interval = setInterval(this.getMarketPrice, Timeouts.short);
		var self=this;
		try {
			axios.get('https://min-api.cryptocompare.com/data/histoday?fsym=NKN&tsym=USD&limit=7').then(function(responseUSD){
				responseUSD.data.Data.forEach(function(entry) {
					self.chartdata.days.push(self.$moment.unix(entry.time));
					self.chartdata.priceUSD.push(entry.open);
				});

				axios.get('https://min-api.cryptocompare.com/data/histoday?fsym=NKN&tsym=ETH&limit=7').then(function(responseETH){
					responseETH.data.Data.forEach(function(entry) {
						self.chartdata.priceETH.push(entry.open);
					});
					self.loading=false;
				});
			});
		} catch (e) {
			console.error(e)
		}
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

                    if(self.nkn24 < 0){
                    	self.priceClass = 'red-main--text'
                    }else{
                    	self.priceClass = 'green-main--text'
                    }
                })
                .catch(function(error){
                	self.nknRank = 'error';
                    self.nknCap = 'error';
                    self.nknVolume = 'error';
                    self.nkn24 = 'error';
                    self.nknWeekly = 'error';
                })

		}
	},
	destroyed () {
		clearInterval(this.interval);
	},

	data(){
		return {
			loading: true,
			chartdata:{
				days : [],
				priceUSD :[],
				priceETH :[]
			},
			interval:null,
			nknUSD: 0,
			nknETH: 0,
			nknRank: 0,
			nknCap: 0,
			nknVolume: 0,
			nkn24: 0,
			nknWeekly: 0,
			priceClass: "green-main--text"
		}
	}
};
</script>

