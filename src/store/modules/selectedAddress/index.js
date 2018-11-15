/**
 * Settings Module
 */
import {
	selectedAddress,
} from "./data";

const state = {
	selectedAddress: selectedAddress,                         
}

// getters
const getters = {
	selectedAddress: state => {
		return state.selectedAddress;
	},
}

// actions
const actions = {
	setSelectedAddress(context, payload) {
		context.commit('setSelectedAddressHandler', payload);
	},
	removeSelectedAddress(context, payload) {
		context.commit('removeSelectedAddressHandler', payload);
	},
}

// mutations
const mutations = {
	setSelectedAddressHandler(state, address) {
		state.selectedAddress = address;
	},
	removeSelectedAddressHandler(state) {
		state.selectedAddress = null;
	},
}


export default {
	state,
	getters,
	actions,
	mutations
}
