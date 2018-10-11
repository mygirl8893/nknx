import Vue from 'vue'
import Router from 'vue-router'
import HorizontalLayout from 'Container/HorizontalLayout'

const Dashboard = () => import('Views/dashboard/Dashboard');
const Wallet = () => import('Views/wallet/Wallet');
const CreateWallet = () => import('Views/wallet/CreateWallet');
const OpenWallet = () => import('Views/wallet/OpenWallet');
const AddressBrowser = () => import('Views/browser/Addresses');
const BlockBrowser = () => import('Views/browser/Blocks');
const TransactionBrowser = () => import('Views/browser/Transactions');
const BlockHeight = () => import('Views/block/Height');
const BlockHash = () => import('Views/block/Hash');
const Transaction = () => import('Views/transaction/Transaction');
const Profile = () => import('Views/profile/Profile');

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			component: HorizontalLayout,
			redirect: '/dashboard',
			children: [
			 {
				 component: Dashboard,
				 path: '/dashboard',
				 meta: {
					requiresAuth: true,
					title: 'message.ecommerce',
					breadcrumb: 'Dashboard / Ecommerce'
				 }
			  },
			 {
				 component: Wallet,
				 path: '/wallet',
				 meta: {
					requiresAuth: true,
					title: 'message.wallet',
					breadcrumb: 'Wallet'
				 }
			  },
			  {
				 component: CreateWallet,
				 path: '/wallet/create',
				 meta: {
					requiresAuth: true,
					title: 'message.createWallet',
					breadcrumb: 'Wallet / Create'
				 }
			  },
			  {
				 component: OpenWallet,
				 path: '/wallet/open',
				 meta: {
					requiresAuth: true,
					title: 'message.openWallet',
					breadcrumb: 'Wallet / Open'
				 }
			  },
			  {
				 component: AddressBrowser,
				 path: '/browse/addresses',
				 meta: {
					requiresAuth: true,
					title: 'message.addresses',
					breadcrumb: 'Addresses'
				 }
			  },
			  {
				 component: BlockBrowser,
				 path: '/browse/blocks',
				 meta: {
					requiresAuth: true,
					title: 'message.blocks',
					breadcrumb: 'Blocks'
				 }
			  },
			  {
				 component: TransactionBrowser,
				 path: '/browse/txs',
				 meta: {
					requiresAuth: true,
					title: 'message.transactions',
					breadcrumb: 'Transactions'
				 }
			  },
			  {
				 component: BlockHeight,
				 path: '/block/height/:height',
				 meta: {
					requiresAuth: true,
					title: 'message.block',
					breadcrumb: 'Home / Blocks / Block'
				 }
			  },
			  {
				 component: BlockHash,
				 path: '/block/hash/:hash',
				 meta: {
					requiresAuth: true,
					title: 'message.block',
					breadcrumb: 'Home / Blocks / Block'
				 }
			  },
			  {
				component: Transaction,
				path: '/transaction/:hash',
				meta: {
				   requiresAuth: true,
				   title: 'message.transaction',
				   breadcrumb: 'Home / Transactions / Transaction'
				}
			 },
			  {
				component: Profile,
				path: '/profile',
				meta: {
				   requiresAuth: true,
				   title: 'message.profile',
				   breadcrumb: 'Home / Profile '
				}
			 }
			]
		}
	]
	
})
