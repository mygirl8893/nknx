<template>
    <div>
        <page-title-bar></page-title-bar>
        <v-container fluid pt-0 grid-list-xl>
					<v-layout>
                        <v-flex xs2>
                            <v-card>
                                <v-card-title primary-title>
                                    <div>
                                        <h4>{{$t('message.nodesFilter')}}</h4>
										<v-radio-group :mandatory="false" v-model="currentOrder">
											<v-radio  
												v-for="order in orderOptions"
												:key="order.value"
												:label="order.label"
												:value="order.value"
												color="green"></v-radio>
										</v-radio-group>
                                    </div>
                                </v-card-title>
                            </v-card>
                        </v-flex>
						<v-flex xs2>
                            <v-card>
                                <v-card-title primary-title>
                                    <div>
                                        <h4>{{$t('message.autoRefresher')}}</h4>
										<v-radio-group :mandatory="false" v-model="refreshTime">
											<v-radio  
												v-for="radio in refresherOptions"
												:key="radio.label"
												:label="radio.label"
												:value="radio.value"
												:disabled="refreshActive.active"
												color="green"></v-radio>
										</v-radio-group>
										<v-switch v-model="refreshActive.active" color="green" v-on:change="refreshToggle" v-bind:label="refreshActive.title"></v-switch>
                                    </div>
                                </v-card-title>
                            </v-card>
                        </v-flex>
                        <v-flex xs2>
                            <v-form v-model="valid" class="mb-4">
                                <v-text-field 
                                    :label="$t('message.ip')" 
                                    v-model="addIp"
                                    :rules="ipRules" 
                                    required
                                ></v-text-field>
                                <v-alert
                                v-model='isCopy'
                                type="error"
                                dismissible
                                >
                                {{$t('message.nodeExistError')}}
                                </v-alert>
                                <v-text-field 
                                    :label="$t('message.label')" 
                                    v-model="addLabel" 
                                    required
                                ></v-text-field>
                                <div>
                                    <v-btn :disabled="!valid"  large @click="addNode" block color="warning">{{$t('message.addNode')}}</v-btn>
                                </div>
                            </v-form>
                        </v-flex>
                    </v-layout>
            <v-layout row wrap>
				<app-card 
                :heading="$t('message.myNodes')" 
                colClasses="xl12 lg12 md12 sm12 xs12" 
                customClasses="mb-0" 
                :fullScreen="true" 
                :fullBlock="true" 
                :footer="true"
                v-if="userNodesData.length>0"
                >
                	<div class="table-responsive">
                        <app-section-loader :status="loader"></app-section-loader>
                        <v-data-table :items="sortedArray" hide-actions>
                            <template slot='headers' slot-scope='props'>
                                <tr>
                                    <th style="width:5%;">#</th>
                                    <th>{{ $t('message.node') }}</th>
                                    <th>{{ $t('message.status') }}</th>
                                    <th>{{ $t('message.latestBlock') }}</th>
                                    <th>{{ $t('message.tx') }}</th>
                                    <th>{{ $t('message.version') }}</th>
                                    <th></th>
                                </tr>
                            </template>
                            <template slot="items" slot-scope="props">
                                <td>{{props.index+1}}</td>
                                <td>{{props.item.addr}} <v-chip v-if="props.item.label != ''" label outline color="orange">{{props.item.label}}</v-chip></td>
                                <td>{{props.item.syncState}}</td>
                                <td>{{props.item.latestBlockHeight}}</td>
                                <td>{{props.item.txnCnt}}</td>
                                <td>{{props.item.softwareVersion}}
                                
                                </td>
                                <td><v-btn
                                color="red"
                                dark
                                small
                                fab
                                @click='removeNode(props.item.addr)'
                                >
                                <v-icon>remove</v-icon>
                                </v-btn></td>
                            </template>
                        </v-data-table>
                    </div>
                </app-card>
            </v-layout>
        </v-container>
    </div>
</template>
<script>
import axios from "axios";

