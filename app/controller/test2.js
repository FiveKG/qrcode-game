//@ts-check
'use strict';

const Controller = require('egg').Controller;

class Test2Controller extends Controller {
  async echo() {
    const { ctx } = this;
    const result = await this.app.pg.query(`SELECT * FROM user_log`);
    ctx.body = {
        success: true,
        "data": result,
        "code": 1,
        "message":'message!!!'
    }
  }
}

module.exports = Test2Controller;
