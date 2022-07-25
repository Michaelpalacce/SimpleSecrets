<template>
	<a href="javascript:void(0)" class="flex items-center focus:outline-none focus:ring-2 focus:ring-white">
		<PlusCircleIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true"/>
		<span class="text-sm ml-2">
								New Secret
							</span>
	</a>
</template>

<script>
import { PlusCircleIcon } from '@heroicons/vue/solid'

export default {
	name: "NewSecret",
	components: {
		PlusCircleIcon
	},
}
</script>

<style scoped>

</style>