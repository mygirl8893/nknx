// Line Chart Widget
import { Line } from 'vue-chartjs'
import { ChartConfig } from "Constants/chart-config";
import axios from "axios";

export default {
   extends: Line,
   data() {
      return {
         chartdata:{
             days : [],
             blocks :[],
         },
         options: {
            elements: { point: { radius:0,hitRadius: 5, hoverRadius: 5  } },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
               yAxes: [{
                  id: 'Blocks',
                  type: 'linear',
                  position: 'left',
                  ticks: {
                    beginAtZero: true,
                     display: true
                  },
                  gridLines: {
                     display: true,
                     drawBorder: true,
                  }
               }],
               xAxes: [{
                  ticks: {
                     display: true,
                     beginAtZero: true,
                     autoSkip: false,
    
                  },
                  gridLines: {
                     display: true,
                     drawBorder: true
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
        let chartdata = {
            days : [],
            blocks :[]
        }
      	axios.get('https://nknx.org/api/statistics/daily/blocks').then(function(blocks){
        blocks.data.forEach(function(entry) {
             chartdata.days.push(entry.date);
             chartdata.blocks.push(entry.count)
        });
        //Last 2 weeks
        chartdata.days = chartdata.days.slice(0,14)
        chartdata.days.reverse()
        chartdata.blocks = chartdata.blocks.slice(0,14)
        chartdata.blocks.reverse()
        self.chartdata = chartdata
            self.renderChart({
                labels: self.chartdata.days,
                datasets: [
                    {
                        label: 'Blocks',
                        yAxisID: 'Blocks',
                        data: self.chartdata.blocks,
                        lineTension: 0.1,
                        borderColor: ChartConfig.color.primary,
                        fill: false,
                        borderWidth: 2 // and not lineWidth
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
    this.interval = setInterval(this.getChart, 60000);
   },
   created(){
    this.getChart()
   }
   
}
