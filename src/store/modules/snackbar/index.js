import {
	snackbar,
} from "./data";

const state = {
	snackbar: snackbar,                         
}

// getters
const getters = {
	snackbar: state => {
		return state.snackbar;
	},
}

const actions = {
	setSnackbar(context, payload) {
		context.commit('setSnackbarHandler', payload);
	}
}

const mutations = {
    setSnackbarHandler(state, snackbar) {
		state.snackbar = snackbar;
	},
}
export default {
    getters,
    actions,
	state,
	mutations
}