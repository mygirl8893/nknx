<template>
	<v-menu offset-y left origin="right top" z-index="99" content-class="notification-dropdown notifications" transition="slide-y-transition" nudge-top="-10">
		<v-btn class="notification-icon ma-0" v-bind:class="{ active: active}" icon large slot="activator" v-html="iconSvg"></v-btn>
		<div class="dropdown-content">
			<div class="dropdown-top d-custom-flex justify-space-between">
				<span class="white--text fw-bold">Notifications</span>
				<span class="v-badge warning">{{notifications.length}} NEW</span>
			</div>
			<v-list class="dropdown-list">
				<v-list-tile v-for="notification in notifications" :key="notification.id">
					<div class="notifications-item">
						<span class='notifications-item__icon' v-html="notificationIcon(notification.icon)"></span>
						<span class='notifications-item__text' v-if='notification.type === "stateError"'>{{$t('message.node')}} <strong>{{notification.node}}</strong> {{$t('message.isOffline')}}</span>
						<span class='notifications-item__text' v-if='notification.type === "stateWarning"'>{{$t('message.node')}} <strong>{{notification.node}}</strong> {{$t('message.isIn')}} {{notification.state}} {{$t('message.state')}}</span>
						<span class='notifications-item__text' v-if='notification.type === "versionWarning"'>{{$t('message.node')}} <strong>{{notification.node}}</strong> {{$t('message.versionOutdated')}}</span>
						<span class='notifications-item__text' v-if='notification.type === "networkStateWarning"'>{{$t('message.networkState')}} <strong>{{notification.state}}</strong></span>
						<span class='notifications-item__text' v-if='notification.type === "nodeLatestBlockWarning"'>{{$t('message.node')}} <strong>{{notification.node}}</strong> {{$t('message.latestBlockNotSync')}}</span>
						<div class="notifications-item__date">{{$moment(notification.timestamp).format('MMMM Do YYYY, h:mm:ss a')}}</div>
					</div>
				</v-list-tile>
			</v-list>
		</div>
	</v-menu>
</template>

<script>
	import feather from 'feather-icons';
	import axios from "axios";
	import { Timeouts } from "Constants/timeouts";
	export default {
		data() {
			return {
				interval: null,
				active: false,
				timer: "",
				notifications: []
			};
		},
		computed: {
			iconSvg: function () {
				return feather.icons['bell'].toSvg()
			}
		},
		created: function(){
    		this.getNotifications();
    	},
	    mounted: function(){
	       this.interval = setInterval(this.getUserNodes, Timeouts.short);
	    },
		destroyed() {
	        clearInterval(this.interval);
	    },
	    methods: {
	    	notificationIcon: function (icon) {
				return feather.icons[icon].toSvg()
			},
	    	getNotifications() {
	            const self = this;
	            self.notifications = []
	            axios.post('https://nknx.org:30003/', {
                    "jsonrpc": "2.0",
                    "method": "getversion",
                    "params": {},
                    "id": 1
                })
                .then((version) => {
                   let networkVersion = version.data.result

                   axios.post('https://nknx.org:30003/', {
                    "jsonrpc": "2.0",
                    "method": "getnodestate",
                    "params": {},
                    "id": 1
	                })
	                .then((response) => {
	                	console.log(response)
	                    let networkState = response.data.result.SyncState
	                    let latestNetworkBlock = response.data.result.Height

	                    axios.get('nodes', {})
		                .then((nodes) => {
		                	nodes = nodes.data
		                	console.log(nodes)
		                	let errorId = 0
		                    for(let i = 0; i<nodes.length; i++){
		                    	//State error
		                    	if(nodes[i].online === 0){
		                    		errorId++
		                    		self.notifications.push({
		                    			id: errorId,
		                    			icon: "alert-triangle",
		                    			type: "stateError",
		                    			timestamp: nodes[i].updated_at,
		                    			node: nodes[i].addr,
		                    			state: "Offline"
		                    		})
		                    	}
		                    	//SyncStarted and SyncFinished warning
		                    	if(nodes[i].syncState === "SyncFinished" || nodes[i].syncState === "SyncStarted"){//TODO Here should be now()-1hour
		                    		errorId++
		                    		self.notifications.push({
		                    			id: errorId,
		                    			icon: "alert-octagon",
		                    			type: "stateWarning",
		                    			timestamp: nodes[i].updated_at,
		                    			node: nodes[i].addr,
		                    			state: nodes[i].syncState
		                    		})
		                    	}
		                    	//Version out of date warning
		                    	if(nodes[i].softwareVersion != networkVersion){
		                    		errorId++
		                    		self.notifications.push({
		                    			id: errorId,
		                    			icon: "alert-octagon",
		                    			type: "versionWarning",
		                    			timestamp: nodes[i].updated_at,
		                    			node: nodes[i].addr
		                    		})
		                    	}

		                    	//TODO Check node and network latest block
		                    	if(nodes[i].height != latestNetworkBlock){
		                    		errorId++
		                    		self.notifications.push({
		                    			id: errorId,
		                    			icon: "alert-octagon",
		                    			type: "nodeLatestBlockWarning",
		                    			timestamp: nodes[i].updated_at,
		                    			node: nodes[i].addr
		                    		})
		                    	}
		                    	
		                    }
		                    // Check network state
							if(networkState != "PersistFinished"){
	                    		errorId++
	                    		self.notifications.push({
	                    			id: errorId,
	                    			icon: "info",
	                    			type: "networkStateWarning",
	                    			state: networkState
	                    		})
	                    	}

	                    	//TODO NetworkLatestBlockTimestamp > 1hour warning

		                    //toggle notification dot
		                    if(self.notifications.length>0){
		                    	self.active = true
		                    }
		                    
		                })

	                })
                })
        	}
	    }
	};
</script>
