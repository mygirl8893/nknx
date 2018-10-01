<template>
	<div>
		<page-title-bar></page-title-bar>
		<v-container grid-list-xl pt-0>
			<v-layout row wrap>
				<app-card
					customClasses="mb-30"
					colClasses="xl12 lg12 md12 sm12 xs12"
                    :footer="true"
				>
					<v-layout row wrap>
						<v-flex xs12>
							<div v-html="$t('message.openWalletAdvice')"></div>
						</v-flex>
					</v-layout>
					<v-layout row wrap>
						<v-flex xs3>
							<v-radio-group v-model="radioButton">
								<v-radio color="primary" :label="$t('message.openWalletfromFile')" value="file"></v-radio>
								<v-radio color="primary" :label="$t('message.openWalletfromPK')" value="pk"></v-radio>
							</v-radio-group>
							
						</v-flex>
						<v-flex xs6>
							<upload-btn :title="$t('message.selectWalletFile')" v-if="radioButton==='file'"></upload-btn>
							<v-text-field v-if="radioButton==='pk'"
								v-model="pk"
								:append-icon="show1 ? 'visibility_off' : 'visibility'"
								:rules="[rules.required]"
								:label="$t('message.pasteOrTypePK')"
								:type="show1 ? 'text' : 'password'"
								@click:append="show1 = !show1"
							></v-text-field>
						</v-flex>

					</v-layout>
				</app-card>
			</v-layout>


		</v-container>
	</div>
</template>

<script>
	import UploadButton from 'vuetify-upload-button';
  export default {
	components: {
		'upload-btn': UploadButton
		
	},
   data () {
      return {
				radioButton: "",
				pk:"",
				show1: false,
				rules: {
          required: value => !!value || 'Required.',
        }
      
      }
    }
  }
</script>