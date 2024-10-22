module.exports = {
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    moduleNameMapper: {
        '^axios$': require.resolve('axios'),
      },
  };
  
  