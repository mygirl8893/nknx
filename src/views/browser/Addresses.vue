<template>
	<div>
	
		<page-title-bar></page-title-bar>
		<v-container grid-list-xl pt-0>
			<v-layout row wrap>
				<app-card
					customClasses="mb-30 full-width"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
					<v-layout row wrap>
						<v-flex xs12>
    						<app-section-loader :status="loader"></app-section-loader>
								<v-data-table
									:items="latestAddresses"
									hide-actions
								>
									<template slot="headers" slot-scope="props">
												<tr>
													<th>{{ $t('message.address') }}</th>
													<th>{{ $t('message.firstTransaction') }}</th>
													<th>{{ $t('message.latestTransaction') }}</th>
													<th>{{ $t('message.transactions') }}</th>
												</tr>
											</template>
											<template slot="items" slot-scope="props">
										<tr>
										<td>
											<router-link :to="{ path: '/address/'+props.item.address}">{{ props.item.address }}</router-link>
										</td>
										<td>{{ $moment(props.item.first_transaction).fromNow() }}</td>
										<td>{{ $moment(props.item.last_transaction).fromNow() }}</td>
										<td>{{ props.item.transactions}}</td>
										</tr>
											</template>

								</v-data-table>
							</v-flex>
					</v-layout>
					<v-layout row wrap justify-center>
									<v-btn v-on:click.native="getPrevAddressesPage" :disabled="!prev_page" small fab color="primary">
										<v-icon>zmdi-chevron-left</v-icon>
									</v-btn>
									<span style="padding: 15px;">{{current_page}}</span>
									<v-btn v-on:click.native="getNextAddressesPage" :disabled="!next_page" small fab color="primary">
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
			latestAddresses: [],
    };
  },
	mounted: function(){
		this.getLatestAddresses();
	},
	watch: {

	},
  methods: {
    getLatestAddresses() {
      const self = this;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get('addresses').then(function(response){
				self.latestAddresses = response.data.data;
			  self.next_page = response.data.next_page_url;
				self.prev_page = response.data.prev_page_url;
				self.current_page = response.data.current_page;
        self.loader= false
      });
      
		},
		getNextAddressesPage() {
			const self = this;
			this.loader = true;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get(this.next_page).then(function(response){
				self.next_page = response.data.next_page_url;
				self.prev_page = response.data.prev_page_url;
				self.current_page = response.data.current_page;
				self.latestAddresses= response.data.data;
        self.loader= false
      });
		},
		getPrevAddressesPage() {
			const self = this;
			this.loader = true;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get(this.prev_page).then(function(response){
				self.next_page = response.data.next_page_url;
				self.prev_page = response.data.prev_page_url;
				self.current_page = response.data.current_page;
				self.latestAddresses= response.data.data;
        self.loader= false
      });
    }		

  }
};
</script>

