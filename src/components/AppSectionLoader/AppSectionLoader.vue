<template>
	<div class="loader-overlay" v-if="status">
  		<v-progress-circular indeterminate color="gradient-primary"></v-progress-circular>
	</div>
</template>

<script>
export default {
  props: ["status"]
};
</script>
