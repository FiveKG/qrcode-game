//@ts-check
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
//todo 对众多路由进行分类：https://eggjs.org/zh-cn/basics/router.html
  router.get('/api/test/code', controller.test.test1);
  router.get('/api/test/test2', controller.test.test2);
  router.get('/api/test/test3', controller.test.test3);
  router.get('/api/test/test4',controller.test2.echo);
  

 
  /** ----------------------------Api-tool---------------------------- */
  router.get('/api/common/generate_key', controller.tool.getPrimaryKey);
  router.get('/api/tool/get_captcha',controller.tool.getCaptcha)

  /** ----------------------------Api-account---------------------------- */
  router.post('/api/account/search', controller.v1.sysUser.getSysUser);
  router.post('/api/account/register',controller.v1.sysUser.registerUser);
  router.post('/api/account/login',controller.v1.sysUser.login);

  /** ----------------------------Page---------------------------- */
  router.get('/login',controller.v1.index.login);
  router.get('/index', controller.v1.index.index);
  router.get('/page/welcome', controller.v1.index.welcome);
  router.get('/page/user/user_manage', controller.v1.index.userManage);
  router.get('/edit/edit_user',controller.v1.sysUser.editUser)

};
