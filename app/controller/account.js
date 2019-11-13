//@ts-check
'use strict';

const Controller = require('egg').Controller;

class AccountController extends Controller {
  async login() {
    const { ctx } = this;
    const user_name = ctx.request.body.user_name;
    const user_pwd = ctx.request.body.user_pwd;
    console.log('????',user_name,user_pwd)

  }
}

module.exports = AccountController;
