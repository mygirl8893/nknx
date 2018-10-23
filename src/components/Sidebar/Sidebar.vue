<!-- Side Structure -->
<template>
  	<div class="sidebar sidebar-overlay-primary" style="height:100%">
    	<vue-perfect-scrollbar class="scroll-area" :settings="settings" style="height:100%">
        <v-toolbar flat class="transparent scroll-area navigation">
          <v-list>
					<div class="site-logo">
							<router-link to="/">
									<img src="/static/img/site-logo_color.png" alt="site logo" width="100" height="30">
							</router-link>
					</div>
				<template v-for="(category, key) in menus">
					<div :key="key">
						<template v-for="item in category" v-if="key == 'general' || $auth.check()">

							<template>
								<v-list-tile
									:to="item.path"
									:key="item.path"
								>
									<v-list-tile-content>
										<v-list-tile-title>
											<i class="mr-2 zmdi" :class="item.action"></i>
											<span>{{ textTruncate($t(item.title)) }}</span>
										</v-list-tile-title>
									</v-list-tile-content>
								</v-list-tile>
							</template>
						</template>
					</div>
				</template>     
          </v-list>
        </v-toolbar>
    	</vue-perfect-scrollbar>
  	</div>
</template>

<script>

import { mapGetters } from "vuex";

export default {
  data() {
    return {
      settings: {
        maxScrollbarLength: 160
      }
    };
  },
  components: {
 

  },
  computed: {
    ...mapGetters(["sidebarSelectedFilter", "menus"])
  },
	mounted(){
		this.$store.dispatch("setActiveMenuGroup", this.$router);
	},
  methods: {
    textTruncate(text) {
      return textTruncate(text, 18);
    },
  }
};
</script>
