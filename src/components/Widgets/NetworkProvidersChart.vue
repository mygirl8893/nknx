<template>
    <div class="table-responsive">
        <app-section-loader :status="loader"></app-section-loader>
        <v-card-title><h3>{{$t('message.nodeProviders')}}: {{totalProviders}}</h3></v-card-title>
        <NetworkProvidersChart></NetworkProvidersChart>
    </div>
</template>
<script>
import axios from "axios";
import NetworkProvidersChart from "Components/Charts/NetworkProvidersChart";
import { Timeouts } from "Constants/timeouts";

export default {
    components: {
        NetworkProvidersChart
    },
    data() {
        return {
            interval: null,
            loader: true,
            totalProviders: 'Loading...',
        };
    },
    destroyed() {
        clearInterval(this.interval);
    },
    created(){
        this.getProviders()
    },
    mounted: function() {
        this.interval = setInterval(this.getProviders, Timeouts.medium);
    },
    methods: {
        getProviders(){
        const self = this;
        let providerNodeList = {}
        axios.get('crawledNodes?withLocation=true').then(function(nodeList){
            nodeList.data.forEach(function(node) {
            let provider = node.organization
                if(providerNodeList.hasOwnProperty(provider)){
                  providerNodeList[provider] ++
                } else{
                  providerNodeList[provider] = 1
                }
            })
            self.totalProviders = Object.keys(providerNodeList).length
            self.loader = false
        })
        }
    }
};
</script>