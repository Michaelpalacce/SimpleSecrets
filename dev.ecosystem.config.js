module.exports	= {
	apps : [
		{
			name: 'simple-secrets',
			script: 'npm run serve',
			watch: true,
			ignore_watch : [
				"node_modules",
				"docker-data",
				"dist",
				"cache",
				"logs",
				"*.log",
				"db.*",
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
			env: {
			}
		},
		{
			name: 'frontend',
			script: 'npm run fr-serve',
			watch: true,
			ignore_watch : [
				"node_modules",
				"docker-data",
				"dist",
				"cache",
				"logs",
				"*.log",
				"*.json",
				"*.tmp",
				".idea",
				".git",
				"db.*",
				"Uploads",
				"api",
				"public",
				"src"
			],
			watch_options: {
				followSymlinks: false,
				usePolling: true
			},
			env: {
			}
		},
	]
};
