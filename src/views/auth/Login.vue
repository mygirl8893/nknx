<template>
	<div>
		<v-alert
		:value="error"
		type="error"
		>
				<span>Error logging you in. Did you mistype your password or email?</span>
		</v-alert>

			<div class="session-table-cell">
				<div class="session-content">
					<img 
						src="/static/img/myNKNx.png" 
						class="img-responsive mb-3" 
						width="230" 
						height="120" 
					/>
					<h2 class="mb-3">{{$t('message.loginHeader')}}</h2>
					<p class="fs-14">{{$t('message.enterUsernameAndPasswordToAccess')}}.</p>
					<v-form v-model="valid" class="mb-4">
						<v-text-field 
							:label="$t('message.email')" 
							v-model="email" 
							:rules="emailRules" 
							required
						></v-text-field>
						<v-text-field 
							:label="$t('message.password')" 
							v-model="password" 
							type="password" 
							:rules="passwordRules" 
							required
						></v-text-field>
						<v-checkbox 
							color="gradient-primary" 
							:label="$t('message.rememberMe')" 
							v-model="checkbox"
						></v-checkbox>
						<router-link class="mb-1" to="/forgot-password">{{$t('message.forgotPassword')}}</router-link>
						<div>
							<v-btn :disabled="!valid"  large @click="login" block color="gradient-primary">{{$t('message.login')}}</v-btn>
							<v-btn large :to="{path: '/register'}" block color="warning">{{$t('message.createAccount')}}</v-btn>
						</div>
					</v-form>

				</div>
			</div>
	</div>
</template>

<script>
import axios from "axios";
import { mapGetters } from 'vuex';

export default {
    data(){
      return {
		error:false,
		checkbox: false,
      	valid: false,
     
		emailRules: [
			v => !!v || "E-mail is required",
			v =>
			/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
			"E-mail must be valid"
		],
     
      	passwordRules: [v => !!v || "Password is required"],
        email: null,
        password: null,
        error: false
      }
		},
		computed:{
			...mapGetters({
					wallets: 'wallets'
        })
		},
    methods: {
			syncLocalStorage(){
				this.addToDatabase = [];
				this.addToLocalStorage = [];
				var self = this;
				
				axios.get('walletAddresses/').then(function(response){
					var databaseWallets = response.data;
					// in database but not in localstorage
					databaseWallets.forEach(function(databaseWallet){
						let found = false;
						self.wallets.forEach(function(localWallet){
							if(localWallet.address == databaseWallet.address){
								found=true;
							}
						});
						if(!found){
							// add localstorageItem
							self.addToLocalStorage.push({"address": databaseWallet.address,"label":databaseWallet.label});
						}
					});

					//in localStorage but not in database
					self.wallets.forEach(function(localWallet){

							let found = false;
							databaseWallets.forEach(function(databaseWallet){
								if(localWallet.address == databaseWallet.address){
									found=true;
								}
							});
							if(!found){
								//create database entry
								self.addToDatabase.push({'address':localWallet.address, 'label':localWallet.label});
							}
					});

					self.addToDatabase.forEach(wallet => {
								axios.post('walletAddresses/', wallet)
					});
					self.addToLocalStorage.forEach(wallet => {
								self.$store.dispatch("addToWalletsStore", wallet);
					});
					self.$store.dispatch("setSelectedWallet",self.wallets[0]);
				});
			},
      login(){
        var app = this
        this.$auth.login({
            params: {
              email: app.email,
              password: app.password
            }, 
            success: function () {
							this.syncLocalStorage();
							this.$store.dispatch("setSnackbar", this.$t('message.successfullyLoggedIn'));
						},
            error: function () {
				this.error = true;
			},
            rememberMe: this.checkbox,
            redirect: '/profile',
            fetchUser: true,
        });       
      },
    }
  } 
</script>
