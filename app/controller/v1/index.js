//@ts-check
'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
    async login(){
        const { ctx } = this;
        const locals = {
            title:'扫码游戏系统--后台登录'
        }
        await ctx.render('login.html',locals);
    }
    async index() {
        const { ctx,logger } = this;
        const jwtInfo = await ctx.helper.getJWTInfo()
        if(!jwtInfo){
            ctx.body = await ctx.helper.messageByCode(400003)
            ctx.redirect('/login')
            return
        }
        const locals = {
            title:'扫码游戏系统--管理后台',
            ...jwtInfo
        }
        await ctx.render('index.html',locals);
    }

    
    async welcome() {
        const { ctx } = this;
        await ctx.render('welcome.html');
    }

    
}

module.exports = IndexController;
