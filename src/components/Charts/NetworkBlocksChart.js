// Line Chart Widget
import { Line } from 'vue-chartjs'
import { ChartConfig } from "Constants/chart-config";
import { Timeouts } from "Constants/timeouts";
import axios from "axios";
import Chart from 'chart.js'

var gradientLinePlugin = {
    // Called at start of update.
    afterLayout: function(chartInstance) {
      if (chartInstance.options.linearGradientLine2) {
        // The context, needed for the creation of the linear gradient.
        var ctx = chartInstance.chart.ctx;
        // The first (and, assuming, only) dataset.
        var dataset = chartInstance.config.data.datasets[0];
        var dataset1 = chartInstance.config.data.datasets[1];
        var dataset2 = chartInstance.config.data.datasets[2];
        // Calculate min and max values of the dataset.
        var minValue = Number.MAX_VALUE;
        var maxValue = Number.MIN_VALUE;
        for (var i = 0; i < dataset.data.length; ++i) {
          if (minValue > dataset.data[i])
            minValue = dataset.data[i];
          if (maxValue < dataset.data[i])
            maxValue = dataset.data[i];
        }
        var minValue1 = Number.MAX_VALUE;
        var maxValue1 = Number.MIN_VALUE;
        for (var i = 0; i < dataset1.data.length; ++i) {
          if (minValue1 > dataset1.data[i])
            minValue1 = dataset1.data[i];
          if (maxValue1 < dataset1.data[i])
            maxValue1 = dataset1.data[i];
        }
        var minValue2 = Number.MAX_VALUE;
        var maxValue2 = Number.MIN_VALUE;
        for (var i = 0; i < dataset2.data.length; ++i) {
          if (minValue2 > dataset2.data[i])
            minValue2 = dataset2.data[i];
          if (maxValue2 < dataset2.data[i])
            maxValue2 = dataset2.data[i];
        }
        // Calculate Y pixels for min and max values.
        var yAxis = chartInstance.scales.Blocks;

        //console.log("USD");
        //console.log("minValue: " + minValue);
        //console.log("maxValue: " + maxValue);
        if(yAxis){
         var minValueYPixel = yAxis.getPixelForValue(minValue);
         var maxValueYPixel = yAxis.getPixelForValue(maxValue);
         var minValue1YPixel = yAxis.getPixelForValue(minValue1);
         var maxValue1YPixel = yAxis.getPixelForValue(maxValue1);
         var minValue2YPixel = yAxis.getPixelForValue(minValue2);
         var maxValue2YPixel = yAxis.getPixelForValue(maxValue2);

        //console.log("minValueYPixel: " + minValueYPixel);
        //console.log("maxValueYPixel: " + maxValueYPixel);


         if(!isNaN(minValueYPixel) && !isNaN(maxValueYPixel) ){

               // Create the gradient.
               var gradient = ctx.createLinearGradient(0, minValueYPixel, 0, maxValueYPixel);

               gradient.addColorStop(0.85, 'rgba(0,115,231, 1.0)');
               gradient.addColorStop(1, '#42b7bd');
               // Assign the gradient to the dataset's border color.
               dataset.borderColor = gradient;
         }
         if(!isNaN(minValue1YPixel) && !isNaN(maxValue1YPixel) ){

            // Create the gradient.
            var gradient1 = ctx.createLinearGradient(0, minValue1YPixel, 0, maxValue1YPixel);

            gradient1.addColorStop(0.85, '#279a32');
            gradient1.addColorStop(1, '#0cc51e');
            // Assign the gradient to the dataset's border color.
            dataset1.borderColor = gradient1;

        }
        if(!isNaN(minValue2YPixel) && !isNaN(maxValue2YPixel) ){
            // Create the gradient.
            var gradient2 = ctx.createLinearGradient(0, minValue2YPixel, 0, maxValue2YPixel);

            gradient2.addColorStop(0.85, 'rgba(251,92,62, 1.0)');
            gradient2.addColorStop(1, '#e1a661');
            // Assign the gradient to the dataset's border color.
            dataset2.borderColor = gradient2;
         }
        }
      }
    }
  };

  Chart.plugins.register(gradientLinePlugin);

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
            linearGradientLine2: true,
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
                     display: false,
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
      	axios.get('statistics/daily/blocks').then(function(blocks){
        blocks.data.forEach(function(entry) {
             chartdata.days.push(entry.date);
             chartdata.blocks.push(entry.count)
        });
        //Producer blocks
        let producer = '022d52b07dff29ae6ee22295da2dc315fef1e2337de7ab6e51539d379aa35b9503';
        axios.get('statistics/daily/blocks?pubkey='+producer).then(function(producerBlocks){
        producerBlocks.data.forEach(function(entry) {
             chartdata.producerBlocks.push(entry.count)
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
                        lineTension: 0.5,
                        borderColor: "rgba(0,115,231, 1.0)",
                        fill: false,
                        borderWidth: 3 // and not lineWidth
                    },
                    {
                        label: 'Genesis producer',
                        yAxisID: 'Blocks',
                        data: self.chartdata.producerBlocks,
                        lineTension: 0.5,
                        borderColor: "#0cc51e",
                        fill: false,
                        borderWidth: 3 // and not lineWidth
                    },
                    {
                        label: 'Miners',
                        yAxisID: 'Blocks',
                        data: self.chartdata.minersBlocks,
                        lineTension: 0.5,
                        borderColor: "rgba(251,92,62, 1.0)",
                        fill: false,
                        borderWidth: 3 // and not lineWidth
                    },
                ]
            }, self.options);
        });
        })
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
