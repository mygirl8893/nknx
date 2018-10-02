<template>
   <div class="table-responsive">
    <app-section-loader :status="loader"></app-section-loader>
		<v-data-table
			:headers="headers"
			:items="latestBlocks"
			hide-actions
		>
			<template slot="headers" slot-scope="props">
				<tr>
					<th class="text-xs-left fw-bold" v-for="header in props.headers" :key="header.text">
						{{ header.text }}
					</th>
				</tr>
			</template>
			<template slot="items" slot-scope="props">
				<td><router-link :to="{ path: '/block/height/'+props.item.header.height}">{{ props.item.header.height }}</router-link></td>
				<td>{{ props.item.transactions.length }}</td>
				<td>{{ props.item.header.signer }}</td>
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
      loader: true,
      latestBlocks: [],
      headers: [
        {
          text: "Height",
          sortable: false,
          value: "height"
        },
        {
          text: "Transactions",
          sortable: false,
          value: "transactions"
        },
        {
          text: "Block proposer",
          sortable: false,
          value: "signer"
        },
        {
          text: "Created",
          sortable: false,
          value: "timestamp"
        }
      ]
    };
  },
  destroyed () {
		clearInterval(this.getLatestBlocks);
	},
	mounted: function(){
		this.getLatestBlocks();
		setInterval(this.getLatestBlocks, 10000);
	},
  methods: {
    getLatestBlocks() {
      const self = this;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get('http://nknx.org/api/blocks/?latest=5').then(function(response){
        self.latestBlocks = response.data;
        self.loader= false
      });
      
    }
  }
};
</script>
