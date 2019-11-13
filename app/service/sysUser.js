'use strict';

const Service = require('egg').Service;
/**
 * @description TODO(SysUserService)
 * @author woni
 * @Date 2019-11-12 11:39:53
 * @version 
 * @Modifier 
 * @ModifiedDate 
 * @version 
 */
class SysUserService extends Service {
    /**
     * @description 返回用户
     * @param {number} start 
     * @param {number} size 
     * @param {object} search 参数
     */
    async findSysUser(start, size, search) {
        const { logger } = this;
        try {
            let joinStr = ` WHERE 1 = 1`;
            let params = [];
            let i = 1;
            if (search['user_id']) {
                joinStr += ` AND user_id = $${i}`;
                params.push(search['user_id']);
                i ++;
            }
            if (search['user_name']) {
                joinStr += ` AND user_name LIKE $${i}`;
                params.push(`${search['user_name']}%`);
                i ++;
            }
            if (search['user_type']) {
                joinStr += ` AND user_type = $${i}`;
                params.push(search['user_type']);
                i ++;
            }
            if (search['is_enable']) {
                joinStr += ` AND is_enable = $${i}`;
                let isEnable = false;
                if (search['is_enable'] === '1') {
                    isEnable = true;
                }
                params.push(isEnable);
                i ++;
            }
            let sql = `SELECT
                ROW_NUMBER () OVER (ORDER BY add_time DESC) AS RowNumber,
                user_id,
                user_name,
                user_type,
                open_id,
                user_nick_name,
                is_enable,
                add_time,
                last_login,
                account_balance,
                last_ip
            FROM
            "public".sys_user ${joinStr}`;
            let searchSql = await this.service.tool.joinSearchSql(sql, start, size);
            let total = await this.service.tool.findRowCount(sql, params);
            // logger.debug('searchSql: ', searchSql);
            // logger.debug('params: ', params);
            const { rows } = await this.app.pg.query(searchSql, params);
            // logger.debug('rows: ', rows);
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

module.exports = SysUserService;