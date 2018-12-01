<template>
    <div class="table-responsive">
        <app-section-loader :status="loader"></app-section-loader>
        <v-card-title><h3>{{$t('message.countriesTotal')}}: {{totalCountries}}</h3></v-card-title>
        <NetworkCountriesChart ref="NetworkCountriesChart"></NetworkCountriesChart>
    </div>
</template>
<script>
import axios from "axios";
import { Timeouts } from "Constants/timeouts";
import NetworkCountriesChart from "Components/Charts/NetworkCountriesChart";

export default {
    components: {
        NetworkCountriesChart
    },
    data() {
        return {
            interval: null,
            loader: true,
            totalCountries: 'Loading...',
        };
    },
    destroyed() {
        clearInterval(this.interval);
    },
    created(){
        this.getCountries()
    },
    mounted: function() {
        this.interval = setInterval(this.getCountries, Timeouts.medium);
    },
    methods: {
        getCountries(){
            const self = this
            let countryNodeList = {}
            axios.get('crawledNodes?withLocation=true').then(function(nodeList){
            nodeList.data.forEach(function(node) {
            let countryName = node.country_name
                if(countryNodeList.hasOwnProperty(countryName)){
                  countryNodeList[countryName] ++
                } else{
                  countryNodeList[countryName] = 1
                }
            })
           self.totalCountries = Object.keys(countryNodeList).length
           self.loader = false
          })
            
        }
    }
};
</script>