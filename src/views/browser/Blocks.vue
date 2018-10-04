<template>
	<div>
	
		<page-title-bar></page-title-bar>
		<v-container grid-list-xl pt-0>
			<v-layout row wrap>
				<app-card
					customClasses="mb-30"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
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
										<td>{{ props.item.transactions_count }}</td>
										<td>{{ props.item.header.signer }}</td>
										<td>{{ $moment(props.item.header.timestamp).fromNow() }}</td>
									</template>
								</v-data-table>
					</div>
				</app-card>
			</v-layout>
		</v-container>
	
    </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      loader: true,
	  	latestBlocks: [],
	  	pagination: {
      	page: 1,
      	rowsPerPage: 25,
      	totalItems: 0
      },
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
	mounted: function(){
		this.getLatestBlocks();
	},
	watch: {

	},
  methods: {
    getLatestBlocks() {
      const self = this;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get('https://nknx.org/api/blocks/?latest=30').then(function(response){
				self.latestBlocks= response.data;
				self.pagination.page = response.data;
        self.loader= false
      });
      
    }
  }
};
</script>
