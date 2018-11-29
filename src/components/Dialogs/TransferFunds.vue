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
									<v-flex xs12>
										<v-card color="grey lighten-1" height="200px"></v-card>
									</v-flex>
								</v-layout>
								<v-layout row wrap justify-end>
										<v-btn color="primary" @click.native="e1 = 3">{{ $t('message.continue') }}</v-btn>
										<v-btn color="error" @click.native="resetModal()">{{ $t('message.cancel') }}</v-btn>
								</v-layout>
							</v-flex>
						</v-layout>
				</v-stepper-content>
				<v-stepper-content step="3">
						<v-layout row wrap>
                        	<v-flex xs12>
								<v-layout row wrap>
									<v-flex xs12>
										<v-card color="grey lighten-1" height="200px"></v-card>
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
		}
	},
	methods:{
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
			
		}
	},
   data () {
      return {
		  		addressItem:null,
		  		addresses:[{"name":"microsoft","public_key":"02ac9d242fad2ac6e231c4ecda82b1b108c12b1e21a685053a41d64f9886f6fdea","address":"NgugCfHpsYV2zMDwHwEqm147VsW1akrSyL"},{"name":"elonmusk","public_key":"035e5cce1fa0049684b6e1438d3398382dcca298f4e0363109a90a3d7039009bc7","address":"Nd4DfvaB95YAQzVAPtFc59Ap8YpTq9urBo"},{"name":"trueinsider","public_key":"039bd29d184aa8acc963a46c083129737c0a78615b86656463b3f1e5e06df9a1a3","address":"NTs3B7YsM6aRDCSMzqTdgbdkW5Q6YBBUZn"},{"name":"bittorrent","public_key":"027865c7c961e7d5d3f96920803f4d6a0e4e48cca4f98fd23b370799c2598053b5","address":"NQ7KwEzta2CJz2MCFzq2xf8jyH8UUE7PpU"},{"name":"spacecat","public_key":"028238f44d4449f58157426fce815acf39e996efe13a5a251c5efb32c93b0004f4","address":"NRMsBEVsg3NBDVwRParmF8pr6VzusdsTWv"},{"name":"nakamoto","public_key":"02b186c7fb05fb5d9e95bd3e3038d47d05bd3d51af12e4b8df360a59e511f026cd","address":"NSsrynyYiioV1eBaErxLp2npmQ7skaTx6h"},{"name":"gilgacat","public_key":"0287f7c0da034bcf675c3221e29360f40ee77a5bc48e21acfccc87ded63125acc7","address":"NZC8CFpi4H9H11ktdKXFxBdsQkw5mnZAwZ"},{"name":"newkindofcat","public_key":"02466da3cbc24b7ae2942f772183df8c52f0ec205a42afa48c6bad610a692bf7d6","address":"NRC8KQQtmkcP95vHazWGJHnZQDJV8167tp"},{"name":"testtest","public_key":"03fcc36672abfc00c41f9febd200ce0bd03a38bb8ce38f9edfa7a65d9d4ea8165d","address":"NgmrzbqhPQ2tpySFJYgY8gZf1bMQAE6nP8"},{"name":"testtesttest","public_key":"02113fc95f9bed707cddd0e9b1f7074f773f602c971e8e9084390bf3ce2d521478","address":"NTAXQ8YTviziFWVPPBRfPw7M1rGi3zih8s"},{"name":"thisistest","public_key":"0362da1f4cb51fe366a024673c9502d0d64ce4cffd8bf4e0e214293894c82defca","address":"NgdkJ4ZyJz7vU6BDRFGJdv3GN9VWRj4atp"},{"name":"testingfor","public_key":"02feaa6d25b1108adb1b469c1b5e4779d8ad7c697b4e64c8199dba696ce1534714","address":"NiqrJZQ6jfUdcJpQoRZBua5Nfe6CRZaTv1"},{"name":"testingforit","public_key":"034c07b8984ca1e856d46539a7f018e0c188647e0b9157f53f43557e6b089cf9fd","address":"NbKuXqz6BvKrD8XRjj8orTFoU3n1qdMzab"},{"name":"thisisit","public_key":"0327094063c04cfdfaa901b1f9439bfcc2a66b2bc9fac041e639cad578fa4e50cd","address":"NZfM9gBmpcwZQiH81m3C2or4dtwT1STteV"},{"name":"lolololololo","public_key":"02e00b1420b69885566650738e8eb058daa1a91044cbe97b99c3e0fe2f59ceb279","address":"NVwW4z5qjZxzyAxsXFMtxzgr6La7u147XH"},{"name":"abcdefgh","public_key":"03d4561027fc39afdbd32078790aecc84b317bb27f89df15295bfca63718add2cd","address":"Nj951SrpqXo1Byu9GpTSS7ptEjCyht9kwL"},{"name":"abcdefghi","public_key":"035fa25366ff8f252ddf8032b0b83a0129116f2abb55176bf82ed9ee9817a0268d","address":"NW3EWzzUVhHi12f2ACfi3yAtypmh82ASkT"},{"name":"nknwhale","public_key":"03c7582b7dc5af6db032a89e287c882d6e88b7cb2214432e58ddd30c51419ff8c7","address":"NgCckkmDFZmEDtwvZMNtC2ruVydYKRWpAB"},{"name":"devilmaycry","public_key":"02f8ba2c84332ea88d22c0315f417eefe1e72f7d1337f6dbd84fb460fad317090a","address":"NZbsqPWxjs3gjEEomdND79VsQeFgddZU5W"},{"name":"quakeworld","public_key":"02f3b9c6aff59c8f91d82cfd2e807f2d46ad1cef569015f17e45454f847fbe25df","address":"Na7DUWWXW7RZvN1iT2GECZFPcmKYzGBxSk"},{"name":"skysniper","public_key":"03f713a7791b905346cd5d49279f17c6ff007dc5c70ac9dfe772a62b6bb1cf3c4d","address":"NWbU9NsEWTu6m4cksh2BbXFtUfjkS5YKbU"},{"name":"mickeyelias","public_key":"03512f021576915fc15839af651ce949eb893a26b2b4e6bc9e00f9546f1f16e0ec","address":"NQdFyui3Kvy7ZMK53dfadhiv9jfb8hPZR2"},{"name":"gunitlabs","public_key":"03012aafea9eec71516955a74b87888aa64eeca49ea5ba968f8a1622d84d75819b","address":"Niyk1YEoU6ocoCXHEjsGRVosTt5yMMZUTq"},{"name":"gunitlabsone","public_key":"034b10a9a11ba3b4fede8a4d201ef2facbc48fbfa9321d88c8a2c372dc7fd54de4","address":"NPphmLhepSRR6PgsbwPSj33daGPHZGj3EB"},{"name":"menkalinan","public_key":"02b15aca8a5af6c2f05de3e988241a23351b3654c9709d8c1031ac4027e07e4f1d","address":"NfX9JT73WEwHJRC1Uspdqiz1JhJo8ayeu9"},{"name":"bartneyzz","public_key":"027c538847e693217be88627809793f5f9828381331bdc4771e5f6f13c0f4561fb","address":"NLbM8xPMV6yCriQs5wtUKKjiUJTshKyint"},{"name":"apisittt","public_key":"0315389dbc9b309ebd169b13e9758e7552984f42385cd55b5a4f27c27e17d85339","address":"NWrYnKkXNpNwVU3WmswxAdKNws6dpWV9ff"},{"name":"somename","public_key":"0384735d420e9b7dae7d5619586901892987249ab01371f97e9bbdf581e4c7a685","address":"NXZySnV8N9fN8WNfhLfx6cRAmqvSXPkqSQ"}],
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