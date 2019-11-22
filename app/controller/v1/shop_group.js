//@ts-check
'use strict';

const Controller = require('egg').Controller;

class Shop_groupController extends Controller {
    async shop_groupManage(){
        const { ctx } = this;
        await ctx.render('/shop_group/shop_groupManage.html');
    }

    async addShop_group(){
        const { ctx } = this;
        await ctx.render('/shop_group/addShop_group.html');
    }

    async editShop_group(){
        const { ctx } = this;
        await ctx.render('/shop_group/editShop_group.html');
    }

    async getShop_group() {
        const { ctx, service, logger } = this;
        try {
            const reqData = ctx.request.body;
            logger.debug('请求参数：%j', reqData);
            let start = Number(reqData['limit']) * (Number(reqData['page']) -1);
            let size = Number(reqData['limit']);
            const result = await service.shopGroup.findShop_group(start, size, reqData['search'] || {});
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

module.exports = Shop_groupController;
