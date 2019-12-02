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
            if (search['shop_id']) {
                joinStr += ` AND shop_id = $${i}`;
                params.push(`${search['shop_id']}`);
                i ++;
            }
            if (search['group_id']) {
                joinStr += ` AND group_id = $${i}`;
                params.push(`${search['group_id']}`);
                i ++;
            }

            if (search['is_enable']) {
                joinStr += ` AND shop_view.is_enable = $${i}`;
                let isEnable = false;
                if (search['is_enable'] === 'true') {
                    isEnable = true;
                }
                params.push(isEnable);
                i ++;
            }
            let sql = `SELECT
                ROW_NUMBER () OVER (ORDER BY shop_view.add_time DESC) AS RowNumber,
                *
                FROM
                shop_view ${joinStr}`;
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

     /**
     * @description 返回shop_staff
     * @param {number} start 
     * @param {number} size 
     * @param {object} search 参数
     */
    async findShop_staff(start, size, search) {
        const { logger } = this;
        logger.debug(`findShop_staff,start:${start},size:${size},search:${JSON.stringify(search,null,4)}`)
        try {
            let joinStr = ` WHERE 1 = 1`;
            let params = [];
            let i = 1;
            if (search['shop_staff_id']) {
                joinStr += ` AND shop_staff_id = $${i}`;
                params.push(`${search['shop_staff_id']}`);
                i ++;
            }
            if (search['shop_id']) {
                joinStr += ` AND shop_id = $${i}`;
                params.push(`${search['shop_id']}`);
                i ++;
            }
            if (search['is_enable']) {
                joinStr += ` AND shop_staff_view.is_enable = $${i}`;
                let isEnable = false;
                if (search['is_enable'] === 'true') {
                    isEnable = true;
                }
                params.push(isEnable);
                i ++;
            }
            let sql = `SELECT
                ROW_NUMBER () OVER (ORDER BY shop_staff_view.add_time DESC) AS RowNumber,
                *
                FROM shop_staff_view ${joinStr}`;

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
