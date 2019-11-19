//@ts-check
'use strict'

module.exports = option=>{
/**
 * 
 * @param {Egg.Context} ctx 
 * @param {*} next 
 */
    return async function first(ctx, next){  
       console.log('ctx===============>',ctx.method,ctx.url)
       await next()
    } 
}