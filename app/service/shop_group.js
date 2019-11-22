//@ts-check
'use strict';

const Service = require('egg').Service;

class Shop_groupService extends Service {
    /**
     * @description 返回shop_group
     * @param {number} start 
     * @param {number} size 
     * @param {object} search 参数
     */
    async findShop_group(start, size, search) {
        const { logger } = this;
        logger.debug(`findShop_group,start:${start},size:${size},search:${JSON.stringify(search,null,4)}`)
        try {
            let joinStr = ` WHERE 1 = 1`;
            let params = [];
            let i = 1;
            if (search['shop_group_name']) {
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
                ROW_NUMBER () OVER (ORDER BY shop_group.add_time DESC) AS RowNumber,
                shop_group.group_id,
                shop_group.group_name,
                shop_group.parent_id,
                shop_group.add_time,
                shop_group.is_enable,
                shop_group.add_user_id,
                u.user_name
            FROM
            "public".shop_group as shop_group inner join "public".sys_user as u on  shop_group.add_user_id=u.user_id${joinStr}`;
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

module.exports = Shop_groupService;
