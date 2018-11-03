<template>
    <div class="table-responsive">
        <app-section-loader :status="loader"></app-section-loader>
        <v-flex d-flex>
            <v-text-field
                v-model="blocktime"
                :label="$t('message.blockPerSec')"
                style = 'margin: 5px'
            ></v-text-field>
            <v-text-field
                v-model="totalNodes"
                :label="$t('message.totalNodes')"
                style = 'margin: 5px'
            ></v-text-field>
            <v-text-field
                v-model="userNodes"
                :label="$t('message.userNodes')"
                style = 'margin: 5px'
            ></v-text-field>
        </v-flex>
        <v-flex d-flex>
            <v-text-field
                v-model="workingTime"
                :label="$t('message.workingTime')"
                style = 'margin: 5px'
            ></v-text-field>
            <v-text-field
                v-model="nodeCost"
                :label="$t('message.nodeCost')"
                style = 'margin: 5px'
            ></v-text-field>
            <v-text-field
                v-model="bandWidthCost"
                :label="$t('message.bandWidthCost')"
                style = 'margin: 5px'
            ></v-text-field>
        </v-flex>
        <v-container fluid pt-0 grid-list-xl>
            <div>{{$t('message.testnetPerDay')}}: <b>{{testTokensDaily}} NKN</b></div>
            <div>{{$t('message.testnetTotal')}} {{workingTime}} {{$t('message.months')}}: <b>{{totalTestTokens}} NKN</b></div>
            <div>{{$t('message.mainnetTotal')}} {{workingTime}} {{$t('message.months')}}: <b>{{totalMainTokens}} NKN</b></div>
            <div>{{$t('message.usdDaily')}}: <b>${{usdProfitPerDay}}</b></div>
            <div>{{$t('message.usdMonthly')}} {{workingTime}} {{$t('message.months')}}: <b>${{usdProfit}}</b></div>
        </v-container>
    </div>
</template>
<script>
import axios from "axios";

export default {
    data() {
        return {
            interval: null,
            loader: true,
            blocktime: 12,
            nodeCost: 0,
            workingTime: 1,
            userNodes: 1,
            bandWidthCost: 0,
            testTokensDaily: 0,
            totalTestTokens: 0,
            totalMainTokens: 0,
            usdProfitPerDay: 0,
            usdProfit: 0,
            nknPrice: 0,
            totalNodes: 0,
            crawlCounter: 'Loading...'

        };
    },
    destroyed() {
        clearInterval(this.interval);
    },
    created: function() {
        this.getCalcData()
    },
    mounted: function() {
        
    },
    updated(){
         this.miningCalc()
    },
    methods: {
        miningCalc(){
            const self = this
            const secDay = 86400
            let dailyMined = (secDay / self.blocktime) * 15
            let totalNodeCost = self.nodeCost * self.workingTime * self.userNodes
            let totalBandwidthCost = self.bandWidthCost * self.workingTime * self.userNodes
            let dailyNodeCost = self.nodeCost / 30 * self.userNodes
            let dailyBandwidthCost = self.bandWidthCost / 30 * self.userNodes
            self.testTokensDaily = (dailyMined * self.userNodes / self.totalNodes).toFixed(0)
            self.totalTestTokens = (self.testTokensDaily * 30 * self.workingTime).toFixed(0)
            self.totalMainTokens = (self.totalTestTokens / 5).toFixed(0)
            self.usdProfitPerDay = (self.testTokensDaily / 5 * self.nknPrice - dailyBandwidthCost - dailyNodeCost).toFixed(2)
            self.usdProfit = (self.nknPrice * self.totalMainTokens - totalBandwidthCost - totalNodeCost).toFixed(2)
        },
        getCalcData(){
            const self = this
            axios.get('https://api.coinmarketcap.com/v2/ticker/2780/')
            .then(response => {
                self.nknPrice = response.data.data.quotes.USD.price.toFixed(3)
            })
            .catch(function(error){
                self.nknPrice = 'error';
            })

            axios.get('https://nknx.org/api/crawledNodes', {})
            .then((response) => {
                self.crawlCounter = response.data.length
                self.totalNodes = self.crawlCounter
                self.loader = false
            })

            axios.get('nodes', {
            })
            .then((response) => {
                self.userNodes = response.data.length
            })
 
        }
    }
};
</script>