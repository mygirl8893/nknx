<template>
	<v-card>
		<v-card-title class="headline">{{$t('message.sendFundsFrom')}}&nbsp;<span style="font-size:0.8em">{{senderAddress}}</span></v-card-title>
		<v-stepper v-model="e1">
			<v-stepper-header>
				<v-stepper-step step="1" :complete="e1 > 1">{{$t("message.sendFundsStep1")}}</v-stepper-step>
				<v-divider></v-divider>
				<v-stepper-step step="2" :complete="e1 > 2">{{$t("message.sendFundsStep2")}}</v-stepper-step>
				<v-divider></v-divider>
				<v-stepper-step step="3">{{$t("message.sendFundsStep3")}}</v-stepper-step>
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
												<v-text-field
													:label="$t('message.to')"
													v-model="to"
													append-icon="contacts"
													@click:append="openAddressBookModal"
												></v-text-field>
											</v-flex>
										</v-layout>
										<v-layout row wrap>
											<v-text-field
													style="padding-left: 10px;padding-right: 10px;"
													:label="$t('message.amount')"
													type="number"
													v-model.number="amount"
												></v-text-field>   
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
									<v-flex xs12 v-if="transferResult">
										<h3>{{$t('message.transferSuccessful')}}</h3>
										<span>{{$t('message.yourTransferIdIs')}} {{transferResult}}</span>
									</v-flex>
									<v-flex xs12 v-else>
										<h3>{{$t('message.transferFailed')}}</h3>
										<span>{{transferError}}</span>
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
		<v-dialog v-model="addressBookModal" max-width="500px">
			
            <v-card>
				<v-card-title>
					<span class="headline">{{ $t('message.addressBook') }}</span>
				</v-card-title>

				<v-card-text>
					<v-autocomplete
						v-model="addressItem"
						:items="addresses"
						hide-details
      					hide-selected
						item-text="name"
						item-value="address"
						:label="$t('message.searchAddress')"
						persistent-hint
						solo
					>
					<template
						slot="selection"
						slot-scope="{ item, selected }"
					>
						<span v-text="item.name"></span>&nbsp;<span style="font-size:0.8em;">({{item.address}})</span>
					</template>
						<template
							slot="item"
							slot-scope="{ item, tile }"
						>
							<v-list-tile-avatar
							color="indigo"
							class="headline font-weight-light white--text"
							>
							{{ item.name.charAt(0) }}
							</v-list-tile-avatar>
							<v-list-tile-content>
							<v-list-tile-title v-text="item.name"></v-list-tile-title>
							<v-list-tile-sub-title v-text="item.address"></v-list-tile-sub-title>
							</v-list-tile-content>
						</template>
					</v-autocomplete>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" flat @click="addressBookModal=false">{{ $t('message.cancel') }}</v-btn>
					<v-btn color="blue darken-1" flat @click="useAddress">{{ $t('message.useAddress') }}</v-btn>
				</v-card-actions>
            </v-card>
        </v-dialog>
		<v-dialog v-model="transferConfirmDialog" max-width="500">
			<v-card>
				<v-card-title class="headline">{{$t('message.confirmTransfer')}}</v-card-title>
				<v-card-text>
					<p>{{$t('message.transferInformation')}}</p>
					<p>{{$t('message.amount')}}: <b>{{amount}}</b></p>
					<p>{{$t('message.to')}}: <b>{{to}}</b></p>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="error" flat="flat" @click.native="transferConfirmDialog = false">{{$t('message.cancel')}}</v-btn>
					<v-btn color="gradient-primary" flat="flat" @click.native="transferFunds">{{$t('message.sendFunds')}}</v-btn>
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
		transferModalClosed: { type: Function },
		senderAddress: { type: String}
    },
	mounted: function(){
		nknWallet.configure({
			rpcAddr: 'https://nknx.org:30003',
		});
	},
	watch: {
		to: function (val) {
			if (val && this.amount && this.amount>0){
				this.s1valid=true;
			}
		},
		amount: function (val) {
			if (val && val>0 && this.to){
				this.s1valid=true;
			}
		},
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
		transferFunds(){
			var self=this;

            this.wallet.transferTo(this.to, this.amount, this.password).then(function(data) {
				self.transferConfirmDialog = false;
				self.transferResult = data;
				self.e1 = 3;
            }).catch(function(error) {
				self.transferConfirmDialog = false;
				self.transferError = error;
				self.e1 = 3;
            })
			
		},
		openAddressBookModal(){
			var self = this;
			self.addressBookModal = true;
			axios.get('walletNames').then(function(addressBookEntries){
				self.addresses=addressBookEntries.data;
			});
			
		},
		useAddress(){
			this.to = this.addressItem;
			this.addressBookModal = false;
		},
		resetModal(){
			this.transferModalClosed();
			this.e1 = 1;
			this.transferConfirmDialog=false;
			this.addressItem=null;
			this.addresses=[];
			this.addressBookModal=false;
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
					this.transferConfirmDialog = true;
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
								self.transferConfirmDialog = true;
							}
						}
						
				}
			
			}
				
		}
	},
   data () {
      return {
			  	transferResult : null,
				transferError : null,
		  		transferConfirmDialog:false,
		  		addressItem:null,
		  		addresses:[],
		  		addressBookModal:false,
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
				rules: {
          			required: value => !!value || 'Required.',
        		}
      }
    }
  }
</script>