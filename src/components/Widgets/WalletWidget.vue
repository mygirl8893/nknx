<template>
    <div>
                <v-layout row wrap>
					
						<v-btn :to="{path: '/wallet/create'}" raised color="primary">{{$t('message.newWallet')}}</v-btn>
						<v-btn :to="{path: '/wallet/open'}" raised color="primary">{{$t('message.openWallet')}}</v-btn>
						<v-menu offset-y>
							<v-btn
								slot="activator"
								color="primary"
								dark
							>
								{{$t('message.menu')}}
							</v-btn>
							<v-list>
                                
                                    <v-list-tile @click="">
                                        <v-list-tile-title>{{$t('message.changeName')}}</v-list-tile-title>
                                    </v-list-tile>
                              
								<v-list-tile @click="">
									<v-list-tile-title>{{$t('message.changePassword')}}</v-list-tile-title>
								</v-list-tile>
								<v-list-tile @click="">	
									<v-list-tile-title>{{$t('message.closeWallet')}}</v-list-tile-title>
								</v-list-tile>
							</v-list>
						</v-menu>
					
				</v-layout>
				<v-layout row wrap>
					<v-flex xs12>
						{{$t('message.yourWalletNoWallet')}}
					</v-flex>
				</v-layout>
    </div>
</template>