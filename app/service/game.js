//@ts-check
'use strict';

const Service = require('egg').Service;

class GameService extends Service {
 /**
     * @description 返回game
     * @param {number} start 
     * @param {number} size 
     * @param {object} search 参数
     */
    async findGame(start, size, search) {
        const { logger } = this;
        logger.debug(`findGame,start:${start},size:${size},search:${JSON.stringify(search,null,4)}`)
        try {
            let joinStr = ` WHERE 1 = 1`;
            let params = [];
            let i = 1;
            if (search['game_id']) {
                joinStr += ` AND game_id = $${i}`;
                params.push(`${search['game_id']}`);
                i ++;
            }
            if (search['game_type']) {
                joinStr += ` AND game_type = $${i}`;
                params.push(`${search['game_type']}`);
                i ++;
            }
            if (search['is_enable']) {
                joinStr += ` AND game.is_enable = $${i}`;
                let isEnable = false;
                if (search['is_enable'] === 'true') {
                    isEnable = true;
                }
                params.push(isEnable);
                i ++;
            }
            let sql = `SELECT
                ROW_NUMBER () OVER (ORDER BY game.add_time DESC) AS RowNumber,
                game.game_id,
                game.game_name,
                game.game_img,
                game.game_img_small,
                game.price,
                game.game_url,
                game.game_type,
                game.add_time,
                game.is_enable,
                game.add_user_id,
                game.game_desc,
                sys_user.user_name
            FROM
            "public".game as game inner join "public".sys_user as sys_user on sys_user.user_id = game.add_user_id ${joinStr} `;

            let searchSql = await this.service.tool.joinSearchSql(sql, start, size);
            let total = await this.service.tool.findRowCount(sql, params);
            //logger.debug('searchSql: ', searchSql);
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
     * @description 返回game_session
     * @param {number} start 
     * @param {number} size 
     * @param {object} search 参数
     */
    async findGame_session(start, size, search) {
        const { logger } = this;
        logger.debug(`findGame_session,start:${start},size:${size},search:${JSON.stringify(search,null,4)}`)
        try {
            let joinStr = ` WHERE 1 = 1`;
            let params = [];
            let i = 1;
            if (search['game_session_name']) {
                joinStr += ` AND game_session_name like $${i}`;
                params.push(`${search['name']}%`);
                i ++;
            }
            if (search['is_enable']) {
                joinStr += ` AND game_session.is_enable = $${i}`;
                let isEnable = false;
                if (search['is_enable'] === 'true') {
                    isEnable = true;
                }
                params.push(isEnable);
                i ++;
            }
            let sql = `SELECT
                ROW_NUMBER () OVER (ORDER BY game_session.add_time DESC) AS RowNumber,
                    game_session.session_id,
                    game_session.scan_id,
                    game_session.game_id,
                    game_session.is_payed,
                    game_session.pay_time,
                    game_session.pay_method,
                    game_session.session_state,
                    game_session.start_time,
                    game_session.end_time,
                    game_session.is_win,
                    game_session.add_time,
                    game.game_name
            FROM
            "public".game_session as game_session inner join "public".game as game on  game_session.game_id=game.game_id${joinStr}`;
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

module.exports = GameService;
