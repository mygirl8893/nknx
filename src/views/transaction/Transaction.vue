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
                                        {{$moment(transaction.block.timestamp).format('MMMM Do YYYY, h:mm:ss a')}}
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                        {{ $t('message.block') }}
                                    </v-flex>
                                    <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        <router-link :to="{ path: '/block/height/'+transaction.block.height}">{{ transaction.block.height }}</router-link> 
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
                                <v-layout row wrap>
                                    <v-flex xl12 lg12 md12 sm12 xs12 b-50 style="padding: 1rem 1.25rem;">
                                        <div v-for='item in nodeTracer'>
                                          <div style="margin-bottom:10px;"><span v-html='tracerIcon(item.icon)' style="height:24px; width:24px; position:relative; top:8px;margin-right:10px;"></span> <b>{{item.user}}</b> {{item.node_pk}} <b>{{item.action}}</b></div>
                                        </div>
                                    </v-flex>
                                </v-layout>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                          <v-expansion-panel v-if="!loader && transaction.txType !== 0" class="mb-4" v-model="payloadOpened">
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
import feather from 'feather-icons';

export default {
  data() {
    return {
      generalOpened:0,
      payloadOpened:null,
      payloadloader:true,
      loader:true,
      transaction: null, 
      payload:null,
      nodeTracer: null
    };
  },
  mounted() {
      self = this;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get("transactions/"+this.$route.params.hash+'?&withoutattributes=true&withoutinputs=true').then(function(response){
          self.transaction = response.data;
          let nodeTracer = response.data.node_tracing
          for(let i = 0; i < nodeTracer.length; i++){
            //first node
            if(i === 0){
              nodeTracer[i].user = self.$t('message.client')
              nodeTracer[i].action = self.$t('message.sentData')
              nodeTracer[i].icon = "layersIcon"
            } 
            //last node
            else if (i === nodeTracer.length - 1){
              nodeTracer[i].user = self.$t('message.client')
              nodeTracer[i].action = self.$t('message.recievedData')
              nodeTracer[i].icon = "layersIcon"
            } 
            //other nodes
            else{
              nodeTracer[i].user = self.$t('message.node')
              nodeTracer[i].action = self.$t('message.relayData')
              nodeTracer[i].icon = "arrowIcon"
            }
          }
          self.nodeTracer = nodeTracer
          self.loader = false;
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
      axios.get("transactions/"+this.$route.params.hash+'?&withoutattributes=true&withoutinputs=true').then(function(response){
          self.transaction = response.data;
          self.loader=false;
      });
    }
  },
  methods: {
      getPayload(){
        this.payloadloader=true;
        self = this;
        axios.get("payloads/"+this.transaction.id).then(function(response){
          self.payload = response.data;
          self.payloadloader=false;
        });
      },
      tracerIcon: function (item) {
          if(item === 'arrowIcon'){
             return feather.icons['arrow-down'].toSvg()
          }
          else{
             return feather.icons['layers'].toSvg()
          }
      }
  }
};
</script>