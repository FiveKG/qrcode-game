//@ts-check
'use strict';

const Controller = require('egg').Controller;
/**
 * @description TODO(SysUserController, 用户控制层)
 * @author woni
 * @Date 2019-11-12 11:39:53
 * @version 
 * @Modifier 
 * @ModifiedDate 
 * @version 
 */
class SysUserController extends Controller {
    async getSysUser() {
        const { ctx, service, logger } = this;
        try {
            const reqData = ctx.request.body;
            logger.debug('请求参数：%j', reqData);
            let start = Number(reqData['limit']) * (Number(reqData['page']) -1);
            let size = Number(reqData['limit']);
            const result = await service.sysUser.findSysUser(start, size, reqData['search'] || {});
            if (result === null) {
                ctx.body = await ctx.helper.renderError(500, '系统出错');
            } else {
                ctx.body = await ctx.helper.renderSuccess(0, '', result);
            }
        } catch (e) {
            logger.error(e);
            ctx.body = await ctx.helper.renderError(500, '系统出错');
        }
    }
}

module.exports = SysUserController;
