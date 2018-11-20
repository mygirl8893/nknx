<template>
   <div class="mt-4 visitor-area-chart">
   	<div class="w-100 px-4 mb-4">
	<h4>{{$t('message.miningStats')}}</h4>
	<v-select
          v-model="select"
          :hint="`$t('message.wallet')`"
          :items="wallets"
          item-text="label"
          item-value="label"
          label="Wallet"
          persistent-hint
          return-object
          outline
          @change='getId(select.id)'
          
        ></v-select>

   	</div>
		
		<div class="px-4 pos-relative">
			<WalletChart :currentId='currentId' :height="220"></WalletChart>
		</div>
	</div>
</template>

<script>
import WalletChart from "Components/Charts/WalletChart";
import axios from "axios";
export default {
  components: {
    WalletChart
	},
	props: ['wallets'],
	destroyed () {
		clearInterval(this.interval);
	},
	mounted: function(){
		const self = this;
		self.select = self.wallets[0]
		self.loader = false;
	},
	created: function(){

	},
	data(){
		return {
			interval:null,
			nknPrice: 0,
			select: "",
			currentId: 0

		}
	},
	methods: {
        getId(id){
        	const self = this;
			self.currentId = id
        }
	}
};
</script>

