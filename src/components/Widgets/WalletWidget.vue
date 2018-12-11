<template>
    <div>
                <v-layout  v-if="items.length" row wrap style="margin-top:30px;">
					<v-flex xl12 lg12 md12 sm12 xs12 style="padding-top:0px">
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
					<div style='margin: 10px 0px;'>
					<v-btn color="primary" large  @click.native.stop="createWalletDialog = true" ><span v-html="addWalletIcon" class="icon"></span>{{$t('message.newWallet')}}</v-btn>
					<v-btn color="primary" large  @click.native.stop="addWalletDialog = true" ><span v-html="openWalletIcon" class="icon"></span>{{$t('message.openWallet')}}</v-btn>
					</div>

				</v-layout>
				<!--<v-layout>
					<v-flex xl12 lg12 md12 sm12 xs12 style="padding-top:0px">
						<v-layout row wrap justify-end style="margin-top: 5px;">
							<v-btn :to="{path: '/wallet/create'}" raised color="gradient-primary">{{$t('message.newWallet')}}</v-btn>
							<v-btn :to="{path: '/wallet/open'}" raised color="gradient-primary">{{$t('message.openWallet')}}</v-btn>
							<v-menu offset-y>
								<v-btn
									slot="activator"
									color="gradient-primary"
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
		<v-dialog v-model="addWalletDialog" max-width="800">
			<v-card>
				<open-wallet :openWalletModalClosed="openWalletModalClosed" :walletLoaded="walletLoaded"></open-wallet>
			</v-card>
		</v-dialog>
		<v-dialog v-model="createWalletDialog" max-width="800">
			<v-card>
				<create-wallet :createWalletModalClosed="createWalletModalClosed"></create-wallet>
			</v-card>
		</v-dialog>
    </div>
</template>
<script>
import axios from "axios"
import WalletCard from "../WalletCard/WalletCard";
import { mapGetters } from 'vuex';
import OpenWallet from "Components/Dialogs/OpenWallet";
import CreateWallet from "Components/Dialogs/CreateWallet";
import feather from 'feather-icons';

export default {
	components: {
		WalletCard,
		OpenWallet,
		CreateWallet
	},
	watch:{
		selectedWalletAddress: function () {
			this.$store.dispatch("setSelectedAddress", this.selectedWalletAddress);
		}
	},
	computed: {
			openWalletIcon: function () {
				return feather.icons['upload'].toSvg()
           },
			addWalletIcon: function () {
				return feather.icons['plus'].toSvg()
           },
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
		},
		walletLoaded(){
			this.addWalletDialog=false;
		},
		createWalletModalClosed(){
			this.createWalletDialog=false;
		},
		openWalletModalClosed(){
			this.addWalletDialog=false;
		}
	},
	data(){
		return {
			balance:0,
			newbalance:0,
			addWalletDialog:false,
			createWalletDialog:false,
		}
	}
}
</script>

