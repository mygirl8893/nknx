<template>
   <div class="table-responsive">
    <app-section-loader :status="loader"></app-section-loader>
		<v-data-table
			:headers="headers"
			:items="latestBlocks"
      item-key="height"
			hide-actions
		>
			<template slot="headers" slot-scope="props">
				<tr>
					<th class="text-xs-left fw-bold" v-for="header in props.headers" :key="header.text">
						{{ header.text }}
					</th>
				</tr>
			</template>
			<template slot="items" slot-scope="props">
        <tr @click="props.expanded = !props.expanded">
          <td>{{ props.item.height }}</td>
          <td>{{ props.item.transactions }}</td>
          <td>{{ props.item.signer }}</td>
          <td>{{ props.item.timestamp }}</td>
        </tr>
			</template>
      <template slot="expand" slot-scope="props">
						<v-card flat>
							<v-card-text>Peek-a-boo!</v-card-text>
						</v-card>
				</template>
		</v-data-table>
	</div>
</template>

<script>

export default {
  data() {
    return {
      loader: true,
      latestBlocks: [],
      headers: [
        {
          text: "Height",
          sortable: false,
          value: "height"
        },
        {
          text: "Transactions",
          sortable: false,
          value: "transactions"
        },
        {
          text: "Block proposer",
          sortable: false,
          value: "signer"
        },
        {
          text: "Created",
          sortable: false,
          value: "timestamp"
        }
      ]
    };
  },
  mounted() {
    this.getLatestBlocks();
  },

  // a3e24c2be711afee146df3cccbc283ee921b251059c4cb0d2355426db1142e74 = Mining reward
  // 01992bb729bfbf06291c708a0ab292917481595a0914e275fd8ed0b338960904 = Signature Chain
  // Height 101720
  methods: {
    getLatestBlocks() {
      const self = this;
      //some axios stuff
      self.latestBlocks=[
        {
          height: 13456,
          transactions: 10,
          signer: "1413502450d3106f8c63bdf6779fa3e6324f6ecbecf5738e3bafdf832d942e5c",
          timestamp: "12 seconds ago"
        },

      ]
      self.loader= false
    }
  }
};
</script>
