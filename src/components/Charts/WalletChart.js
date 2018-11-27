// Line Chart Widget
import { Line } from 'vue-chartjs'
import { ChartConfig } from "Constants/chart-config";
import axios from "axios";


var gradientLinePlugin2 = {
    // Called at start of update.
    afterLayout: function(chartInstance) {
        //console.log(chartInstance);
      if (chartInstance.options.linearGradientLine) {
        // The context, needed for the creation of the linear gradient.
        var ctx2 = chartInstance.chart.ctx;
        // The first (and, assuming, only) dataset.
        var dataset2 = chartInstance.config.data.datasets[0];
        // Calculate min and max values of the dataset.
        var minValue2 = Number.MAX_VALUE;
        var maxValue2 = Number.MIN_VALUE;
        for (var i = 0; i < dataset2.data.length; ++i) {
          if (minValue2 > dataset2.data[i])
            minValue2 = dataset2.data[i];
          if (maxValue2 < dataset2.data[i])
            maxValue2 = dataset2.data[i];
        }
        // Calculate Y pixels for min and max values.
        var yAxis2 = chartInstance.scales.NKN;

        if(yAxis2){
        //console.log("USD");
        //console.log("minValue: " + minValue);
        //console.log("maxValue: " + maxValue);

        var minValue2YPixel = yAxis2.getPixelForValue(minValue2);
        var maxValue2YPixel = yAxis2.getPixelForValue(maxValue2);

        //console.log("minValueYPixel: " + minValueYPixel);
        //console.log("maxValueYPixel: " + maxValueYPixel);


        if(!isNaN(minValue2YPixel) && !isNaN(maxValue2YPixel) ){

            // Create the gradient.
            var gradient2 = ctx2.createLinearGradient(0, minValue2YPixel, 0, maxValue2YPixel);

            gradient2.addColorStop(0.85, 'rgba(0,115,231, 1.0)');
            gradient2.addColorStop(1, '#42b7bd');
            // Assign the gradient to the dataset's border color.
            dataset2.borderColor = gradient2;
        }
        }

      }
    }
  };

  Chart.plugins.register(gradientLinePlugin2);

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
      	axios.get('walletAddresses/'+id+'/miningOutput?latest=14').then(function(responseUSD){
        responseUSD.data.forEach(function(entry) {
            blocks.push(entry.date);
            nkn.push(entry.count*15)
        });
            //Last 2 weeks
            self.chartdata.days = blocks
            self.chartdata.days.reverse()
            self.chartdata.nkn = nkn
            self.chartdata.nkn.reverse()
            self.renderChart({
                labels: self.chartdata.days,
                datasets: [
                    {
                        label: 'NKN',
                        yAxisID: 'NKN',
                        data: self.chartdata.nkn,
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
   watch: { 
  	currentId: function(newVal, oldVal) { 
      this.getChart(this.currentId)
    }
},
   mounted() {

   },
   
}
