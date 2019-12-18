//@ts-check
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app; 
      /** ----------------------------Page---------------------------- */
  router.get('/',controller.v1.index.login);
  router.get('/login',controller.v1.index.login);
  router.get('/index', controller.v1.index.index);
  router.get('/page/welcome', controller.v1.index.welcome);
  router.get('/page/user/user_manage', controller.v1.sysUser.userManage);
  router.get('/page/add_user',controller.v1.sysUser.addUser);
  router.get('/page/edit_user',controller.v1.sysUser.editUser);

  router.get('/page/shop/shop_manage', controller.v1.shop.shopManage);
  router.get('/page/add_shop',controller.v1.shop.addShop);
  router.get('/page/edit_shop',controller.v1.shop.editShop);
  router.get('/page/shop/shop_staff_manage',controller.v1.shop.shop_staffManage);
  router.get('/page/edit_shop_staff',controller.v1.shop.editShop_staff);

  router.get('/page/game/game_manage', controller.v1.game.gameManage);
  router.get('/page/game/game_session',controller.v1.game.game_sessionManage);
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

  router.get("/page/pay/pay_order",controller.v1.pay.pay_orderManage);
  router.get("/page/pay/user_recharge",controller.v1.pay.user_rechargeManage);
  router.get("/page/pay/balance_log",controller.v1.pay.balance_logManage);
}