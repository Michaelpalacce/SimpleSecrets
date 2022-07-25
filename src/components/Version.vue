<template>
	<p class="text-center">
		Current version:
		<span class="text-yellow-500">{{ currentVersion }}</span>.
		Latest version:
		<a :href="`https://github.com/Michaelpalacce/Simplesecrets/releases/tag/${latestVersion}`">
			<span :class="`${currentVersion !== latestVersion ? 'text-red-500' : 'text-yellow-500' }`">
				{{ latestVersion }}
			</span>
		</a>
	</p>
</template>

<script>
export default {
	name: "Version",
	async created() {
		await this.$store.dispatch('updateVersions');
	},
	computed: {
		currentVersion() {
			return this.$store.state.currentVersion;
		},
		latestVersion() {
			return this.$store.state.latestVersion;
		},
	},
}
</script>

<style scoped>

</style>