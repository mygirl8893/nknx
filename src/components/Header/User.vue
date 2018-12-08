<template>
   <v-menu offset-y origin="right top" left content-class="language-dropdown" transition="slide-y-transition" nudge-top="-10" class="user-block-wrap">
		<v-btn icon large slot="activator" v-html="iconSvg"></v-btn>
		<div class="dropdown-content">
         <div class="dropdown-top white--text">
            <span class="white--text fs-14 fw-bold d-block">{{$auth.user().name}}</span>
            <span class="d-block fs-12 fw-light">{{$auth.user().email}}</span>
         </div>
         <v-list class="dropdown-list">
            <template v-for="userLink in userLinks" v-if="userLink.id !== 2">
               <v-list-tile :to="'/profile'" :key="userLink.id">
                  <i :class="userLink.icon"></i>
                  <span>{{$t(userLink.title)}}</span>
               </v-list-tile>
            </template>
            <template v-else>
               <v-list-tile @click.prevent="logoutUser" :key="userLink.id">
                  <i :class="userLink.icon"></i>
                  <span>{{$t(userLink.title)}}</span>
               </v-list-tile>
            </template>
         </v-list>

      </div>
	</v-menu>
</template>
<script>
   import { mapMutations } from 'vuex'
   import feather from 'feather-icons'

   export default{
      data() {
         return {
            userLinks: [
               {
                  id: 1,
                  title: 'message.userProfile',
                  icon: 'ti-user mr-3 primary--text',
                  path: '/users/user-profile'
               },
               {
                  id: 2,
                  title: 'message.logOut',
                  icon: 'ti-power-off mr-3 error--text'
               }
            ]
         }
      },
      methods: {
         logoutUser() {
            this.$store.dispatch("setSnackbar", this.$t('message.successfullyLoggedOut'));
            this.$auth.logout();
         },
      },
      computed: {
			iconSvg: function () {
            return feather.icons['user'].toSvg()
			}
		},
   }
</script>
