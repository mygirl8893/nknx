<template>
	<div>
		<page-title-bar></page-title-bar>
		<v-container grid-list-xl pt-0>
			<v-layout row wrap>
                
				<app-card
					customClasses="mb-30"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
                
                    <template>
                        <v-expansion-panel class="mb-4" value="1">
                            <v-expansion-panel-content>
                            <div slot="header">{{$t('message.generalInformation')}}</div>
                            <div style="padding:15px;">
        
                                <app-section-loader :status="loader"></app-section-loader>
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
                        <v-expansion-panel class="mb-4" value="1">
                            <v-expansion-panel-content>
                            <div slot="header">{{$t('message.transactions')}}</div>
                            <div style="padding:15px;">
        
                                <app-section-loader :status="loader"></app-section-loader>
                                <v-layout row wrap>
                                    <v-flex xs12 style="padding: 1rem 1.25rem;font-weight:bold;">
                                       <v-data-table
                                            :headers="headers"
                                            :items="block.transactions"
                                            item-key="hash"
                                            hide-actions
                                        >
                                        <template slot="headers" slot-scope="props">
                                                <tr>
                                                    <th class="text-xs-left fw-bold" v-bind:class="{ 'hidden-sm-and-down' : header.value=='hash' }" v-for="header in props.headers" :key="header.value">
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
                                        <td class="hidden-sm-and-down">{{ props.item.hash }}</td>
                                        <td>{{ block.header.height }}</td>
                                        <td>{{ $moment(block.header.timestamp).fromNow() }}</td>
                                        </tr>
                                            </template>
                                    <template slot="expand" slot-scope="props">
                                                        <v-card flat>
                                                            <v-card-text>Peek-a-boo!</v-card-text>
                                                        </v-card>
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
  mounted() {
      self = this;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get("https://nknx.org/api/blocks/"+this.$route.params.height).then(function(response){
          self.block = response.data[0];
          self.loader = false;
      });
  },
  methods: {
  }
};
</script>