'use strict';

const Service = require('egg').Service;
/**
 * @description TODO(ToolService, 工具类)
 * @author woni
 * @Date 2019-11-12 15:18:02
 * @version 
 * @Modifier 
 * @ModifiedDate 
 * @version 
 */
class ToolService extends Service {
    /**
     * @description 拼接分页sql
     * @param {string} sql 
     * @param {number} start 
     * @param {number} size 
     */
    async joinSearchSql(sql, start, size) {
        let searchSql = `SELECT U.* FROM 
            (
                ${sql}
            ) AS U
        WHERE RowNumber > ${start} LIMIT ${size};`;
        return searchSql;
    }
    /**
     * @description 返回记录行数
     * @param {string} sql 
     * @param {object} params 参数
     */
    async findRowCount(sql, params) {
        const { rowCount } = await this.app.pg.query(sql, params);
        return rowCount;
    }
}

module.exports = ToolService;
