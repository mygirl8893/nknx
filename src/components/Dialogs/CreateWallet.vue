<template>
	<v-card>
        <v-card-title class="headline">{{$t('message.createWallet')}}</v-card-title>
		<v-container grid-list-xl pt-0>
            <v-card-text>
                <template
                    v-if="step==0"
                    colClasses="xl12 lg12 md12 sm12 xs12"
                    :footer="true"
                >
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
                            </v-form>
                        </v-flex>
                    </v-layout>
                    <v-btn :disabled="!valid || loading" :loading="loading" v-on:click="createWallet()" slot="footer" color="gradient-primary" small>{{$t('message.create')}}</v-btn>
                </template>
                <template
                    v-if="step==1"
                    colClasses="xl12 lg12 md12 sm12 xs12"
                    :footer="true"
                >
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
                    <v-btn :disabled="!s1valid" :loading="loading" v-on:click="getPK()" slot="footer" color="gradient-primary" small>{{$t('message.continue')}}</v-btn>
                </template>
                <template
                    v-if="step==2"
                    colClasses="xl12 lg12 md12 sm12 xs12"
                    :footer="true"
                >
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
                    <v-btn v-on:click="walletCreated()" :disabled="!s2valid" slot="footer" color="gradient-primary" small>{{$t('message.done')}}</v-btn>
                </template>
            </v-card-text>
		</v-container>
	</v-card>
</template>

<script>
  import nknWallet from "nkn-wallet";

  export default {
        props: {
            walletCreated: { type: Function }
        },
		mounted: function(){
			nknWallet.configure({
				rpcAddr: 'https://nknx.org:30003',
			});
		},
		methods: {
			createWallet(){
				if(this.valid){
					this.loading = true;
					this.wallet = nknWallet.newWallet('pwd');
					this.walletFile = this.wallet.toJSON();
					this.loading = false;
					this.step = 1;
					this.$store.dispatch("addToAddressesStore", this.wallet.address);
					this.$store.dispatch("setSelectedAddress", this.wallet.address);
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
				return this.walletFile.length > 0 ? "data:text/plain;charset=utf-8," + encodeURIComponent(this.walletFile) : 'javascript:void(0);';
			}
   		},
		data () {
			return {
				snackbar: false,
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