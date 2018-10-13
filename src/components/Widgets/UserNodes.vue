<template>
    <div class="table-responsive">
        <app-section-loader :status="loader"></app-section-loader>
        <v-data-table :items="userNodesData" hide-actions>
            <template slot="headers" slot-scope="props">
                <tr>
                    <th style="width:10%;">#</th>
                    <th>{{ $t('message.node') }}</th>
                    <th>{{ $t('message.status') }}</th>
                    <th>{{ $t('message.latestBlock') }}</th>
                    <th>{{ $t('message.tx') }}</th>
                    <th>{{ $t('message.version') }}</th>
                </tr>
            </template>
            <template slot="items" slot-scope="props">
                <td>{{props.index+1}}</td>
                <td>{{props.item.Addr}}</td>
                <td>{{props.item.SyncState}}</td>
                <td>{{props.item.latestBlocks}}</td>
                <td>{{props.item.TxnCnt}}</td>
                <td>{{props.item.version}}</td>
            </template>
        </v-data-table>
    </div>
</template>
<script>
import axios from "axios";

export default {
    data() {
        return {
            interval: null,
            loader: true,
            userNodes: ['138.68.76.78:30003',
                '139.59.130.53:30003'
            ],
            userNodesWidget: [],
            userNodesData: [],
        };
    },
    destroyed() {
        clearInterval(this.interval);
    },
    created: function() {
        this.getUserNodes();
    },
    mounted: function() {
        
    },
    methods: {
        userNodesSync() {
            const self = this;
            if (self.userNodesWidget.length === self.userNodesData.length) {
                self.getUserNodesBlocks()
                self.getUserNodesVersion()
                setTimeout(() => {
                    self.loader = false
                }, 1000)


            } else {
                setTimeout(() => {
                    self.userNodesSync()
                }, 1000)
            }
        },
        getUserNodes() {
            const self = this;
            self.userNodesData = []
            if(self.userNodes.length >=5){
                self.userNodesWidget = self.userNodes.slice(0, 5)
            } else{
                self.userNodesWidget = self.userNodes
            }
            for (let i = 0; i < self.userNodesWidget.length; i++) {
                axios.post('http://' + self.userNodesWidget[i], {
                        "jsonrpc": "2.0",
                        "method": "getnodestate",
                        "params": {},
                        "id": 1
                    })
                    .then((response) => {
                        self.userNodesData.push(response.data.result)
                    })
                    .catch((error) => {
                        self.userNodesData.push({ 'Addr': self.userNodesWidget[i], 'SyncState': 'Error' })
                    });
            }
            this.userNodesSync();

        },
        getUserNodesBlocks() {
            const self = this
            for (let i = 0; i < self.userNodesWidget.length; i++) {
                axios.post('http://' + self.userNodesWidget[i], {
                        "jsonrpc": "2.0",
                        "method": "getlatestblockheight",
                        "params": {},
                        "id": 1
                    })
                    .then((response) => {
                        self.userNodesData[i].latestBlocks = response.data.result
                    })
            }

        },
        getUserNodesVersion() {
          const self = this
            for (let i = 0; i < self.userNodesWidget.length; i++) {
                axios.post('http://' + self.userNodesWidget[i], {
                        "jsonrpc": "2.0",
                        "method": "getversion",
                        "params": {},
                        "id": 1
                    })
                    .then((response) => {
                        self.userNodesData[i].version = response.data.result
                    })
            }
        }
    }
};
</script>