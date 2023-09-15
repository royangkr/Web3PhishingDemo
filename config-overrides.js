module.exports = function override(config, env) {
    config.resolve.fallback = {
      fs: false,
      path:false,
      http: false,
      https: false,
      zlib: false,
      url: false
    };
    return config;
  };