//@ts-check
'use strict';

const Service = require('egg').Service;

class ShopService extends Service {
   /**
     * @description 返回商店
     * @param {number} start 
     * @param {number} size 
     * @param {object} search 参数
     */
    async findShop(start, size, search) {
        const { logger } = this;
        logger.debug(`findShop,start:${start},size:${size},search:${JSON.stringify(search,null,4)}`)
        try {
            let joinStr = ` WHERE 1 = 1`;
            let params = [];
            let i = 1;
            if (search['name']) {
                joinStr += ` AND name like $${i}`;
                params.push(`${search['name']}%`);
                i ++;
            }
            if (search['shop_manager']) {
                joinStr += ` AND shop_manager like $${i}`;
                params.push(`${search['shop_manager']}%`);
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
                ROW_NUMBER () OVER (ORDER BY add_time DESC) AS RowNumber,
                shop_id,
                name,
                p_c_a_id,
                p_c_a_text,
                local_address,
                shop_manager,
                mobile,
                group_id,
                license,
                longitude,
                latitude,
                add_user_id,
                add_time,
                is_enable
            FROM
            "public".shop ${joinStr}`;
            let searchSql = await this.service.tool.joinSearchSql(sql, start, size);
            let total = await this.service.tool.findRowCount(sql, params);
            // logger.debug('searchSql: ', searchSql);
            // logger.debug('params: ', params);
            const { rows } = await this.app.pg.query(searchSql, params);
            //logger.debug('rows: ', rows);
            // logger.debug('total: ', total);
            return {
                list: rows,
                total: total
            }
        } catch (e) {
            logger.error(e);
            return null;
        }
    }
}

module.exports = ShopService;
