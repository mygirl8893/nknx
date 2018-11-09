<template>
   <div class="mt-4 visitor-area-chart">
   	<div class="w-100 px-4 mb-4">
	<h2>{{$t('message.networkTxStats')}}: {{avgTx}}</h2>
   	</div>
		
		<div class="px-4 pos-relative">
			<NetworkTransactionsChart :height="220"></NetworkTransactionsChart>
		</div>
	</div>
</template>

<script>
import NetworkTransactionsChart from "Components/Charts/NetworkTransactionsChart";
import axios from "axios";
export default {
  components: {
    NetworkTransactionsChart
	},
	destroyed () {
		clearInterval(this.interval);
	},
	mounted: function(){
		const self = this;
		self.loader = false;
		let avgTx = []
		let avgTxCount = 0
		axios.get('statistics/daily/transactions').then(function(tx){
        tx.data.forEach(function(entry) {
             avgTx.push(entry.count)
        });
        avgTx = avgTx.slice(0,14)
        avgTx.reverse()
        for(let i in avgTx){
        	avgTxCount += avgTx[i]
        }
        self.avgTx = (avgTxCount/avgTx.length).toFixed(0)
		})
	},
	data(){
		return {
			interval:null,
			nknPrice: 0,
			select: "",
			currentId: 0,
			avgTx: 0

		}
	},
	methods: {

	}
};
</script>

