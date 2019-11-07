//@ts-check
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  /** ----------------------------Api---------------------------- */
  //获取主键值
  router.get('/api/common/generate_key', controller.tool.getPrimaryKey);
  //登录验证
  router.post('/api/account/login', controller.v1.sysUser.login);

  /** ----------------------------Page---------------------------- */
  router.get('/index', controller.v1.index.index);
};
