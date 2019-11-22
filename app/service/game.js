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
            if (search['game_name']) {
                joinStr += ` AND name like $${i}`;
                params.push(`${search['name']}%`);
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
                u.user_name
            FROM
            "public".game as game inner join "public".sys_user as u on u.user_id = game.add_user_id ${joinStr} `;

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
}

module.exports = GameService;
