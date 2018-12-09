<template>
    <div>

        <v-flex xs12>
            <v-flex xs12>
                <v-text-field
                    v-model="username"
                    :label="$t('message.username')"
                ></v-text-field>
            </v-flex>
            <v-flex xs12>
                <v-text-field
                    v-model="email"
                    :label="$t('message.email')"
                ></v-text-field>
            </v-flex>
            <v-flex xs12>
                <v-text-field
                    v-model="password"
                    :label="$t('message.password')"
                    :append-icon="show1 ? 'visibility_off' : 'visibility'"
                    :rules="[rules.min]"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    hint="At least 8 characters"
                    counter
                    @click:append="show1 = !show1"
                ></v-text-field>
            </v-flex>
            <v-flex xs12>
                <v-layout justify-end>
                    <v-btn :disabled="!enabled" @click="changeUser" color="gradient-primary" small>{{$t('message.saveChanges')}}</v-btn>
                </v-layout>  
            </v-flex>

        </v-flex>

    </div>
</template>
<script>
    import axios from "axios";  
    export default{
        data () {
			return {
                username : this.$auth.user().name,
                email : this.$auth.user().email,
                password : "",
                show1  :false,
                rules: {
					min: v => v.length >= 8 || 'Min 8 characters',
                },
                enabled : false
			}
        },
        watch: { 
            username: function(newVal, oldVal) { 
                if(newVal !== this.$auth.user().name){
                    this.enabled = true;
                }
                else{
                    this.enabled = false;
                }
            },
            email: function(newVal, oldVal) { 
                console.log(newVal);
                if(newVal !== this.$auth.user().email){
                    this.enabled = true;
                }
                else{
                    this.enabled = false;
                }
            },
            password: function(newVal, oldVal) { 
                if(newVal){
                    this.enabled = true;
                }
                if(!newVal){
                    this.enabled = false;
                }
            }
        },
         methods: {
            changeUser() {
                const self = this;
                var newUser = {};
                if (this.username && this.username!==this.$auth.user().name){
                    newUser.name = this.username;
                }
                if (this.email && this.email!==this.$auth.user().email){
                    newUser.email = this.email;
                }
                if (this.password){
                    newUser.password = this.password;
                }
                //Call to NKN-API https://github.com/CrackDavid/nkn-api
                axios.post('auth/changeUser',newUser).then(function(response){
                    if (self.password){
                        self.$auth.logout();
                        self.$store.dispatch("setSnackbar", self.$t('message.userChangedSuccessfulLogout'));
                    }
                    else{
                        self.$auth.fetch();
                        self.$store.dispatch("setSnackbar", self.$t('message.userChangedSuccessful'));
                    }
                }).catch(function (error) {
                    self.$store.dispatch("setSnackbar", self.$t('message.userChangedError'));
                });
            }
         }
    }
</script>