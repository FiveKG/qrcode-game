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
            return;
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
// module.exports = options => {
//     return async function requestInspect(ctx, next) {
//         let token = ctx.header.token;
//         if (!token) {
//             ctx.status = 403;
//             ctx.body = await ctx.helper.renderError(403, 'token invalid');
//             return;
//         }
//         try {
//             let user = await ctx.helper.decodeToken(token);
//             ctx.logger.debug('user: ', user);
//             if (!user['is_enable']) {
//                 ctx.body = await ctx.helper.renderError(501, '用户状态不可用');
//                 return;
//             }
//             if ('admin' != user['user_type']) {
//                 ctx.body = await ctx.helper.renderError(502, '权限不足');
//                 return;
//             }
//             await next();
//             return;
//         } catch (e) {
//             ctx.status = 403;
//             ctx.body = await ctx.helper.renderError(403, 'token invalid');
//         }
//     }
// }