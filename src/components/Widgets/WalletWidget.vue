<template>
    <div>
                <v-layout  v-if="items.length" row wrap style="margin-top:30px;">
					<v-flex xl12 lg12 md12 sm12 xs12 style="padding-top:0px">
						<v-select
							v-on:change="setSelectedWallet"
							:value="selectedWallet"
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
					<v-flex xs12 v-if="selectedWallet">
						<wallet-card :label="selectedWallet.label" :address="selectedWallet.address" :deleteCallback="removeWallet"></wallet-card>
					</v-flex>
					<div style='margin: 10px 0px;'>
					<v-btn color="primary" large  @click.native.stop="createWalletDialog = true" ><span v-html="addWalletIcon" class="icon"></span>{{$t('message.newWallet')}}</v-btn>
					<v-btn color="primary" large  @click.native.stop="addWalletDialog = true" ><span v-html="openWalletIcon" class="icon"></span>{{$t('message.openWallet')}}</v-btn>
					</div>
				</v-layout>
		<v-dialog v-model="addWalletDialog" max-width="800">
			<v-card>
				<open-wallet :openWalletModalClosed="openWalletModalClosed" :walletLoaded="walletLoaded"></open-wallet>
			</v-card>
		</v-dialog>
		<v-dialog v-model="createWalletDialog" max-width="1000">
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
		selectedWallet: function () {
			this.$store.dispatch("setSelectedWallet", this.selectedWallet);
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
			selectedWallet: 'selectedWallet',
			items: 'wallets'
        })
	},
	methods:{
		setSelectedWallet(val){
			this.items.forEach(element => {
				if(element.address==val){
					this.$store.dispatch("setSelectedWallet", element);
				}
			});
		},
		removeWallet(){
			var self = this;
			if(this.$auth.check()){
				//get address from api
				axios.get('walletAddresses/'+this.selectedWallet.address).then(function(response){
					axios.delete('walletAddresses/'+response.data.id)
					.then((response) => {
						self.$store.dispatch("removeFromWalletsStore", self.selectedWallet);
						self.$store.dispatch("removeSelectedWallet");
					})
				})
			}
			else{
				this.$store.dispatch("removeFromWalletsStore", this.selectedWallet);
				this.$store.dispatch("removeSelectedWallet");
			}
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

