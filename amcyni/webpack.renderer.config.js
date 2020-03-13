const rules = require('./webpack.rules');
const path = require('path');

//CSS
rules.push({
  test: /\.css$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader' },
    {
      loader: 'postcss-loader',
      options: {
        plugins: function () {
            return [
                  require('autoprefixer')
            ];
        }
      }
    },
    { loader: 'sass-loader' }
  ],
});

//Fonts
rules.push({
  test: /\.(woff|woff2|eot|ttf|otf)$/,
  use: ['file-loader',],
});

//Images
rules.push({
  test: /\.(png|svg|jpg|gif)$/,
  use: ['file-loader',],
});

module.exports = {
  // Put your normal webpack config below here
  resolve: {
    alias: {
      vue: 'vue/dist/vue.min.js' ,
    }
  },
  module: {
    rules,
  },
};
