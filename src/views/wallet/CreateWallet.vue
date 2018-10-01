<template>
	<div>
		<page-title-bar></page-title-bar>
		<v-container grid-list-xl pt-0>
			<v-layout row wrap>
				<app-card
					colClasses="xl12 lg12 md12 sm12 xs12"
                    :footer="true"
				>
					<v-layout row wrap>
						<v-flex xs12>
							<div v-html="$t('message.createWalletAdvice')"></div>
						</v-flex>
					</v-layout>
					<v-layout row wrap>
						<v-flex xs6>
							<v-text-field
								v-model="password"
								:append-icon="show1 ? 'visibility_off' : 'visibility'"
								:rules="[rules.required, rules.min]"
								:type="show1 ? 'text' : 'password'"
								name="input-10-1"
								hint="At least 8 characters"
								counter
								@click:append="show1 = !show1"
							></v-text-field>
						</v-flex>
					</v-layout>
					<v-btn slot="footer" color="primary" small>{{$t('message.create')}}</v-btn>
				</app-card>
			</v-layout>


		</v-container>
	</div>
</template>

<script>
	import nknWallet from "nkn-wallet";

  export default {
		components: {
		},
		methods: {

		},
		data () {
			return {
				show1: false,
				wallet: null,
				rules: {
					required: value => !!value || 'Required.',
					min: v => v.length >= 8 || 'Min 8 characters',
				}
			}
		}
  }
</script>