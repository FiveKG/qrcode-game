//@ts-check
'use strict';

const Service = require('egg').Service;

class AgentService extends Service {
   /**
     * @description 返回agent
     * @param {number} start 
     * @param {number} size 
     * @param {object} search 参数
     */
    async findAgent(start, size, search) {
        const { logger } = this;
        logger.debug(`findAgent,start:${start},size:${size},search:${JSON.stringify(search,null,4)}`)
        try {
            let joinStr = ` WHERE 1 = 1`;
            let params = [];
            let i = 1;
            if (search['agent_id']) {
                joinStr += ` AND agent_id = $${i}`;
                params.push(`${search['agent_id']}`);
                i ++;
            }
            if (search['is_enable']) {
                joinStr += ` AND agent.is_enable = $${i}`;
                let isEnable = false;
                if (search['is_enable'] === 'true') {
                    isEnable = true;
                }
                params.push(isEnable);
                i ++;
            }
            let sql = `SELECT
                ROW_NUMBER () OVER (ORDER BY agent.add_time DESC) AS RowNumber,
                    agent.agent_id,
                    agent.name,
                    agent.gain_rate,
                    agent.license,
                    agent.p_c_a_id,
                    agent.p_c_a_text,
                    agent.local_address,
                    agent.is_enable,
                    agent.add_user_id,
                    agent.balance,
                    agent.add_time,
                u.user_name
            FROM
            "public".agent as agent inner join "public".sys_user as u on  agent.add_user_id=u.user_id${joinStr}`;
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

module.exports = AgentService;
