'use strict';

/** @type {import("snowpack").SnowpackUserConfig} */
module.exports = {
  mount: {
    assets: {
      url: '/assets',
    },
    public: {
      url: '/',
    },
    src: {
      url: '/dist',
    },
  },
  plugins: [
    //
    '@snowpack/plugin-typescript',
  ],
};
