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
            if (search['shop_name']) {
                joinStr += ` AND name like $${i}`;
                params.push(`${search['shop_name']}%`);
                i ++;
            }
            // if (search['shop_manager']) {
            //     joinStr += ` AND shop_manager like $${i}`;
            //     params.push(`${search['shop_manager']}%`);
            //     i ++;
            // }
            if (search['is_enable']) {
                joinStr += ` AND shop.is_enable = $${i}`;
                let isEnable = false;
                if (search['is_enable'] === 'true') {
                    isEnable = true;
                }
                params.push(isEnable);
                i ++;
            }
            let sql = `SELECT
                ROW_NUMBER () OVER (ORDER BY shop.add_time DESC) AS RowNumber,
                shop.shop_id,
                shop.name,
                shop.p_c_a_id,
                shop.p_c_a_text,
                shop.local_address,
                shop.shop_manager,
                shop.mobile,
                shop.group_id,
                shop.license,
                shop.longitude,
                shop.latitude,
                shop.add_user_id,
                shop.add_time,
                shop.is_enable,
                u.user_name
            FROM
            "public".shop as shop inner join "public".sys_user as u on u.user_id = shop.add_user_id  ${joinStr}`;
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
