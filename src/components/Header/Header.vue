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
				<v-form style="flex: auto;" @submit.prevent="search">
					<v-text-field  flat solo prepend-icon="search" v-model="searchString" :placeholder="$t('message.search')" class="search-bar "></v-text-field>
				 </v-form>
			</div>
			<div class="navbar-right">
				<notifications v-if="$auth.check()"></notifications>
				<v-btn v-if="!$auth.check()" color="primary" tag="link" :to="'/login'">{{ $t('message.login') }}</v-btn>
				<user v-if="$auth.check()"></user>
				<language-provider></language-provider>
			</div>
		</v-toolbar>
		<mobile-search-form></mobile-search-form>


	</div>
</template>

<script>
import screenfull from "screenfull";
import User from "./User";
import LanguageProvider from "./LanguageProvider";
import MobileSearchForm from "./MobileSearchForm";
import { mapGetters } from "vuex";
import Notifications from "./Notifications";

export default {
  props: {
    horizontal: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
			searchString:"",
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
		search(){
			if(isNaN(parseFloat(this.searchString))){
				this.$router.push({ path: '/block/hash/'+this.searchString})
			}
			else{
				this.$router.push({ path: '/block/height/'+this.searchString})
			}
		},
  },
  components: {
    LanguageProvider,
		MobileSearchForm,
		User,
		Notifications
  }
};
</script>