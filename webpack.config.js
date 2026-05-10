module.exports = function (options) {
  return {
    ...options,
    resolve: {
      ...options.resolve,
      extensionAlias: {
        '.js': ['.js', '.ts'],
        '.cjs': ['.cjs', '.cts'],
        '.mjs': ['.mjs', '.mts'],
      },
    },
  };
};
