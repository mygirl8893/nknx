<template>
   <div class="table-responsive">
    <app-section-loader :status="loader"></app-section-loader>
		<v-data-table
			:items="latestBlocks"
			hide-actions
		>
			<template slot="headers" slot-scope="props">
				<tr>
          <th>{{ $t('message.height') }}</th>
          <th>{{ $t('message.transactions') }}</th>
          <th style="width:40%;" class="hidden-sm-and-down">{{ $t('message.signer') }}</th>
          <th>{{ $t('message.created') }}</th>
				</tr>
			</template>
			<template slot="items" slot-scope="props">
				<td><router-link :to="{ path: '/block/height/'+props.item.header.height}">{{ props.item.header.height }}</router-link></td>
				<td>{{ props.item.transaction_count}}</td>
				<td class="hidden-sm-and-down">{{ props.item.header.signer }}</td>
        <td>{{ $moment(props.item.header.timestamp).fromNow() }}</td>
			</template>
		</v-data-table>
	</div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      interval:null,
      loader: true,
      latestBlocks: [],
    };
  },
  destroyed () {
		clearInterval(this.interval);
	},
	mounted: function(){
		this.getLatestBlocks();
		this.interval = setInterval(this.getLatestBlocks, 10000);
	},
  methods: {
    getLatestBlocks() {
      const self = this;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get('blocks/?latest=5').then(function(response){
        self.latestBlocks = response.data;
        self.loader= false
      });
      
    }
  }
};
</script>
