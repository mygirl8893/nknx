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
					<h2 class="mb-3">{{$t('message.signUpHeader')}}</h2>
					<p class="fs-14">{{$t('message.havingAnAccount')}}
						<router-link to="/login">{{$t('message.login')}}</router-link>
					</p>
					<v-form v-model="valid" class="mb-4">
						<v-text-field 
							label="Username" 
							v-model="name" 
							:rules="nameRules" 
							:counter="20" 
							required
						></v-text-field>
						<v-text-field 
							label="E-mail ID" 
							v-model="email" 
							:rules="emailRules" 
							required
						></v-text-field>
						<v-text-field 
							label="Password" 
							v-model="password" 
							:rules="passwordRules" 
							type="password" 
							required
						></v-text-field>
						<v-btn large @click="submit" block color="primary" class="mb-3">{{$t('message.signUp')}}</v-btn>
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
      passwordRules: [v => !!v || "Password is required"],
    };
  },
  methods: {
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
