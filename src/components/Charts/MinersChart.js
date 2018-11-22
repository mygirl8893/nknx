// Pie Chart Widget
import { Pie } from 'vue-chartjs'
import { ChartConfig } from "Constants/chart-config";
import axios from "axios";

export default {
   extends: Pie,
   data() {
      return {
         chartdata:{
          address: [],
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

  },
   mounted() {
    const self = this;
        axios.get('statistics/miners?latest=50').then(function(addresses){
            // get only top 50 miners

            addresses.data.forEach(function(address) {
                self.chartdata.address.push(address.address);
                self.chartdata.value.push(address.total*10);
            })

            let colorsCount = self.chartdata.value.length;
            let colors = [];

            while(colorsCount > 0){
              let letters = '0123456789ABCDEF';
              let color = '#';
              for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
              }
              colors.push(color)
              colorsCount-=1
            }
            self.colors = colors

            self.renderChart({
                labels: self.chartdata.address,
                datasets: [
                    {
                        data: self.chartdata.value,
                        backgroundColor: colors,
                        fill: true
                    }
                ]
            }, self.options);
        });

   },
   
}
