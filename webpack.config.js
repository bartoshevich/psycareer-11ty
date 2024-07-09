const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: { main: "./src/assets/scripts/index.js" },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].js",
  },
  resolve: {
    alias: {
      Images: path.resolve(__dirname, 'src/assets/images/'),
      Fonts: path.resolve(__dirname, 'src/assets/fonts/'),
      Favicons: path.resolve(__dirname, 'src/assets/favicons/')
       
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        type: "asset/resource",
        generator: {
          filename: '[name][ext]', 
        },
      },
      {
        test: /\.(png|svg|jpg|webp|jpeg|gif)$/i,
        type: "asset/resource",
       
      },
    ],
  },

  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300, 
    poll: 1000 
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  devtool:
    process.env.NODE_ENV === "production"
      ? "source-map"
      : "cheap-module-source-map",
  cache: false,
};
