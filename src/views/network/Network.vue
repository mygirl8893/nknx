<template>
	<div>
	
		<page-title-bar></page-title-bar>
		<v-container grid-list-xl pt-0>
			<app-section-loader :status="loader"></app-section-loader>
			<v-layout row wrap>
				<app-card
					customClasses="mb-30"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
					<v-layout row wrap>
						<v-flex xs12>
							<map-widget></map-widget>
						</v-flex>
					</v-layout>
				</app-card>
				<app-card
					customClasses="mb-30"
					colClasses="xl6 lg6 md12 sm12 xs12"
				>
					<v-layout row wrap>
						<v-flex xs12>
							<NetworkCountries-chart></NetworkCountries-chart>
						</v-flex>
					</v-layout>
				</app-card>
			</v-layout>
		</v-container>
	
    </div>
</template>
<script>

import axios from "axios";
import MapWidget from "Components/Widgets/Map";
import NetworkCountriesChart from "Components/Widgets/NetworkCountriesChart";

export default {
   components: {
	MapWidget,
	NetworkCountriesChart
  },
  data() {
    return {
		loader: true
    };
  },
	mounted: function(){
		this.loader = false
	},

  methods: {

  }
};
</script>
