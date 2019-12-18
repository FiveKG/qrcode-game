//@ts-check
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app; 
    
    /** ----------------------------Api-qrcode---------------------------- */
    router.post('/api/qrcode/add_qrcode',controller.v1.qrcode.insertQrcode);
    router.get('/api/qrcode/generate_qr_code',controller.v1.qrcode.generateQrcode);

    /** ----------------------------Api-test_qrcode---------------------------- */
    router.get('/api/qrcode/test_qrcode',controller.v1.qrcode.test_qrcode)
}