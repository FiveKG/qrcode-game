//@ts-check
'use strict';

const Controller = require('egg').Controller;

class GameController extends Controller {
    async gameManage(){
        const { ctx } = this;
        await ctx.render('/game/gameManage.html');
    }

    async game_sessionManage(){
        const { ctx } = this;
        await ctx.render('/game/game_session.html');
    }
    async addGame(){
        const { ctx } = this;
        await ctx.render('/game/addGame.html');
    }

    async editGame(){
        const { ctx } = this;
        await ctx.render('/game/editGame.html');
    }

    async getGame() {
        const { ctx, service, logger } = this;
        try {
            const reqData = ctx.request.body;
            logger.debug('请求参数：%j', reqData);
            let start = Number(reqData['limit']) * (Number(reqData['page']) -1);
            let size = Number(reqData['limit']);
            const result = await service.game.findGame(start, size, reqData['search'] || {});
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

module.exports = GameController;
