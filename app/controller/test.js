'use strict';

const path = require("path");
const sendToWormhole = require('stream-wormhole');
const tmp = require('tmp')
const fs = require('fs')

const Controller = require('egg').Controller;

class TestController extends Controller {
    async test1() {
        const { ctx } = this;
        await ctx.render('test.html');
    }
    async upload() {
        const ctx = this.ctx;

        const stream = await this.ctx.getFileStream(); //获取表单提交的数据
        if (!stream.filename) { //注意如果没有传入图片直接返回   
            return;
        }   
        console.log(stream)

        // const stream = await ctx.getFileStream();
        // const name = 'egg-multipart-test/' + path.basename(stream.filename);
        // // 文件处理，上传到云存储等等
        // let result;
        // try {
        //  // result = await ctx.oss.put(name, stream);
        //  console.log(stream)
        // } catch (err) {
        //   // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
        //   await sendToWormhole(stream);
        //   throw err;
        // }
    
        // ctx.body = {
        //   url: result.url,
        //   // 所有表单字段都能通过 `stream.fields` 获取到
        //   fields: stream.fields,
        // };

        
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
