<template>
    <div>
        <v-layout row wrap>
            <v-flex xs12 v-if="!$store.getters.walletfile">
                {{$t('message.transferNoWallet')}}
            </v-flex>
            <v-flex xs12 v-else>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-text-field
                            :label="$t('message.to')"
                            v-model="to"
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
                        <v-btn @click.native.stop="dialog = true" :disabled="!to || !amount" color="gradient-primary">{{$t('message.send')}}</v-btn> 
                        <v-dialog v-model="dialog" max-width="500">
                            <v-card>
                                <v-card-title class="headline">{{$t('message.confirmTransfer')}}</v-card-title>
                                <v-card-text>
                                    <p>{{$t('message.transferInformation')}}</p>
                                    <p>{{$t('message.amount')}}: <b>{{amount}}</b></p>
                                    <p>{{$t('message.to')}}: <b>{{to}}</b></p>
                                    <p><b>{{$t('message.confirmByPassword')}}</b></p>
                                    <p>
                                        <v-text-field
                                            v-model="password"
                                            :append-icon="show1 ? 'visibility_off' : 'visibility'"
                                            :label="$t('message.password')"
                                            :type="show1 ? 'text' : 'password'"
                                            @click:append="show1 = !show1"
                                        ></v-text-field>
                                    </p>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="error" flat="flat" @click.native="dialog = false">{{$t('message.cancel')}}</v-btn>
                                    <v-btn color="gradient-primary" :disabled="!password" flat="flat" @click.native="transferAmount">{{$t('message.send')}}</v-btn>
                                </v-card-actions>
                            </v-card>
					    </v-dialog>
                </v-layout> 

            </v-flex>
        </v-layout>
            <v-snackbar
                :timeout="3000"
                v-model="snackbar1"
                color="success"
            >
            {{ $t('message.amountSentSuccessful') }}
            </v-snackbar>
            <v-snackbar
                :timeout="3000"
                v-model="snackbar2"
                color="error"
            >
            {{ $t('message.amountSentError') }}
            </v-snackbar>

    </div>
</template>
<script>
import axios from "axios";
import { mapGetters } from 'vuex'
import nknWallet from "nkn-wallet";

  export default {
	methods: {
        transferAmount(){
            var self=this;
            this.dialog=false;
            this.walletfile.transferTo(this.to, this.amount, this.password).then(function(data) {
                self.snackbar1=true;
                self.password="";
            }).catch(function(error) {
                console.log(error);
                self.snackbar2=true;
                self.password="";
            })
        },
        onCopy1(){
            this.snackbar1 = true;
        },
    },
	mounted: function(){
        nknWallet.configure({
            rpcAddr: 'https://nknx.org:30003',
        });
		
    },
    watch: {
        walletfile: function () {
            
        }
    },
    computed: {
        ...mapGetters({
        walletfile: 'walletfile'
        })
   	},
	data(){
		return {
            password:"",
            show1:false,
            dialog:false,
            snackbar1: false,
            snackbar2: false,
            valid:true,
            amount:null,
            to: "",


			

		}
	}
	
  }
</script>