export default {
    data() {
        return {
			interval: null,
            loader: true,
            valid: false,
            isCopy: false,
            addIp: '',
            addLabel: '',
            ipRules: [
            v => !!v || "IP Address of node is required!",
            v =>
            /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(v) ||
            "IP address must be valid"
            ],
            userNodesData: [],
        	timer: "",
        	currentOrder: "Default",
        	refreshTime: "60",
        	userNodesDataCounter: {
                all: 0,
                pf: 0,
                ss: 0,
                sf: 0,
                er: 0
            },
        	refreshActive: {
        		active: false,
        		title: "Enable"
        	},
        	refresherOptions: [
        	{
        		label: "30 sec",
        		value: "30"
        	},
        	{
        		label: "60 sec",
        		value: "60"
        	},
        	{
        		label: "5 minutes",
        		value: "300"
        	},
        	{
        		label: "10 minutes",
        		value: "600"
        	},
        	{
        		label: "15 minutes",
        		value: "900"
        	}
        	],
        	orderOptions: [
        	{
        		value: "Default",
        		label: "",
        		count: 0
        	},
        	{
        		value: "PersistFinished",
        		label: "",
        		count: 0
        	},
        	{
        		value: "SyncFinished",
        		label: "",
        		count: 0
        	},
        	{
        		value: "SyncStarted",
        		label: "",
        		count: 0
        	},
        	{
        		value: "Error",
        		label: "",
        		count: 0
        	},
        	]
        };
    },
    created: function(){
    	this.getUserNodes();
    },
    mounted: function(){

    },
    computed: {
    	sortedArray: function() {
		let customNodes = []
        if (this.currentOrder === 'Default') {
            function compare(a, b) {
                if (a.SyncState < b.SyncState)
                    return -1;
                if (a.SyncState > b.SyncState)
                    return 1;
                return 0;
            }
            return this.userNodesData.sort(compare);
        } else {
            for (let i = 0; i < this.userNodesData.length; i++) {
                if (this.userNodesData[i].syncState === this.currentOrder) {
                    customNodes.push(this.userNodesData[i])
                }
            }
            return customNodes
        }
    }
    },
    methods:{
    	refreshToggle(){
    		const self = this
			clearInterval(self.timer)
            switch (self.refreshActive.active) {
                    case false:
                        self.refreshActive.title = "Enable"
                        break;
                    case true:
                        self.refreshActive.title = "Disable"
                        break;
               }
			self.timer = setInterval(this.autoRefresh, self.refreshTime * 1000);
    	},
    	autoRefresh(){
    		const self = this
				if (self.refreshActive.active === true) {
                	this.getUserNodes()
            	}
    	},
        addNode(){
            const self = this;
            for(let i in self.userNodesData){
                if(self.userNodesData[i].addr === self.addIp){
                    self.isCopy = true
                }
            }
            if(self.isCopy != true){
                axios.post('nodes', {
                'ip': self.addIp, 'label': self.addLabel
                    })
                    .then((response) => {
                        this.getUserNodes()
                    })
            }
        },
        removeNode(node) {
            const self = this;
            let id = 0
            for(let i in self.userNodesData){
                if(self.userNodesData[i].addr === node){
                    id = self.userNodesData[i].id
                }
            }
            axios.delete('nodes/'+id, {
                    })
            .then((response) => {
                this.getUserNodes()
            })
        },
        getUserNodes() {
            const self = this;
            axios.get('nodes', {
                    })
                    .then((response) => {
                        self.userNodesData = response.data
                        this.getNodesDataCounter()
                    })

                    self.loader = false
        },
        getNodesDataCounter: function() {
        	const self = this
            self.userNodesDataCounter.pf = 0
            self.userNodesDataCounter.sf = 0
            self.userNodesDataCounter.ss = 0
            self.userNodesDataCounter.er = 0
            for (let i in self.userNodesData) {
                switch (self.userNodesData[i].syncState) {
                    case 'PersistFinished':
                        self.userNodesDataCounter.pf++
                        break;
                    case 'SyncFinished':
                        self.userNodesDataCounter.sf++
                        break;
                    case 'SyncStarted':
                        self.userNodesDataCounter.ss++
                        break;
                    case 'Error':
                        self.userNodesDataCounter.er++
                        break;
                }
            }
            for(let y in self.orderOptions){
            	switch (self.orderOptions[y].value) {
            		case 'Default':
                        self.orderOptions[y].count = self.userNodesData.length
                        self.orderOptions[y].label = "All (" + self.orderOptions[y].count+")"
                        break;
                    case 'PersistFinished':
                        self.orderOptions[y].count = self.userNodesDataCounter.pf
                        self.orderOptions[y].label = self.orderOptions[y].value + " (" + self.orderOptions[y].count+")"
                        break;
                    case 'SyncFinished':
                        self.orderOptions[y].count = self.userNodesDataCounter.sf
                        self.orderOptions[y].label = self.orderOptions[y].value + " (" + self.orderOptions[y].count+")"
                        break;
                    case 'SyncStarted':
                        self.orderOptions[y].count = self.userNodesDataCounter.ss
                        self.orderOptions[y].label = self.orderOptions[y].value + " (" + self.orderOptions[y].count+")"
                        break;
                    case 'Error':
                        self.orderOptions[y].count = self.userNodesDataCounter.er
                        self.orderOptions[y].label = self.orderOptions[y].value + " (" + self.orderOptions[y].count+")"
                        break;
                }
            }
        }
    }
};
</script>