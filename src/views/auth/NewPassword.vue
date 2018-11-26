<template>
	<div>

			<div class="session-table-cell">
				<div class="session-content">
					<img 
						src="/static/img/myNKNx.png" 
						class="img-responsive mb-3" 
						width="230" 
						height="120" 
					/>
					<h2 class="mb-3">{{$t('message.resetPassword')}}</h2>
					<p class="fs-14">{{$t('message.enterNewPasswordOfAccount')}}.</p>
					<v-form v-model="valid" class="mb-4">
						<v-text-field 
							:label="$t('message.password')" 
							v-model="password" 
							type="password" 
							:rules="passwordRules" 
							required
						></v-text-field>
						<v-text-field 
							:error-messages='passwordMatchError()'
							:label="$t('message.repeatPassword')" 
							v-model="repeatPassword" 
							type="password" 
							:rules="passwordRepeatRules" 
							required
						></v-text-field>

						<div>
							<v-btn :disabled="!valid" large @click="resetPassword" block color="gradient-primary">{{$t('message.resetPassword')}}</v-btn>
						</div>
					</v-form>

				</div>
			</div>
	</div>
</template>

<script>


import axios from "axios";

export default {
    data(){
      return {

      	valid: false,
				passwordRules: [v => !!v || "Password is required"],
				passwordRepeatRules: [v => !!v || "Password is required"],
				password: null,
				repeatPassword: null,
        error: false
      }
    },
    methods: {
			passwordMatchError () { 
				return (this.password === this.repeatPassword) ? '' : 'Passwords must match'
			},
      resetPassword(){
						var self = this;
				    axios.post('auth/reset/'+this.$route.params.token , {
                password: this.password
            })
            .then(function (response) {
								self.$store.dispatch("setSnackbar", self.$t('message.passwordRestored'));
								self.$router.push({ path: '/login'})
            })
            .catch(function (error) {
                self.$store.dispatch("setSnackbar", self.$t('message.errorRestoringPassword'));
            });
      
      },
    }
  } 
</script>
