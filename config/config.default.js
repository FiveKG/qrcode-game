/* eslint valid-jsdoc: "off" */

'use strict';

const path = require("path");

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
  config.middleware = [
    //"requestInspect",
    "requestProxy",
  ];

  // 配置项目启动的端口
  config.cluster = {
    listen: {
      port: 7005
    }
  };

  // 设置安全插件
  config.security = {
    csrf: {
      useSession: false,
      enable: false,
      ignoreJSON: false,
      cookieName: 'csrfToken',
      sessionName: 'csrfToken',
      headerName: 'x-csrf-token',
      bodyName: '_csrf',
      queryNAme: '_csrf'
    },
    domainWhiteList: ['http://localhost:7005']
  };

  // 配置跨域
  config.cors = {
    origin: "*",
    allowMethods: 'GET,HEADER,PUT,POST,DELETE,PATCH',
    credentials: true
  };

  config.requestProxy = {
    host: process.env.PROXY_HOST, // target host that matched path will be proxy to
    match: /^\/data\//,
    map: function (path) {
      // console.log(`proxy, path:${path}`);
      return path.replace('/data/', '/');
    }
  };

  config.token = {
    secret: process.env.JWT_SECRET,
    expiresIn: 60, // 60
  };

  // 设置模板
  config.view = {
    root: [
      path.join(appInfo.baseDir, 'app/view')
    ].join(','),
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.njk': 'nunjucks',
      '.html': 'nunjucks'
    }
  };

  // 设置网站图标
  // config.siteFile = {
  //   '/favicon.ico': fs.readFileSync(path.join(appInfo.baseDir, 'app/public/k12_logo.ico'))
  // };

  // 设置静态资源地址
  config.static = {
    prefix: '/',
    dir: ['app/public']
  };

  config.logger = {
    level: 'DEBUG',
    consoleLevel: 'DEBUG',
    outputJSON: true,
    allowDebugAtProd: process.env.DEBUG ? true : false,
  };

  config.pg = {
    // database configuration
    client: {
      // host
      host: process.env.DB_HOST,
      // port
      port: process.env.DB_PORT,
      // username
      user: process.env.DB_USER,
      // password
      password: process.env.DB_PWD,
      // database
      database: process.env.DB_NAME,
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
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
