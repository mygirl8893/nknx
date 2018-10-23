// Horizontal Bar Chart Widget
import { Doughnut } from 'vue-chartjs'
import { ChartConfig } from "Constants/chart-config";
import axios from "axios";

export default {
   extends: Doughnut,
   data() {
      return {
        interval: null,
         chartdata:{
          country: [],
          value: []
         },
         colors: [],
         options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
               display: false
            }
         }
      }
   },
   methods: {
    getProvidersData(){
        const self = this;
        let providerNodeList = {}
        let othersCounter = 0
        axios.get('crawledNodes?withLocation=true').then(function(nodeList){
            nodeList.data.forEach(function(node) {
            let provider = node.organization
                if(providerNodeList.hasOwnProperty(provider)){
                  providerNodeList[provider] ++
                } else{
                  providerNodeList[provider] = 1
                }
            })
            for(let provider in providerNodeList) {
              //If provider value < 15 nodes add it to others
                if(providerNodeList[provider]<15){
                  othersCounter+=providerNodeList[provider]
                  delete providerNodeList[provider]
                }
            }
           providerNodeList['Others'] = othersCounter
           self.chartdata.country = Object.keys(providerNodeList)
           self.chartdata.value = Object.values(providerNodeList)
           self.renderChart({
                labels: self.chartdata.country,
                datasets: [
                    {
                        data: self.chartdata.value,
                        backgroundColor: ChartConfig.color.primary,
                        fill: true
                    }
                ]
            }, self.options);
          })
    }
  },
  created(){
    this.getProvidersData()
  },
  destroyed(){
    clearInterval(this.interval);
  },
   mounted() {
    this.interval = setInterval(this.getProvidersData, 60000);
   }
   
}
