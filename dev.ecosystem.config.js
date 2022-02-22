module.exports	= {
	apps : [
		{
			name: 'simple-secrets',
			script: 'dist/index.js',
			watch: true,
			ignore_watch : [
				"node_modules",
				"dist",
				"cache",
				"logs",
				"*.log",
				"*.json",
				"*.tmp",
				".idea",
				".git",
				"Uploads",
				"src",
				"public"
			],
			watch_options: {
				followSymlinks: false,
				usePolling: true
			},
		},
	]
};
