<template>
  <v-app
	id="inspire"
	:class="[{ 
		'rtl-layout': rtlLayout
	}]"
  > 
    	<router-view></router-view>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      animation: {
        enter: {
          opacity: [1, 0],
          translateX: [0, -300],
          scale: [1, 0.2]
        },
        leave: {
          opacity: 0,
          height: 0
        }
     }
    };
  },
  mounted() {
    if (
      //demo
      //this.selectedLocale.locale === "he" ||
      this.selectedLocale.locale === "ar"
    ) {
      this.$store.dispatch("rtlLayout");
    }
  },
  computed: {
    ...mapGetters([
      "rtlLayout",
      "selectedLocale"
    ])
  }
};
</script>
