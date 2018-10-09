<template>
	<div>
	
		<page-title-bar></page-title-bar>
		<v-container grid-list-xl pt-0>
			<v-layout row wrap>
				<app-card
					customClasses="mb-30"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
					<v-layout row wrap>
						<v-flex xs12>
									<app-section-loader :status="loader"></app-section-loader>
									<v-data-table
										:items="latestBlocks"
										hide-actions
									>
										<template slot="headers" slot-scope="props">
											<tr>
												<th>{{ $t('message.height') }}</th>
												<th>{{ $t('message.transactions') }}</th>
												<th style="width:50%;" class="hidden-sm-and-down">{{ $t('message.signer') }}</th>
												<th>{{ $t('message.created') }}</th>
											</tr>
										</template>
										<template slot="items" slot-scope="props">
											<td><router-link :to="{ path: '/block/height/'+props.item.header.height}">{{ props.item.header.height }}</router-link></td>
											<td>{{ props.item.transaction_count }}</td>
											<td class="hidden-sm-and-down">{{ props.item.header.signer }}</td>
											<td>{{ $moment(props.item.header.timestamp).fromNow() }}</td>
										</template>
									</v-data-table>
						</v-flex>
					</v-layout>
					<v-layout row wrap justify-center>
									<v-btn v-on:click.native="getPrevBlockPage" :disabled="!prev_page" small fab color="primary">
										<v-icon>zmdi-chevron-left</v-icon>
									</v-btn>
									<span style="padding: 15px;">{{current_page}}</span>
									<v-btn v-on:click.native="getNextBlockPage" :disabled="!next_page" small fab color="primary">
										<v-icon>zmdi-chevron-right</v-icon>
									</v-btn>
					</v-layout>
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
			next_page:null,
			prev_page:null,
			current_page:1,
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
	mounted: function(){
		this.getLatestBlocks();
	},
	watch: {

	},
  methods: {
    getLatestBlocks() {
      const self = this;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get('https://nknx.org/api/blocks/').then(function(response){
				self.next_page = response.data.next_page_url;
				self.prev_page = response.data.prev_page_url;
				self.current_page = response.data.current_page;
				self.latestBlocks= response.data.data;
        self.loader= false
      });
		},
		getNextBlockPage() {
			const self = this;
			this.loader = true;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get(this.next_page).then(function(response){
				self.next_page = response.data.next_page_url;
				self.prev_page = response.data.prev_page_url;
				self.current_page = response.data.current_page;
				self.latestBlocks= response.data.data;
        self.loader= false
      });
		},
		getPrevBlockPage() {
			const self = this;
			this.loader = true;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get(this.prev_page).then(function(response){
				self.next_page = response.data.next_page_url;
				self.prev_page = response.data.prev_page_url;
				self.current_page = response.data.current_page;
				self.latestBlocks= response.data.data;
        self.loader= false
      });
    }
  }
};
</script>
