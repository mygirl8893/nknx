<template>
    <div>
        <app-section-loader :status="loader"></app-section-loader>
            <div class='stats-wrapper'>
                <div class="stats-card">
                    <div class="stats-card__data">
                        <div class="stats-card__data-title">NKN {{$t('message.price')}}</div>
                        <div class="stats-card__data-value">$ {{nknPrice}}</div>
                    </div>
                    <div class="stats-card__chart">
                        <PriceChart :height='100' :width='100'></PriceChart>
                    </div>
                </div>
            </div>
    </div>
</template>
<script>
import axios from "axios";
import { Timeouts } from "Constants/timeouts";
import PriceChart from "Components/Charts/NetworkStats/PriceChart";

export default {
    components: {
        PriceChart
    },
    data() {
        return {
            interval: null,
            loader: true,
            nknPrice: 0,
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
        this.interval = setInterval(this.getMarketStats, Timeouts.short);
    },
    methods: {
        getMarketStats(){
            const self = this
            self.loader = true
            axios.get('https://api.coinmarketcap.com/v2/ticker/2780/')
                .then(response => {
                    self.nknPrice = response.data.data.quotes.USD.price.toFixed(3)
                    self.nknWeekly = response.data.data.quotes.USD.percent_change_7d
                })
                .catch(function(error){
                    self.nknPrice = 'error';
                    self.nknWeekly = 'error';
                })
            self.loader = false
        }
    }
};
</script>