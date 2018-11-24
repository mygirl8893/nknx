<template>
	<div>
		<app-section-loader :status="loader"></app-section-loader>
		<h5>{{$t('message.totalNodesCounter')}} {{crawlCounter}}</h5>
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
    crawlCounter: 'Loading...',
    nodes: [],
    countryNodeList: {},
    mapObj :{}
  	}
  },
  destroyed() {
        clearInterval(this.interval);
        this.mapObj.remove();
  },
  created: function(){
    var self = this;
  	this.updateNodeList().then(function(){
      self.createMap();
    });
  },
  mounted() {
    var self = this;
    this.interval = setInterval(function(){
      self.updateNodeList().then(function(){
          self.mapObj.remove();
          self.createMap();
      });
    }, 60000);
  },
  methods: {
    updateNodeList(){
      return new Promise((resolve, reject) => {
        const self = this;
        self.loader = true
        axios.get('crawledNodes', {})
        .then((response) => {
            self.crawlCounter = response.data.length
        })  

        axios.get('crawledNodes?withLocation=true').then(function(nodeList){
          self.nodes= []
          self.countryNodeList={};
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
                if(self.countryNodeList.hasOwnProperty(countryCode)){
                  self.countryNodeList[countryCode] ++
                } else{
                  self.countryNodeList[countryCode] = 1
                }
            }
            self.nodes.push({latLng: [node.latitude, node.longitude], name: regionMarker})
            
          });
          self.loader= false
          resolve();
        });
      });
      
    },
    createMap() {
      var self = this;
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
        markers: self.nodes,
        series: {
          regions: [{
              scale: ['#c4d9ec', '#08519C'],
              attribute: 'fill',
              values: self.countryNodeList
          }]
        },
        onRegionTipShow: function(event, label, index) {
          if(self.countryNodeList[index] === undefined){
            self.countryNodeList[index] = 0
          }
          label.html(
            label.html()+'</br>'+
            'Total Nodes: ' + self.countryNodeList[index]
          );
        }
      });

      self.mapObj = $("#world-map").vectorMap('get', 'mapObject');
      var center = self.mapObj.pointToLatLng(self.mapObj.width / 2, self.mapObj.height / 2);

      var config = {
          animate: true,
          lat: center.lat,
          lng: center.lng,
          scale: 1
      }

      self.mapObj.setFocus(config)
      
    }
  }
};
</script>
