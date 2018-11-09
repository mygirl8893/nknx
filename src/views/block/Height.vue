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
                    <template>
                        <v-expansion-panel class="mb-4" v-model="openGeneral">
                            <v-expansion-panel-content>
                            <div slot="header">{{$t('message.generalInformation')}}</div>
                            <div style="padding:15px;" v-if="block">
                                <v-layout row wrap>
                                    <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.hash') }}
                                    </v-flex>
                                    <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        {{block.hash}}
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.height') }}
                                    </v-flex>
                                    <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        {{block.header.height}} 
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.timestamp') }}
                                    </v-flex>
                                    <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        {{$moment(block.header.timestamp).format('MMMM Do YYYY, h:mm:ss a')}}
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.signer') }}
                                    </v-flex>
                                    <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        {{block.header.signer}} 
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.transactions') }}
                                    </v-flex>
                                    <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        {{block.transaction_count}} 
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.prevBlockHash') }}
                                    </v-flex>
                                    <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        <router-link :to="{ path: '/block/hash/'+block.header.prevBlockHash}">{{ block.header.prevBlockHash }}</router-link>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.nextBlockHash') }}
                                    </v-flex>
                                    <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        <router-link :to="{ path: '/block/hash/'+block.header.nextBlockHash}">{{ block.header.nextBlockHash }}</router-link>
                                    </v-flex>
                                </v-layout>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel class="mb-4" v-model="openTransactions">
                            <v-expansion-panel-content>
                            <div slot="header">{{$t('message.transactions')}}</div>
                            <div style="padding:15px;" v-if="block">
        
                                <app-section-loader :status="loader"></app-section-loader>
                                <v-layout row wrap>
                                    <v-flex xs12 style="padding: 1rem 1.25rem;font-weight:bold;">
                                       <v-data-table
                                            :items="block.transactions"
                                            item-key="hash"
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
                                        <td>{{ block.header.height }}</td>
                                        <td>{{ $moment(block.header.timestamp).fromNow() }}</td>
                                        </tr>
                                            </template>
                                        </v-data-table>
                                    </v-flex>

                                </v-layout>

                            </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
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
      loader:true,
      block: null,
      openGeneral:0,
      openTransactions:null,
    };
  },
  mounted() {
      self = this;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get("blocks/"+this.$route.params.height).then(function(response){
          self.block = response.data[0];
          self.loader = false;
      });
  },
  methods: {
  }
};
</script>