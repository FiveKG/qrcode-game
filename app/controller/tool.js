//@ts-check
'use strict';
//@ts-ignore
const provinces = require('../tool/provinces.json')
//@ts-ignore
const cities = require('../tool/cities.json')
//@ts-ignore
const areas = require('../tool/areas.json')
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
        const { ctx,logger } = this;
        try{
            const data  = await ctx.helper.getPrimaryKey();
            ctx.body = await ctx.helper.renderSuccess(200,'',data); 
        }catch(err){
            logger.error(err)
            throw err
        }
    }
    /**
     * @description 获取jwt解析信息
     */
    async getJwtInfo(){
        const { ctx,logger } = this;
        try{
            const data = await ctx.helper.getJWTInfo()
            ctx.body = await ctx.helper.renderSuccess(200,'',data); 
        }catch(err){
            logger.error(err)
            throw err
        }
    }

    /**
     * @description 获取验证码
     */
    async getCaptcha(){
        const {ctx,logger,app,config} = this;

        try{
        const reqData = ctx.query;
        logger.debug('getCaptcha请求参数：%j', reqData);

        const captcha_random = reqData.captcha_random;
        const {data,text}=await ctx.helper.getCaptcha();
        if (data) {
            await app.redis.set(captcha_random.toString(),text.toString(),'EX',config.redis_expiration);
            ctx.body = await ctx.helper.renderSuccess(200,'', data);    
        } else {
            ctx.body = await ctx.helper.renderError(500, '系统出错');
        }
        }catch(err){
            logger.error(err)
            throw err
        }
        
    }

    /**
     * @description 获取省份
     */
    async getProvince(){
        const {ctx,logger,app,config} = this;
        try{
            const reqData = ctx.query;
            logger.debug('getProvince请求参数：%j', reqData);
            ctx.body = await ctx.helper.renderSuccess(200,'',provinces); 
        }catch(err){
            logger.error(err)
            throw err
        }
    }

    /**
     * 获取城市
     */
    async getCity(){
        const {ctx,logger,app,config} = this;
        try{
            const reqData = ctx.query;
            logger.debug('getCity请求参数：%j', reqData);
            const provinceCode = reqData.provinceCode;
            const P_cities = cities.filter(x=>{
                if(x.provinceCode == provinceCode)return x
            })
            ctx.body = await ctx.helper.renderSuccess(200,'',P_cities); 
        }catch(err){
            logger.error(err)
            throw err
        }
    }

    /**
     * 获取区
     */
    async getArea(){
        const {ctx,logger,app,config} = this;
        try{
            const reqData = ctx.query;
            logger.debug('getCity请求参数：%j', reqData);
            const cityCode = reqData.cityCode;
            const C_area = areas.filter(x=>{
                if(x.cityCode == cityCode)return x
            })
            ctx.body = await ctx.helper.renderSuccess(200,'',C_area); 
        }catch(err){
            logger.error(err)
            throw err
        }
    }


}

module.exports = ToolController;
