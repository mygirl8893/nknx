/**
 * Settings Module
 */
import {
	wallets,
} from "./data";

const state = {
	wallets: wallets,                         
}

// getters
const getters = {
	wallets: state => {
		return state.wallets;
	},
}

// actions
const actions = {
	addToWalletsStore(context, payload) {
		context.commit('addToWalletsStoreHandler', payload);
	},
	removeFromWalletsStore(context, payload) {
		context.commit('removeFromWalletsStoreHandler', payload);
	},
}

// mutations
const mutations = {
	addToWalletsStoreHandler(state, wallet) {
		var found = false;
		for(var i=0; i < state.wallets.length; i++) { 
			if(state.wallets[i].address == wallet.address){
				found = true
			} 
		}
		if (!found){
			state.wallets.push(wallet);
		}
	},
	removeFromWalletsStoreHandler(state, wallet) {
		for(var i=0; i < state.wallets.length; i++) { 
			if(state.wallets[i].address == wallet.address){
				state.wallets.splice(i,1);
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
