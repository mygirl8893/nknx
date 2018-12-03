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
									:items="latestTransactions"
									hide-actions
								>
									<template slot="headers" slot-scope="props">
												<tr>
													<th>{{ $t('message.txType') }}</th>
													<th style="width:50%;" class="hidden-sm-and-down">{{ $t('message.hash') }}</th>
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
										<td class="hidden-sm-and-down"><router-link :to="{ path: '/transaction/'+props.item.hash}">{{ props.item.hash }}</router-link></td>
										<td><router-link :to="{ path: '/block/height/'+props.item.block.height }">{{ props.item.block.height }}</router-link></td>
										<td>{{ $moment(props.item.block.timestamp).fromNow() }}</td>
										</tr>
											</template>

								</v-data-table>
							</v-flex>
					</v-layout>
					<v-layout row wrap justify-center>
									<v-btn v-on:click.native="getPrevTransactionsPage" :disabled="!prev_page" small fab color="primary">
										<v-icon>zmdi-chevron-left</v-icon>
									</v-btn>
									<span style="padding: 15px;">{{current_page}}</span>
									<v-btn v-on:click.native="getNextTransactionsPage" :disabled="!next_page" small fab color="primary">
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
			latestTransactions: [],

      headers: [
        {
          text: "txType",
          sortable: false,
          value: "tx"
        },
        {
          text: "hash",
          sortable: false,
          value: "hash"
        },
        {
          text: "height",
          sortable: false,
          value: "height"
        },
        {
          text: "created",
          sortable: false,
          value: "timestamp"
        }
      ]
    };
  },
	mounted: function(){
		this.getLatestTransactions();
	},
	watch: {

	},
  methods: {
    getLatestTransactions() {
      const self = this;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get('transactions/?withoutpayload=true&withoutinputs=true&withoutattributes=true&withoutoutputs=true&txType=0,16,66').then(function(response){
				self.latestTransactions = response.data.data;
			  self.next_page = response.data.next_page_url;
				self.prev_page = response.data.prev_page_url;
				self.current_page = response.data.current_page;
        self.loader= false
      });
      
		},
		getNextTransactionsPage() {
			const self = this;
			this.loader = true;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get(this.next_page+'&withoutpayload=true&withoutinputs=true&withoutattributes=true&withoutoutputs=true&txType=0,16,66').then(function(response){
				self.next_page = response.data.next_page_url;
				self.prev_page = response.data.prev_page_url;
				self.current_page = response.data.current_page;
				self.latestTransactions= response.data.data;
        self.loader= false
      });
		},
		getPrevTransactionsPage() {
			const self = this;
			this.loader = true;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get(this.prev_page+'&withoutpayload=true&withoutinputs=true&withoutattributes=true&withoutoutputs=true&txType=0,16,66').then(function(response){
				self.next_page = response.data.next_page_url;
				self.prev_page = response.data.prev_page_url;
				self.current_page = response.data.current_page;
				self.latestTransactions= response.data.data;
        self.loader= false
      });
    }		

  }
};
</script>

