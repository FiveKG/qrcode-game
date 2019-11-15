//@ts-check
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

    /**
     *      
     * @param {{
     * user_id       : string,
     * user_pwd      : string,
     * user_type     : string,
     * user_nick_name: string
     * }} register_data 
     * @returns {Promise<boolean>}
     */
    async register(register_data){
        const { logger,ctx } = this;
        try{
            const encrypt_pwd = await ctx.helper.encryptPwd(register_data.user_pwd);
            let sql = `INSERT INTO public."sys_user"
            ("user_id"
            ,"user_pwd"
            ,"user_type"
            ,"user_nick_name"
            )VALUES($1,$2,$3,$4)`
        const {rowCount} = await this.app.pg.query(sql,[register_data.user_id,encrypt_pwd,register_data.user_type,register_data.user_nick_name]);
        if(rowCount){
            logger.debug(`${register_data.user_id}创建账号成功`)
            return true
        }
        else{
            logger.debug(`${register_data.user_id}创建账号失败`)
            return false
        }
        }catch(err){
            logger.error(err)
            throw err
        }
    }

    /**
     * 
     * @param {{
     * user_name:string,
     * user_pwd:string,       
     * }} login_data
     * @returns {Promise<boolean>} 
     */
    async login(login_data){
        const { logger,ctx,app} = this;
        try {
            const sql     = `select user_pwd from sys_user where user_name = $1;`;
            const {rows}  = await app.pg.query(sql,[login_data.user_name]);
            const sql_pwd = rows.pop().user_pwd;

            const verify_result = await ctx.helper.verifyPwd(sql_pwd,login_data.user_pwd)

            return verify_result
        } catch (err) {
            logger.error(err)
            throw err
        }
    }
}

module.exports = SysUserService;
