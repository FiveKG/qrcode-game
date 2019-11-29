//@ts-check
'use strict';

const Service = require('egg').Service;

class Game_coupon_ruleService extends Service {
   /**
     * @description 返回game_coupon_rule
     * @param {number} start 
     * @param {number} size 
     * @param {object} search 参数
     */
    async findGame_coupon_rule(start, size, search) {
        const { logger } = this;
        logger.debug(`findGame_coupon_rule,start:${start},size:${size},search:${JSON.stringify(search,null,4)}`)
        try {
            let joinStr = ` WHERE 1 = 1`;
            let params = [];
            let i = 1;
            if (search['game_coupon_rule_name']) {
                joinStr += ` AND game_coupon_rule_name like $${i}`;
                params.push(`${search['name']}%`);
                i ++;
            }
            if (search['is_enable']) {
                joinStr += ` AND game_coupon_rule.is_enable = $${i}`;
                let isEnable = false;
                if (search['is_enable'] === 'true') {
                    isEnable = true;
                }
                params.push(isEnable);
                i ++;
            }
            let sql = `SELECT
                ROW_NUMBER () OVER (ORDER BY game_coupon_rule_view.add_time DESC) AS RowNumber,
                *
                FROM
                game_coupon_rule_view ${joinStr}`;

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

module.exports = Game_coupon_ruleService;
