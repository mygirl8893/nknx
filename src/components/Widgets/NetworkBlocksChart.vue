<template>
   <div class="mt-4 visitor-area-chart">
   	<div class="w-100 px-4 mb-4">
	<h3>{{$t('message.networkBlockStats')}}: {{avgBlocks}}</h3>
   	</div>
		
		<div class="px-4 pos-relative">
			<NetworkBlocksChart :height="220"></NetworkBlocksChart>
		</div>
	</div>
</template>

<script>
import NetworkBlocksChart from "Components/Charts/NetworkBlocksChart";
import axios from "axios";
export default {
  components: {
    NetworkBlocksChart
	},
	destroyed () {
		clearInterval(this.interval);
	},
	mounted: function(){
		const self = this;
		self.loader = false;
		let avgBlocks = []
		let avgBlocksCount = 0
		axios.get('statistics/daily/blocks').then(function(blocks){
        blocks.data.forEach(function(entry) {
             avgBlocks.push(entry.count)
        });
        avgBlocks = avgBlocks.slice(0,14)
        avgBlocks.reverse()
        for(let i in avgBlocks){
        	avgBlocksCount += avgBlocks[i]
        }
        self.avgBlocks = (avgBlocksCount/avgBlocks.length).toFixed(0)
		})
	},
	data(){
		return {
			interval:null,
			nknPrice: 0,
			select: "",
			currentId: 0,
			avgBlocks: 0

		}
	},
	methods: {

	}
};
</script>

