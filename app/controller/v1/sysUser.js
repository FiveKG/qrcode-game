'use strict';

const Controller = require('egg').Controller;
/**
 * @description TODO(SysUserController控制层)
 * @author woni
 * @Date 2019-11-2 16:58:37
 * @version 
 * @Modifier 
 * @ModifiedDate 
 * @version 
 */
class SysUserController extends Controller {
    async login() {
        const { ctx, service, logger } = this;
        ctx.body = {
            'success': ''
        }
    }
}

module.exports = SysUserController;
