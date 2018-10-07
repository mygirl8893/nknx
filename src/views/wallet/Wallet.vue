<template>
	<div>
		<page-title-bar></page-title-bar>
		<v-container grid-list-xl pt-0>
			<v-layout row wrap>
				<app-card
					:heading="$t('message.yourWallet')"
					customClasses="mb-30"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
					<wallet-widget></wallet-widget>

				</app-card>
			</v-layout>
			<v-layout row wrap>
				<app-card
					:heading="$t('message.transfer')"
					customClasses="mb-30"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
					<wallet-transfer></wallet-transfer>
				</app-card>
			</v-layout>
			<v-layout row wrap>
				<app-card
					:heading="$t('message.transactions')"
					customClasses="mb-30"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
					<latest-wallet-transactions></latest-wallet-transactions>
				</app-card>
			</v-layout>
			<v-layout row wrap>
				<app-card
					:heading="$t('message.transfers')"
					customClasses="mb-30"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
					<latest-wallet-transfers></latest-wallet-transfers>
				</app-card>
			</v-layout>
			<v-layout row wrap>
				<app-card
					:heading="$t('message.details')"
					customClasses="mb-30"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
					<wallet-details></wallet-details>
				</app-card>
			</v-layout>
		</v-container>
	</div>
</template>

<script>
import WalletWidget from "Components/Widgets/WalletWidget";
import LatestWalletTransactions from "Components/Widgets/LatestWalletTransactions";
import LatestWalletTransfers from "Components/Widgets/LatestWalletTransfers";
import WalletDetails from "Components/Widgets/WalletDetails";
import WalletTransfer from "Components/Widgets/WalletTransfer";
import axios from "axios";
  export default {
	components: {
		WalletWidget,
		LatestWalletTransactions,
		LatestWalletTransfers,
		WalletDetails,
		WalletTransfer
	},
	methods: {
		
	},
	mounted: function(){
		
	},
	data(){
		return {
		}
	}
	
  }
</script>