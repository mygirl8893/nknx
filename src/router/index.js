import Vue from 'vue'
import Router from 'vue-router'
import MainContainer from 'Container/MainContainer'



const Dashboard = () => import('Views/dashboard/Dashboard');
const Login = () => import('Views/auth/Login');
const Register = () => import('Views/auth/Register');
const ForgotPassword = () => import('Views/auth/ForgotPassword')
const NewPassword = () => import('Views/auth/NewPassword')
const Wallet = () => import('Views/wallet/Wallet');
const CreateWallet = () => import('Views/wallet/CreateWallet');
const OpenWallet = () => import('Views/wallet/OpenWallet');
const AddressBrowser = () => import('Views/browser/Addresses');
const BlockBrowser = () => import('Views/browser/Blocks');
const TransactionBrowser = () => import('Views/browser/Transactions');
const BlockHeight = () => import('Views/block/Height');
const BlockHash = () => import('Views/block/Hash');
const Transaction = () => import('Views/transaction/Transaction');
const Address = () => import('Views/address/Address');
const Profile = () => import('Views/user/Profile');
const NodesManager = () => import('Views/user/NodesManager');
const WalletTracker = () => import('Views/user/WalletTracker');
const Network = () => import('Views/network/Network');







Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			component: MainContainer,
			redirect: '/dashboard',
			children: [
				{
					component: Login,
					path: '/login',
					meta: {
					   title: 'message.login',
					   breadcrumb: ['message.login'],
					   auth: false
					}
				},
				{
					component: Register,
					path: '/register',
					meta: {
					   title: 'message.register',
					   breadcrumb: ['message.register'],
					   auth: false
					}
				},
				{
					component: ForgotPassword,
					path: '/forgot-password',
					meta: {
					   title: 'message.forgotPassword',
					   breadcrumb: ['message.forgotPassword'],
					   auth: false
					}
				},
				{
					component: NewPassword,
					path: '/newpassword/:token',
					meta: {
					   title: 'message.newPassword',
					   breadcrumb: ['message.newPassword'],
					   auth: false
					}
				},
				{
					component: Dashboard,
					path: '/dashboard',
					meta: {
						title: 'message.dashboard',
						breadcrumb: ['message.dashboard'],
					}
				},
				{
					component: Wallet,
					path: '/wallet',
					meta: {
						title: 'message.wallet',
						breadcrumb: ['message.wallet'],
					}
				},
				{
					component: CreateWallet,
					path: '/wallet/create',
					meta: {
						title: 'message.createWallet',
						breadcrumb: ['message.wallet','message.createWallet'],
					}
				},
				{
					component: OpenWallet,
					path: '/wallet/open',
					meta: {
						title: 'message.openWallet',
						breadcrumb: ['message.wallet','message.openWallet'],
					}
				},
				{
					component: AddressBrowser,
					path: '/browse/addresses',
					meta: {
						title: 'message.addresses',
						breadcrumb: ['message.addresses'],
					}
				},
				{
					component: BlockBrowser,
					path: '/browse/blocks',
					meta: {
						title: 'message.blocks',
						breadcrumb: ['message.blocks'],
					}
				},
				{
					component: TransactionBrowser,
					path: '/browse/txs',
					meta: {
						title: 'message.transactions',
						breadcrumb: ['message.transactions'],
					}
				},
				{
					component: BlockHeight,
					path: '/block/height/:height',
					meta: {
						title: 'message.block',
						breadcrumb: ['message.blocks','message.block'],
					}
				},
				{
					component: BlockHash,
					path: '/block/hash/:hash',
					meta: {
						title: 'message.block',
						breadcrumb: ['message.blocks','message.block'],
					}
				},
				{
					component: Transaction,
					path: '/transaction/:hash',
					meta: {
						title: 'message.transaction',
						breadcrumb: ['message.transactions','message.transaction'],
					}
				},
				{
					component: Address,
					path: '/address/:address',
					meta: {
						title: 'message.address',
						breadcrumb: ['message.addresses','message.address'],
					}
				},
				{
					component: Network,
					path: '/network',
					meta: {
						title: 'message.network',
						breadcrumb: ['message.network'],
					}
				},
				{
					component: Profile,
					path: '/profile',
					meta: {
						title: 'message.profile',
						breadcrumb: ['message.profile'],
						auth: true
					}
				},
				{
					component: NodesManager,
					path: '/nodes-manager',
					meta: {
						auth: true,
						title: 'message.nodesManager',
						breadcrumb: ['message.nodesManager']
					}
				},
				{
					component: WalletTracker,
					path: '/wallet-tracker',
					meta: {
						auth: true,
						title: 'message.walletTracker',
						breadcrumb: ['message.walletTracker']
					}
				}
			]
		}
	]
	
})
