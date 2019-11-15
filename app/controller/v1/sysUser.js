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
                ctx.body = await ctx.helper.renderError(400000);
            }
             
            // 验证验证码,del redis 
            const redis_captcha = await app.redis.get(reqData.captcha_key);
            if(!redis_captcha||redis_captcha!==reqData.captcha){
                logger.debug('wrong captcha,this captcha is not exist');
                ctx.body = await ctx.helper.renderError(400000);
                return
            }
            await app.redis.del(reqData.captcha_key)
              
            const result= await service.sysUser.login(reqData);
            //验证密码  
            if(!result.verify_result){
                logger.debug('wrong pwd,verify result is false');
                ctx.body = await ctx.helper.renderError(400001);
                return
            }
            //验证是否可用
            if(!result.is_enable){
                logger.debug(`wrong status,${reqData.user_name} is disable`);
                ctx.body = await ctx.helper.renderError(400002);
                return
            }

            //设置cookies
            const option = {
                user_name     : result.user_name,
                user_type     : result.user_type,
                open_id       : result.open_id,
                user_nick_name: result.user_nick_name,
                wx_url        : result.wx_url,
                is_enable     : result.is_enable
            }
            const token = await ctx.helper.setJWTToken(option)
            
            ctx.body = await ctx.helper.renderSuccess(200004);
            
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
