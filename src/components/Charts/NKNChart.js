// Line Chart Widget
import { Line } from 'vue-chartjs'
import { ChartConfig } from "Constants/chart-config";
import { hexToRgbA } from "Helpers/helpers";
import axios from "axios";

export default {
   extends: Line,
   data() {
      return {
         chartdata:{
             days : [],
             priceUSD :[],
             priceETH :[]
         },
         gradient1: null,
         options: {
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
                     beginAtZero: true
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
    getHistoricalData() {

      
    }
  },
   mounted() {
    const self = this;
    //some axios stuff
      axios.get('https://min-api.cryptocompare.com/data/histoday?fsym=NKN&tsym=USD').then(function(responseUSD){
        responseUSD.data.Data.forEach(function(entry) {
            self.chartdata.days.push(self.$moment.unix(entry.time).format('MMM DD'));
            self.chartdata.priceUSD.push(entry.open);
        });
        axios.get('https://min-api.cryptocompare.com/data/histoday?fsym=NKN&tsym=ETH').then(function(responseETH){
            responseETH.data.Data.forEach(function(entry) {
                self.chartdata.priceETH.push(entry.open);
            });

           
            let ctx = self.$refs.canvas.getContext('2d')
            let _stroke = ctx.stroke
            ctx.stroke = function () {
                ctx.save()
                ctx.shadowColor = 'rgba(0,0,0,0.5)'
                ctx.shadowBlur = 8
                ctx.shadowOffsetX = 0
                ctx.shadowOffsetY = 4
                _stroke.apply(this, arguments)
                ctx.restore()
            }
        
            let gradientColor = ' '
            self.gradient1 = self.$refs.canvas.getContext('2d').createLinearGradient(0, 110, 0, 0)
            self.gradient1.addColorStop(0, hexToRgbA(ChartConfig.color.white, 0.2))
            self.gradient1.addColorStop(0.5, hexToRgbA(ChartConfig.color.info, 0.2))
        
            self.gradient2 = self.$refs.canvas.getContext('2d').createLinearGradient(0, 110, 0, 0)
            self.gradient2.addColorStop(0, hexToRgbA(ChartConfig.color.white, 0.1))
            self.gradient2.addColorStop(0.5, hexToRgbA(ChartConfig.color.primary, 0.1))
        
            self.renderChart({
                labels: self.chartdata.days,
                datasets: [
                    {
                        label: 'USD',
                        yAxisID: 'USD',
                        data: self.chartdata.priceUSD,
                        lineTension: 0.5,
                        backgroundColor: "transparent",
                        borderColor: ChartConfig.color.primary,
                        lineTension: 0,
                        fill: true
                    },
                    {
                        label: 'ETH',
                        yAxisID: 'ETH',
                        data: self.chartdata.priceETH,
                        lineTension: 0.5,
                        backgroundColor: "transparent",
                        borderColor: ChartConfig.color.secondary,
                        lineTension: 0,
                        fill: true
                        },
                ]
            }, self.options);
        });
      });

   },
   
}
