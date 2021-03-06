import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist';

// modules

import settings from './modules/settings';
import sidebar from './modules/sidebar';
import wallets from './modules/wallets';
import snackbar from './modules/snackbar';
import selectedWallet from './modules/selectedWallet';


Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
    key: 'vuex', // The key to store the state on in the storage provider.
    storage: window.localStorage, // or window.sessionStorage or localForage
    reducer: state => ({
        wallets: state.wallets,
        selectedWallet: state.selectedWallet,
        settings: {
            selectedLocale: state.settings.selectedLocale
        }
      })
  })

export const store = new Vuex.Store({
    plugins: [vuexLocalStorage.plugin],
    modules: {
        settings,
        sidebar,
        wallets,
        snackbar,
        selectedWallet
    }
})
