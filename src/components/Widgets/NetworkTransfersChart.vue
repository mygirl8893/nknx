<template>
   <div class="mt-4 visitor-area-chart">
   	<div class="w-100 px-4 mb-4">
	<h2>{{$t('message.networkTransfersStats')}}: {{avgTransfers}}</h2>
   	</div>
		
		<div class="px-4 pos-relative">
			<NetworkTransfersChart :height="220"></NetworkTransfersChart>
		</div>
	</div>
</template>

<script>
import NetworkTransfersChart from "Components/Charts/NetworkTransfersChart";
import axios from "axios";
export default {
  components: {
    NetworkTransfersChart
	},
	destroyed () {
		clearInterval(this.interval);
	},
	mounted: function(){
		const self = this;
		self.loader = false;
		let avgTransfers = []
		let avgTransfersCount = 0
		axios.get('https://nknx.org/api/statistics/daily/transfers').then(function(transfers){
        transfers.data.forEach(function(entry) {
             avgTransfers.push(entry.count)
        });
        avgTransfers = avgTransfers.slice(0,14)
        avgTransfers.reverse()
        for(let i in avgTransfers){
        	avgTransfersCount += avgTransfers[i]
        }
        self.avgTransfers = (avgTransfersCount/avgTransfers.length).toFixed(0)
		})
	},
	data(){
		return {
			interval:null,
			nknPrice: 0,
			select: "",
			currentId: 0,
			avgTransfers: 0

		}
	},
	methods: {

	}
};
</script>

