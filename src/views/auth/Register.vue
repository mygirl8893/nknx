<template>
	<div>
		   <v-alert
      :value="success"
      type="success"
    >
      {{$t('message.registrationSuccess')}}
    </v-alert>
    <v-alert
      :value="error"
      type="error"
    >
			<span v-for="(key,value) in errors" :key="key">{{$t('message.errorRegistration'+ value.replace(/^\w/, c => c.toUpperCase()))}} </span>
      
    </v-alert>

			<div class="session-table-cell">
				<div class="session-content">
					<img 
						src="/static/img/myNKNx.png" 
						class="img-responsive mb-3" 
						width="230" 
						height="120" 
					/>
					<h2 class="mb-3">{{$t('message.signUpHeader')}}</h2>
					<p class="fs-14">{{$t('message.havingAnAccount')}}
						<router-link to="/login">{{$t('message.login')}}</router-link>
					</p>
					<v-form v-model="valid" class="mb-4">
						<v-text-field 
							:label="$t('message.username')" 
							v-model="name" 
							:rules="nameRules" 
							:counter="20" 
							required
						></v-text-field>
						<v-text-field 
							:label="$t('message.email')" 
							v-model="email" 
							:rules="emailRules" 
							required
						></v-text-field>
						<v-text-field 
							:label="$t('message.password')"
							v-model="password" 
							:rules="passwordRules" 
							type="password" 
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
						<v-btn :disabled="!valid" large @click="submit" block color="gradient-primary" class="mb-3">{{$t('message.signUp')}}</v-btn>
					<!--	<p>{{$t('message.bySigningUpYouAgreeTo')}}</p>
						<router-link to="">{{$t('message.termsOfService')}}</router-link>-->
					</v-form>
				</div>
			</div>
	</div>
</template>

<script>
import axios from 'axios';

export default {
  components: {

  },
  data() {
    return {
			valid: false,
			success:false,
			error:false,
			errors:null,
      name: "",
      nameRules: [
        v => !!v || "Name is required",
        v => v.length <= 20 || "Name must be less than 20 characters"
      ],
      email: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid"
      ],
		password: "",
		repeatPassword: "",
		passwordRepeatRules: [v => !!v || "Password is required"],
      passwordRules: [v => !!v || "Password is required"],
    };
  },
  methods: {
	passwordMatchError () { 
		return (this.password === this.repeatPassword) ? '' : 'Passwords must match'
	},
    submit() {
			var self = this;
      if (this.valid) {
			this.$auth.register({
					data: {
						name: this.name,
						email: this.email,
						password: this.password,
					}, 
					success: function () {
							self.success = true
					},
					error: function (resp) {
							self.error = true;
							self.errors = resp.response.data.errors;
					},
					redirect: null
			}); 
      }
    },
  }
};
</script>
