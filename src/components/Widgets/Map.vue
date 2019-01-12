<template>
    <div class="nkn-explorer-index-internet-topology-panel nkn-explorer-card-shadow">
        <app-section-loader :status="loader"></app-section-loader>
        <h5>{{$t('message.totalNodesCounter')}} {{crawlCounter}}</h5>
        <div class="internet-topology map"></div>
    </div>
</template>
<script>
import $ from "jquery";
import "raphael"
import "jquery-mapael";
import 'jquery-mapael/js/maps/world_countries.js';
import axios from "axios";
import { Timeouts } from "Constants/timeouts";

export default {
    props: ["query"],
    data() {
        return {
            interval: null,
            plotsName: [],
            plots: {},
            crawlCounter: null,
            countryNodeList: {},
            currentPlots: []
        }
    },
    created(){
      this.getPolots()
    },
    mounted() {
      this.interval = setInterval(this.relayPath, Timeouts.short/2);
    },
    destroyed() {
        clearInterval(this.interval);
    },
    methods: {
      getPolots(){
        const self = this;
        self.loader = true
        let plots = {}
        let plotsName = []
        axios.get('crawledNodes?withLocation=true').then(function(nodeList){
          nodeList = nodeList.data
          self.crawlCounter = nodeList.length
          self.countryNodeList = {};
          nodeList.forEach(function(node) {
            plotsName.push(node.city)
            plots[node.city] = self.buildPlots(node.latitude, node.longitude, node.city, node.ip)
            //Nodes in country Counter
            if(node.country_code2 != null){
                let countryCode = node.country_code2
                if(self.countryNodeList.hasOwnProperty(countryCode)){
                  self.countryNodeList[countryCode].value++
                } else{
                  self.countryNodeList[countryCode] = {"value": 1}
                }
            }
          });
          self.plotsName = plotsName
          self.plots = plots
          let $this = $(".nkn-explorer-index-internet-topology-panel")
          $this.mapael({
              map: {
                  name: "world_countries",
                  defaultArea: {
                      attrs: {
                          fill: "#c8e0ff",
                          stroke: "#e4e7ed",
                          "stroke-width": 1
                      },
                      attrsHover: {
                          fill: "#0073E7",
                      }
                  }
              },
              legend: {
                area: {
                  slices: [
                    {
                        min: 1,
                        max: 10,
                        attrs: {
                          fill: "#b3d4ff"
                        }
                    },
                    {
                        min: 11,
                        max: 100,
                        attrs: {
                          fill: "#99c5ff"
                        }
                    },
                    {
                        min: 101,
                        max: 500,
                        attrs: {
                          fill: "#76b1ff"
                        }
                    },
                    {
                        min: 501,
                        attrs: {
                          fill: "#3f92ff"
                        }
                    },
                  ]
                }
              },
              areas: self.countryNodeList,
              plots: plots,
          })
          self.loader = false;
          self.relayPath()
        });
      },
      buildPlots(lat, lng, city, ip) {
          return {
              latitude: lat,
              longitude: lng,
              tooltip: {
                  content: this.buildContent(city, ip)
              },
              size: 10,
              attrs: {
                  fill: "#28B725",
                  stroke: "#fff",
                  "stroke-width": 1
              },
              attrsHover: {
                  fill: "#0073E7",
                  "stroke-width": 2
              }
          }
      },
      buildContent(city, ip) {
          return "<div class='internet-topology-tooltip-text'>" +
              "<span class='internet-topology-tooltip-point'></span>" +
              "<span class='internet-topology-tooltip-cnnt'>connected</span>" +
              "</div>" +
              "<div class='internet-topology-tooltip-text'>" + city + "</div>" +
              "<div class='internet-topology-tooltip-text'>IP: " + ip + "</div>"
      },
      clearMapRelayLine(callback) {
          let $this = $(".nkn-explorer-index-internet-topology-panel")
          $this.trigger('update', [{
              deleteLinkKeys: "all",
              afterUpdate: function() {
                  callback()
              }
          }])
      },
      relayPath() {
          const self = this
          let cityNames = []
          let btweens = []
          let j = 0
          axios.get("transactions/"+self.query).then(function(response){
          if(self.query === "?latest=1&txType=66"){
            var nodeTracer = response.data[0].node_tracing
          } else{
            var nodeTracer = response.data.node_tracing
          }

          for (let i = 1; i<nodeTracer.length-1;i++){
            if(nodeTracer[i].city != null){
              cityNames.push(nodeTracer[i].city)
            }
          }

          if (self.currentPlots.length > 0){
            let $this = $(".nkn-explorer-index-internet-topology-panel")
            let updatedPlots = self.plots
              for (let i =0;i<self.currentPlots.length;i++){
                updatedPlots[self.currentPlots[i]].attrs.fill = "#28B725"
                updatedPlots[self.currentPlots[i]].attrs.transform = "s1"
              }
              $this.trigger('update', [{
                deletePlotKeys: self.currentPlots,
                newPlots: updatedPlots
              }])
          }

          let c1 = cityNames[0]
          if(cityNames.length>2){
            for (let i = 1; i < cityNames.length; i++) {
              let c2 = cityNames[i]
              btweens[j] = [c1, c2]
              c1 = c2
              j++
            }
          } else{
            btweens[j] = [c1, c1]
          }
            if(cityNames.length>0){
              self.clearMapRelayLine(function() {
                self.mapRelayAni(btweens, 0)
              })
            }
            
            self.currentPlots = cityNames
          });
          
      },
      mapRelayAni(betweens, idx) {
          if (idx >= betweens.length) {                
              return
          }

          let $this = $(this.$el)
          let _this = this
          let newLink = {}
          let updatedPlots = this.plots
          let deletePlots = []
          for (let i = 0; i<betweens[idx].length;i++){
            let activeItem = betweens[idx][i]
            updatedPlots[activeItem].attrs.fill = "#fb5b40"
            updatedPlots[activeItem].attrs.transform = "s1.5"
            deletePlots.push(activeItem)
          }
          newLink[idx] = {
              between: betweens[idx],
              attrs: {
                  stroke: "#fb5b40",
                  "stroke-width": 2
              }
          }

          $this.trigger('update', [{
              newLinks: newLink,
              deletePlotKeys: deletePlots,
              newPlots: updatedPlots,
              animDuration: 400,
              afterUpdate: function() {
                  setTimeout(function() {
                      _this.mapRelayAni(betweens, idx + 1)
                  }, 200)
              }
          }])
      }
    }
}
</script>
<style>
.mapael .map {
  position: relative;
}
.mapael .map svg{
  overflow: overlay !important;
}

.mapael .mapTooltip {
    border-radius: 5px;
    position: absolute;
    background-color: #0073E7;
    padding: 10px;
    z-index: 1000;
    min-width: 200px;
    display: none;
    color: #ffffff;
    font-size: 14px;
    box-shadow: rgba(0, 0, 0, 0.12) 0 2px 6px, rgba(0, 0, 0, 0.24) 0 1px 2px;
}

.mapael .mapTooltip .internet-topology-tooltip-point {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background: #28B725;
}

.mapael .mapTooltip .internet-topology-tooltip-text {
    margin-bottom: 2px;
}

.mapael .mapTooltip .internet-topology-tooltip-cnnt {
    padding-left: 4px;
}
</style>