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
                            <v-card>
                                <app-section-loader :status="loader"></app-section-loader>
                                <table class="table">
                                        <template v-for="(value, key) in items">
                                            <v-layout row wrap>
                                                <v-flex xl4 lg4 md4 sm4 xs12 b-50 style="padding: 1rem 1.25rem;font-weight:bold;">
                                                    {{ $t('message.'+key) }}
                                                </v-flex>
                                                <v-flex xl8 lg8 md8 sm8 xs12 b-50 style="padding: 1rem 1.25rem;">
                                                    <router-link v-if="key === 'prevBlockHash'" :to="{ path: '/block/hash/'+value}">{{ value }}</router-link>
                                                    <router-link v-else-if="key === 'signer'" :to="{ path: '/address/'+value}">{{ value }}</router-link>
                                                    <span v-else-if="key === 'timestamp'">{{ $moment(value).format('MMMM Do YYYY, h:mm:ss a') }}</span>

                                                    
                                                    <span v-else>{{ value }}</span>
                                                </v-flex>
                                            </v-layout>

                                        </template>
                                </table>
                            </v-card>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel class="mb-4">
                            <v-expansion-panel-content>
                            <div slot="header">{{$t('message.transactions')}}</div>
                            <v-card>
                                <v-card-text>Sorry, not implemented yet :(</v-card-text>
                            </v-card>
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
      items: null,
      blockdata: {},
     
    };
  },
  mounted() {
      self = this;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get("http://localhost:8000/api/blocks/"+this.$route.params.hash+"/flat").then(function(response){
          self.items = response.data[0];
          self.loader=false;
      });
  },
  watch:{
    $route (to, from){
      this.loader=true;
      self = this;
      //Call to NKN-API https://github.com/CrackDavid/nkn-api
      axios.get("http://localhost:8000/api/blocks/"+this.$route.params.hash+"/flat").then(function(response){
          self.items = response.data[0];
          self.loader=false;
      });
    }
  }, 
  methods: {
  }
};
</script>