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
									:items="latestTransactions"
									hide-actions
								>
									<template slot="headers" slot-scope="props">
												<tr>
													<th class="text-xs-left fw-bold" v-for="header in props.headers" :key="header.value">
														{{ $t('message.'+header.text) }}
													</th>
												</tr>
											</template>
											<template slot="items" slot-scope="props">
										<tr @click="props.expanded = !props.expanded">
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
										<td>{{ props.item.hash }}</td>
										<td>{{ props.item.block.header.height }}</td>
										<td>{{ $moment(props.item.block.header.timestamp).fromNow() }}</td>
										</tr>
											</template>
									<template slot="expand" slot-scope="props">
														<v-card flat>
															<v-card-text>Peek-a-boo!</v-card-text>
														</v-card>
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
	  latestTransactions: [],
	  pagination: {
		page: 1
	  },

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
      axios.get('https://nknx.org/api/transactions/?latest=30&withoutpayload=true').then(function(response){
        self.latestTransactions = response.data;
        self.loader= false
      });
      
    }
  }
};
</script>

