//@ts-check
'use strict';

const path = require('path');
const sendToWormhole = require('stream-wormhole');
const Service = require('egg').Service;
/**
 * @description TODO(ToolService, 工具类)
 * @author woni
 * @Date 2019-11-12 15:18:02
 * @version 
 * @Modifier 
 * @ModifiedDate 
 * @version 
 */
class ToolService extends Service {
    /**
     * @description 拼接分页sql
     * @param {string} sql 
     * @param {number} start 
     * @param {number} size 
     */
    async joinSearchSql(sql, start, size) {
        let searchSql = `SELECT U.* FROM 
            (
                ${sql}
            ) AS U
        WHERE RowNumber > ${start} LIMIT ${size};`;
        return searchSql;
    }
    /**
     * @description 返回记录行数
     * @param {string} sql 
     * @param {object} params 参数
     */
    async findRowCount(sql, params) {
        const { rowCount } = await this.app.pg.query(sql, params);
        return rowCount;
    }

     /**
     * 返回一个装有文件内容的数组及其参数
     * @param {Object} stream
     * @returns {Promise<*>}
     * 
     */
    async upload_img_oss(stream){
        const {ctx,config} = this

        try {
            let type = '.'+stream.mimeType.split('/')[1]
            let name = config.upload_img_style.style.game+stream.fields.id+type;
             
            //上传云服务
           let result = await ctx.oss.putStream(name, stream);
           let url = result.url
           //判断是游戏还是代金券的
           let style = ctx.path.split('/api/tool/upload_img_')[1]

          // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
           await sendToWormhole(stream);
           if(style ==='game'){
                //处理成小图
                let url_small = url+config.upload_img_style.scale
                return {url,url_small}
           }
           else if(style==='coupon'){
                return {url}
           }
           else{
                return false
           }
            
        } catch (err) {
            await sendToWormhole(stream);
            throw err;
        }

    }

    
}

module.exports = ToolService;
