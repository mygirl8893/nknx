<template>
    <div>
        <app-section-loader :status="loader"></app-section-loader>
        <v-flex d-flex sm12 xs12 style='flex-flow: row wrap'>
            <div class='flex w-20 d-md-half-block w-600-full card-wrapper --red'>
                <v-card-title>
                    <v-layout column>
                        <div class="card__title">{{$t('message.totalNodes')}}</div>
                        <div class="card__content">{{crawlCounter}}</div>
                    </v-layout>
                </v-card-title>
            </div>
            <div class='flex w-20 d-md-half-block w-600-full card-wrapper --green'>
                <v-card-title>
                    <v-layout column>
                        <div class="card__title">{{$t('message.networkStatus')}}</div>
                        <div class="card__content">{{seedStatus}}</div>
                    </v-layout>
                </v-card-title>
                
            </div>
            <div class='flex w-20 d-md-half-block w-600-full card-wrapper --blue'>
                <v-card-title>
                    <v-layout column>
                        <div class="card__title">{{$t('message.networkVersion')}}</div>
                        <div class="card__content">{{seedVersion}}</div>
                    </v-layout>
                </v-card-title>
            </div>
            <div class='flex w-20 d-md-half-block w-600-full card-wrapper --green'>
                <v-card-title>
                    <v-layout column>
                        <div class="card__title">{{$t('message.networkCurrentBlock')}}</div>
                        <div class="card__content">{{seedLatestBlock}}</div>
                    </v-layout>
                </v-card-title>
            </div>
            <div class='flex w-20 d-md-full w-600-full card-wrapper --red'>
                <v-card-title>
                    <v-layout column>
                        <div class="card__title">{{$t('message.networkMempool')}}</div>
                        <div class="card__content">{{seedMempool}}</div>
                    </v-layout>
                </v-card-title>
            </div>
        </v-flex>
    </div>
</template>
<script>
import axios from "axios";

export default {
    data() {
        return {
            interval: null,
            loader: true,
            crawlCounter: "Loading...",
            seedMempool: "Loading...",
            seedStatus: "Loading...",
            seedVersion: "Loading...",
            seedLatestBlock: "Loading..."
        };
    },
    destroyed() {
        clearInterval(this.interval);
    },
    created: function() {
        this.getNetworkState()
    },
    mounted: function() {
        this.interval = setInterval(this.getNetworkState, 30000);
    },
    methods: {
    getNetworkState(){
            const self = this
            axios.post('http://testnet-node-0001.nkn.org:30003/', {
                    "jsonrpc": "2.0",
                    "method": "getrawmempool",
                    "params": {},
                    "id": 1
                })
                .then((response) => {
                    self.seedMempool = response.data.result.length

                })
                .catch((error) => {

                });

            axios.post('http://testnet-node-0001.nkn.org:30003/', {
                    "jsonrpc": "2.0",
                    "method": "getnodestate",
                    "params": {},
                    "id": 1
                })
                .then((response) => {
                    self.seedStatus = response.data.result.SyncState
                })
                .catch((error) => {

                });

            axios.post('http://testnet-node-0001.nkn.org:30003/', {
                    "jsonrpc": "2.0",
                    "method": "getversion",
                    "params": {},
                    "id": 1
                })
                .then((response) => {
                    self.seedVersion = response.data.result.substring(0, 7)

                })
                .catch((error) => {

                });

            axios.post('http://testnet-node-0001.nkn.org:30003/', {
                    "jsonrpc": "2.0",
                    "method": "getlatestblockheight",
                    "params": {},
                    "id": 1
                })
                .then((response) => {
                    self.seedLatestBlock = response.data.result

                })
                .catch((error) => {

                });


            axios.get('crawledNodes', {})
            .then((response) => {
                self.crawlCounter = response.data.length
            })  

            self.loader = false
        }
    }
};
</script>