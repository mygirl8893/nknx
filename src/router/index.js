import Vue from 'vue'
import Router from 'vue-router'
import HorizontalLayout from 'Container/HorizontalLayout'



const Dashboard = () => import('Views/dashboard/Dashboard');
const Login = () => import('Views/auth/Login');
const Register = () => import('Views/auth/Register');
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
					component: Login,
					path: '/login',
					meta: {
					   title: 'message.login',
					   breadcrumb: 'login',
					   auth: false
					}
				},
				{
					component: Register,
					path: '/register',
					meta: {
					   title: 'message.register',
					   breadcrumb: 'register',
					   auth: false
					}
				},
				{
					component: Dashboard,
					path: '/dashboard',
					meta: {
						title: 'message.dashboard',
						breadcrumb: 'Dashboard',
						auth: false
					}
				},
				{
					component: Wallet,
					path: '/wallet',
					meta: {
						title: 'message.wallet',
						breadcrumb: 'Wallet',
						auth: false
					}
				},
				{
					component: CreateWallet,
					path: '/wallet/create',
					meta: {
						title: 'message.createWallet',
						breadcrumb: 'Wallet / Create',
						auth: false
					}
				},
				{
					component: OpenWallet,
					path: '/wallet/open',
					meta: {
						title: 'message.openWallet',
						breadcrumb: 'Wallet / Open',
						auth: false
					}
				},
				{
					component: AddressBrowser,
					path: '/browse/addresses',
					meta: {
						title: 'message.addresses',
						breadcrumb: 'Addresses',
						auth: false
					}
				},
				{
					component: BlockBrowser,
					path: '/browse/blocks',
					meta: {
						title: 'message.blocks',
						breadcrumb: 'Blocks',
						auth: false
					}
				},
				{
					component: TransactionBrowser,
					path: '/browse/txs',
					meta: {
						title: 'message.transactions',
						breadcrumb: 'Transactions',
						auth: false
					}
				},
				{
					component: BlockHeight,
					path: '/block/height/:height',
					meta: {
						title: 'message.block',
						breadcrumb: 'Home / Blocks / Block',
						auth: false
					}
				},
				{
					component: BlockHash,
					path: '/block/hash/:hash',
					meta: {
						title: 'message.block',
						breadcrumb: 'Home / Blocks / Block',
						auth: false
					}
				},
				{
					component: Transaction,
					path: '/transaction/:hash',
					meta: {
					title: 'message.transaction',
					breadcrumb: 'Home / Transactions / Transaction',
					auth: false
					}
				},
				{
					component: Profile,
					path: '/profile',
					meta: {
					title: 'message.profile',
					breadcrumb: 'Home / Profile ',
					auth: true
					}
				}
			]
		}
	]
	
})
