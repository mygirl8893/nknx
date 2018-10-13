<template>
    <div>
        <app-section-loader :status="loader"></app-section-loader>
        <v-flex d-flex sm12 xs12 style='flex-flow: row wrap'>
            <div class='flex w-20 d-md-half-block w-600-full card-wrapper --green'>
                <v-card-title>
                    <v-layout column>
                        <div class="card__title">NKN {{$t('message.price')}}</div>
                        <div class="card__content">${{nknPrice}}</div>
                    </v-layout>
                </v-card-title>
            </div>
            <div class='flex w-20 d-md-half-block w-600-full card-wrapper --blue'>
                <v-card-title>
                    <v-layout column>
                        <div class="card__title">{{$t('message.marketcap')}}</div>
                        <div class="card__content">${{nknCap}}M</div>
                    </v-layout>
                </v-card-title>
                
            </div>
            <div class='flex w-20 d-md-half-block w-600-full card-wrapper --green'>
                <v-card-title>
                    <v-layout column>
                        <div class="card__title">{{$t('message.dailyVolume')}}</div>
                        <div class="card__content">${{nknVolume}}K</div>
                    </v-layout>
                </v-card-title>
            </div>
            <div class='flex w-20 d-md-half-block w-600-full card-wrapper --blue'>
                <v-card-title>
                    <v-layout column>
                        <div class="card__title">{{$t('message.marketRank')}}</div>
                        <div class="card__content">#{{nknRank}}</div>
                    </v-layout>
                </v-card-title>
            </div>
            <div class='flex w-20 d-md-full w-600-full card-wrapper --green'>
                <v-card-title>
                    <v-layout column>
                        <div class="card__title">{{$t('message.change24')}}h</div>
                        <div class="card__content">{{nkn24}}%</div>
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
            nknPrice: 0,
            nknRank: 0,
            nknCap: 0,
            nknVolume: 0,
            nkn24: 0,
            nknWeekly: 0
        }
    },
    destroyed() {
        clearInterval(this.interval);
    },
    created: function() {
       this.getMarketStats()
    },
    mounted: function() {
        
    },
    methods: {
        getMarketStats(){
            const self = this
            axios.get('https://api.coinmarketcap.com/v2/ticker/2780/')
                .then(response => {
                    self.nknPrice = response.data.data.quotes.USD.price.toFixed(3)
                    self.nknRank = response.data.data.rank
                    self.nknCap = ((response.data.data.quotes.USD.market_cap) / 1000000).toFixed(2)
                    self.nknVolume = ((response.data.data.quotes.USD.volume_24h) / 1000).toFixed(2)
                    self.nkn24 = response.data.data.quotes.USD.percent_change_24h
                    self.nknWeekly = response.data.data.quotes.USD.percent_change_7d
                })
                .catch(function(error){
                    self.nknPrice = 'error';
                    self.nknRank = 'error';
                    self.nknCap = 'error';
                    self.nknVolume = 'error';
                    self.nkn24 = 'error';
                    self.nknWeekly = 'error';
                })
            self.loader = false
        }
    }
};
</script>