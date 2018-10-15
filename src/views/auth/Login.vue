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
					<h2 class="mb-3">{{$t('message.loginHeader')}}</h2>
					<p class="fs-14">{{$t('message.enterUsernameAndPasswordToAccess')}}.</p>
					<v-form v-model="valid" class="mb-4">
						<v-text-field 
							:label="$t('message.email')" 
							v-model="email" 
							:rules="emailRules" 
							required
						></v-text-field>
						<v-text-field 
							:label="$t('message.password')" 
							v-model="password" 
							type="password" 
							:rules="passwordRules" 
							required
						></v-text-field>
						<v-checkbox 
							color="primary" 
							:label="$t('message.rememberMe')" 
							v-model="checkbox"
						></v-checkbox>
						<router-link class="mb-1" to="/forgot-password">{{$t('message.forgotPassword')}}</router-link>
						<div>
							<v-btn :disabled="!valid"  large @click="login" block color="primary">{{$t('message.login')}}</v-btn>
							<v-btn large :to="{path: '/register'}" block color="warning">{{$t('message.createAccount')}}</v-btn>
						</div>
					</v-form>

				</div>
			</div>
	</div>
</template>

<script>




export default {
    data(){
      return {
		checkbox: false,
      	valid: false,
     
		emailRules: [
			v => !!v || "E-mail is required",
			v =>
			/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
			"E-mail must be valid"
		],
     
      	passwordRules: [v => !!v || "Password is required"],
        email: null,
        password: null,
        error: false
      }
    },
    methods: {
      login(){
        var app = this
        this.$auth.login({
            params: {
              email: app.email,
              password: app.password
            }, 
            success: function () {
							this.$store.dispatch("setSnackbar", this.$t('message.successfullyLoggedIn'));
						},
            error: function () {},
            rememberMe: this.checkbox,
            redirect: '/profile',
            fetchUser: true,
        });       
      },
    }
  } 
</script>
