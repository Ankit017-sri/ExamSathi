module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  //   resolver: {
  //     sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'], // Add any other file extensions you want to support
  //   },
};
