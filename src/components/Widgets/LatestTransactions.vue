<template>
   <div class="table-responsive">
    <app-section-loader :status="loader"></app-section-loader>
		<v-data-table
			:items="latestTransactions"
      item-key="hash"
			hide-actions
		>
    	<template slot="headers" slot-scope="props">
				<tr>
          <th>{{ $t('message.txType') }}</th>
          <th style="width:40%;">{{ $t('message.hash') }}</th>
          <th>{{ $t('message.height') }}</th>
          <th>{{ $t('message.created') }}</th>
				</tr>
			</template>
			<template slot="items" slot-scope="props">
        <tr>
          <td>
            <span v-if="props.item.txType == 66">
              {{$t('message.signatureChainTransaction')}}
            </span>
            <span v-else-if="props.item.txType == 0">
              {{$t('message.miningReward')}}
            </span>
            <span v-else-if="props.item.txType == 16">
              {{$t('message.transfer')}}
            </span>
            

            <span v-else>
              {{ props.item.txType }}
            </span>

          </td>
          <td><router-link :to="{ path: '/transaction/'+props.item.hash}">{{ props.item.hash }}</router-link></td>
          <td><router-link :to="{ path: '/block/height/'+props.item.block.height }">{{ props.item.block.height }}</router-link></td>
          <td>{{ $moment(props.item.block.timestamp).fromNow() }}</td>
        </tr>
			</template>
		</v-data-table>
	</div>
</template>

<script>
import axios from "axios";
import { Timeouts } from "Constants/timeouts";

export default {
  data() {
    return {
      interval :null,
      loader: true,
      latestTransactions: []
    };
  },
  destroyed () {
    clearInterval(this.interval);
	},
	mounted: function(){
		this.getLatestTransactions();
		this.interval = setInterval(this.getLatestTransactions, Timeouts.short/2);
	},
  methods: {
    getLatestTransactions() {
      const self = this;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get('transactions/?latest=5&withoutpayload=true&withoutattributes=true&withoutinputs=true&txType=0,16,66').then(function(response){
        self.latestTransactions = response.data;
        self.loader= false
      });
      
    }
  }
};
</script>

