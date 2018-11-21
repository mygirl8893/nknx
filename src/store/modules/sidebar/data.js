// Sidebar Routers
export const menus = {
	'general': [
		{ action: 'zmdi-money',title: 'message.wallet', path: '/wallet' },
		{ action: 'zmdi-label',title: 'message.network', path: '/network'},
		{ action: 'zmdi-view-dashboard',title: 'message.blocks', path: '/browse/blocks'},
		{ action: 'zmdi-mail-send',title: 'message.transactions', path: '/browse/txs'},
		{ action: 'zmdi-label',title: 'message.addresses', path: '/browse/addresses'},
	],
	'protected': [
		{ action: 'zmdi-router',title: 'message.nodesManager', path: '/nodes-manager' },
		{ action: 'zmdi-balance-wallet',title: 'message.walletTracker', path: '/wallet-tracker'},
	]
}