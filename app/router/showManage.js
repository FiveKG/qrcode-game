//@ts-check
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app; 
      /** ----------------------------Api-showManage---------------------------- */
    router.post('/api/account/search', controller.v1.sysUser.getSysUser);
    router.post('/api/shop/search', controller.v1.shop.getShop);
    router.post('/api/shop_staff/search',controller.v1.shop.getShop_staff);
    router.post('/api/game/search', controller.v1.game.getGame);
    router.post('/api/game_session/search',controller.v1.game.getGame_session)
    router.post('/api/shop_group/search', controller.v1.shopGroup.getShop_group);
    router.post('/api/agent/search', controller.v1.agent.getAgent);
    router.post('/api/agent_staff/search',controller.v1.agentStaff.getAgent_staff);
    router.post('/api/qrcode/search',controller.v1.qrcode.getQrcode);
    router.post('/api/coupon/search',controller.v1.coupon.getCoupon);
    router.post('/api/game_coupon_rule/search',controller.v1.gameCouponRule.getGame_coupon_rule);
    router.post('/api/pay_order/search',controller.v1.pay.getPay_order);
    router.post('/api/balance_log/search',controller.v1.pay.getBalance_log);
    router.post('/api/user_recharge/search',controller.v1.pay.getUser_recharge);
}