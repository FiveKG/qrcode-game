'use strict';

const Controller = require('egg').Controller;

class TestController extends Controller {
    async test1() {
        const { ctx } = this;
        ctx.body = await ctx.helper.messageByCode(500001);
    }
    async test2() {
        const { ctx } = this;
        const result = await this.app.pg.query(`SELECT * FROM user_log`);
        console.log('result: ', result);
        ctx.body = {
            success: true
        }
    }
    async test3() {
        const { ctx } = this;
        const result = await ctx.curl('data/sys_user?limit=15&offset=1', {
            method: 'GET',
            dataType: 'json',
        });
        console.log('result: ', result);
        ctx.body = {
            success: true
        }
    }
}

module.exports = TestController;
