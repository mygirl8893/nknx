// Sidebar Routers
export const menus = {
	'message.general': [
		{ action: 'zmdi-money',title: 'message.wallet', path: '/wallet' , exact: true },
		{ action: 'zmdi-view-dashboard',title: 'message.blocks', path: '/browse/blocks', exact: true },
		{ action: 'zmdi-mail-send',title: 'message.transactions', path: '/browse/txs', exact: true },
		//{ action: 'zmdi-label',title: 'message.addresses', path: '/browse/addresses', exact: true },
	]
}