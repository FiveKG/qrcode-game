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
            if (search['id']) {
                joinStr += ` AND id = $${i}`;
                params.push(`${search['id']}`);
                i ++;
            }
            if (search['game_id']) {
                joinStr += ` AND game_id = $${i}`;
                params.push(`${search['game_id']}`);
                i ++;
            }
            if (search['coupon_id']) {
                joinStr += ` AND coupon_id = $${i}`;
                params.push(`${search['coupon_id']}`);
                i ++;
            }
            if (search['is_enable']) {
                joinStr += ` AND game_coupon_rule_view.is_enable = $${i}`;
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

    async editRule(reqData){
        const { logger } = this;
        logger.debug(`editRule,,search:${JSON.stringify(reqData,null,4)}`)
        try{
            let select_sql = `SELECT * FROM game_coupon_rule WHERE id = '${reqData.id}'`

            let delete_sql = `DELETE FROM game_coupon_rule WHERE  id = '${reqData.id}'`

            let insert_sql = `
            INSERT INTO public."game_coupon_rule"
                ("id"
                ,"game_id"
                ,"coupon_id"
                ,"score"
                ,"play_count_range"
                ,"add_user_id"
                ,"add_time"
                ,"is_enable"
                ,"rule_name")
            VALUES
                ($1,$2,$3,$4,$5,$6,$7,$8,$9);  `

            //先获取原数据进行构造数据
            const { rows } = await this.app.pg.query(select_sql);
            let select_data = rows.pop()

            await this.app.pg.query('BEGIN');
            await this.app.pg.query(delete_sql);
            await this.app.pg.query(insert_sql,[reqData.id,reqData.game_id,reqData.coupon_id,reqData.score,reqData.play_count_range,select_data.add_user_id,select_data.add_time,select_data.is_enable,reqData.rule_name]);
            await this.app.pg.query('COMMIT');

            return true
        }catch(err){
            await this.app.pg.query('ROLLBACK');
            logger.error(err);
            return null;
        }
    }
}

module.exports = Game_coupon_ruleService;
