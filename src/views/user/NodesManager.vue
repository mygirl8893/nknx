<template>
    <div>
        <page-title-bar></page-title-bar>
        <v-container fluid pt-0 grid-list-xl>
            <div class="network-block">
                <network-stats></network-stats>
            </div>
            <v-layout style='flex-flow: row wrap;'>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; flex-flow: row wrap">  
                <div class="tab-toggler">
                    <div class="tab-toggler__item" 
                    v-for="order in orderOptions" 
                    :value="order.value"
                    :class="getClass(order.value)"
                    @click='toggleFilter(order.value)'
                    >
                        <div class="tab-toggler__item--text">{{order.value}}</div>
                        <div class="tab-toggler__item--counter">{{order.count}}</div>
                    </div>
                </div>
                <div style='margin: 0px 12px;'><v-btn color="primary" large @click='addNodeModal'><span v-html="addNodeIcon" class="icon"></span>{{$t('message.addNode')}}</v-btn>
                <v-btn v-if='userNodesData.length>0' large @click='removeAllNodes' color="primary"><span v-html="removeNodeIcon" class="icon"></span>{{ $t('message.removeAllNodes') }}</v-btn></div>
                </div>
            </v-layout>
            <v-layout row wrap>
				<app-card 
                :heading="$t('message.myNodes')" 
                colClasses="xl12 lg12 md12 sm12 xs12" 
                customClasses="mb-0" 
                :fullBlock="true" 
                :footer="true"
                >
                	<div class="table-responsive">
                        <app-section-loader :status="loader"></app-section-loader>
                        <v-data-table :items="sortedArray" hide-actions item-key='props.item.index'>
                            <template slot='headers' slot-scope='props'>
                                <tr>
                                    <th style="width:5%;">#</th>
                                    <th>{{ $t('message.node') }}</th>
                                    <th>{{ $t('message.status') }}</th>
                                    <th>{{ $t('message.latestBlock') }}</th>
                                    <th>{{ $t('message.tx') }}</th>
                                    <th>{{ $t('message.version') }}</th>
                                    <th style="text-align:center">{{ $t('message.actions') }}</th>
                                </tr>
                            </template>
                            <template slot="items" slot-scope="props">
                                <td>{{props.index+1}}</td>
                                <td
                                v-clipboard:copy="props.item.addr"
                                v-clipboard:success="onCopy1"
                                class='cursor-pointer'
                                >{{props.item.addr}} <v-chip v-if="props.item.label !=null" label outline color="orange">{{props.item.label}}</v-chip></td>
                                <td >{{props.item.syncState}}
								<span v-if='props.item.online != 1'><v-badge color="red">
                                <span slot="badge">!</span>
                                </v-badge></span> </td>
                                <td><span v-if='props.item.online != 0'>{{props.item.latestBlockHeight}}</span></td>
                                <td><span v-if='props.item.online != 0'>{{props.item.rxTxnCnt}}</span></td>
                                <td><span v-if='props.item.online != 0'>{{props.item.softwareVersion}}</span></td>
                                <td style="text-align:center">
                                <v-menu bottom left>
                                    <v-btn
                                      slot="activator"
                                      dark
                                      icon
                                    >
                                      <v-icon color='primary' style='font-size:30px;'>more_vert</v-icon>
                                    </v-btn>

                                    <v-list>
                                      <v-list-tile
                                        @click='removeNode(props.item.addr)'
                                      >
                                        <v-list-tile-title><span v-html="removeNodeIcon" class="icon"></span>{{ $t('message.removeNode') }}</v-list-tile-title>
                                      </v-list-tile>
                                      <v-list-tile
                                        @click='checkPorts(props.item.addr)'
                                      >
                                        <v-list-tile-title><span v-html="checkPortsIcon" class="icon"></span>{{ $t('message.checkPorts') }}</v-list-tile-title>
                                      </v-list-tile>
                                    </v-list>
                                  </v-menu>
                            </td>
                            </template>
                        </v-data-table>
                    </div>
                    <v-dialog v-model="removeDialog" max-width="500px">
                        <v-card class='card-light'>
                          <v-card-title>
                            <span class="headline">{{ $t('message.warning') }}</span>
                          </v-card-title>

                          <v-card-text>
                            {{ $t('message.removeNodesWarning') }}
                          </v-card-text>

                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click="close">{{ $t('message.cancel') }}</v-btn>
                            <v-btn color="blue darken-1" flat @click="removeAllConfirm">{{ $t('message.removeAllNodes') }}</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    <v-dialog v-model="addNodeDialog" max-width="500px">
                        <v-card class='card-light'>
                          <v-card-title>
                            <span class="headline">{{ $t('message.addNodes') }}</span>
                          </v-card-title>

                          <v-card-text>
                        <v-card-title >
                                <v-tabs
                                    slot="extension"
                                    v-model="tabs"
                                    fixed-tabs
                                    color="transparent"
                                    class='w-100'
                                  >
                                    <v-tabs-slider></v-tabs-slider>
                                    <v-tab href="#single-node" class="primary--text">
                                      {{$t('message.singleNode')}}
                                    </v-tab>
                                    <v-tab href="#multi-nodes" class="primary--text">
                                      {{$t('message.multipleNodes')}}
                                    </v-tab>
                                </v-tabs>
                                <v-tabs-items v-model="tabs" class='w-100'>
                                <v-tab-item v-model="valid" id='single-node'>
                                <v-text-field
                                    :label="$t('message.ip')" 
                                    v-model="addIp"
                                    required
                                    class='w-100'
                                ></v-text-field>
                                <v-alert
                                v-if='isCopy===true'
                                v-model='isError'
                                type="error"
                                dismissible
                                class='w-100'
                                >
                                {{isError}}
                                </v-alert>
                                <v-text-field 
                                    :label="$t('message.label')" 
                                    v-model="addLabel" 
                                    required
                                    class='w-100'
                                ></v-text-field>
                                <div>
                                    <v-btn :disabled="!valid"  large @click="addNode" block color="warning">{{$t('message.addNode')}}</v-btn>
                                </div>
                                  </v-tab-item>
                                <v-tab-item v-model="multiValid" id='multi-nodes'>
                                <v-textarea
                                    :label="$t('message.multiIp')" 
                                    v-model="addMultiIp"
                                    :rules="multiIpRules" 
                                    required
                                    class='w-100'
                                    :no-resize='true'
                                ></v-textarea>
                                <v-alert
                                v-if='isMultiCopy===true'
                                v-model='isMultiError'
                                type="error"
                                dismissible
                                class='w-100'
                                >
                                <span v-html="isMultiError"></span>
                                </v-alert>
                                <v-text-field 
                                    :label="$t('message.multiLabel')" 
                                    v-model="addMultiLabel" 
                                    required
                                    class='w-100'
                                ></v-text-field>
                                <div>
                                    <v-btn :disabled="!multiValid"  large @click="addMultiNode" block color="warning">{{$t('message.addNodes')}}</v-btn>
                                </div>
                                  </v-tab-item>
                                </v-tabs-items>
     
                            </v-card-title>
                          </v-card-text>

                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click="close">{{ $t('message.cancel') }}</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
					<v-dialog v-model="portsDialog" max-width="500px">
                        <v-card class='card-light'>
                          <v-card-title>
                            <span class="headline">{{currentIp}}</span>
                          </v-card-title>

                          <v-card-text>
							<v-data-table
							    :items="nodePorts"
							    item-key="port"
							    hide-actions 
							  >
							    <template slot="headers" slot-scope="props">
							      <tr>
									<th><b>{{ $t('message.port') }}</b></th>
									<th><b>{{ $t('message.status') }}</b></th>
							      </tr>
							    </template>
							    <template slot="items" slot-scope="props">
							      <tr>
							        <td>{{ props.item.port}}</td>
							        <td>{{ props.item.status}}</td>
							      </tr>
							    </template>
							  </v-data-table>
                          </v-card-text>

                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click="close">{{ $t('message.close') }}</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                </app-card>
            </v-layout>
        </v-container>
    </div>
