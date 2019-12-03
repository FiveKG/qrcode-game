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
    async userManage() {
        const { ctx } = this;
        await ctx.render('/user/userManage.html');
    }
    
    async getSysUser() {
        const { ctx, service, logger } = this;
        try {
            const reqData = ctx.request.body;
            logger.debug('请求参数：%j', reqData);
            let start = Number(reqData['limit']) * (Number(reqData['page']) -1);
            let size = Number(reqData['limit']);
            const result = await service.sysUser.findSysUser(start, size, reqData['search'] || {});
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

    async registerUser(){
        const { app,ctx, service, logger } = this;
        try{
            const reqData = ctx.request.body;
            logger.debug('请求参数：%j', reqData);
            //检验规则：https://github.com/node-modules/parameter/blob/master/example.js
            const validate_rule = {
                user_id       : 'string',
                user_name     : 'string',
                user_pwd      : 'string',
                user_type     : ['admin','agent','shop'],
                user_nick_name: 'number',
                phone_num     : 'number'
            }
            const validate_result = app.validator.validate(validate_rule,reqData)
            if(validate_result.length>0){
                //无论对方有多少项填错，都返回一个错误回去，直到所有错误改正
                let message ; 
                let field = validate_result.pop().field;
                if(field ==='phone_num') message      = '手机格式不正确';
                if(field ==='user_nick_name') message = '昵称格式不正确';
                if(field ==='user_type') message      = '用户类型格式不正确';
                if(field ==='user_name') message      = '用户名格式不正确';
                ctx.body = await ctx.helper.renderError(400005, message);
            }

            //注册
            const register_result = await service.sysUser.register(reqData)
            if(register_result.is_pass){
                ctx.body = await ctx.helper.renderSuccess(register_result.explainCode);    
            }
            else{

                ctx.body = await ctx.helper.renderError(register_result.explainCode,register_result.message);
            }

        }catch(err){
            logger.error(err);
            ctx.body = await ctx.helper.renderError(500000, '系统出错');
        }
    }
    
    async login(){
        const { ctx, service, logger,app } = this;
        try{
            const reqData = ctx.request.body;
            logger.debug('请求参数：%j', reqData);
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
            
            //登录检测
            const result= await service.sysUser.login(reqData);
            if(!result.is_pass){
                console.log('reuslt',result)
                ctx.body = await ctx.helper.renderError(result.explainCode);
                return
            }
            
            //设置cookies
            const option = {
                user_id       : result.user_id,
                user_name     : result.user_name,
                user_type     : result.user_type,
                open_id       : result.open_id,
                user_nick_name: result.user_nick_name,
                wx_url        : result.wx_url,
                is_enable     : result.is_enable
            }
            await ctx.helper.setJWTToken(option);
            ctx.body = await ctx.helper.renderSuccess(result.explainCode);

            //更新最后登录时间和ip
            await service.sysUser._updateLoginTimeAndIp(result.user_id)
            
        }catch(err){
            logger.error(err);
            ctx.body = await ctx.helper.renderError(500000, '系统出错');
        }
    }

    async editUser(){
        const { ctx } = this;
        await ctx.render('/user/editUser.html');
    }

    async addUser(){
        const { ctx } = this;
        await ctx.render('/user/addUser.html');
    }

}

module.exports = SysUserController;
