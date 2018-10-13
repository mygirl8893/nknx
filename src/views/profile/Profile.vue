<template>
	<div>
	<page-title-bar></page-title-bar>
		<v-container fluid pt-0 grid-list-xl>
			<!-- Market Stats -->
			<div class="card-stats">
				<market-stats></market-stats>
			</div>
			<v-layout row wrap>
				<!-- User Nodes -->
				<app-card
					:heading="$t('message.myNodes')"
					colClasses="xl6 lg6 md6 sm12 xs12"
					customClasses="mb-0"
					:fullScreen="true"
					:fullBlock="true"
					:footer="true"
				>
					<user-nodes></user-nodes>
					<v-btn slot="footer" :to="{path: '/profile/NodesManager'}" color="primary" small>{{$t('message.viewAll')}}</v-btn>
				</app-card>
				<!-- Calc -->
				<app-card
					:heading="$t('message.miningCalculator')"
					colClasses="xl6 lg6 md6 sm12 xs12"
					customClasses="mb-0"
					:fullScreen="true"
					:fullBlock="true"
				>
					<mining-calc></mining-calc>
				</app-card>
			</v-layout>

		</v-container>
	</div>
</template>

<script>

import UserNodes from "Components/Widgets/UserNodes";
import MiningCalc from "Components/Widgets/MiningCalc";
import MarketStats from "Components/Widgets/MarketStats";

export default {
  components: {
  	UserNodes,
	MiningCalc,
	MarketStats
  },
  data() {
    return {
      
    };
  }
};
</script>
