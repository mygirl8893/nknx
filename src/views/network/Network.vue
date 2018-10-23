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
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
					<v-layout row wrap>
						<v-flex xs12>
							
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

export default {
   components: {
	MapWidget
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
