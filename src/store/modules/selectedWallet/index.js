/**
 * Settings Module
 */
import {
	selectedWallet,
} from "./data";

const state = {
	selectedWallet: selectedWallet,                         
}

// getters
const getters = {
	selectedWallet: state => {
		return state.selectedWallet;
	},
}

// actions
const actions = {
	setSelectedWallet(context, payload) {
		context.commit('setSelectedWalletHandler', payload);
	},
	removeSelectedWallet(context, payload) {
		context.commit('removeSelectedWalletHandler', payload);
	},
}

// mutations
const mutations = {
	setSelectedWalletHandler(state, wallet) {
		state.selectedWallet = wallet;
	},
	removeSelectedWalletHandler(state) {
		state.selectedWallet = null;
	},
}


export default {
	state,
	getters,
	actions,
	mutations
}
