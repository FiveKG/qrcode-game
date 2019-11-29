//@ts-check
'use strict';

const Service = require('egg').Service;

class PayService extends Service {
   /**
     * @description 返回user_recharge
     * @param {number} start 
     * @param {number} size 
     * @param {object} search 参数
     */
    async findUser_recharge(start, size, search) {
        const { logger } = this;
        logger.debug(`findUser_recharge,start:${start},size:${size},search:${JSON.stringify(search,null,4)}`)
        try {
            let joinStr = ` WHERE 1 = 1`;
            let params = [];
            let i = 1;
            if (search['wx_open_id']) {
                joinStr += ` AND user_name like $${i}`;
                params.push(`${search['user_name']}%`);
                i ++;
            }

            let sql = `SELECT
                ROW_NUMBER () OVER (ORDER BY user_recharge.add_time DESC) AS RowNumber,
                    user_recharge.recharge_id,
                    user_recharge.user_id,
                    user_recharge.recharge_amount,
                    user_recharge.add_time,
                    sys_user.user_name
            FROM
            "public".user_recharge as user_recharge inner join "public".sys_user as sys_user on  user_recharge.user_id=sys_user.user_id${joinStr}`;
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
     * @description 返回pay_order
     * @param {number} start 
     * @param {number} size 
     * @param {object} search 参数
     */
    async findPay_order(start, size, search) {
        const { logger } = this;
        logger.debug(`findPay_order,start:${start},size:${size},search:${JSON.stringify(search,null,4)}`)
        try {
            let joinStr = ` WHERE 1 = 1`;
            let params = [];
            let i = 1;
            if (search['wx_open_id']) {
                joinStr += ` AND wx_open_id =${i}`;
                params.push(`${search['wx_open_id']}`);
                i ++;
            }

            let sql = `SELECT
                ROW_NUMBER () OVER (ORDER BY pay_order.add_time DESC) AS RowNumber,
                    pay_order.pay_order_id,
                    pay_order.wx_open_id,
                    pay_order.pay_type,
                    pay_order.source_id,
                    pay_order.pay_state,
                    pay_order.pay_way,
                    pay_order.pay_way_order_id,
                    pay_order.payment_time,
                    pay_order.amount,
                    pay_order.add_time
            FROM
            "public".pay_order as pay_order ${joinStr}`;
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
     * @description 返回balance_log
     * @param {number} start 
     * @param {number} size 
     * @param {object} search 参数
     */
    async findBalance_log(start, size, search) {
        const { logger } = this;
        logger.debug(`findBalance_log,start:${start},size:${size},search:${JSON.stringify(search,null,4)}`)
        try {
            let joinStr = ` WHERE 1 = 1`;
            let params = [];
            let i = 1;
            if (search['user_name']) {
                joinStr += ` AND user_name like $${i}`;
                params.push(`${search['user_name']}%`);
                i ++;
            }

            let sql = `SELECT
                ROW_NUMBER () OVER (ORDER BY balance_log.add_time DESC) AS RowNumber,
                    balance_log.id,
                    balance_log.user_id,
                    balance_log.before,
                    balance_log.after,
                    balance_log.change_reason,
                    balance_log.remark,
                    balance_log.add_time,
                    sys_user.user_name
            FROM
            "public".balance_log as balance_log inner join "public".sys_user as sys_user on  balance_log.user_id=sys_user.user_id${joinStr}`;
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

module.exports = PayService;
