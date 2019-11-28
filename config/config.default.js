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
    //"first",
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
    domainWhiteList: ['.127.0.0.1:7005']//当字符串以 . 开头，例如 .test.com 时，代表 referrer 白名单为 test.com 的所有子域名，包括 test.com 自身。当字符串不以 . 开头，例如 sub.test.com，代表 referrer 白名单为 sub.test.com 这一个域名
  };

  // // 配置跨域
  // config.cors = {
  //   origin: "*",
  //   allowMethods: 'GET,HEADER,PUT,POST,DELETE,PATCH',
  //   credentials: true
  // };

  config.requestInspect={
    enable: true,
    ignore:['/api/account/register','/login','/api/tool/get_captcha*','/api/account/login']
  };  
  

  config.bodyParser = {
    ignore: /^\/data\//,
  };

  
  config.requestProxy = {
    host: process.env.PROXY_HOST, // target host that matched path will be proxy to
    match: /^\/data\//,
    map: function (path) {
      // console.log(`proxy, path:${path}`);
      return path.replace('/data/', '');
    }
  };

  config.token = {
    secret: process.env.JWT_SECRET,
    expiresIn: 2*24*3600, // 60
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

  config.redis = {
    client: {             // instanceName. See below
        port: process.env.REDIS_PORT,          // Redis port
        host: process.env.REDIS_HOST,   // Redis host
        password: process.env.REDIS_PWD,
        db: process.env.REDIS_DB,
    }
  }
  config.set_redis={
    redis_expiration:60*2,
  }
  // add your user config here
  const userConfig = {
    redis_expiration:60*2,
    //设置cookies
    cookies:{
      jwt_key    : 'jwtToken',
      cookies_options: {
      maxAge   : 2*24*3600*1000,
      path     : '/',              //设置键值对生效的 URL 路径，默认设置在根路径上（/），也就是当前域名下的所有 URL 都可以访问这个 Cookie。
      httpOnly : true,             //设置键值对是否可以被 js 访问，默认为 true，不允许被 js 访问。
      overwrite: true,             //设置 key 相同的键值对如何处理，如果设置为 true，则后设置的值会覆盖前面设置的，否则将会发送两个 set-cookie 响应头。
      signed   : false,            //设置是否对 Cookie 进行签名
      encrypt  : false             //设置是否对 Cookie 进行加密
        }
      },
    
    qrcode:{
        hash_secret:process.env.HASH_SECRET,
        option:{
          size:4,//二维码的大小，从1-5.仅支持调整npg和svg格式，详情：https://www.npmjs.com/package/qr-image 
          margin :4,//白色边框，png默认是4，其他为1
        },
        url_option:{
            host:"https://www.qrcode.isecsp.com/entry_page?",
            param1:'id=',
            param2:'&s_id=',
            param3:"&g_id=",
            param4:'&hash=',
            param5:'&seq='
        },
        url:function(data){
            return `https://www.qrcode.isecsp.com/entry_page?id=${data.id}&s_id=${data.s_id}&g_id=${data.g_id}&hash=${data.hash}`
        }
      }

  };

  return {
    ...config,
    ...userConfig,
  };
};
