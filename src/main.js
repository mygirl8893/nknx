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
moment.tz.setDefault('Atlantic/Reykjavik')
Vue.prototype.$moment = moment

// Create VueI18n instance with options
const i18n = new VueI18n({
	locale: store.getters.selectedLocale.locale, // set locale
	messages, // set locale messages
})


/* eslint-disable no-new */
new Vue({
	store,
	i18n,
	router,
	render: h => h(App),
	components: { App }
}).$mount('#app')
