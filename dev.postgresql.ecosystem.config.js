module.exports	= {
	apps : [
		{
			name: 'simple-secrets',
			script: 'dist/index.js',
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
				"Uploads",
				"src",
				"public"
			],
			watch_options: {
				followSymlinks: false,
				usePolling: true
			},
			env:{
				PROD_DB_USERNAME	: 'simplesecrets',
				PROD_DB_PASSWORD	: 'simplesecrets',
				PROD_DB_NAME		: 'simplesecrets',
				PROD_DB_HOSTNAME	: 'localhost',
				PROD_DB_PORT		: '5432',
				PROD_DB_DIALECT		: 'postgres'
			}
		},
	]
};
