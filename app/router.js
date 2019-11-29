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
  router.get('/api/tool/get_captcha',controller.tool.getCaptcha);
  router.get('/api/tool/getJwtInfo',controller.tool.getJwtInfo);

  /** ----------------------------Api-account---------------------------- */
  router.post('/api/account/register',controller.v1.sysUser.registerUser);
  router.post('/api/account/login',controller.v1.sysUser.login);
  /** ----------------------------Api-qrcode---------------------------- */
  router.post('/api/qrcode/add_qrcode',controller.v1.qrcode.insertQrcode);
  router.get('/api/qrcode/generate_qr_code',controller.v1.qrcode.GenerateQrcode);
  

  /** ----------------------------Api-showManage---------------------------- */
  router.post('/api/account/search', controller.v1.sysUser.getSysUser);
  router.post('/api/shop/search', controller.v1.shop.getShop);
  router.post('/api/game/search', controller.v1.game.getGame);
  router.post('/api/shop_group/search', controller.v1.shopGroup.getShop_group);
  router.post('/api/agent/search', controller.v1.agent.getAgent);
  router.post('/api/agent_staff/search',controller.v1.agentStaff.getAgent_staff);
  router.post('/api/qrcode/search',controller.v1.qrcode.getQrcode);
  router.post('/api/coupon/search',controller.v1.coupon.getCoupon);
  router.post('/api/game_coupon_rule/search',controller.v1.gameCouponRule.getGame_coupon_rule);

  /** ----------------------------Page---------------------------- */
  router.get('/login',controller.v1.index.login);
  router.get('/index', controller.v1.index.index);
  router.get('/page/welcome', controller.v1.index.welcome);
  router.get('/page/user/user_manage', controller.v1.sysUser.userManage);
  //router.get('/page/add_user',controller.v1.sysUser.addUser);
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
  router.get('/page/agent/agent_staff_manage', controller.v1.agentStaff.agent_staffManage);
  //router.get('/page/add_agent_staff',controller.v1.agentStaff.addAgent_staff);
  router.get('/page/edit_agent_staff',controller.v1.agentStaff.editAgent_staff);
  router.get('/page/qrcode/qrcode_manage', controller.v1.qrcode.qrcodeManage);
  router.get('/page/add_qrcode',controller.v1.qrcode.addQrcode);
  router.get('/page/edit_qrcode',controller.v1.qrcode.editQrcode);
  router.get('/page/qrcode/download_qrcode',controller.v1.qrcode.downloadQrcode);

  router.get('/page/coupon/coupon_manage', controller.v1.coupon.couponManage);
  router.get('/page/add_coupon',controller.v1.coupon.addCoupon);
  router.get('/page/edit_coupon',controller.v1.coupon.editCoupon);

  router.get('/page/game_coupon_rule/game_coupon_rule_manage', controller.v1.gameCouponRule.game_coupon_ruleManage);
  router.get('/page/add_game_coupon_rule',controller.v1.gameCouponRule.addGame_coupon_rule);
  router.get('/page/edit_game_coupon_rule',controller.v1.gameCouponRule.editGame_coupon_rule);
};