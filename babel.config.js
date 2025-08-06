module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Tamagui compilation optimization plugin (must be first)
      [
        '@tamagui/babel-plugin',
        {
          components: ['@tamagui/core'], // Only use core components
          config: './src/tamagui.config.ts',
          logTimings: true,
          disableExtraction: process.env.NODE_ENV === 'development',
        },
      ],
      'babel-plugin-transform-inline-environment-variables',
      // Keep reanimated plugin at the end if exists
    ],
  };
};
