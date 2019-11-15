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

    async getCaptcha(){
        const {ctx,logger,app,config} = this;

        try{
        const reqData = ctx.query;
        logger.debug('请求参数：%j', reqData);

        const captcha_random = reqData.captcha_random;
        const {data,text}=await ctx.helper.getCaptcha();
        if (data) {
            await app.redis.set(captcha_random.toString(),text.toString(),'EX',config.redis_expiration);
            ctx.body = await ctx.helper.renderSuccess(0, '', data);    
        } else {
            ctx.body = await ctx.helper.renderError(500, '系统出错');
        }
        }catch(err){
            logger.error(err)
            throw err
        }
        
    }
}

module.exports = ToolController;
