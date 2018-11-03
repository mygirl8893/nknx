<template>
	<div>
		<page-title-bar></page-title-bar>
		<v-container grid-list-xl pt-0>
			<v-layout row wrap>
				<app-card
					customClasses="mb-30"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
                <app-section-loader :status="loader"></app-section-loader>
                    <template v-if="!loader && address">
                        <v-expansion-panel class="mb-4" v-model="openGeneral">
                            <v-expansion-panel-content>
                            <div slot="header">{{$t('message.generalInformation')}}</div>
                            <div style="padding:15px;" v-if="address">
        
                                
                                <v-layout row wrap>
                                    <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.address') }}
                                    </v-flex>
                                    <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        {{address.address}}
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.balance') }}
                                    </v-flex>
                                    <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        {{walletbalance}} NKN
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.firstTransaction') }}
                                    </v-flex>
                                    <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        {{$moment(address.first_transaction).format('MMMM Do YYYY, h:mm:ss a')}}
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.latestTransaction') }}
                                    </v-flex>
                                    <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        {{$moment(address.last_transaction).format('MMMM Do YYYY, h:mm:ss a')}} 
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.transactions') }}
                                    </v-flex>
                                    <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        {{address.transactions}} 
                                    </v-flex>
                                </v-layout>
                              
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel class="mb-4" v-model="openTransactions">
                            <v-expansion-panel-content>
                            <div slot="header">{{$t('message.transactions')}}</div>
                            <div style="padding:15px;" v-if="address">
        
                                <div v-if="transactionLoader" style="position:relative;padding:25px;">
                                    <app-section-loader :status="transactionLoader"></app-section-loader>
                                </div>

                                <v-layout v-if="latestTransactions && !transactionLoader" row wrap>
                                    <v-flex xs12 style="padding: 1rem 1.25rem;font-weight:bold;">
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
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel class="mb-4" v-model="openTransfers">
                            <v-expansion-panel-content>
                            <div slot="header">{{$t('message.transfers')}}</div>
                                <div v-if="transferLoader" style="position:relative;padding:25px;">
                                    <app-section-loader :status="transferLoader"></app-section-loader>
                                </div>

                                <v-layout v-if="latestTransfers && !transferLoader" row wrap>
                                    <v-flex xs12 style="padding: 1rem 1.25rem;font-weight:bold;">
                                       <v-data-table
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
                                                <tr :key="output.id" v-for="output in props.item.outputs">
                                                    <td>
                                                        <span v-if="$route.params.address == props.item.sender">-</span>
                                                        <span v-if="$route.params.address == output.address">+</span>
                                                        {{ output.value }} NKN
                                                    </td>
                                                    <td><router-link :to="{ path: '/transaction/'+props.item.hash}">{{ props.item.hash }}</router-link></td>
                                                    <td v-if="$route.params.address == props.item.sender">{{$t('message.thisWallet')}}</td><td v-else>{{ props.item.sender }}</td>
                                                    <td v-if="$route.params.address == output.address">{{$t('message.thisWallet')}}</td><td v-else>{{ output.address }}</td>
                                                    <td><router-link :to="{ path: '/block/height/'+props.item.block.header.height }">{{ props.item.block.header.height }}</router-link></td>
                                                    <td>{{ $moment(props.item.block.header.timestamp).fromNow() }}</td>
                                                </tr>
                                            </template>
                                    </v-data-table>
                                    </v-flex>

                                </v-layout>


                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </template>
                    <template v-if="!loader && !address">
                        {{$t('message.noAddressFound')}}
                    </template>
				</app-card>
			</v-layout>
		</v-container>
	</div>
</template>
<script>
import axios from "axios"


export default {
  data() {
    return {
      openGeneral:0,
      openTransactions:null,
      openTransfers:null,
      loader:true,
      transactionLoader:true,
      transferLoader:true,
      latestTransfers:[],
      latestTransactions:[],
      address: null,
      error:false,
      walletbalance:0
    };
  },
  mounted() {
    self = this;
    this.error = false;
    //Call to NKN-API https://github.com/CrackDavid/nkn-api
    axios.get("https://nknx.org/api/addresses/"+this.$route.params.address).then(function(response){
        self.address = response.data;
        console.log(self.address);
        self.loader=false;
    }).catch(function(error) {
        self.loader=false;
        self.error = true;
    });

    axios.post('https://nknx.org:30003',{
		"jsonrpc": "2.0",
		"method":  "getunspendoutput",
		"params": {
            "address" : this.$route.params.address, 
            "assetid" : "4945ca009174097e6614d306b66e1f9cb1fce586cb857729be9e1c5cc04c9c02"
        },
		"id": 1
	}).then(function(response){
        
        response.data.result.forEach(function(unspendoutput) {
            self.walletbalance = self.walletbalance + Number(unspendoutput.Value);
        });
    });

    self.transactionLoader= true;
    //Call to NKN-API https://github.com/CrackDavid/nkn-api
    axios.get('https://nknx.org/api/transactions/?latest=5&txType=16&withoutpayload=true&address='+this.$route.params.address).then(function(response){
        self.latestTransfers = response.data;
        self.transferLoader= false
    });

    self.transferLoader= true;
    axios.get('https://nknx.org/api/transactions/?latest=5&withoutpayload=true&txType=0,16,66&address='+this.$route.params.address).then(function(response){
        self.latestTransactions = response.data;
        self.transactionLoader= false
    });
  },
  methods: {
  }
};
</script>