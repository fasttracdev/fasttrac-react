module.exports = {
  presets: [
    '@babel/env',
    '@babel/react',
    '@lingui/babel-preset-react'
  ],
  plugins: [
    '@babel/syntax-dynamic-import',
    '@babel/proposal-class-properties',
    ['@babel/transform-runtime', {
      helpers: false
    }]
  ]
}
