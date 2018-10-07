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
             priceUSD :[],
             priceETH :[]
         },
         options: {
            elements: { point: { radius:0,hitRadius: 5, hoverRadius: 5  } },
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
                        if (dt.getHours()==0) {          
                                return dt.getDate() + '.' + monthNames[dt.getMonth()];
                        }
                        else if (dt.getHours()==12){
                            return dt.getHours() + ":00";
                        }


                      }
                
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
      axios.get('https://min-api.cryptocompare.com/data/histohour?fsym=NKN&tsym=USD').then(function(responseUSD){
        responseUSD.data.Data.forEach(function(entry) {
            self.chartdata.days.push(self.$moment.unix(entry.time));
            self.chartdata.priceUSD.push(entry.open);
        });
        axios.get('https://min-api.cryptocompare.com/data/histohour?fsym=NKN&tsym=ETH').then(function(responseETH){
            responseETH.data.Data.forEach(function(entry) {
                self.chartdata.priceETH.push(entry.open);
            });

           
        

        
            self.renderChart({
                labels: self.chartdata.days,
                datasets: [
                    {
                        label: 'USD',
                        yAxisID: 'USD',
                        data: self.chartdata.priceUSD,
                        lineTension: 0.1,
                        backgroundColor: "transparent",
                        borderColor: ChartConfig.color.primary,
                        fill: false,
                        borderWidth: 2 // and not lineWidth
                    },
                    {
                        label: 'ETH',
                        yAxisID: 'ETH',
                        data: self.chartdata.priceETH,
                        lineTension: 0.1,
                        backgroundColor: "transparent",
                        borderColor: ChartConfig.color.secondary,
                        fill: false,
                        borderWidth: 2 // and not lineWidth
                        },
                ]
            }, self.options);
        });
      });

   },
   
}
