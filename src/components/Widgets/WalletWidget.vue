<template>
    <div>
                <v-layout row wrap>
					<v-flex v-if="$store.getters.walletstore.length" xl4 lg4 md4 sm12 xs12 style="padding-top:0px">
						<v-select
							v-model="selectedWallet"
							:items="items"
							item-text="address"
							item-value="pk"
							:label="$t('message.storedWallets')"
						></v-select>
					</v-flex>
					<v-flex xl4 lg4 md4 sm12 xs12 style="padding-top:0px">
						<v-layout row wrap style="margin-top: 5px;">
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
									
										<!--<v-list-tile @click="">
											<v-list-tile-title>{{$t('message.changeName')}}</v-list-tile-title>
										</v-list-tile>
								
									<v-list-tile @click="">
										<v-list-tile-title>{{$t('message.changePassword')}}</v-list-tile-title>
									</v-list-tile>-->
									<v-list-tile :disabled="selectedWallet ? false : true" @click="removeWallet">	
										<v-list-tile-title>{{$t('message.closeWallet')}}</v-list-tile-title>
									</v-list-tile>
								</v-list>
							</v-menu>
						</v-layout>
					</v-flex>
				</v-layout>
				<v-layout row wrap v-if="selectedWallet && (selectedWallet != pkFromStore)">
					<v-flex xl4 lg4 md4 sm12 xs12>
						<v-text-field
							v-model="password"
							:append-icon="show1 ? 'visibility_off' : 'visibility'"
							:label="$t('message.password')"
							:type="show1 ? 'text' : 'password'"
							@click:append="show1 = !show1"
						></v-text-field>
					</v-flex>
					<v-flex xl4 lg4 md4 sm12 xs12>
						<v-layout row wrap style="margin-top: 5px;">
							<v-btn v-on:click.native="unlockWallet" raised color="primary">{{$t('message.unlock')}}</v-btn>
						</v-layout>
					</v-flex>
				</v-layout>
				<v-layout row wrap>
					<v-flex xs12 v-if="!$store.getters.walletfile ">
						{{$t('message.yourWalletNoWallet')}}
					</v-flex>
					<template v-else>
						<v-flex xs12>
							<h3 class="balance-header">{{$t('message.activeWallet')}}: <b>{{$store.getters.walletfile.address}}</b></h3>
							<div class="balance">{{balance}} <span class="primary--text">NKN</span></div>
						</v-flex>
					</template>
				</v-layout>
    </div>
</template>
<script>
import nknWallet from "nkn-wallet";
export default {
	mounted: function(){

		nknWallet.configure({
			rpcAddr: 'https://nknx.org:30003',
		});
		this.getBalance();
		this.interval = setInterval(this.getBalance, 10000);
		if(this.$store.getters.walletstore.length){
			var self = this;
			for(var i=0; i < this.$store.getters.walletstore.length; i++) { 
				this.items.push(this.$store.getters.walletstore[i]);
			}
		}
	},
	computed: {
		// a computed getter
		pkFromStore: function () {
			if(this.$store.getters.walletfile){
				return this.$store.getters.walletfile.getPrivateKey()
			}
			else{
				return ""
			}
			
		}
	},
	methods:{
		removeWallet(){
			//splice from items
			for(var i=0; i < this.items.length; i++) { 
				if(this.items[i].pk == this.selectedWallet){
					this.items.splice(i,1);
				};
			}
			
			//remove from store
			this.$store.dispatch("removeFromWalletStore", this.selectedWallet);

			//remove from walletfile if it is loaded
			if(this.$store.getters.walletfile){
				if(this.$store.getters.walletfile.getPrivateKey()==this.selectedWallet){
					this.$store.dispatch("removeWalletfile", this.selectedWallet);
				}
			}

			
			this.selectedWallet=null;

		},
		unlockWallet(){

			//var wallet = nknWallet.restoreWalletByPrivateKey('the private key', 'new-wallet-password')
			//this.selectedWallet="";
			var self = this;
			const wallet = nknWallet.restoreWalletByPrivateKey(this.selectedWallet, this.password);
			this.$store.dispatch("setWalletfile", wallet);
			this.getBalance();
			this.password="";
		},
		getBalance(){
			if(this.$store.getters.walletfile){
				var self = this;
				this.$store.getters.walletfile.queryAssetBalance().then(function(value) {
					self.balance = value.toString();
				}).catch(function(error) {
					console.log('query balance fail: ', error)
				})
			}
		}
	},
	destroyed () {
		clearInterval(this.interval);
	},
	data(){
		return {
			interval:null,
			password:"",
			selectedWallet:null,
			balance:"",
			show1: false,
			items: []

		}
	}
}
</script>

