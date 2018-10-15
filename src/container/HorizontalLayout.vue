<!-- App Main Structure -->
<template>
	<div class="app-horizontal-layout">
		<template v-if="loading">
			<rotate-square2></rotate-square2>
		</template>
		<template v-else>
			<!-- App Header -->
			<app-header :horizontal="true"></app-header>
			<app-horizontal-menus></app-horizontal-menus>
			<v-navigation-drawer
				absolute
				temporary
				v-model="horizontalLayoutSidebar"
				:width="250"
			>
        <app-sidebar></app-sidebar>
			</v-navigation-drawer>
			<!-- App Main Content -->
			<v-content>
        	<v-alert
            v-if="$auth.check()"
            :value="!$auth.user().verified"
            type="warning"
          >
            {{$t('message.mailNotVerified')}}<a href="#" @click.prevent="resendVerification">{{$t('message.resendVerificationMail')}}</a>
          </v-alert>
				<!-- App Router -->
				<transition name="router-anim" :enter-active-class="`animated ${'slideInUp'}`">
					<router-view style="min-height:calc(100% - 32px);margin-bottom:25px;"></router-view>
				</transition>
        <v-footer> 
          <app-footer></app-footer>
        </v-footer>
        <snackbar></snackbar>
			</v-content>

		</template>

	</div>
</template>

<script>
import Header from "Components/Header/Header.vue";
import AppHorizontalMenus from "Components/AppHorizontalMenus/AppHorizontalMenus";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import { mapGetters } from "vuex";
import Footer from "Components/Footer/Footer.vue";
import Sidebar from "Components/Sidebar/Sidebar";
import Snackbar from "Components/Snackbar/Snackbar.vue";
import axios from "axios";

export default {
  data() {
    return {
      loading: true
    };
  },
  components: {
    appHeader: Header,
    appFooter: Footer,
    appHorizontalMenus: AppHorizontalMenus,
    PageTitleBar,
    appSidebar: Sidebar,
    Snackbar
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  },
  computed: {
    ...mapGetters(["selectedRouterAnimation"]),
    horizontalLayoutSidebar: {
      get() {
        return this.$store.getters.horizontalLayoutSidebar;
      },
      set(val) {
        this.$store.dispatch("toggleHorizontalLayoutSidebar", val);
      }
    },
    // computed property to get page breadcrumbs
    pageTitle() {
      return this.$breadcrumbs[0].meta.title;
    },
    pageBreadcrumb() {
      return this.$breadcrumbs[0].meta.breadcrumb;
    }
  },
  methods : {
    resendVerification() {
        var self = this;
        axios.get("auth/resendVerification").then(function(response){
          self.$store.dispatch("setSnackbar", self.$t('message.verificationSentSuccessfully'));
        }).catch(function(error) {
          self.$store.dispatch("setSnackbar", self.$t('message.verificationSentError'));
        })

    }
  }
};
</script>

<style scoped>
.app-horizontal-layout {
  height: 100vh;
}
</style>

