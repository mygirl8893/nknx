// Line Chart Widget
import { Line } from 'vue-chartjs'
import { ChartConfig } from "Constants/chart-config";
import axios from "axios";

var gradientLinePlugin = {
    // Called at start of update.
    afterLayout: function(chartInstance) {
        //console.log(chartInstance);
      if (chartInstance.options.linearGradientLine) {
        // The context, needed for the creation of the linear gradient.
        var ctx = chartInstance.chart.ctx;
        // The first (and, assuming, only) dataset.
        var dataset = chartInstance.config.data.datasets[0];
        // Calculate min and max values of the dataset.
        var minValue = Number.MAX_VALUE;
        var maxValue = Number.MIN_VALUE;
        for (var i = 0; i < dataset.data.length; ++i) {
          if (minValue > dataset.data[i])
            minValue = dataset.data[i];
          if (maxValue < dataset.data[i])
            maxValue = dataset.data[i];
        }
        // Calculate Y pixels for min and max values.
        var yAxis = chartInstance.scales.Transfers;
        if(yAxis){
        //console.log("USD");
        //console.log("minValue: " + minValue);
        //console.log("maxValue: " + maxValue);

        var minValueYPixel = yAxis.getPixelForValue(minValue);
        var maxValueYPixel = yAxis.getPixelForValue(maxValue);

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
         },
         options: {
            linearGradientLine: true,
            elements: { point: { radius:0,hitRadius: 5, hoverRadius: 5  } },
            tooltips: {
            backgroundColor: '#FFF',
            titleFontSize: 12,
            titleFontColor: '#1D2733',
            bodyFontColor: '#1D2733',
            },
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
                        lineTension: 0.5,
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
    this.interval = setInterval(this.getChart, 36000000);
   },
   created(){
    this.getChart()
   }
   
}
