<!-- Header Structure -->
<template>
	<div>
		<v-navigation-drawer
			v-if="!horizontal"
			app
			fixed
			v-model="drawer"
			:mini-variant="collapseSidebar"
			mini-variant-width="70"
			:width="250"
			class="nknx-sidebar"
			:style="{backgroundImage: 'url(' + selectedSidebarBgImage.url + ')'}"
			:class="{'background-none': !backgroundImage}"
			:right="rtlLayout"
		>
			<!-- App Sidebar -->

		</v-navigation-drawer>
		<v-toolbar 
			class="nknx-toolbar"
			app
		
			fixed
		>	
			<div class="d-custom-flex align-items-center navbar-left">
				<div v-if="!horizontal">
					<v-toolbar-side-icon icon large @click.stop="drawer = !drawer" class="v-step-0"></v-toolbar-side-icon>
				</div>
				<div class="site-logo-wrap d-custom-flex ml-0 align-items-center" v-else>
					<router-link to="/dashboard" class="primary site-logo-img">
						<img src="/static/img/site-logo.png" alt="site logo" width="100" height="30">
					</router-link>
				</div>
				<v-text-field flat solo prepend-icon="search" :placeholder="$t('message.search')" class="search-bar "></v-text-field>
				<div class="mobile-search d-none">
					<v-btn flat icon  small class="mobile-search-btn" >
						<v-icon class="font-md">Search by block/tx/address hash or block index</v-icon>
					</v-btn>
				</div>
			</div>
			<div class="navbar-right">
				<language-provider></language-provider>
			</div>
		</v-toolbar>
		<mobile-search-form></mobile-search-form>
	</div>
</template>

<script>
import screenfull from "screenfull";
import LanguageProvider from "./LanguageProvider";
import MobileSearchForm from "./MobileSearchForm";
import { getCurrentAppLayout } from "Helpers/helpers";
import { mapGetters } from "vuex";

export default {
  props: {
    horizontal: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      collapsed: false, // collapse sidebar
      drawer: true, // sidebar drawer default true
      sidebarImages: "", // sidebar background images
      enableDefaultSidebar: false
    };
  },
  computed: {
    ...mapGetters([
      "rtlLayout",
      "backgroundImage",
      "backgroundImage",
      "selectedSidebarBgImage",
			"darkMode",
			"collapseSidebar",
			"activeHeaderFilter"
    ])
  },
  methods: {
		getMenuLink(link) {
			return '/' + getCurrentAppLayout(this.$router) + link;
		}
  },
  components: {
    LanguageProvider,
    MobileSearchForm
  }
};
</script>
