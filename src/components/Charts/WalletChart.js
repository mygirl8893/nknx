// Line Chart Widget
import { Line } from 'vue-chartjs'
import { ChartConfig } from "Constants/chart-config";
import axios from "axios";

export default {
   extends: Line,
   props: ['currentId'],
   data() {
      return {
         chartdata:{
             days : [],
             nkn :[],
         },
         options: {
            elements: { point: { radius:0,hitRadius: 5, hoverRadius: 5  } },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
               yAxes: [{
                  id: 'NKN',
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
   	getChart(id){
		const self = this;
	    let blocks = []
	    let nkn = []
      	axios.get('walletAddresses/'+id+'/miningOutput').then(function(responseUSD){
        responseUSD.data.forEach(function(entry) {
            blocks.push(entry.date);
            nkn.push(entry.count*15)
        });
            //Last 2 weeks
            self.chartdata.days = blocks.slice(0,14)
            self.chartdata.days.reverse()
            self.chartdata.nkn = nkn.slice(0,14)
            self.chartdata.nkn.reverse()
            self.renderChart({
                labels: self.chartdata.days,
                datasets: [
                    {
                        label: 'NKN',
                        yAxisID: 'NKN',
                        data: self.chartdata.nkn,
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
   watch: { 
  	currentId: function(newVal, oldVal) { 
      this.getChart(this.currentId)
    }
},
   mounted() {

   },
   
}
