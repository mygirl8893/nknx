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
             producerBlocks: []
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
               }
               ],
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
               display: true
            }
         }
      }
   },
   methods: {
   	getChart(){
		const self = this;
        let chartdata = {
            days : [],
            blocks :[],
            producerBlocks: [],
            minersBlocks: []
        }
        //Producer blocks
        let producer = '022d52b07dff29ae6ee22295da2dc315fef1e2337de7ab6e51539d379aa35b9503';
        axios.get('statistics/daily/blocks?pubkey='+producer).then(function(producerBlocks){
        producerBlocks.data.forEach(function(entry) {
             chartdata.producerBlocks.push(entry.count)
        });
        })
      	axios.get('statistics/daily/blocks').then(function(blocks){
        blocks.data.forEach(function(entry) {
             chartdata.days.push(entry.date);
             chartdata.blocks.push(entry.count)
        });
        //Last 2 weeks
        chartdata.days = chartdata.days.slice(0,14)
        chartdata.days.reverse()
        chartdata.blocks = chartdata.blocks.slice(0,14)
        chartdata.blocks.reverse()
        chartdata.producerBlocks = chartdata.producerBlocks.slice(0,14)
        chartdata.producerBlocks.reverse()
        //Miners
        for(let i = 0; i<chartdata.producerBlocks.length; i++){
          chartdata.minersBlocks.push(chartdata.blocks[i] - chartdata.producerBlocks[i])
        }
        self.chartdata = chartdata
            self.renderChart({
                labels: self.chartdata.days,
                datasets: [
                    {
                        label: 'Total blocks',
                        yAxisID: 'Blocks',
                        data: self.chartdata.blocks,
                        lineTension: 0.1,
                        borderColor: ChartConfig.color.primary,
                        fill: false,
                        borderWidth: 2 // and not lineWidth
                    },
                    {
                        label: 'Genesis producer',
                        yAxisID: 'Blocks',
                        data: self.chartdata.producerBlocks,
                        lineTension: 0.1,
                        borderColor: ChartConfig.color.secondary,
                        fill: false,
                        borderWidth: 2 // and not lineWidth
                    },
                    {
                        label: 'Miners',
                        yAxisID: 'Blocks',
                        data: self.chartdata.minersBlocks,
                        lineTension: 0.1,
                        borderColor: ChartConfig.color.success,
                        fill: false,
                        borderWidth: 2 // and not lineWidth
                    },
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
