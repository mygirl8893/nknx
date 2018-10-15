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
					<h2 class="mb-3">{{$t('message.forgotPassword')}}</h2>
					<p class="fs-14">{{$t('message.enterYourEmailToSendYouAResetLink')}}</p>
					<v-form v-model="valid" class="mb-4">
							<v-text-field 
							:label="$t('message.email')" 
							v-model="email" 
							:rules="emailRules" 
							required
						></v-text-field>						
						<v-btn :disabled="!valid" color="primary" block @click="resetPassword">{{$t('message.sendMail')}}</v-btn>
					</v-form>
					<div>
						<router-link to="/login">{{$t('message.backToSignIn')}}</router-link>
					</div>
				</div>
	    </div>
	</div>
</template>

<script>

import axios from "axios";


export default {
    data(){
      return {
		email: '',
        valid: false,
                emailRules: [
            v => !!v || "E-mail is required",
            v =>
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
            "E-mail must be valid"
        ],
      }
    },
    methods: {
      resetPassword(){
           var self = this;
           axios.post('auth/reset', {
                email: this.email
            })
            .then(function (response) {
                self.$store.dispatch("setSnackbar", self.$t('message.forgotPasswordSent'));
            })
            .catch(function (error) {
                self.$store.dispatch("setSnackbar", self.$t('message.verificationSentError'));
            });

      },
    }
  } 
</script>
