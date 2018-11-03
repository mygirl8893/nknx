<template>
    <div>
        <v-layout row wrap>
            <v-flex xs12 v-if="!$store.getters.walletfile">
                {{$t('message.transfersNoWallet')}}
            </v-flex>
            <v-flex xs12 v-else>
                    <app-section-loader :status="loader"></app-section-loader>
                    <v-data-table
                        :headers="headers"
                        :items="latestTransfers"
                        hide-actions
                    >
                        <template slot="headers" slot-scope="props">
                                <tr>
                                    <th>{{ $t('message.amount') }}</th>
                                    <th style="width:30%;" class="hidden-sm-and-down">{{ $t('message.hash') }}</th>
                                    <th style="width:20%;">{{ $t('message.from') }}</th>
                                    <th style="width:20%;">{{ $t('message.to') }}</th>
                                    <th>{{ $t('message.height') }}</th>
                                    <th>{{ $t('message.created') }}</th>
                                </tr>
                        </template>
                        <template slot="items" slot-scope="props">
                            <tr :key="output.id" v-for="output in props.item.outputs" v-if="output.address!==props.item.sender">
                                <td>
                                    <span v-if="$store.getters.walletfile.address == props.item.sender">-</span>
                                    <span v-if="$store.getters.walletfile.address == output.address">+</span>
                                    {{ output.value }} NKN
                                </td>
                                <td><router-link :to="{ path: '/transaction/'+props.item.hash}">{{ props.item.hash }}</router-link></td>
                                <td v-if="$store.getters.walletfile.address == props.item.sender">{{$t('message.yourWallet')}}</td><td v-else><router-link :to="{ path: '/address/'+props.item.sender }">{{ props.item.sender }}</router-link></td>
                                <td v-if="$store.getters.walletfile.address == output.address">{{$t('message.yourWallet')}}</td><td v-else><router-link :to="{ path: '/address/'+output.address }">{{ output.address }}</router-link></td>
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
		getLatestTransfers() {
			if(this.$store.getters.walletfile){
				const self = this;
				self.loader= true;
				//Call to NKN-API https://github.com/CrackDavid/nkn-api
				axios.get('https://nknx.org/api/transactions/?latest=5&txType=16&withoutpayload=true&address='+this.$store.getters.walletfile.address).then(function(response){
                    self.latestTransfers = response.data;
					self.loader= false
				});
			}
		}
    },
    destroyed () {
        clearInterval(this.interval);
	},
	mounted: function(){
		this.getLatestTransfers();
		this.interval = setInterval(this.getLatestTransfers, 60000);
    },
    computed: {
        ...mapGetters({
        walletfile: 'walletfile'
        })
    },
    watch: {
        walletfile: function () {
            this.getLatestTransfers();
            if(!this.interval){
                this.interval = setInterval(this.getLatestTransfers, 60000);
            }
        }
    },
	data(){
		return {
            interval:null,
			latestTransfers:[],
			loader:false,
			headers: [
				{
					text: "amount",
					sortable: false,
					value: "amount"
				},
				{
					text: "hash",
					sortable: false,
					value: "hash"
                },
                {
					text: "from",
					sortable: false,
					value: "from"
                },
                {
					text: "to",
					sortable: false,
					value: "to"
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

		}
	}
	
  }
</script>
