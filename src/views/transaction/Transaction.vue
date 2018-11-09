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
                        
                        <v-expansion-panel v-if="!loader" class="mb-4" :value="0">
                            <v-expansion-panel-content>
                            <div slot="header">
                                <span v-if="transaction.txType == 66">
								    {{$t('message.signatureChainTransaction')}}
								</span>
								<span v-else-if="transaction.txType == 0">
									{{$t('message.miningReward')}}
								</span>
								<span v-else-if="transaction.txType == 16">
									{{$t('message.transfer')}}
								</span>
                                 - {{$t('message.generalInformation')}}
                                </div>
                            <div style="padding:15px;">
        
                                
                                <v-layout row wrap>
                                    <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.hash') }}
                                    </v-flex>
                                    <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        {{transaction.hash}}
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.timestamp') }}
                                    </v-flex>
                                    <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        {{$moment(transaction.block.header.timestamp).format('MMMM Do YYYY, h:mm:ss a')}}
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.block') }}
                                    </v-flex>
                                    <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        <router-link :to="{ path: '/block/height/'+transaction.block.header.height}">{{ transaction.block.header.height }}</router-link> 
                                    </v-flex>
                                </v-layout>
                                <v-layout v-if="transaction.txType == 0" row wrap>
                                    <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.miningAddress') }}
                                    </v-flex>
                                    <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        <router-link :to="{ path: '/address/'+transaction.outputs[0].address}">{{ transaction.outputs[0].address}}</router-link> 
                                    </v-flex>
                                </v-layout>
                                <v-layout v-if="transaction.txType == 0" row wrap>
                                    <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.miningReward') }}
                                    </v-flex>
                                    <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        {{transaction.outputs[0].value}} NKN
                                    </v-flex>
                                </v-layout>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                          <v-expansion-panel v-if="!loader" class="mb-4" v-model="payloadOpened">
                            <v-expansion-panel-content>
             
                            <div slot="header">{{$t('message.payload')}}</div>
                            <div style="padding:15px; " >
                                <div v-if="payloadloader" style="position:relative;padding:25px;">
                                    <app-section-loader :status="payloadloader"></app-section-loader>
                                </div>
                                
                                <v-layout v-if="!payload && !payloadloader" row wrap>
                                    <v-flex xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.noPayload') }}
                                    </v-flex>
                                </v-layout>
                                <v-layout v-if="payload" row wrap>
                                    <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.sigchain') }}
                                    </v-flex>
                                    <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        {{payload.sigchain}} 
                                    </v-flex>
                                </v-layout>
                                <v-layout v-if="payload" row wrap>
                                    <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.submitter') }}
                                    </v-flex>
                                    <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        {{payload.submitter}} 
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
      generalOpened:0,
      payloadOpened:null,
      payloadloader:true,
      loader:true,
      transaction: null, 
      payload:null
    };
  },
  mounted() {
      self = this;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get("transactions/"+this.$route.params.hash+'?withoutpayload=true').then(function(response){
          self.transaction = response.data[0];
          self.loader=false;
      });
  },
  watch:{
    payloadOpened: function (val) {
        if(val==0){
            this.getPayload();
        }
    },
    $route (to, from){
      this.loader=true;
      self = this;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get("transactions/"+this.$route.params.hash+'?withoutpayload=true').then(function(response){
          self.transaction = response.data[0];
          self.loader=false;
      });
    }
  }, 
  methods: {
      getPayload(){
        this.payloadloader=true;
        self = this;
        axios.get("payloads/"+this.transaction.id).then(function(response){
          self.payload = response.data[0];
          self.payloadloader=false;
        });
      }
  }
};
</script>