<template>
  	<div class="app-card-title" v-if="heading">
		<h3>{{heading}}</h3>
		<template v-if="!withTabs">
			<div class="app-contextual-link" v-if="fullScreen || reloadable || closeable || walletLinks">
				<v-tooltip bottom>
					<v-menu
						transition="scale-transition"
						origin="right top"
						bottom
						left
						slot="activator"
					>
						<v-btn class="ma-0" icon slot="activator">
							<v-icon>more_vert</v-icon>
						</v-btn>
						<v-list class="app-card-action">
							<v-list-tile @click="$emit('onCollapse')" v-if="fullScreen">
								<i class="zmdi zmdi-fullscreen primary--text mr-2 fs-14"></i>
								<span>{{$t("message.fullScreen")}}</span>
							</v-list-tile>
							<v-list-tile @click="$emit('onReload')" v-if="reloadable">
								<i class="zmdi zmdi-refresh success--text mr-2 fs-14"></i>
								<span>{{$t("message.reload")}}</span>
							</v-list-tile>
							<v-list-tile @click="$emit('onClose')" v-if="closeable">
								<i class="zmdi zmdi-close mr-2 error--text fs-14"></i>
								<span>{{$t("message.close")}}</span>
							</v-list-tile>
							<v-list-tile @click.native.stop="addWalletDialog = true" v-if="walletLinks">
								<span>{{$t('message.openWallet')}}</span>
							</v-list-tile>
							<v-list-tile @click.native.stop="createWalletDialog = true" v-if="walletLinks">
								<span>{{$t('message.newWallet')}}</span>
							</v-list-tile>
						</v-list>
					</v-menu>
					<v-dialog v-model="addWalletDialog" max-width="800">
						<v-card>
							<verify-address :walletLoaded="walletLoaded"></verify-address>
						</v-card>
					</v-dialog>
					<v-dialog v-model="createWalletDialog" max-width="800">
						<v-card>
							<create-wallet :walletCreated="walletCreated"></create-wallet>
						</v-card>
					</v-dialog>
					<span>{{$t('message.moreActions')}}</span>
				</v-tooltip>
			</div>
		</template>
		<template v-else>
			<div class="app-contextual-link">
				<ul class="custom-tab-wrap list-inline">
					<template v-for="(tab, key) in tabs">
						<li @click="onChangeTab(key)" :key="key">
							<a href="javascript:void(0)" class="fs-12 fw-semi-bold px-2 py-1 rounded mx-1" :class="[{'primary white--text': activeTab === key}]" >{{tab}}</a>
						</li>
					</template>
				</ul>
			</div>
		</template>
  	</div>
</template>

<script>
import VerifyAddress from "Components/Dialogs/VerifyAddress";
import CreateWallet from "Components/Dialogs/CreateWallet";
export default {
  props: [
    "heading",
    "closeable",
    "reloadable",
    "fullScreen",
    "withTabs",
    "tabs",
    "onCollapse",
    "onReload",
    "onClose",
		"onChangeTabCallback",
		"walletLinks"
	],
	components: {
		VerifyAddress,
		CreateWallet
	},
  data() {
    return {
			addWalletDialog:false,
			createWalletDialog:false,
      activeTab: 0
    };
  },
  methods: {
		walletLoaded(){
			this.addWalletDialog=false;
		},
		walletCreated(){
			this.createWalletDialog=false;
		},
    onChangeTab(value) {
      this.activeTab = value;
      this.$emit("onChangeTabCallback", value);
    }
  }
};
</script>
