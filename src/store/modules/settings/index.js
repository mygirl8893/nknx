/**
 * Settings Module
 */
import {
	languages,
} from "./data";

const state = {
	rtlLayout: false,                                      // rtl layout
	languages,                                             // languages
	selectedLocale: languages[0],                          // selected locale
}

// getters
const getters = {
	rtlLayout: state => {
		return state.rtlLayout;
	},
	selectedLocale: state => {
		return state.selectedLocale;
	},
	languages: state => {
		return state.languages;
	},
}

// actions
const actions = {
	changeLanguage(context, payload) {
		context.commit('changeLanguageHandler', payload);
	},
}

// mutations
const mutations = {
	changeLanguageHandler(state, language) {
		state.selectedLocale = language;
		if (language.locale === 'he' || language.locale === 'ar') {
			state.rtlLayout = true;
		} else {
			state.rtlLayout = false;
		}
	},
}

export default {
	state,
	getters,
	actions,
	mutations
}
