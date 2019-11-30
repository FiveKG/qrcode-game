//@ts-check
'use strict';

const Controller = require('egg').Controller;

class ShopController extends Controller {
    
    async shopManage(){
        const { ctx } = this;
        await ctx.render('/shop/shopManage.html');
    }

    async shop_staffManage(){
        const { ctx } = this;
        await ctx.render('/shop/shop_staffManage.html');
    }

    async editShop_staff(){
        const { ctx } = this;
        await ctx.render('/shop/editShop_staff.html');
    }

    async addShop(){
        const { ctx } = this;
        await ctx.render('/shop/addShop.html');
    }

    async editShop(){
        const { ctx } = this;
        await ctx.render('/shop/editShop.html');
    }

    async getShop() {
        const { ctx, service, logger } = this;
        try {
            const reqData = ctx.request.body;
            logger.debug('请求参数：%j', reqData);
            let start = Number(reqData['limit']) * (Number(reqData['page']) -1);
            let size = Number(reqData['limit']);
            const result = await service.shop.findShop(start, size, reqData['search'] || {});
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

    async getShop_staff(){
        const { ctx, service, logger } = this;
        try {
            const reqData = ctx.request.body;
            logger.debug('请求参数：%j', reqData);
            let start = Number(reqData['limit']) * (Number(reqData['page']) -1);
            let size = Number(reqData['limit']);
            const result = await service.shop.findShop_staff(start, size, reqData['search'] || {});
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

module.exports = ShopController;
