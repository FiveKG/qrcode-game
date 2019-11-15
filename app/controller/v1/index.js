'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
    async login(){
        const { ctx } = this;
        await ctx.render('login.html');
    }
    async index() {
        const { ctx } = this;
        await ctx.render('index.html');
    }
    async welcome() {
        const { ctx } = this;
        await ctx.render('welcome.html');
    }
    async userManage() {
        const { ctx } = this;
        await ctx.render('/user/userManage.njk');
    }
    
}

module.exports = IndexController;
