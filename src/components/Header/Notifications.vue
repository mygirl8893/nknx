<template>
	<v-menu offset-y left origin="right top" z-index="99" content-class="notification-dropdown" transition="slide-y-transition" nudge-top="-10">
		<v-btn class="notification-icon ma-0"  icon large slot="activator">
			<i class="zmdi grey--text zmdi-notifications-active  zmdi-hc-fw font-lg"></i> <!--maybe class wobble animated infinite -->
		</v-btn>
		<div class="dropdown-content">
			<div class="dropdown-top d-custom-flex justify-space-between primary">
				<span class="white--text fw-bold">Notifications</span>
				<span class="v-badge warning">4 NEW</span>
			</div>
			<v-list class="dropdown-list">
				<v-list-tile v-for="notification in notifications" :key="notification.title" @click="">
					<i class="mr-3 zmdi" :class="notification.icon"></i>
					<span>{{ $t(notification.title) }}</span>
				</v-list-tile>
			</v-list>
		</div>
	</v-menu>
</template>

<script>
	export default {
		data() {
			return {
				notifications: [{
						title: "message.testMessage1",
						icon: "zmdi-storage primary--text"
					},
					{
						title: "message.testMessage2",
						icon: "zmdi-memory warning--text"
					},
					{
						title: "message.testMessage3",
						icon: "zmdi-email error--text"
					},
					{
						title: "message.testMessage4",
						icon: "zmdi-edit success--text"
					}
				]
			};
		}
	};
</script>
