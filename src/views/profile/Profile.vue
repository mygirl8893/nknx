<template>
	<div>
	<page-title-bar></page-title-bar>
		<v-container fluid pt-0 grid-list-xl>
						<v-layout row wrap>
				<!-- User Nodes -->
				<app-card
					:heading="$t('message.myNodes')"
					colClasses="xl6 lg6 md6 sm12 xs12"
					customClasses="mb-0"
					:fullScreen="true"
					:fullBlock="true"
					:footer="true"
				>
					<user-Nodes></user-Nodes>
					<v-btn slot="footer" :to="{path: '/profile/nodes'}" color="primary" small>{{$t('message.viewAll')}}</v-btn>
				</app-card>
			</v-layout>

		</v-container>
	</div>
</template>

<script>

import UserNodes from "Components/Widgets/UserNodes";

export default {
  components: {
	UserNodes
  },
  data() {
    return {
      
    };
  }
};
</script>
