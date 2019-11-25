//@ts-check
'use strict';

const Controller = require('egg').Controller;

class Agent_staffController extends Controller {
    async agent_staffManage(){
        const { ctx } = this;
        await ctx.render('/agent_staff/agent_staffManage.html');
    }

    async addAgent_staff(){
        const { ctx } = this;
        await ctx.render('/agent_staff/addAgent_staff.html');
    }

    async editAgent_staff(){
        const { ctx } = this;
        await ctx.render('/agent_staff/editAgent_staff.html');
    }

    async getAgent_staff() {
        const { ctx, service, logger } = this;
        try {
            const reqData = ctx.request.body;
            logger.debug('请求参数：%j', reqData);
            let start = Number(reqData['limit']) * (Number(reqData['page']) -1);
            let size = Number(reqData['limit']);
            const result = await service.agentStaff.findAgent_staff(start, size, reqData['search'] || {});
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

module.exports = Agent_staffController;
