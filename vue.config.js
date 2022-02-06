module.exports = {
  publicPath: "./",
  pages: {
    index: {
      entry: "src/main.js",
      title: "TM 暁月のフィナーレ",
    },
  },
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