</template>
<script>
import axios from "axios";
import NetworkStats from "Components/Widgets/NetworkStats";
import { Timeouts } from "Constants/timeouts";
import feather from 'feather-icons';

export default {
    components: {
    NetworkStats
    },
    data() {
        return {
			interval: null,
            loader: true,
            valid: false,
            removeDialog: false,
            portsDialog: false,
            addNodeDialog: false,
            multiValid: false,
            nodePorts: [],
            currentIp: null,
            isCopy: false,
            isMultiCopy: false,
            tabs: null,
            addIp: '',
            addLabel: '',
            addMultiLabel: '',
            addMultiIp: '',
            multiIpRules: [v => !!v || "IP Addresses of nodes are required!"],
            userNodesData: [],
        	timer: "",
        	currentOrder: "All",
            isError: '',
            isMultiError: '',
        	userNodesDataCounter: {
                all: 0,
                pf: 0,
                ss: 0,
                sf: 0,
                er: 0
            },
        	orderOptions: [
        	{
        		value: "All",
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
        this.interval = setInterval(this.getUserNodes, Timeouts.short);
    },
    destroyed() {
        clearInterval(this.interval);
    },
    computed: {
        addNodeIcon: function () {
            return feather.icons['plus'].toSvg()
        },
        removeNodeIcon: function () {
            return feather.icons['trash-2'].toSvg()
        },
        checkPortsIcon: function () {
            return feather.icons['cpu'].toSvg()
        },
    	sortedArray: function() {
		let customNodes = []
        if (this.currentOrder === 'All') {
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
        toggleFilter(itemValue){
            const self = this;
            self.currentOrder = itemValue;
        },
        getClass(itemValue){
            const self = this;
            if(itemValue === self.currentOrder){
                return 'active'
            }
        },
        onCopy1(){
            this.$store.dispatch("setSnackbar", this.$t('message.ipCopiedSuccessful'));
        },
        addNode(){
            const self = this;
            self.isCopy = false
            //Check if node is already tracked
            for(let i in self.userNodesData){
                if(self.userNodesData[i].addr === self.addIp){
                    self.isCopy = true
                    self.isError = this.$t('message.nodeIsTracked');
                }
            }
            //Check if ports are open
            axios.get('checkPort?address='+self.addIp, {})
            .then((ports) => {
                let portsStatus = true;
                for (let port in ports.data){
                    if(ports.data[port] === 'closed'){
                        self.isCopy = true;
                        self.isError = this.$t('message.portsClosed');
                    }
                    portsStatus = false;
                }
                if(self.isCopy != true && portsStatus != true){
                    axios.post('nodes', {
                    'ip': self.addIp, 'label': self.addLabel
                        })
                        .then((response) => {
                            //Check if node is reachable
                            if(response.data.data.failed.length){
                                self.isCopy = true;
                                self.isError = this.$t('message.NodeNotReachable');
                            }
                            //Check if node is already in DB
                            else if(response.data.data.duplicate.length){
                                self.isCopy = true;
                                self.isError = this.$t('message.NodeDuplicate');
                            }
                            //Everything is ok and we add this node
                            else{
                                this.$store.dispatch("setSnackbar", this.$t('message.nodeSuccessfullyAdded'));
                                self.addIp = "";
                                this.getUserNodes();
                            }

                        })

                }    
            })
        },
        addMultiNode(){
            const self = this;
            self.isMultiCopy = false
            self.isMultiError = "";

            //get nodes by ip
            const ipRegExp = /((?=.*[^\.]$)((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.?){4})/igm;
            let ipArray = []
            ipArray = self.addMultiIp.match(ipRegExp)

            //get nodes by urls
            const urlRegExp = /((http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?)/igm;
            let urlArray = []
            urlArray = self.addMultiIp.match(urlRegExp)

            //ips + urls
            if(ipArray != null && urlArray != null){
                ipArray = ipArray.concat(urlArray)
                self.addMultiIp = ipArray.join()
            } else if(ipArray != null && urlArray === null){
                self.addMultiIp = ipArray.join()
            } else{
                self.addMultiIp = urlArray.join()
            }
            
            axios.post('nodes', {
                'ip': self.addMultiIp, 'label': self.addMultiLabel
            })
            .then((response) => {
                if(response.data.data.failed.length){
                    self.isMultiCopy = true;
                    self.isMultiError= self.isMultiError+this.$t('message.followingNodesNotReachable') + " " + response.data.data.failed.join(", ") + "<br/>";
                    self.addMultiIp = "";
                }
                if(response.data.data.duplicate.length){
                    self.isMultiCopy = true;
                    self.isMultiError= self.isMultiError+this.$t('message.followingNodesDuplicate') + " " + response.data.data.duplicate.join(", ") + "<br/>";
                    self.addMultiIp = "";
                }
                else{
                    this.$store.dispatch("setSnackbar", this.$t('message.nodesSuccessfullyAdded'));
                    self.addMultiIp = "";
                }
                this.getUserNodes()
            })
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
        addNodeModal(){
            const self = this;
            self.addNodeDialog = true
        },
        removeAllNodes(){
            const self = this;
            self.removeDialog = true
        },
		checkPorts(ip){
            const self = this;
            self.portsDialog = true
            self.currentIp = ip
            self.nodePorts = []
            axios.get('checkPort?address='+ip, {
                    })
                    .then((response) => {
						for (var port in response.data){
						    self.nodePorts.push({"port":port, "status": response.data[port]})
						}
                    })

        },
        removeAllConfirm(){
            const self = this;
            axios.delete('nodes/', {
                    })
            .then((response) => {
                this.getUserNodes()
            })
            this.close()
        },
        close(){
            const self = this;
            self.removeDialog = false
            self.portsDialog = false
            self.addNodeDialog = false
        },
        getUserNodes() {
            const self = this;
            axios.get('nodes', {
                    })
                    .then((response) => {
                        self.userNodesData = response.data
                        for(let node in self.userNodesData){
                            if(self.userNodesData[node].online === 0 ){
                                self.userNodesData[node].syncState = 'Error'
                            }
                        }
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
            		case 'All':
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