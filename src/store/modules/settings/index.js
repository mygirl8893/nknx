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
	horizontalLayoutSidebar: false,
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
	horizontalLayoutSidebar: state => {
		return state.horizontalLayoutSidebar;
	}
}

// actions
const actions = {
	changeLanguage(context, payload) {
		context.commit('changeLanguageHandler', payload);
	},
	toggleHorizontalLayoutSidebar(context, payload) {
		context.commit('toggleHorizontalLayoutSidebarHandler', payload);
	}
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
	toggleHorizontalLayoutSidebarHandler(state, value) {
		state.horizontalLayoutSidebar = value;
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}
