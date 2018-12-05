// Line Chart Widget
import { Line } from 'vue-chartjs'
import { Timeouts } from "Constants/timeouts";
import axios from "axios";
import { ChartConfig } from "Constants/chart-config";

export default {
   extends: Line,
   data() {
      return {
         chartdata:{
             days : [],
             priceUSD :[],
         },
         options: {
            elements: { point: { radius:0,hitRadius: 5, hoverRadius: 5  } },
            tooltips: {
            enabled: false
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
               yAxes: [{
                  display: false,
                  ticks: {
                     display: false
                  },
                  gridLines: {
                     display: false,
                  }
               }],
               xAxes: [{
                  display: false,
                  ticks: {
                     display: false,
                  },
                  gridLines: {
                     display: false,
                  }
               }]
            },
            legend: {
               display: false
            }
         }
      }
   },
   methods: {
   	getChart(){
		const self = this;
      	axios.get('https://min-api.cryptocompare.com/data/histoday?fsym=NKN&tsym=USD&limit=7&aggregate=1&e=CCCAGG').then(function(responseUSD){
        responseUSD.data.Data.forEach(function(entry) {
          self.chartdata.days.push(self.$moment.unix(entry.time));
          self.chartdata.priceUSD.push(entry.open);
        });
            self.renderChart({
                labels: self.chartdata.days,
                datasets: [
                    {
                        data: self.chartdata.priceUSD,
                        lineTension: 0.5,
                        borderColor: '#fff',
                        fill: false,
                        pointHoverRadius: 5,
                        pointBackgroundColor: "#FFF",
                        borderWidth: 3 // and not lineWidth
                    }
                ]
            }, self.options);
        });
   	}
  },
  destroyed(){
    clearInterval(this.interval);
  },
   mounted() {
    this.interval = setInterval(this.getChart, Timeouts.long);
   },
   created(){
    this.getChart()
   }
   
}
