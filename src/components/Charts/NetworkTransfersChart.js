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
                  id: 'Transfers',
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
            transfers :[]
        }
      	axios.get('statistics/daily/transfers').then(function(transfers){
        transfers.data.forEach(function(entry) {
             chartdata.days.push(entry.date);
             chartdata.transfers.push(entry.count)
        });
        //Last 2 weeks
        chartdata.days = chartdata.days.slice(0,14)
        chartdata.days.reverse()
        chartdata.transfers = chartdata.transfers.slice(0,14)
        chartdata.transfers.reverse()
        self.chartdata = chartdata
            self.renderChart({
                labels: self.chartdata.days,
                datasets: [
                    {
                        label: 'Transfers',
                        yAxisID: 'Transfers',
                        data: self.chartdata.transfers,
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