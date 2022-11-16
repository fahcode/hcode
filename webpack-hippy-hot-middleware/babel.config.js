'use strict';

module.exports = (api) => {
  api.cache(true);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          targets: {
            esmodules: true,
            node: '0.12',
          },
        },
      ],
    ],
  };
};
