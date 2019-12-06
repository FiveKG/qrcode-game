//@ts-check
'use strict'

module.exports = option=>{
/**
 * 
 * @param {Egg.Context} ctx 
 * @param {*} next 
 */
    return async function requestInspect(ctx, next){  
        const jwtToken = await ctx.helper.getJWTToken();
        if(!jwtToken){

            ctx.body = await ctx.helper.messageByCode(400003)
            ctx.redirect('/login')
            return
        }
        try{
            let user_info = await ctx.helper.decodeToken(jwtToken);
            ctx.logger.debug('==================requestInspect-Token-user_info===============>',user_info)
            if(!user_info.is_enable){
                ctx.body = await ctx.helper.messageByCode(400002);
                return;
            }
            if(user_info.user_type!=='admin'){
                ctx.body = await ctx.helper.messageByCode(400006);
            }
            await next();
            return
        }catch(err){
            ctx.logger.debug(err)
            ctx.body = await ctx.helper.messageByCode(400003);
        }
    } 
}