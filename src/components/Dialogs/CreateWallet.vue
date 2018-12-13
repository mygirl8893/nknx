<template>
    <v-card>
		<v-card-title class="headline">{{$t('message.createWallet')}}</v-card-title>
		<v-stepper v-model="e1">
			<v-stepper-header>
				<v-stepper-step step="1" :complete="e1 > 1">{{$t("message.createWalletStep1")}}</v-stepper-step>
				<v-divider></v-divider>
				<v-stepper-step step="2" :complete="e1 > 2">{{$t("message.createWalletStep2")}}</v-stepper-step>
				<v-divider></v-divider>
				<v-stepper-step step="3">{{$t("message.createWalletStep3")}}</v-stepper-step>
			</v-stepper-header>
			<v-stepper-items>
				<v-stepper-content step="1">
					<v-container grid-list-xl pt-0>
						<v-layout row wrap>
                        	<v-flex xs12>
                                <v-layout row wrap>
                                    <v-flex xs12>
                                        <div v-html="$t('message.createWalletAdvice')"></div>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs6>
                                        <v-form v-on:submit.prevent="createWallet()" v-model="valid">
                                            <v-text-field
                                                v-model="password"
                                                :append-icon="show1 ? 'visibility_off' : 'visibility'"
                                                :rules="[rules.required, rules.min]"
                                                :type="show1 ? 'text' : 'password'"
                                                name="input-10-1"
                                                hint="At least 8 characters"
                                                counter
                                                required
                                                @click:append="show1 = !show1"
                                            ></v-text-field>
											<v-text-field
                                                v-model="label"
												:label="$t('message.walletLabel')"
                                                name="input-10-1"
                                            ></v-text-field>
                                        </v-form>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap justify-end>
										<v-btn color="primary" :disabled="!valid || loading" :loading="loading" v-on:click="createWallet();e1 = 2">{{ $t('message.continue') }}</v-btn>
										<v-btn color="error" @click.native="resetModal()">{{ $t('message.cancel') }}</v-btn>
								</v-layout>
							</v-flex>
						</v-layout>
					</v-container>
				</v-stepper-content>
				<v-stepper-content step="2">
						<v-layout row wrap>
                        	<v-flex xs12>
								<v-layout row wrap>
                                    <v-flex xs12>
                                        <div v-html="$t('message.saveYourWalletFile')"></div>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                            <v-btn color="gradient-primary" download="wallet.dat" :href="downloadUrl" v-on:click="s1valid = true">
                                                {{$t('message.downloadWallet')}}
                                            </v-btn>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12>
                                            <div v-html="$t('message.newWalletAdvice')"></div>
                                    </v-flex>
                                </v-layout>
								<v-layout row wrap justify-end>
										<v-btn :disabled="!s1valid" :loading="loading" v-on:click="getPK();e1 = 3" color="primary">{{ $t('message.continue') }}</v-btn>
								</v-layout>
							</v-flex>
						</v-layout>
				</v-stepper-content>
				<v-stepper-content step="3">
						<v-layout row wrap>
                        	<v-flex xs12>
								<v-layout row wrap>
                                    <v-flex xs12>
                                        <div v-html="$t('message.saveYourPK')"></div>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12>
                                        <v-text-field
                                            v-clipboard:copy="pk"
                                            v-clipboard:success="onCopy"
                                            v-model="pk"
                                            name="input-10-1"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12>
                                            <div v-html="$t('message.newPkAdvice')"></div>
                                    </v-flex>
                                </v-layout>
								<v-layout row wrap justify-end>
										<v-btn color="primary" v-on:click="resetModal()" :disabled="!s2valid">{{ $t('message.done') }}</v-btn>
								</v-layout>
							</v-flex>
						</v-layout>
				</v-stepper-content>
			</v-stepper-items>
		</v-stepper>
	</v-card>
</template>

<script>
  import nknWallet from "nkn-wallet";

  export default {
        props: {
            createWalletModalClosed: { type: Function }
        },
		mounted: function(){
			nknWallet.configure({
				rpcAddr: 'https://nknx.org:30003',
			});
		},
		methods: {
            resetModal(){
					this.snackbar= false;
					this.label= "";
                    this.pk="";
                    this.s1valid=false;
                    this.s2valid=false;
                    this.wallet=null;
                    this.walletFile=null;
                    this.loading=false;
                    this.password="";
                    this.valid=false;
                    this.step=0;
                    this.show1= false;
                    this.wallet= null;
                    this.e1= 1;
                    this.createWalletModalClosed();
            },
			createWallet(){
				if(this.valid){
					this.loading = true;
					this.wallet = nknWallet.newWallet('pwd');
					this.walletFile = this.wallet.toJSON();
					this.loading = false;
					this.step = 1;
					this.$store.dispatch("addToWalletsStore", {"address": this.wallet.address,"label":this.label});
					this.$store.dispatch("setSelectedWallet", {"address": this.wallet.address,"label":this.label});
				}
			},
			getPK(){
				this.pk= this.wallet.getPrivateKey();
				this.step = 2;
			},
			onCopy(){
				this.$store.dispatch("setSnackbar", this.$t('message.PkCopiedSuccessful'));
				this.s2valid=true;
			}

		},
		computed: {
			downloadUrl() {
                if(this.walletFile){
                    return this.walletFile.length > 0 ? "data:text/plain;charset=utf-8," + encodeURIComponent(this.walletFile) : 'javascript:void(0);';
                }
			}
   		},
		data () {
			return {
                e1: 1,
				snackbar: false,
				label: "",
				pk:"",
                s1valid:false,
                s2valid:false,
				wallet:null,
				walletFile:null,
				loading:false,
				password:"",
				valid:false,
				step:0,
				show1: false,
				wallet: null,
				rules: {
					required: value => !!value || 'Required.',
					min: v => v.length >= 8 || 'Min 8 characters',
				}
			}
		}
  }
</script>