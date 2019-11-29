//@ts-check
'use strict';

const Controller = require('egg').Controller;

class Game_game_coupon_rule_ruleController extends Controller {
    async game_coupon_ruleManage(){
        const { ctx } = this;
        await ctx.render('/game_coupon_rule/game_coupon_ruleManage.html');
    }

    async addGame_coupon_rule(){
        const { ctx } = this;
        await ctx.render('/game_coupon_rule/addGame_coupon_rule.html');
    }

    async editGame_coupon_rule(){
        const { ctx } = this;
        await ctx.render('/game_coupon_rule/editGame_coupon_rule.html');
    }


    async getGame_coupon_rule() {
        const { ctx, service, logger } = this;
        try {
            const reqData = ctx.request.body;
            logger.debug('请求参数：%j', reqData);
            let start = Number(reqData['limit']) * (Number(reqData['page']) -1);
            let size = Number(reqData['limit']);
            const result = await service.gameCouponRule.findGame_coupon_rule(start, size, reqData['search'] || {});
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

module.exports = Game_game_coupon_rule_ruleController;
