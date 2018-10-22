<template>
    <div class="table-responsive">
        <app-section-loader :status="loader"></app-section-loader>
        <v-card-title><h2>{{$t('message.minersTotal')}}: {{totalMiners}}</h2></v-card-title>
        <MinersChart style='height:300px'></MinersChart>
        <v-card-title><i>{{$t('message.topMinersDecr')}}</i></v-card-title>
    </div>
</template>
<script>
import axios from "axios";
import MinersChart from "Components/Charts/MinersChart";

export default {
    components: {
        MinersChart
    },
    data() {
        return {
            interval: null,
            loader: true,
            totalMiners: 'Loading...'
        };
    },
    destroyed() {
        clearInterval(this.interval);
    },
    created: function() {
        
    },
    mounted: function() {
        const self = this;
        axios.get('https://nknx.org/api/outputs/?by_miner=true').then(function(addresses){
            self.totalMiners = addresses.data.length
            self.loader = false
        });
    },
    methods: {
    
    }
};
</script>