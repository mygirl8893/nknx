<template>
	<v-card>
		<v-card-title class="headline">{{$t('message.setWalletNameFor')}}&nbsp;<span style="font-size:0.8em">{{senderAddress}}</span></v-card-title>
		<v-stepper v-model="e1">
			<v-stepper-header>
				<v-stepper-step step="1" :complete="e1 > 1">{{$t("message.setWalletNameStep1")}}</v-stepper-step>
				<v-divider></v-divider>
				<v-stepper-step step="2" :complete="e1 > 2">{{$t("message.setWalletNameStep2")}}</v-stepper-step>
				<v-divider></v-divider>
				<v-stepper-step step="3">{{$t("message.setWalletNameStep3")}}</v-stepper-step>
			</v-stepper-header>
			<v-stepper-items>
				<v-stepper-content step="1">
					<v-container grid-list-xl pt-0>
						<v-layout row wrap>
                        	<v-flex xs12>
								<v-layout row wrap>
									<v-flex xs12>
										<v-layout row wrap>
											<v-flex xs12>
												<v-form v-model="s1valid" class="mb-4 w-100">
													<v-text-field
														:label="$t('message.walletName')"
														v-model="walletName"
														:rules='rules'
													></v-text-field>
												</v-form>
											</v-flex>
										</v-layout>
									</v-flex>
								</v-layout>
								<v-layout row wrap justify-end>
										<v-btn color="primary" :disabled="!s1valid" @click.native="e1 = 2">{{ $t('message.continue') }}</v-btn>
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
				<v-stepper-content step="3">
						<v-layout row wrap>
                        	<v-flex xs12>
								<v-layout row wrap>
									<v-flex xs12 v-if="setNameResult">
										<h3>{{$t('message.setNameSuccessful')}}</h3>
									</v-flex>
									<v-flex xs12 v-else>
										<h3>{{$t('message.setNameFailed')}}</h3>
										<span>{{setNameError}}</span>
									</v-flex>
								</v-layout>
								<v-layout row wrap justify-end>
										<v-btn color="primary" @click.native="resetModal()">{{ $t('message.done') }}</v-btn>
								</v-layout>
							</v-flex>
						</v-layout>
				</v-stepper-content>
			</v-stepper-items>
		</v-stepper>
		<v-dialog v-model="setNameConfirmDialog" max-width="500">
			<v-card>
				<v-card-title class="headline">{{$t('message.confirmSetName')}}</v-card-title>
				<v-card-text>
					<p>{{$t('message.setNameInformation')}}</p>
					<p>{{$t('message.walletName')}}: <b>{{walletName}}</b></p>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="error" flat="flat" @click.native="setNameConfirmDialog = false">{{$t('message.cancel')}}</v-btn>
					<v-btn color="gradient-primary" flat="flat" @click.native="setWalletName">{{$t('message.setWalletName')}}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-card>
</template>

<script>
	import UploadButton from 'vuetify-upload-button';
	import nknWallet from "nkn-wallet";
	import axios from "axios";
  export default {
	components: {
		'upload-btn': UploadButton
		
    },
    props: {
		setWalletNameDialogClosed: { type: Function },
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
	methods:{
		setWalletName(){
			var self=this;

            this.wallet.registerName(this.walletName.toLowerCase(), this.password).then(function(data) {
				self.setNameConfirmDialog = false;
				self.setNameResult = data;
				self.e1 = 3;
            }).catch(function(error) {
				self.setNameConfirmDialog = false;
				self.setNameError = error;
				self.e1 = 3;
            })

			
		},
		resetModal(){
			this.setWalletNameDialogClosed();
			this.e1 = 1;
			this.setNameConfirmDialog=false;
			this.addressItem=null;
			this.addresses=[];
			this.walletName="";
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
			this.transferResult = null;
			this.transferError = null;
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
		loadWallet(){
			if(this.radioButton == "pk"){
				this.password = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
				this.wallet = nknWallet.restoreWalletByPrivateKey(this.pk, this.password);
				if(this.wallet.address !== this.senderAddress){
					this.$store.dispatch("setSnackbar", this.$t('message.wrongSenderAddress'));
				}
				else{
					this.setNameConfirmDialog = true;
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
								self.setNameConfirmDialog = true;
							}
						}
						
				}
			
			}
				
		}
	},
   data () {
      return {
		  		walletName: "",
			  	setNameResult : null,
				setNameError : null,
		  		setNameConfirmDialog:false,
		  		addressItem:null,
		  		addresses:[],
				amount:0,
				to:"",
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
				rules: [
					v => !!v || "required",
					v => v.length >= 7 || "Length has to be between 8-12 characters",
					v => v.length <= 13 || "Length has to be between 8-12 characters",
					v =>
					/^[A-Za-z]+$/.test(v) ||
					"Only letters allowed"
				],
        		
      }
    }
  }
</script>