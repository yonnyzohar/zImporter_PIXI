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
    'class-validator': 'classValidator',
    '@pixi-spine/all-4.0': 'PIXI.spine',
    '@pixi-spine/base': 'PIXI.spine',
    '@pixi-spine/loader-base': 'PIXI.spine',
    '@pixi-spine/loader-uni': 'PIXI.spine',
    '@pixi-spine/runtime-3.7': 'PIXI.spine',
    '@pixi-spine/runtime-3.8': 'PIXI.spine',
    '@pixi-spine/runtime-4.1': 'PIXI.spine',
    '@pixi/filter-drop-shadow': 'PIXI.filters',
    '@pixi/particle-emitter': 'PIXI.particles'
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
