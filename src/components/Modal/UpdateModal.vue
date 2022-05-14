<template >
	<div class="bg-gray-800 bg-opacity-75 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
		<div class="bg-white p-4 md:p-12 rounded-md text-center w-full md:w-8/12">
			<h1 class="text-xl mb-4 font-bold text-slate-500">{{ secret.namespace }}: {{ secret.name }}</h1>
			<div class="text-left">
				Type:
				<div class="inline-block my-5 text-xl mb-4 font-bold  ml-2" >{{ type }}</div>
			</div>
			<div class="text-left">
				Version / latest {{ latestVersion }} /:
				<input type="text" name="version" class="inline-block my-5 mb-4 ml-2 border-b border-black" v-model="version" />
			</div>
			<textarea :value="data" ref="secretData" class="mx-auto block p-5 text-left border shadow-lg mb-6 resize-y w-full" rows="15"></textarea>

			<button class="bg-green-500 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold" @click="submit">Submit</button>
			<button class="bg-red-500 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold" @click="$emit( 'onClose' )">Close</button>
		</div>
	</div>
</template>

<script>
let closeReference	= null;

export default {
	name: "Modal",
	data: function () {
		return {
			type: '',
			version: 0,
			latestVersion: 0
		}
	},
	props: {
		secret: {
			type: Object
		}
	},
	methods: {
		async submit() {
			const namespace		= this.secret.namespace;
			const name			= this.secret.name;
			const data			= this.$refs.secretData.value;
			await this.$store.dispatch( "updateSecret", { name, namespace, data } )

			this.$emit( 'onSubmit' );
		},
		async close( event ) {
			if (event.keyCode === 27)
				this.$emit( 'onClose' );
		}
	},
	created() {
		this.type			= this.secret.type;
		const version		= parseInt( this.secret.version );
		this.version		= version;
		this.latestVersion	= version;
		closeReference		= this.close.bind( this );

		document.addEventListener('keyup', closeReference );
	},
	unmounted() {
		document.removeEventListener('keyup', closeReference );
	},
	computed: {
		data: function () {
			const data	= this.secret;
			return JSON.stringify( typeof data.data !== 'undefined' ? data.data[this.version] : {}, null, 4 )
		}
	}

}
</script>


<style>
</style>