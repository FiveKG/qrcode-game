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
    async registerUser(){
        const { ctx, service, logger } = this;
        try{
            const reqData = ctx.request.body;
            logger.debug('请求参数：%j', reqData);
            //检验规则：https://github.com/node-modules/parameter/blob/master/example.js
            const validate_rule = {
                user_id:'string',
                user_pwd:'string',
                user_type:['admin','agent','shop'],
                user_nick_name:'string'
            }
            ctx.validate(validate_rule)

            await service.sysUser.register(reqData)
        }catch(err){
            logger.error(err);
            ctx.body = await ctx.helper.renderError(500, '系统出错');
        }
    }
    
    async login(){
        const { ctx, service, logger,app } = this;
        try{
            const reqData = ctx.request.body;
            logger.debug('registerUser请求参数：%j', reqData);
            if(parseInt(reqData.captcha).toString()==='NaN')
            {
                logger.debug('wrong captcha,this captcha is not a number');
                ctx.body = await ctx.helper.messageByCode(400);
            }
             
            //todo 验证验证码
            const redis_captcha = await app.redis.get(reqData.captcha_key);
            if(!redis_captcha||redis_captcha!==reqData.captcha){
                logger.debug('wrong captcha,this captcha is not exist');
                ctx.body = await ctx.helper.messageByCode(400);
                return
            }
                
            const verify_result= await service.sysUser.login(reqData);
            if(!verify_result){
                logger.debug('wrong pwd,verify result is false');
                ctx.body = await ctx.helper.messageByCode(401);
                return
            }

            //设置cookies
            const token = await ctx.helper.setCookies(reqData.user_name)

            ctx.body = await ctx.helper.messageByCode(204);
            await ctx.redirect('./index');
        }catch(err){
            logger.error(err);
            ctx.body = await ctx.helper.renderError(500, '系统出错');
        }
    }




    async module(){
        const { ctx, service, logger } = this;
        try{
            const reqData = ctx.request.body;
            logger.debug('registerUser请求参数：%j', reqData);


        }catch(err){
            logger.error(err);
            ctx.body = await ctx.helper.renderError(500, '系统出错');
        }
    }
}

module.exports = SysUserController;
