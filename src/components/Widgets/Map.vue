<template>
	<div>
		<app-section-loader :status="loader"></app-section-loader>
		<h2>{{$t('message.totalNodesCounter')}} {{crawlCounter}}</h2>
		<div id="world-map" style="width: 100%; height: 500px"></div>
	</div>
</template>

<script>
import $ from "jquery";
import { ChartConfig } from "Constants/chart-config";
import axios from "axios";

export default {
  data(){
  	return {
    interval: null, 
		loader: true,
		crawlCounter: 'Loading...'
  	}
  },
  destroyed() {
        clearInterval(this.interval);
  },
  created: function(){
  	this.getMap()
  },
  mounted() {
    this.interval = setInterval(this.getMap, 30000);
  },
  methods: {
    getMap(){
      $("#world-map").empty()
      const self = this;
      self.loader = true
      axios.get('https://nknx.org/api/crawledNodes', {})
      .then((response) => {
          self.crawlCounter = response.data.length
      })  

      let nodes = []
      let countryNodeList= {}
      axios.get('crawledNodes?withLocation=true').then(function(nodeList){
        nodeList.data.forEach(function(node) {
          let regionMarker = ''
          if(node.city != null){
            regionMarker = node.city
          } else if(node.country_name != null){
            regionMarker = node.country_name
          } else{
            regionMarker = '???'
          }
          //Nodes in country Counter
          if(node.country_code2 != null){
        let countryCode = node.country_code2
              if(countryNodeList.hasOwnProperty(countryCode)){
                countryNodeList[countryCode] ++
              } else{
                countryNodeList[countryCode] = 1
              }
          }
           nodes.push({latLng: [node.latitude, node.longitude], name: regionMarker})
           
        });
        createMap()
    })
    let createMap = function() {
      $("#world-map").vectorMap({
        map: "world_mill_en",
        scaleColors: ["#C8EEFF", "#0071A4"],
        normalizeFunction: "polynomial",
        hoverOpacity: 0.7,
        hoverColor: false,
        markerStyle: {
          initial: {
            fill: ChartConfig.color.warning,
            stroke: ChartConfig.color.warning
          }
        },
        regionStyle: {
          initial: {
            fill: '#DEEBF7'
          }
        },
        backgroundColor: ChartConfig.color.white,
        markers: nodes,
        series: {
          regions: [{
              scale: ['#c4d9ec', '#08519C'],
              attribute: 'fill',
              values: countryNodeList
          }]
      },
        onRegionTipShow: function(event, label, index){
          if(countryNodeList[index] === undefined){
            countryNodeList[index] = 0
          }
          label.html(
          label.html()+'</br>'+
          'Total Nodes: ' + countryNodeList[index]
        );
      }
      });
      self.loader= false
    };  

    }
  }
};
</script>
