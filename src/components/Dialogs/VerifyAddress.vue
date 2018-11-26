<template>
	<v-card>
		<v-card-title class="headline">{{$t('message.confirmWalletAddress')}}</v-card-title>
		<v-container grid-list-xl pt-0>
            <v-card-text>


					<v-layout row wrap>
						<v-flex xs12>
							<div v-html="$t('message.chooseConfirmationMethod')"></div>
						</v-flex>
					</v-layout>
					<v-layout row wrap>
						<v-flex xs4>
							<v-radio-group v-model="radioButton">
								<v-radio color="primary" :label="$t('message.openWalletfromFile')" value="file"></v-radio>
								<v-radio color="primary" :label="$t('message.openWalletfromPK')" value="pk"></v-radio>
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
								<v-text-field v-if="pkvalid"
									v-model="password"
									:append-icon="show1 ? 'visibility_off' : 'visibility'"
									:label="$t('message.password')"
									:type="show1 ? 'text' : 'password'"
									@click:append="show1 = !show1"
								></v-text-field>
							</div>
						</v-flex>

					</v-layout>
					<v-btn :loading="loading" :disabled="!s1valid" v-on:click="loadWallet()" color="primary" small>{{$t('message.verify')}}</v-btn>

            </v-card-text>


		</v-container>
	</v-card>
</template>

<script>
	import UploadButton from 'vuetify-upload-button';
	import nknWallet from "nkn-wallet";
  export default {
	components: {
		'upload-btn': UploadButton
		
    },
    props: {
        walletLoaded: { type: Function }
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
			if(this.pkvalid && this.password != ""){
				this.s1valid = true;
			}
			else if(this.filevalid && this.password != ""){
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
			if(this.pkvalid && this.password != ""){
				this.s1valid = true;
			}
			else{
				this.s1valid = false;
			}
		},
		password: function(){
			if(this.pkvalid && this.password != ""){
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
				this.wallet = nknWallet.restoreWalletByPrivateKey(this.pk, this.password);
				this.$store.dispatch("addToAddressesStore", this.wallet.address);
                this.$store.dispatch("setSelectedAddress", this.wallet.address);
                this.$store.dispatch("setSnackbar", this.$t('message.walletAddressConfirmed'));
				this.walletLoaded();
			}
			else if(this.radioButton == "file"){
				var self = this;
				const read = new FileReader();
				read.readAsText(this.walletFile);
				read.onloadend = function(){
						self.wallet = nknWallet.loadJsonWallet((read.result), self.password);
						self.$store.dispatch("addToAddressesStore", self.wallet.address);
                        self.$store.dispatch("setSelectedAddress", self.wallet.address);
                        self.$store.dispatch("setSnackbar", self.$t('message.walletAddressConfirmed'));
						self.walletLoaded();
				}
			
			}
		}
	},
   data () {
      return {
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