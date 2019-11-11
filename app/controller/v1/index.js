'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
    async index() {
        const { ctx } = this;
        await ctx.render('index.html');
    }
    async welcome() {
        const { ctx } = this;
        await ctx.render('welcome.html');
    }
}

module.exports = IndexController;
