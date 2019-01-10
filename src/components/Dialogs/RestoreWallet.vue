<template>
	<v-card>
		<v-card-title class="headline">{{$t('message.restoreWallet')}}</v-card-title>
		<v-stepper v-model="e1">
			<v-stepper-header>
				<v-stepper-step step="1" :complete="e1 > 1">{{$t('message.createWalletStep1')}}</v-stepper-step>
				<v-divider></v-divider>
				<v-stepper-step step="2" :complete="e1 > 1">{{$t('message.createWalletStep2')}}</v-stepper-step>
				<v-divider></v-divider>
				<v-stepper-step step="3">{{$t('message.createWalletStep4')}}</v-stepper-step>
			</v-stepper-header>
			<v-stepper-items>
				<v-stepper-content step="1">
						<v-layout row wrap>
                        	<v-flex xs12>
                        		<v-layout row wrap>
                                    <v-flex xs12>
                                        <div v-html="$t('message.restoreWalletAdvice')"></div>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12>
									<v-text-field
									v-model="pk"
									:append-icon="show1 ? 'visibility_off' : 'visibility'"
									:label="$t('message.pasteOrTypePK')"
									:type="show1 ? 'text' : 'password'"
									@click:append="show1 = !show1"
									></v-text-field>
                                    </v-flex>
                                    <v-flex xs6>
									<v-text-field
	                                    v-model="password"
	                                    :append-icon="show2 ? 'visibility_off' : 'visibility'"
	                                    :rules="[rules.required, rules.min]"
	                                    :type="show2 ? 'text' : 'password'"
	                                    :label="$t('message.newWalletPassword')"
	                                    name="input-10-1"
	                                    hint="At least 8 characters"
	                                    counter
	                                    required
	                                    @click:append="show2 = !show2"
	                                ></v-text-field>
                                    </v-flex>
                                </v-layout>
								<v-layout row wrap justify-end>
										<v-btn color="primary" :disabled="!s1valid" @click="restoreWallet();e1 = 2;s1valid = false">{{ $t('message.restoreWallet') }}</v-btn>
										<v-btn color="error" @click.native="resetModal()">{{ $t('message.cancel') }}</v-btn>
								</v-layout>
							</v-flex>
						</v-layout>
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
	                                <v-btn color="primary" large v-on:click="s1valid = true" download="wallet.dat" :href="downloadUrl"><span v-html="downloadIcon" class="icon"></span>
	                                	{{$t('message.downloadWallet')}}
	                            	</v-btn>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12>
                                            <div v-html="$t('message.newWalletAdvice')"></div>
                                    </v-flex>
                                </v-layout>
								<v-layout row wrap justify-end>
										<v-btn :disabled="!s1valid" :loading="loading" v-on:click="e1 = 3" color="primary">{{ $t('message.continue') }}</v-btn>
								</v-layout>
							</v-flex>
						</v-layout>
				</v-stepper-content>
				<v-stepper-content step="3">
						<v-layout row wrap>
                        	<v-flex xs12>
								<v-layout row wrap>
                                    <v-flex xs12>
                                        <div v-html="$t('message.printYourPaperWallet')"></div>
                                    </v-flex>
                                </v-layout>
								<v-layout row wrap>
	                            	<v-btn color="primary" @click="openPaperWallet" large><span v-html="printIcon" class="icon"></span>
	                                	{{$t('message.printPaperWallet')}}
	                            	</v-btn>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12>
                                            <div v-html="$t('message.newPaperWalletAdvice')"></div>
                                    </v-flex>
                                </v-layout>
								<v-layout row wrap justify-end>
										<v-btn color="primary" v-on:click="resetModal()">{{ $t('message.done') }}</v-btn>
								</v-layout>
							</v-flex>
						</v-layout>
				</v-stepper-content>
			</v-stepper-items>
		</v-stepper>
	</v-card>
</template>

<script>
	import UploadButton from 'vuetify-upload-button';
	import nknWallet from "nkn-wallet";
	import axios from "axios";
	import feather from 'feather-icons';

  export default {
	components: {
		'upload-btn': UploadButton
    },
    props: {
		restoreWalletModalClosed: { type: Function }
    },
	mounted: function(){
		nknWallet.configure({
			rpcAddr: 'https://nknx.org:30003',
		});
	},
	watch: {
		pk: function (val) {
				if (val != ""){
					this.pkvalid = true;
				}
				else{
					this.pkvalid = false;
				}
			},
			password: function(){
				if(this.pkvalid && this.password.length >= 8){
					this.s1valid = true;
				}
				else if(this.filevalid && this.password != ""){
					this.s1valid = true;
				}
			}
	},
	computed: {
		printIcon: function () {
			return feather.icons['printer'].toSvg()
        },
		downloadUrl() {
            if(this.walletFile){
                return this.walletFile.length > 0 ? "data:text/plain;charset=utf-8," + encodeURIComponent(this.walletFile) : 'javascript:void(0);';
            }
		},
		downloadIcon: function () {
			return feather.icons['download'].toSvg()
		},
	},
	methods:{
		resetModal(){
			this.restoreWalletModalClosed()
			this.e1 = 1;
			this.wallet=null;
			this.password="";
			this.pkvalid= false;
			this.s1valid=false;
			this.loading=false;
			this.walletFile=null;
			this.pk="";
			this.show1= false;
			this.show2= false;
			this.addr= ";"
		},
		openPaperWallet(){
			let routeData = this.$router.resolve({name: 'PaperWallet', query: {pk: this.pk, addr: this.addr, pwd: this.password}});
			window.open(routeData.href, '_blank');
		},
		restoreWallet(){
			const self = this;
			this.wallet = nknWallet.restoreWalletByPrivateKey(this.pk, this.password);
			this.addr = this.wallet.address
			this.walletFile = this.wallet.toJSON();
		}
	},
   data () {
      return {
		  		e1: 0,
				wallet:null,
				password:"",
				pkvalid: false,
				s1valid:false,
				loading:false,
				walletFile:null,
				pk:"",
				show1: false,
				show2: false,
				addr: "",
				rules: {
					required: value => !!value || 'Required.',
					min: v => v.length >= 8 || 'Min 8 characters',
				}
      }
    }
  }
</script>