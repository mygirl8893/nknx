<template>
	<div>
		<v-container fluid pt-0 grid-list-xl>
			<v-layout row wrap>
				<app-card
						colClasses="xl12 lg12 md12 sm12 xs12"
						customClasses="mb-30"
						:fullScreen="true"
					>
				<NKN-chart></NKN-chart>
				</app-card>
			</v-layout>
		</v-container>
		<v-container fluid pt-0 grid-list-xl>
			<v-layout row wrap>
				<app-card
						:heading="$t('message.yourWallet')"
						colClasses="xl5 lg5 md5 sm12 xs12"
						customClasses="mb-30"
					>
					<wallet-widget></wallet-widget>
				</app-card>
				<app-card
						:heading="$t('message.map')"
						colClasses="xl7 lg7 md7 sm12 xs12"
						customClasses="mb-30"
						:fullScreen="true"
						:footer="true"
					>
					<map-widget :query="query"></map-widget>
					<v-btn slot="footer" :to="{path: '/network'}" color="primary" small>{{$t('message.viewDetails')}}</v-btn>
				</app-card>
			</v-layout>

		</v-container>

		<v-container fluid pt-0 grid-list-xl>
						<v-layout row wrap>
				<!-- Latest Blocks -->
				<app-card
					colClasses="xl12 lg12 md12 sm12 xs12"
					customClasses="mb-0"
					:fullScreen="true"
					:fullBlock="true"
					:footer="true"
				>
					<div class="app-card-title title-tab">
					<h3 v-bind:class="{active:isActive==='Blocks'}" @click='isActive="Blocks"'>{{$t('message.latestBlocks')}}</h3>
					<h3 v-bind:class="{active:isActive==='Transactions'}" @click='isActive="Transactions"'>{{$t('message.latestTransactions')}}</h3></div>
					<latest-blocks v-if='isActive === "Blocks"'></latest-blocks>
					<latest-transactions v-if='isActive === "Transactions"'></latest-transactions>
					<v-btn slot="footer"  v-if='isActive === "Blocks"' :to="{path: '/browse/blocks'}" color="primary" small>{{$t('message.viewAll')}}</v-btn>
					<v-btn slot="footer"  v-if='isActive === "Transactions"' :to="{path: '/browse/txs'}" color="primary" small>{{$t('message.viewAll')}}</v-btn>
				</app-card>
			</v-layout>

		</v-container>
	</div>
</template>

<script>

import LatestBlocks from "Components/Widgets/LatestBlocks";
import LatestTransactions from "Components/Widgets/LatestTransactions";
import NKNChart from "Components/Widgets/NKNChart";
import MapWidget from "Components/Widgets/Map";
import WalletWidget from "Components/Widgets/WalletWidget";


export default {
  components: {
	WalletWidget,
	LatestTransactions,
	LatestBlocks,
	NKNChart,
	MapWidget
  },
  data() {
    return {
      isActive: "Blocks",
      query: "?latest=1&txType=66"
    };
  }
};
</script>
