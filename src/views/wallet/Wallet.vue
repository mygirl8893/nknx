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
					<v-layout row wrap>
						<v-flex xs12>
							{{$t('message.transferNoWallet')}}
						</v-flex>
					</v-layout>
				</app-card>
			</v-layout>
			<v-layout row wrap>
				<app-card
					:heading="$t('message.transactions')"
					customClasses="mb-30"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
					<v-layout row wrap>
						<v-flex xs12>
							{{$t('message.transactionsNoWallet')}}
						</v-flex>
					</v-layout>
				</app-card>
			</v-layout>
			<v-layout row wrap>
				<app-card
					:heading="$t('message.transfers')"
					customClasses="mb-30"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
					<v-layout row wrap>
						<v-flex xs12>
							{{$t('message.transfersNoWallet')}}
						</v-flex>
					</v-layout>
				</app-card>
			</v-layout>
			<v-layout row wrap>
				<app-card
					:heading="$t('message.details')"
					customClasses="mb-30"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
					<v-layout row wrap>
						<v-flex xs12>
							{{$t('message.detailsNoWallet')}}
						</v-flex>
					</v-layout>
				</app-card>
			</v-layout>
		</v-container>
	</div>
</template>

<script>
import WalletWidget from "Components/Widgets/WalletWidget";
  export default {
	components: {
		WalletWidget,
	},
    data: () => ({

    })
  }
</script>