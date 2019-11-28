//@ts-check
'use strict';
const  qr = require('qr-image');
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

    async downloadQrcode(){
        const { ctx } = this;
        await ctx.render('/qrcode/downloadQrcode.html');
    }

    async GenerateQrcode(){
        const {logger,service,ctx } = this;
        try{
            const reqData = ctx.query;
            logger.debug('请求参数：%j', reqData);
            const result = await service.qrcode.GenerateQrcode(reqData);
            if (!result) {
                ctx.body = await ctx.helper.renderError(500000, '系统出错');
            } else {
                //图片格式直接返回数据，不用REST格式
                ctx.body = result;
            }
        }catch(e){
            logger.error(e);
            ctx.body = await ctx.helper.renderError(500000, '系统出错'); 
        }
    }
    async getQrcode() {
        const { ctx, service, logger } = this;
        try {
            const reqData = ctx.request.body;
            logger.debug('请求参数：%j', reqData);
            let start = Number(reqData['limit']) * (Number(reqData['page']) -1);
            let size = Number(reqData['limit']);
            const result = await service.qrcode.findQrcode(start, size, reqData['search'] || {});
            if (!result) {
                ctx.body = await ctx.helper.renderError(500000, '系统出错');
            } else {
                ctx.body = await ctx.helper.renderSuccess(0, '', result);
            }
        } catch (e) {
            logger.error(e);
            ctx.body = await ctx.helper.renderError(500000, '系统出错');
        }
    }

    async insertQrcode(){
        const { ctx, service, logger } = this;
        try {
            const reqData = ctx.request.body;
            logger.debug('请求参数：%j', reqData);
            if(typeof(reqData.scan_action===Object)){
                reqData.scan_action = JSON.stringify(reqData.scan_action)
            }

            const result = await service.qrcode.insertQrcode(reqData);
            if (!result) {
                ctx.body = await ctx.helper.renderError(500000, '系统出错');
            } else {
                ctx.body = await ctx.helper.renderSuccess(0, '', result);
            }
        }catch (e) {
            logger.error(e);
            ctx.body = await ctx.helper.renderError(500000, '系统出错');
        }
    }


}

module.exports = QrcodeController;
