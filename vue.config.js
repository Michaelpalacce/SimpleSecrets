module.exports = {
    devServer: {
        disableHostCheck: true,
        proxy: 'http://localhost:3000'
    },
    outputDir: "dist/src"
}