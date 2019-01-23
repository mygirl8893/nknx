import 'babel-polyfill';
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueBreadcrumbs from 'vue2-breadcrumbs'
import Notifications from 'vue-notification'
import velocity from 'velocity-animate'
import Nprogress from 'nprogress'
import VueI18n from 'vue-i18n'
import fullscreen from 'vue-fullscreen'
import moment from 'moment-timezone'
import UploadButton from 'vuetify-upload-button'
import VueClipboard from 'vue-clipboard2'
import axios from 'axios';
import VueAxios from 'vue-axios';
import JSONBigInt from 'json-bigint';

// global components
import GlobalComponents from './globalComponents'

// app.vue
import App from './App'

// router
import router from './router'

// themes
import primaryTheme from './themes/primaryTheme';

// store
import { store } from './store/store';

// include script file
import './lib/Script'

// include all css files
import './lib/Css'


// messages
import messages from './lang';

// navigation guards before each
router.beforeEach((to, from, next) => {
	Nprogress.start()
	next()
})

// navigation guard after each
router.afterEach((to, from) => {
	Nprogress.done()
	setTimeout(() => {
		const contentWrapper = document.querySelector(".v-content__wrap");
		if(contentWrapper !== null){
			contentWrapper.scrollTop = 0;
		}
		const boxedLayout = document.querySelector('.app-boxed-layout .app-content');
		if(boxedLayout !==  null){
			boxedLayout.scrollTop = 0;
		}
		const miniLayout = document.querySelector('.app-mini-layout .app-content');
		if(miniLayout !== null){
			miniLayout.scrollTop = 0;
		}
	}, 200);
})



VueClipboard.config.autoSetContainer = true // add this line

// plugins
Vue.use(Vuetify, {
	theme: primaryTheme
});
Vue.use(VueI18n)
Vue.use(VueBreadcrumbs)
Vue.use(Notifications, { velocity })
Vue.use(fullscreen);
Vue.use(GlobalComponents);
Vue.use(UploadButton);
Vue.use(VueClipboard);
Vue.use(VueAxios, axios);

moment.tz.setDefault('Atlantic/Reykjavik')
moment.locale(store.getters.selectedLocale.locale)
axios.defaults.baseURL = 'https://api.nknx.org/';

axios.defaults.transformResponse =  [function (data) {
	return JSONBigInt.parse(data);
}]



Vue.prototype.$moment = moment

// Create VueI18n instance with options
const i18n = new VueI18n({
	locale: store.getters.selectedLocale.locale, // set locale
	messages, // set locale messages
})

Vue.router= router;

Vue.use(require('@websanova/vue-auth'), {
	auth: {
    
		request: function (req, token) {
			if(req.url.startsWith(req.baseURL) ||  !req.url.startsWith("http")){
				this.options.http._setHeaders.call(this, req, {Authorization: 'Bearer ' + token});
			}
		},
		
		response: function (res) {
			var headers = this.options.http._getHeaders.call(this, res),
				token = headers.Authorization || headers.authorization;
	
			if (token) {
				token = token.split(/Bearer\:?\s?/i);
				
				return token[token.length > 1 ? 1 : 0].trim();
			}
		}
	},
	http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
	router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
	authRedirect: { path: '/login' }
});


Vue.auth.options.http._invalidToken = function(res){
	if (res.status === 400 && res.data.error == "token_invalid") {
		return true;
	}
}

/* eslint-disable no-new */
new Vue({
	store,
	i18n,
	router,
	render: h => h(App),
	components: { App }
}).$mount('#app')