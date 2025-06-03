// This configuration is for Jest testing environment
// Next.js handles Babel configuration for the main application

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  // You might need to add plugins here if you use specific Babel features
  // For example, if you use decorators or class properties that require plugins.
}; 