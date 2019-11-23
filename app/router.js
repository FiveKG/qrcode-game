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
  router.get('/api/common/get_province',controller.tool.getProvince);
  router.get('/api/common/get_city',controller.tool.getCity);
  router.get('/api/common/get_area',controller.tool.getArea);
  router.get('/api/tool/get_captcha',controller.tool.getCaptcha)
  router.get('/api/tool/getJwtInfo',controller.tool.getJwtInfo)
 
  /** ----------------------------Api-account---------------------------- */
  router.post('/api/account/search', controller.v1.sysUser.getSysUser);
  router.post('/api/account/register',controller.v1.sysUser.registerUser);
  router.post('/api/account/login',controller.v1.sysUser.login);

  /** ----------------------------Api-shouManage---------------------------- */
  router.post('/api/shop/search', controller.v1.shop.getShop);
  router.post('/api/game/search', controller.v1.game.getGame);
  router.post('/api/shop_group/search', controller.v1.shopGroup.getShop_group);
  router.post('/api/agent/search', controller.v1.agent.getAgent);

  /** ----------------------------Page---------------------------- */
  router.get('/login',controller.v1.index.login);
  router.get('/index', controller.v1.index.index);
  router.get('/page/welcome', controller.v1.index.welcome);
  router.get('/page/user/user_manage', controller.v1.sysUser.userManage);
  router.get('/page/add_user',controller.v1.sysUser.addUser);
  router.get('/page/edit_user',controller.v1.sysUser.editUser);
  router.get('/page/shop/shop_manage', controller.v1.shop.shopManage);
  router.get('/page/add_shop',controller.v1.shop.addShop);
  router.get('/page/edit_shop',controller.v1.shop.editShop);
  router.get('/page/game/game_manage', controller.v1.game.gameManage);
  router.get('/page/add_game',controller.v1.game.addGame);
  router.get('/page/edit_game',controller.v1.game.editGame);
  router.get('/page/shop/shop_group_manage', controller.v1.shopGroup.shop_groupManage);
  router.get('/page/add_shop_group',controller.v1.shopGroup.addShop_group);
  router.get('/page/edit_shop_group',controller.v1.shopGroup.editShop_group);
  router.get('/page/agent/agent_manage', controller.v1.agent.agentManage);
  router.get('/page/add_agent',controller.v1.agent.addAgent);
  router.get('/page/edit_agent',controller.v1.agent.editAgent);

};