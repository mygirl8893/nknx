<template>
	<div>
	<div id="paper-wallet" class="paper-wallet">
		<div class="paper-wallet__title">
			<div class="paper-wallet__title-text">
				<h1>{{ $t('message.myNknWallet') }}</h1>
				<span>nknx.org</span>
			</div>
		</div>
		<div class="paper-wallet__content">
			<div class="paper-wallet__content-qr">
				<div class='paper-wallet__content-qr__item'>
					<qrcode-vue :value="addr" :size="200" level="H"></qrcode-vue>
					<span>{{ $t('message.yourAddress') }}</span>
				</div>
				<div class='paper-wallet__content-qr__item'>
					<qrcode-vue :value="pk" :size="200" level="H"></qrcode-vue>
					<span>{{ $t('message.yourPrivateKey') }}</span>
				</div>
				<div class='paper-wallet__content-qr__item'>
					<qrcode-vue :value="pwd" :size="200" level="H"></qrcode-vue>
					<span>{{ $t('message.yourWalletPassword') }}</span>
				</div>
			</div>
			<hr>
			<div class="paper-wallet__content-text">
				<p><span>{{ $t('message.yourAddress') }}</span>:<br>
				{{addr}}
				</p>
			</div>
			<div class="paper-wallet__content-text">
				<p><span>{{ $t('message.yourPrivateKey') }}</span>:<br>
				{{pk}}
				</p>
			</div>
			<div class="paper-wallet__content-text">
				<p><span>{{ $t('message.yourWalletPassword') }}</span>:<br>
				{{pwd}}
				</p>
			</div>
		</div>
	</div>
	</div>
</template>
<script>
import QrcodeVue from 'qrcode.vue';

export default {
	components: {
		QrcodeVue
	},
	props: ['pk', 'addr', 'pwd'],
	data() {
		return {
	  		
		};
	},
	mounted: function(){
		let body = document.getElementsByTagName('body')
		body = body[0]
		let wallet = document.getElementById('paper-wallet')
		body.innerHTML = "";
		body.appendChild(wallet);
	}
};
</script>
