//@ts-check
'use strict';

const Service = require('egg').Service;

class CouponService extends Service {
   /**
     * @description 返回coupon
     * @param {number} start 
     * @param {number} size 
     * @param {object} search 参数
     */
    async findCoupon(start, size, search) {
        const { logger } = this;
        logger.debug(`findCoupon,start:${start},size:${size},search:${JSON.stringify(search,null,4)}`)
        try {
            let joinStr = ` WHERE 1 = 1`;
            let params = [];
            let i = 1;
            if (search['coupon_id']) {
                joinStr += ` AND coupon_id = $${i}`;
                params.push(`${search['coupon_id']}`);
                i ++;
            }
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
                joinStr += ` AND coupon_view.is_enable = $${i}`;
                let isEnable = false;
                if (search['is_enable'] === 'true') {
                    isEnable = true;
                }
                params.push(isEnable);
                i ++;
            }
            let sql = `SELECT
                ROW_NUMBER () OVER (ORDER BY coupon_view.add_time DESC) AS RowNumber,
                 *
                FROM coupon_view ${joinStr}`;
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

module.exports = CouponService;
