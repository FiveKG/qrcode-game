/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1572518093505_2720';

  // add your middleware config here
  config.middleware = [];

  //关闭安全威胁csrf的防范
  config.security = {
    csrf: {
      enable: false
    },
    domainWhiteList: ['*']
  };

  config.cluster = {
    listen: {
      path: '',
      port: Number(process.env.PROJECT_PORT),
      hostname: process.env.PROJECT_HOSTNAME,
    }
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
