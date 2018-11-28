<template>
	<v-container fluid>
		<app-card :fullBlock="true">
			<v-breadcrumbs>
				<h2 class="text-capitalize mb-0">{{$t(pageTitle)}}</h2>
				<div class="spacer"></div>
				<v-icon slot="divider">chevron_right</v-icon>
				<v-breadcrumbs-item>
					<template v-for="(breadcrumb, index) in pageBreadcrumb">
							{{$t(breadcrumb)}}
							<template v-if="index < pageBreadcrumb.length-1">
								/
							</template>
					</template>
				</v-breadcrumbs-item>
			</v-breadcrumbs>
		</app-card>
	</v-container>
</template>

<script>
export default {
  computed: {
    // computed property to get page breadcrumbs
    pageTitle() {
      return this.$breadcrumbs[0].meta.title;
    },
    pageBreadcrumb() {
      return this.$breadcrumbs[0].meta.breadcrumb;
    }
  }
};
</script>
