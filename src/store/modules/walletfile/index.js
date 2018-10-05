/**
 * Settings Module
 */
import {
	walletfile,
} from "./data";

const state = {
	walletfile: walletfile,                         
}

// getters
const getters = {
	walletfile: state => {
		return state.walletfile;
	},
}

// actions
const actions = {
	setWalletfile(context, payload) {
		context.commit('setWalletFileHandler', payload);
	},
	removeWalletfile(context, payload) {
		context.commit('removeWalletfileHandler', payload);
	},
}

// mutations
const mutations = {
	setWalletFileHandler(state, walletfile) {
		state.walletfile = walletfile;
	},
	removeWalletfileHandler(state) {
		state.walletfile = null;
	},
}

export default {
	state,
	getters,
	actions,
	mutations
}
