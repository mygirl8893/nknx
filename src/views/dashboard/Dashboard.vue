<template>
	<div>

		<v-container fluid px-0 py-0 class="mb-30">
			<NKN-chart></NKN-chart>
		</v-container>
		<v-container fluid pt-0 grid-list-xl>
			<v-layout row wrap>
				<app-card
						:heading="$t('message.yourWallet')"
						colClasses="xl12 lg12 md12 sm12 xs12"
						customClasses="mb-30"
						:fullScreen="true"
					
					>
					<wallet-widget></wallet-widget>
				</app-card>
			</v-layout>
		</v-container>
		<v-container fluid pt-0 grid-list-xl>
						<v-layout row wrap>
				<!-- Latest Blocks -->
				<app-card
					:heading="$t('message.latestBlocks')"
					colClasses="xl6 lg6 md6 sm12 xs12"
					customClasses="mb-0"
					:fullScreen="true"
					:fullBlock="true"
					:footer="true"
				>
					<latest-blocks></latest-blocks>
					<v-btn slot="footer" color="primary" small>{{$t('message.viewAll')}}</v-btn>
				</app-card>
				<!-- Latest Transactions -->
				<app-card
					:heading="$t('message.latestTransactions')"
					colClasses="xl6 lg6 md6 sm12 xs12"
					customClasses="mb-0"
					:fullScreen="true"
					:fullBlock="true"
					:footer="true"
				>
					<latest-transactions></latest-transactions>
					<v-btn slot="footer" color="primary" small>{{$t('message.viewAll')}}</v-btn>
				</app-card>
			</v-layout>

		</v-container>
	</div>
</template>

<script>

import LatestBlocks from "Components/Widgets/LatestBlocks";
import LatestTransactions from "Components/Widgets/LatestTransactions";
import NKNChart from "Components/Widgets/NKNChart";
import WalletWidget from "Components/Widgets/WalletWidget";


export default {
  components: {
	WalletWidget,
	LatestTransactions,
	LatestBlocks,
	NKNChart,
  },
  data() {
    return {
      
    };
  }
};
</script>
