//@ts-check
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app; 
      /** ----------------------------Api-tool---------------------------- */
    router.get('/api/common/generate_key', controller.tool.getPrimaryKey);
    router.get('/api/common/get_province',controller.tool.getProvince);
    router.get('/api/common/get_city',controller.tool.getCity);
    router.get('/api/common/get_area',controller.tool.getArea);
    router.get('/api/tool/get_captcha',controller.tool.getCaptcha);
    router.get('/api/tool/getJwtInfo',controller.tool.getJwtInfo);
    router.get('/api/tool/get_shop_agent_qrcode',controller.tool.getShopAgentQrcodeByUrl);
    router.post('/api/tool/upload_img_game', controller.tool.upload_img);
    router.post('/api/tool/upload_img_coupon',controller.tool.upload_img);
    router.post('/api/tool/upload_img_shop',controller.tool.upload_img);
}