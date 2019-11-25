//@ts-check
'use strict';

const Controller = require('egg').Controller;

class QrcodeController extends Controller {
    async qrcodeManage(){
        const { ctx } = this;
        await ctx.render('/qrcode/qrcodeManage.html');
    }

    async addQrcode(){
        const { ctx } = this;
        await ctx.render('/qrcode/addQrcode.html');
    }

    async editQrcode(){
        const { ctx } = this;
        await ctx.render('/qrcode/editQrcode.html');
    }

    async getQrcode() {
        const { ctx, service, logger } = this;
        try {
            const reqData = ctx.request.body;
            logger.debug('请求参数：%j', reqData);
            let start = Number(reqData['limit']) * (Number(reqData['page']) -1);
            let size = Number(reqData['limit']);
            const result = await service.qrcode.findQrcode(start, size, reqData['search'] || {});
            if (result === null) {
                ctx.body = await ctx.helper.renderError(500000, '系统出错');
            } else {
                ctx.body = await ctx.helper.renderSuccess(0, '', result);
            }
        } catch (e) {
            logger.error(e);
            ctx.body = await ctx.helper.renderError(500000, '系统出错');
        }
    }
}

module.exports = QrcodeController;
