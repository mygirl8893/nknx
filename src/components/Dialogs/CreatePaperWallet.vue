<template>
	<v-card>
		<v-card-title class="headline">{{$t('message.createPaperWalletFor')}}&nbsp;<span style="font-size:0.8em">{{senderAddress}}</span></v-card-title>
		<v-stepper v-model="e1">
			<v-stepper-header>
				<v-stepper-step step="1" :complete="e1 > 1">{{$t('message.sendFundsStep2')}}</v-stepper-step>
				<v-divider></v-divider>
				<v-stepper-step step="2">{{$t('message.createWalletStep4')}}</v-stepper-step>
			</v-stepper-header>
			<v-stepper-items>
				<v-stepper-content step="1">
						<v-layout row wrap>
                        	<v-flex xs12>
								<v-layout row wrap>
									<v-flex xs4>
										<v-radio-group v-model="radioButton">
											<v-radio color="gradient-primary" :label="$t('message.openWalletfromFile')" value="file"></v-radio>
											<v-radio color="gradient-primary" :label="$t('message.openWalletfromPK')" value="pk"></v-radio>
										</v-radio-group>
										
									</v-flex>
									<v-flex xs8>
										<div v-if="radioButton==='file'">
											<upload-btn style="display:inline" :fileChangedCallback="fileChangedCallback" :title="$t('message.selectWalletFile')" ></upload-btn> 
											<span>{{walletFile.name}}</span>
											<v-text-field v-if="filevalid"
												v-model="password"
												:append-icon="show1 ? 'visibility_off' : 'visibility'"
												:label="$t('message.password')"
												:type="show1 ? 'text' : 'password'"
												@click:append="show1 = !show1"
											></v-text-field>
										</div>
										<div v-if="radioButton==='pk'">
											<v-text-field
												v-model="pk"
												:append-icon="show1 ? 'visibility_off' : 'visibility'"
												:label="$t('message.pasteOrTypePK')"
												:type="show1 ? 'text' : 'password'"
												@click:append="show1 = !show1"
											></v-text-field>
										</div>
									</v-flex>
								</v-layout>
								<v-layout row wrap justify-end>
										<v-btn color="primary" :disabled="!s1valid" @click.native="loadWallet">{{ $t('message.verify') }}</v-btn>
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
		createPaperWalletDialogClosed: { type: Function },
		senderAddress: { type: String}
    },
	mounted: function(){
		nknWallet.configure({
			rpcAddr: 'https://nknx.org:30003',
		});
	},
	watch: {
		radioButton: function () {
					if(this.radioButton == "pk" && this.pk != ""){
						this.pkvalid = true;
					}
					else if(this.radioButton == "file" && this.walletFile.name != ""){
						this.filevalid = true;
					}
					else{
						this.pkvalid = false;
						this.filevalid = false;
					}
					if(this.pkvalid && this.radioButton == "pk"){
						this.s1valid = true;
					}
					else if(this.filevalid && this.password != "" && this.radioButton == "file"){
						this.s1valid = true;
					}
					else{
						this.s1valid = false;
					}
			},
			pk: function (val) {
					if (val != ""){
						this.pkvalid = true;
					}
					else{
						this.pkvalid = false;
					}
					if(this.pkvalid && this.radioButton == "pk"){
						this.s1valid = true;
					}
					else{
						this.s1valid = false;
					}
				},
				password: function(){
					if(this.pkvalid && this.radioButton == "pk"){
						this.s1valid = true;
					}
					else if(this.filevalid && this.password != ""){
						this.s1valid = true;
					}
					else{
						this.s1valid = false;
					}
				}
	},
	computed: {
		printIcon: function () {
			return feather.icons['printer'].toSvg()
        }
	},
	methods:{
		resetModal(){
			this.createPaperWalletDialogClosed()
			this.e1 = 1;
			this.amount=0;
			this.to="";
			this.wallet=null;
			this.password="";
			this.filevalid =false;
			this.pkvalid= false;
			this.s1valid=false;
			this.loading=false;
			this.walletFile={name:""};
			this.radioButton= "";
			this.pk="";
			this.show1= false;
		},
		fileChangedCallback($file){
			this.walletFile = $file;
			this.filevalid = true;
			if(this.filevalid && this.password != ""){
				this.s1valid = true;
			}
			else{
				this.s1valid = false;
			}
		},
		openPaperWallet(){
			let routeData = this.$router.resolve({name: 'PaperWallet', query: {pk: this.pk, addr: this.senderAddress, pwd: this.password}});
			window.open(routeData.href, '_blank');
		},
		loadWallet(){
			if(this.radioButton == "pk"){
				var self = this;
				this.password = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
				this.wallet = nknWallet.restoreWalletByPrivateKey(this.pk, this.password);
				if(this.wallet.address !== this.senderAddress){
					this.$store.dispatch("setSnackbar", this.$t('message.wrongSenderAddress'));
				}
				else{
					self.e1 = 2;
					self.pk= self.wallet.getPrivateKey();
					self.password = ""
				}

			}
			else if(this.radioButton == "file"){
				var self = this;
				const read = new FileReader();
				read.readAsText(this.walletFile);
				read.onloadend = function(){
						self.wallet = nknWallet.loadJsonWallet((read.result), self.password);
						if(self.wallet.cloneError){
							self.$store.dispatch("setSnackbar", self.$t('message.errorLoadingWallet'));
						}
						else{
							if(self.wallet.address !== self.senderAddress){
								self.$store.dispatch("setSnackbar", self.$t('message.wrongSenderAddress'));
							}
							else{
								self.e1 = 2;
								self.pk= self.wallet.getPrivateKey();
							}
						}
						
				}
			
			}
				
		}
	},
   data () {
      return {
		  		e1: 0,
				wallet:null,
				password:"",
				filevalid :false,
				pkvalid: false,
				s1valid:false,
				loading:false,
				walletFile:{name:""},
				radioButton: "",
				pk:"",
				show1: false,
				rules: {
          			required: value => !!value || 'Required.',
        		}
      }
    }
  }
</script>