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
                <div class="network-card__item-title">{{$t('message.network')}} {{$t('message.latestBlock')}} {{$t('message.created')}}</div>
                <div class="network-card__item-value"><span v-html="timeIcon" class="icon"></span>{{ $moment(seedLatestBlockTime).fromNow() }}</div>
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
            seedStatus: "Loading...",
            seedVersion: "Loading...",
            seedLatestBlock: "Loading...",
            seedLatestBlockTime: "Loading..."
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
        statusIcon: function() {
            return feather.icons['activity'].toSvg()
        },
        nodeIcon: function() {
            return feather.icons['droplet'].toSvg()
        },
        versionIcon: function() {
            return feather.icons['git-branch'].toSvg()
        },
        blockIcon: function() {
            return feather.icons['box'].toSvg()
        },
        timeIcon: function() {
            return feather.icons['clock'].toSvg()
        }
    },
    methods: {
        getNetworkState() {
            const self = this
            axios.get('statistics/network').then(function(response) {
                self.seedStatus = response.data.status
                self.seedLatestBlock = response.data.current_height
                self.seedLatestBlockTime = response.data.latest_block
                self.seedVersion = response.data.version
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