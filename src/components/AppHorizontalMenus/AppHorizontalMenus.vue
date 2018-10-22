<template>
	<div class="horizontal-menu">
		<ul class="list-unstyled nav">
      <template v-for="(category, key) in menus">
        <li class="nav-item" v-for="item in category" :key="item.path" v-if="key == 'general' || $auth.check()">
          <router-link :to="{path: item.path}" class="nav-link" >
            <i :class="'zmdi ' + item.action"></i>
            <span class="menu-title">{{$t(item.title)}}</span>
          </router-link>
        </li>
      </template>
    </ul>
		<div class="ham-menu-sm d-none">
			<v-btn flat icon class="my-1 mx-3" @click="toggleHorizontalLayoutSidebar">
				<v-icon class="grey--text">menu</v-icon>
			</v-btn>
		</div>
    <div>
      <div class="search-form">
        <v-text-field flat solo prepend-icon="search" :placeholder="$t('message.search')" class="search-bar "></v-text-field>
        
          <mobile-search-form></mobile-search-form>


      </div>
      
    </div>
  	</div>
</template>

<script>
import AppMenuItem from "./AppMenuItem";
import { mapGetters } from "vuex";
import MobileSearchForm from "../Header/MobileSearchForm";

export default {
  data() {
    return {

    }
  },
  components: {
    AppMenuItem,
     MobileSearchForm
  },
  computed: {
    ...mapGetters(["menus"])
  },
  methods: {
    toggleHorizontalLayoutSidebar() {
      this.$store.dispatch("toggleHorizontalLayoutSidebar", true);
    }
  },
  mounted() {
    const mainMenu = document.getElementsByClassName("nav-item");
    for (let i = 0; i < mainMenu.length; i++) {
      mainMenu[i].onclick = function() {
        for (let j = 0; j < mainMenu.length; j++) {
          if (mainMenu[j].classList.contains("nav-item-active")) {
            mainMenu[j].classList.remove("nav-item-active");
          }
        }
        this.classList.toggle("nav-item-active");
      };
    }
  }
};
</script>