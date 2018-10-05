/**
 * Settings Module
 */
import {
	walletstore,
} from "./data";

const state = {
	walletstore: walletstore,                         
}

// getters
const getters = {
	walletstore: state => {
		return state.walletstore;
	},
}

// actions
const actions = {
	addToWalletStore(context, payload) {
		context.commit('addToWalletStoreHandler', payload);
	},
	removeFromWalletStore(context, payload) {
		context.commit('removeFromWalletStoreHandler', payload);
	},
}

// mutations
const mutations = {
	addToWalletStoreHandler(state, walletStoreObject) {
		var found = false;
		for(var i=0; i < state.walletstore.length; i++) { 
			if(state.walletstore[i].address == walletStoreObject.address){
				found = true
			} 
		}
		if (!found){
			state.walletstore.push(walletStoreObject);
		}
	},
	removeFromWalletStoreHandler(state, pk) {
		for(var i=0; i < state.walletstore.length; i++) { 
			if(state.walletstore[i].pk == pk){
				state.walletstore.splice(i,1);
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
