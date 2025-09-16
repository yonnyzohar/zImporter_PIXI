const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const packageJson = require('./package.json');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'zimporter-pixi.min.js',
    library: 'zimporter',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.webpack.json',
        },
        exclude: /node_modules/,
      },
    ],
  },
  externals: {
    'pixi.js': 'PIXI',
    'gsap': 'gsap',
    'reflect-metadata': 'Reflect',
    'class-transformer': 'classTransformer',
    'class-validator': 'classValidator'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false, // <-- keep comments inside min.js
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __LIB_VERSION__: JSON.stringify(packageJson.version),
    }),
    new webpack.BannerPlugin({
      banner: `/*! zimporter-pixi v${packageJson.version} | (c) ${new Date().getFullYear()} Yonathan Zohar */`,
      raw: true,
    }),
  ],
  mode: 'production',
};
