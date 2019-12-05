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

    async editRule(){
        const { ctx, service, logger } = this;
        try {
            const reqData = ctx.request.body;
            logger.debug('请求参数：%j', reqData);

            //参数非空判断
            if(!reqData||!reqData.id||!reqData.rule_name||!reqData.game_id||!reqData.coupon_id||!reqData.score||!reqData.play_count_range){
                ctx.body = await ctx.helper.renderError(400007);
                return
            }
            //参数score类型判断?number
            if(isNaN(reqData.score)){
                ctx.body = await ctx.helper.renderError(400007);
                return
            }
            //参数play_count_range类型判断?array
            let play_count_range = eval(reqData.play_count_range)
            if(play_count_range instanceof Array){
                //数量?gt2
                if(play_count_range.length>2){
                    ctx.body = await ctx.helper.renderError(400007);
                    return
                }
                //元素类型?number
                const found = play_count_range.find(element=>{return isNaN(element)})
                if(found){
                    ctx.body = await ctx.helper.renderError(400007);
                    return
                }
            }
            else{
                ctx.body = await ctx.helper.renderError(400007);
                return
            }
            
            const result = await service.gameCouponRule.editRule(reqData);
            if (result === null) {
                ctx.body = await ctx.helper.renderError(500000, '系统出错');
            } else {
                ctx.body = await ctx.helper.renderSuccess(0, '', result);
            }
        } catch(e){
            logger.error(e);
            ctx.body = await ctx.helper.renderError(500000, '系统出错');
        }
    }
}

module.exports = Game_game_coupon_rule_ruleController;
