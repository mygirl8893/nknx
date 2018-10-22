<template>
	<div>
		<div id="world-map" style="width: 100%; height: 500px"></div>
	</div>
</template>

<script>
import $ from "jquery";
import { ChartConfig } from "Constants/chart-config";
import axios from "axios";

export default {
  mounted() {
  	let nodes = []
  	let countryNodeList= {}
  	axios.get('crawledNodes?withLocation=true').then(function(nodeList){
        nodeList.data.forEach(function(node) {
        	let regionMarker = ''
        	if(node.city != null){
        		regionMarker = node.city
        	} else if (node.region_name != null){
        		regionMarker = node.region_name
        	} else if(node.country_name != null){
        		regionMarker = node.country_name
        	} else{
        		regionMarker = '???'
        	}
        	//Nodes in country Counter
        	if(node.country_code != null){
				let countryCode = node.country_code
        			if(countryNodeList.hasOwnProperty(countryCode)){
        				countryNodeList[countryCode] ++
        			} else{
        				countryNodeList[countryCode] = 0
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
            fill: ChartConfig.color.primary
          }
        },
        backgroundColor: ChartConfig.color.white,
        markers: nodes,
        series: {
        	regions: [{
          		scale: ['#DEEBF7', '#08519C'],
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
    };
  }
};
</script>
