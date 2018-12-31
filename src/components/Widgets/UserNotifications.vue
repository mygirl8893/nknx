<template>
    <div>
      <v-flex xs12>
        <v-switch
        :label="$t('message.nodeOfflineNotify')"
        v-model="notifications.nodeOffline"
        color = "primary"
        @change="updateNotifications"
        >
        </v-switch>
        <v-switch
        :label="$t('message.nodeOutdatedNotify')"
        v-model="notifications.nodeOutdated"
        color = "primary"
        @change="updateNotifications"
        ></v-switch>
        <v-switch
        :label="$t('message.nodeStuckedNotify')"
        v-model="notifications.nodeStucked"
        color = "primary"
        @change="updateNotifications"
        ></v-switch>
        <v-switch
        :label="$t('message.weeklyMiningOutputNotify')"
        v-model="notifications.weeklyMiningOutput"
        color = "primary"
        @change="updateNotifications"
        ></v-switch>
      </v-flex>
    </div>
</template>
<script>
    import axios from "axios";  
    import { Timeouts } from "Constants/timeouts";
    export default{
        data () {
          return {
            interval: null,
            timer: "",
            notifications: {}
          }
        },
        mounted: function(){
          this.getUserNotifications();
        },
         methods: {
            getUserNotifications(){
              const self = this;
              axios.get('/auth/user/notifications').then(function(response){
                  self.notifications = response.data
                })

            },
            updateNotifications: function() {
              const self = this;
              for (let i in self.notifications){
                self.notifications[i] = Number(self.notifications[i])
              }
              axios.put('/auth/user/notifications', this.notifications).then(function(response){
                self.getUserNotifications()
              })
            }
         }
    }
</script>