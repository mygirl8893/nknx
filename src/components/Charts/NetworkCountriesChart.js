// Horizontal Bar Chart Widget
import { HorizontalBar } from 'vue-chartjs'
import { ChartConfig } from "Constants/chart-config";
import axios from "axios";
import { Timeouts } from "Constants/timeouts";

export default {
   extends: HorizontalBar,
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
    getCountriesData(){
        const self = this;
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
           self.chartdata.country = Object.keys(countryNodeList)
           self.chartdata.value = Object.values(countryNodeList)
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
    this.getCountriesData()
  },
  destroyed(){
    clearInterval(this.interval);
  },
   mounted() {
    this.interval = setInterval(this.getCountriesData, Timeouts.medium);
   }
   
}
