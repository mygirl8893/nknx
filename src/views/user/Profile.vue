<template>
	<div>
	<page-title-bar></page-title-bar>
		<v-container fluid pt-0 grid-list-xl>
			<v-layout row wrap>
				<!-- User Nodes -->
				<div class="xl3 lg6 md6 sm12 xs12 flex">
					<div>
						<user-detail></user-detail>
					</div>
				</div>

				<app-card
					:heading="$t('message.userDetails')"
					colClasses="xl4 lg6 md6 sm12 xs12"
					customClasses="mb-0"
					:fullScreen="true"
					:fullBlock="true"
					:footer="true"
				>
					<user-data></user-data>

				</app-card>
				<!-- Calc -->
				<app-card
					:heading="$t('message.miningCalculator')"
					colClasses="xl5 lg6 md6 sm12 xs12"
					customClasses="mb-0"
					:fullScreen="true"
					:fullBlock="true"
				>
					<mining-calc></mining-calc>
				</app-card>
				<app-card
					:heading="$t('message.miners')"
					colClasses="xl6 lg6 md12 sm12 xs12"
					customClasses="mt-10"
					:fullScreen="true"
					:fullBlock="true"
				>
					<miners-chart></miners-chart>
				</app-card>
			</v-layout>
		</v-container>
	</div>
</template>

<script>

import UserNodes from "Components/Widgets/UserNodes";
import MiningCalc from "Components/Widgets/MiningCalc";
import MarketStats from "Components/Widgets/MarketStats";
import NetworkStats from "Components/Widgets/NetworkStats";
import WalletTracker from "Components/Widgets/WalletTracker";
import MinersChart from "Components/Widgets/MinersChart";
import UserDetail from "Components/Widgets/UserDetail";
import UserData from "Components/Widgets/UserData";

export default {
  components: {
  	UserNodes,
	MiningCalc,
	MarketStats,
	NetworkStats,
	WalletTracker,
	MinersChart,
	UserDetail,
	UserData
  },
  data() {
    return {
      
    };
  }
};
</script>
