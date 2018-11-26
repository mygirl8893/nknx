<template>
    <div>
        <v-layout row wrap>
            <v-flex xs12 v-if="!$store.getters.walletfile">
                {{$t('message.detailsNoWallet')}}
            </v-flex>
            <v-flex xs12 v-else>
                <v-layout row wrap>
                    <v-flex xs12>
                        {{$t('message.yourAddress')}}
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xl4 lg4 md4 sm12 xs12>
                        <v-text-field
                            style="padding-top:0px"
                            v-clipboard:copy="address"
                            v-clipboard:success="onCopy1"
                            v-model="address"
                            name="input-10-1"
                        ></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs12 >
                     {{$t('message.walletFile')}}
                    </v-flex>
                </v-layout>
                <v-layout row wrap> 
                        <v-btn color="gradient-primary" style="margin-bottom:35px;" download="wallet.dat" :href="downloadUrl">
                            {{$t('message.downloadWallet')}}
                        </v-btn>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs12>
                     {{$t('message.yourPk')}}
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xl4 lg4 md4 sm12 xs12>
                        <v-text-field
                            :type="show1 ? 'text' : 'password'"
                            style="padding-top:0px"
                            v-clipboard:copy="pk"
                            v-clipboard:success="onCopy2"
                            v-model="pk"
                            name="input-10-1"
                        ></v-text-field>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </div>
</template>
<script>
import axios from "axios";
import { mapGetters } from 'vuex'
  export default {
	methods: {
		getWalletInformation() {
			if(this.$store.getters.walletfile){
                this.address = this.$store.getters.walletfile.address;
                this.pk = this.$store.getters.walletfile.getPrivateKey();
			}
        },
        onCopy1(){
            this.$store.dispatch("setSnackbar", this.$t('message.AddressCopiedSuccessful'));
        },
        onCopy2(){
            this.$store.dispatch("setSnackbar", this.$t('message.PkCopiedSuccessful'));
        }
    },
	mounted: function(){
		this.getWalletInformation();
    },
    watch: {
        walletfile: function () {
            this.getWalletInformation();
        }
    },
    computed: {
        downloadUrl() {
            var walletfileString = this.$store.getters.walletfile.toJSON();
            return walletfileString.length > 0 ? "data:text/plain;charset=utf-8," + encodeURIComponent(walletfileString) : 'javascript:void(0);';
        },
        ...mapGetters({
        walletfile: 'walletfile'
        })
   	},
	data(){
		return {
           address:"",
           pk:"",
           snackbar1: false,
           snackbar2: false,
           show1:false

			

		}
	}
	
  }
</script>
