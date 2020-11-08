const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: `./src/index.js`,

  // ファイルの出力設定
  output: {
    //出力ファイル名
    path: path.resolve(__dirname, './dist'),
    filename: '[name]-[contenthash].js',
  },
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'dist/html'),
    // contentBase: 'dist',
    open: true,

    port: 3000,
    useLocalIp: true,
    host: '0.0.0.0',
    watchContentBase: true,
    writeToDisk: false,
  },
  module: {
    rules: [
      // CSSをバンドル
      {
        // 対象となるファイルの拡張子(scss)
        test: /\.scss$/,
        // Sassファイルの読み込みとコンパイル
        use: [
          // CSSファイルを書き出すオプションを有効にする
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // CSSをバンドルするための機能
          {
            loader: 'css-loader',
            options: {
              // オプションでCSS内のurl()メソッドの取り込まない
              url: false,
              // ソースマップの利用有無
              sourceMap: true,
              // Sass+PostCSSの場合は2を指定
              importLoaders: 2,
            },
          },
          // PostCSSのための設定
          {
            loader: 'postcss-loader',
            options: {
              // PostCSS側でもソースマップを有効にする
              sourceMap: true,
              postcssOptions: {
                // ベンダープレフィックスを自動付与する
                plugins: ['autoprefixer'],
              },
            },
          },
          // Sassをバンドル
          {
            loader: 'sass-loader',
            options: {
              // ソースマップの利用有無
              sourceMap: true,
            },
          },
        ],
      },

      // 画像ファイルをバンドル
      {
        test: /\.(jpe?g|png|gif|svg|ico)(\?.+)?$/,
        include: path.resolve(__dirname, 'src/images'),
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              name: 'images/[name]-[contenthash].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),

    new CleanWebpackPlugin(),
  ],
  // source-map方式でないと、CSSの元ソースが追跡できないため
  devtool: 'source-map',
};
