// Line Chart Widget
import Chart from 'chart.js'
import { Line } from 'vue-chartjs'
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
        var yAxis = chartInstance.scales.USD;

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

        // The context, needed for the creation of the linear gradient.
        var ctx1 = chartInstance.chart.ctx;
        // The first (and, assuming, only) dataset.
        var dataset1 = chartInstance.config.data.datasets[1];
        // Calculate min and max values of the dataset.
        var minValue1 = Number.MAX_VALUE;
        var maxValue1 = Number.MIN_VALUE;
        for (var i = 0; i < dataset1.data.length; ++i) {
          if (minValue1 > dataset1.data[i])
            minValue1 = dataset1.data[i];
          if (maxValue1 < dataset1.data[i])
            maxValue1 = dataset1.data[i];
        }
        // Calculate Y pixels for min and max values.
        var yAxis1 = chartInstance.scales.ETH;

        //console.log("ETH");
        //console.log("minValue: " + minValue1);
        //console.log("maxValue: " + maxValue1);

        var minValue1YPixel = yAxis1.getPixelForValue(minValue1);
        var maxValue1YPixel = yAxis1.getPixelForValue(maxValue1);

        //console.log("minValueYPixel: " + minValue1YPixel);
        //console.log("maxValueYPixel: " + maxValue1YPixel);

        if(!isNaN(minValue1YPixel) && !isNaN(maxValue1YPixel) ){

            // Create the gradient.
            var gradient1 = ctx1.createLinearGradient(0, minValue1YPixel, 0, maxValue1YPixel);

            gradient1.addColorStop(0.85, 'rgba(251,92,62, 1.0)');
            gradient1.addColorStop(1, '#e1a661');
            // Assign the gradient to the dataset's border color.
            dataset1.borderColor = gradient1;

        }

      }
    }
  };

  Chart.plugins.register(gradientLinePlugin);



export default {
   extends: Line,
   props: {
    chartdata: {
      type: Object,
      default: null
    }
   },
   data() {
      return {
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
                  id: 'USD',
                  type: 'linear',
                  position: 'left',
                  ticks: {
                    // beginAtZero: true,
                     display: true
                  },
                  gridLines: {
                     display: true,
                     drawBorder: true,
                  }
               },
               {
                id: 'ETH',
                type: 'linear',
                position: 'right',
                ticks: {
                   //beginAtZero: true,
                   display: true
                },
                gridLines: {
                   display: false,
                   drawBorder: true,
                }
             }],
               xAxes: [{
                  ticks: {
                     display: true,
                     beginAtZero: true,
                     autoSkip: false,
                     userCallback: function(item, index) {
                        var dt = new Date(item);
                        var monthNames = [
                            "Jan", "Feb", "Mar",
                            "Apr", "May", "June", "July",
                            "Aug", "Sep", "Oct",
                            "Nov", "Dec"
                          ];
      
                                return dt.getDate() + '.' + monthNames[dt.getMonth()];
                      }
                  },
                  gridLines: {
                     display: false,
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

  },
   mounted() {
    this.renderChart({
        labels: this.chartdata.days,
        datasets: [
            {
                label: 'USD',
                yAxisID: 'USD',
                data: this.chartdata.priceUSD,
                lineTension: 0.5,
                fill: false,
                pointHoverRadius: 5,
                pointBackgroundColor: "#FFF",
                borderWidth: 3 // and not lineWidth
            },
            {
                label: 'ETH',
                yAxisID: 'ETH',
                data: this.chartdata.priceETH,
                lineTension: 0.5,
                fill: false,
                pointHoverRadius: 5,
                pointBackgroundColor: "#FFF",
                borderWidth: 3 // and not lineWidth
            },
        ]
    }, this.options);

   },
   
}
