//@ts-check
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/api/test/code', controller.test.test1);
  router.get('/api/test/test2', controller.test.test2);
  router.get('/api/test/test3', controller.test.test3);

  /** ----------------------------Api---------------------------- */
  //获取主键值
  router.get('/api/common/generate_key', controller.tool.getPrimaryKey);

  //获取用户列表
  router.post('/api/account/search', controller.v1.sysUser.getSysUser);

  /** ----------------------------Page---------------------------- */
  router.get('/index', controller.v1.index.index);
  router.get('/page/welcome', controller.v1.index.welcome);
  router.get('/page/user/user_manage', controller.v1.index.userManage);
};
