//@ts-check
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
//todo 对众多路由进行分类：https://eggjs.org/zh-cn/basics/router.html
  router.get('/api/test/code', controller.test.test1);
  router.post('/api/test/upload', controller.test.upload);
  router.get('/api/test/test3', controller.test.test3);
  router.get('/api/test/test4',controller.test2.echo);


  /** ----------------------------Api-game_coupon_rule---------------------------- */
  router.post('/api/game_coupon_rule/edit_rule',controller.v1.gameCouponRule.editRule)

  require('./router/account')(app);
  require('./router/qrcode')(app);
  require('./router/showManage')(app);
  require('./router/showPage')(app);
  require('./router/tool')(app);
};