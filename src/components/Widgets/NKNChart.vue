<template>
   <div class="mt-4 visitor-area-chart">
		<div class="d-custom-flex justify-space-between px-4 mb-4 label-wrap">
			<h4>Market</h4>
			<div class="d-custom-flex justify-space-between w-30">
				<div class="w-50">
					<h4 class="secondary--text mb-0">ETH {{nknETH}}</h4>
					<p class="fs-12 grey--text mb-0">NKN/ETH</p>
				</div>
				<div class="w-50">
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

		}
	},
	destroyed () {
		clearInterval(this.getMarketPrice);
	},
	mounted: function(){

		this.getMarketPrice();
		setInterval(this.getMarketPrice, 10000);

	},

	data(){
		return {
			nknUSD: 0,
			nknETH: 0,
		}
	}
};
</script>

