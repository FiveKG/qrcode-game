//@ts-check
'use strict';

const Controller = require('egg').Controller;
/**
 * @description TODO(ToolController工具类)
 * @author woni
 * @Date 2019-11-02 10:59:16
 * @version 
 * @Modifier 
 * @ModifiedDate 
 * @version 
 */
class ToolController extends Controller {
    /**
     * @description 获取一个主键值
     */
    async getPrimaryKey() {
        const { ctx } = this;
        ctx.body = await ctx.helper.getPrimaryKey();
    }
}

module.exports = ToolController;
