module.exports = {
  publicPath: "./",
  css: {
    loaderOptions: {
      sass: {
        data: `@import "./src/assets/main.scss";`,
      },
    },
  },
  configureWebpack: {
    devtool: "source_map",
    performance: {
      maxAssetSize: 40000,
      maxEntrypointSize: 700000,
    },
  },
};
