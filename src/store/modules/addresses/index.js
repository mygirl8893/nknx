/**
 * Settings Module
 */
import {
	addresses,
} from "./data";

const state = {
	addresses: addresses,                         
}

// getters
const getters = {
	addresses: state => {
		return state.addresses;
	},
}

// actions
const actions = {
	addToAddressesStore(context, payload) {
		context.commit('addToAddressesStoreHandler', payload);
	},
	removeFromAddressesStore(context, payload) {
		context.commit('removeFromAddressesStoreHandler', payload);
	},
}

// mutations
const mutations = {
	addToAddressesStoreHandler(state, address) {
		var found = false;
		for(var i=0; i < state.addresses.length; i++) { 
			if(state.addresses[i].address == address){
				found = true
			} 
		}
		if (!found){
			state.addresses.push(address);
		}
	},
	removeFromAddressesStoreHandler(state, address) {
		for(var i=0; i < state.addresses.length; i++) { 
			if(state.addresses[i] == address){
				state.addresses.splice(i,1);
			} 
		}
	},
}


export default {
	state,
	getters,
	actions,
	mutations
}
