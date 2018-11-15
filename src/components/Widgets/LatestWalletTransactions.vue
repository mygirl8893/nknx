<template>
    <div>
        <v-layout row wrap>
            <v-flex xs12 v-if="!$store.getters.selectedAddress">
                {{$t('message.transactionsNoWallet')}}
            </v-flex>
            <v-flex xs12 v-else>
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
							<td><router-link :to="{ path: '/block/height/'+props.item.block.header.height }">{{ props.item.block.header.height }}</router-link></td>
                            <td>{{ $moment(props.item.block.header.timestamp).fromNow() }}</td>
                            </tr>
                        </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </div>
</template>
<script>
import axios from "axios";
import { mapGetters } from 'vuex'
  export default {
	methods: {
		getLatestTransactions() {
			if(this.$store.getters.selectedAddress){
				const self = this;
                self.loader= true;
                
				//Call to NKN-API https://github.com/CrackDavid/nkn-api
				axios.get('transactions/?latest=5&withoutpayload=true&txType=0,16,66&withoutoutputs=true&withoutattributes=true&withoutinputs=true&address='+this.$store.getters.selectedAddress).then(function(response){
					self.latestTransactions = response.data;
					self.loader= false
				});
			}
		}
    },
    computed: {
        ...mapGetters({
        selectedAddress: 'selectedAddress'
        })
    },
    destroyed () {
        clearInterval(this.interval);
	},
	mounted: function(){
		this.getLatestTransactions();
		this.interval = setInterval(this.getLatestTransactions, 60000);
    },
    watch: {
        selectedAddress: function () {
            this.getLatestTransactions();
            if(!this.interval){
                this.interval = setInterval(this.getLatestTransactions, 60000);
            }
        }
    },
	data(){
		return {
            interval:null,
			latestTransactions:[],
			loader:false,


		}
	}
	
  }
</script>
