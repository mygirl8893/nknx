    <template>
    <div class="table-responsive">
        <app-section-loader :status="loader"></app-section-loader>
        <v-data-table :items="userNodesWidget" hide-actions>
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
                <td>{{props.item.addr}}</td>
                <td>{{props.item.syncState}}</td>
                <td>{{props.item.latestBlockHeight}}</td>
                <td>{{props.item.txnCnt}}</td>
                <td>{{props.item.softwareVersion}}</td>
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
        getUserNodes() {
            const self = this;
            axios.get('nodes', {
            })
            .then((response) => {
                self.userNodesData = response.data
                if(self.userNodesData.length >=5){
                    self.userNodesWidget = self.userNodesData.slice(0, 5)
                } else{
                    self.userNodesWidget = self.userNodesData
                }
            })
            self.loader = false;
        }
    }
};
</script>