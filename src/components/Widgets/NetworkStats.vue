<template>
    <div>
        <app-section-loader :status="loader"></app-section-loader>
        <div class='network-card'>
            <div class="network-card__item">
                <div class="network-card__item-title">{{$t('message.totalNodes')}}</div>
                <div class="network-card__item-value"><span v-html="nodeIcon" class="icon"></span>{{crawlCounter}}</div>
            </div>
            <div class="network-card__item">
                <div class="network-card__item-title">{{$t('message.networkStatus')}}</div>
                <div class="network-card__item-value"><span v-html="statusIcon" class="icon"></span>{{seedStatus}}</div>
            </div>
            <div class="network-card__item">
                <div class="network-card__item-title">{{$t('message.networkVersion')}}</div>
                <div class="network-card__item-value"><span v-html="versionIcon" class="icon"></span>{{seedVersion}}</div>
            </div>
            <div class="network-card__item">
                <div class="network-card__item-title">{{$t('message.networkCurrentBlock')}}</div>
                <div class="network-card__item-value"><span v-html="blockIcon" class="icon"></span>{{seedLatestBlock}}</div>
            </div>
            <div class="network-card__item">
                <div class="network-card__item-title">{{$t('message.networkMempool')}}</div>
                <div class="network-card__item-value"><span v-html="mempoolIcon" class="icon"></span>{{seedMempool}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import { Timeouts } from "Constants/timeouts";
import feather from 'feather-icons';

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
        this.interval = setInterval(this.getNetworkState, Timeouts.short);
    },
    computed: {
        statusIcon: function () {
            return feather.icons['activity'].toSvg()
        },
        nodeIcon: function () {
            return feather.icons['droplet'].toSvg()
        },
        versionIcon: function () {
            return feather.icons['git-branch'].toSvg()
        },
        blockIcon: function () {
            return feather.icons['box'].toSvg()
        },
        mempoolIcon: function () {
            return feather.icons['layers'].toSvg()
        }
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