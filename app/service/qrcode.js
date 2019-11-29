//@ts-check
'use strict';
const qr = require('qr-image');
const Service = require('egg').Service;

class QrcodeService extends Service {
   /**
     * @description 返回qrcode
     * @param {number} start 
     * @param {number} size 
     * @param {object} search 参数
     */
    async findQrcode(start, size, search) {
        const { logger } = this;
        logger.debug(`findQrcode,start:${start},size:${size},search:${JSON.stringify(search,null,4)}`)
        try {
            let joinStr = ` WHERE 1 = 1`;
            let params = [];
            let i = 1;
            if (search['agent_name']) {
                joinStr += ` AND agent_name like $${i}`;
                params.push(`${search['agent_name']}%`);
                i ++;
            }
            if (search['group_name']) {
                joinStr += ` AND group_name like $${i}`;
                params.push(`${search['group_name']}%`);
                i ++;
            }
            if (search['shop_name']) {
                joinStr += ` AND shop_name like $${i}`;
                params.push(`${search['shop_name']}%`);
                i ++;
            }
            if (search['is_enable']) {
                joinStr += ` AND is_enable = $${i}`;
                let isEnable = false;
                if (search['is_enable'] === 'true') {
                    isEnable = true;
                }
                params.push(isEnable);
                i ++;
            }
            let sql = `SELECT
                ROW_NUMBER () OVER (ORDER BY qrcode_view.add_time DESC) AS RowNumber,
                *
                FROM qrcode_view ${joinStr}`;
           
            let searchSql = await this.service.tool.joinSearchSql(sql, start, size);
            let total = await this.service.tool.findRowCount(sql, params);
            // logger.debug('searchSql: ', searchSql);
            // logger.debug('params: ', params);
            const { rows } = await this.app.pg.query(searchSql, params);
            // logger.debug('rows: ', rows);
            //  logger.debug('total: ', total);
            return {
                list: rows,
                total: total
            }
        } catch (e) {
            logger.error(e);
            return null;
        }
    }

    /**
     * 添加二维码
     * @param {Object} data
     * @returns {Promise<boolean>}
     */
    async insertQrcode(data){
        const { logger,ctx } = this;
        logger.debug(`insertQrcode,option:${JSON.stringify(data,null,4)}`)

        try{ 
            let get_sql = `SELECT MAX(seq) FROM  public."qrcode"
            where shop_id = '${data.shop_id}'`
            let insert_sql =`INSERT INTO public."qrcode"
            ("qrcode_id"
            ,"scan_action"
            ,"agent_id"
            ,"shop_id"
            ,"group_id"
            ,"hash_str"
            ,"add_user_id"
            ,seq)
        VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8)`
        
        
        //先查询该店已经有的seq值
        const { rows } = await this.app.pg.query(get_sql);
        let max = rows.pop().max
        if(max===null){
            max =0
        }


        //赋值hash和url
        const hash_str  = await ctx.helper.getHashStr(JSON.stringify(data))

        for( let i= max+1;i<=(parseInt(data.seq)+max);i++){
            let qrcode_id = await ctx.helper.getPrimaryKey()
            data['qrcode_id'] = qrcode_id
            await this.app.pg.query(insert_sql, [qrcode_id,data.scan_action,data.agent_id,data.shop_id,data.group_id,hash_str,data.add_user_id,i]);
        }
        return true
        }catch(err){
            logger.error(err);
            return false; 
        }
    }
    
    /**
     * 给img返回二维码
     * @param {object} data 
     */
    async GenerateQrcode(data){
        const { logger,ctx,config} = this;
        try{
            let sql = ` SELECT 
            ROW_NUMBER () OVER (ORDER BY qrcode.add_time DESC) AS seq,
            qrcode_id,agent_id,shop_id,hash_str,group_id FROM qrcode WHERE qrcode_id='${data.qrcode_id}'`;
            let {rows} = await this.app.pg.query(sql)

            const url =await  ctx.helper.qrcode_url(rows.pop())

            const qrcode = qr.image(url,config.qrcode.option)
            return qrcode            
        }catch(e){
            logger.error(e);
            return false; 
        }
    }
}

module.exports = QrcodeService;
