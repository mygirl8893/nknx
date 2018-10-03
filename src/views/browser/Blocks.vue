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
									:total-items="pagination.totalItems"
									:pagination.sync="pagination"
									:rows-per-page-items="[5,10,25,50,100]"
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
  destroyed () {
		clearInterval(this.getLatestBlocks);
	},
	mounted: function(){
		this.getLatestBlocks();
	},
	watch: {
		pagination: {
		async handler () {
			this.loader = true;
			const rowsPerPage = this.pagination.rowsPerPage
			const pageNumber = this.pagination.page
			//Call to NKN-API https://github.com/CrackDavid/nkn-api
			const res = await axios.get(`https://nknx.org/api/blocks/?page=${pageNumber}&per_page=${rowsPerPage}`)
			this.latestBlocks = res.data.data
			this.loader = false;
		},
		deep: true
		}
	},
  methods: {
    getLatestBlocks() {
      const self = this;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get('https://nknx.org/api/blocks/').then(function(response){
		self.pagination.page = response.data.current_page;
      	self.pagination.rowsPerPage = response.data.per_page;
      	self.pagination.totalItems = response.data.total;
        self.latestBlocks = response.data.data;
        self.loader= false
      });
      
    }
  }
};
</script>
