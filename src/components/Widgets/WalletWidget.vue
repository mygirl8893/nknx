<template>
    <div>
                <v-layout row wrap style="margin-top:35px;">
					<v-flex v-if="items.length" xl12 lg12 md12 sm12 xs12 style="padding-top:0px">
						<v-select
							v-on:change="setSelectedWalletAddress"
							:value="selectedWalletAddress"
							:items="items"
							item-text="address"
							item-value="address"
							:label="$t('message.storedWallets')"
							outline
						></v-select>
					</v-flex>
				</v-layout>
				<v-layout row wrap>
					<v-flex xs12 v-if="!items.length ">
						{{$t('message.yourWalletNoWallet')}}
					</v-flex>
					<v-flex xs12 v-if="selectedWalletAddress">
						<wallet-card :address="selectedWalletAddress" :deleteCallback="removeWalletAddress"></wallet-card>
					</v-flex>
				</v-layout>
				<!--<v-layout>
					<v-flex xl12 lg12 md12 sm12 xs12 style="padding-top:0px">
						<v-layout row wrap justify-end style="margin-top: 5px;">
							<v-btn :to="{path: '/wallet/create'}" raised color="primary">{{$t('message.newWallet')}}</v-btn>
							<v-btn :to="{path: '/wallet/open'}" raised color="primary">{{$t('message.openWallet')}}</v-btn>
							<v-menu offset-y>
								<v-btn
									slot="activator"
									color="primary"
									dark
								>
									{{$t('message.menu')}}
								</v-btn>
								<v-list>
									
										<v-list-tile @click="">
											<v-list-tile-title>{{$t('message.changeName')}}</v-list-tile-title>
										</v-list-tile>
								
									<v-list-tile @click="">
										<v-list-tile-title>{{$t('message.changePassword')}}</v-list-tile-title>
									</v-list-tile>
								</v-list>
							</v-menu>
						</v-layout>
					</v-flex>
				</v-layout>-->
    </div>
</template>
<script>
import axios from "axios"
import WalletCard from "../WalletCard/WalletCard";
import { mapGetters } from 'vuex'

export default {
	components: {
		WalletCard
	},
	watch:{
		selectedWalletAddress: function () {
			this.$store.dispatch("setSelectedAddress", this.selectedWalletAddress);
		}
	},
	computed: {

        ...mapGetters({
			selectedWalletAddress: 'selectedAddress',
			items: 'addresses'
        })
	},
	methods:{
		setSelectedWalletAddress(val){
			this.$store.dispatch("setSelectedAddress", val);
		},
		removeWalletAddress(){
			//remove from store
			this.$store.dispatch("removeFromAddressesStore", this.selectedWalletAddress);
			this.$store.dispatch("removeSelectedAddress");
		}
	},
	data(){
		return {
			balance:0,
			newbalance:0,
		}
	}
}
</script>

