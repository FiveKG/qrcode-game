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
        logger.debug(`service findSysUser,start:${start},size:${size},search:${search}`)
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
     * user_name     : string,
     * user_pwd      : string,
     * user_type     : string,
     * user_nick_name: string,
     * open_id       : string
     * }} register_data 
     * @returns {Promise<boolean>}
     */
    async register(register_data){
        const { logger,ctx } = this;
        logger.debug(`service register,param:${register_data}`)
        try{
            let sql = `INSERT INTO public."sys_user"
            ("user_id"
            ,"user_name"
            ,"user_pwd"
            ,"user_type"
            ,"user_nick_name"
            ,"open_id"
            ,"last_ip"
            )VALUES($1,$2,$3,$4,$5,$6,$7)`
            
            const user_id     = ctx.helper.getPrimaryKey()
            const last_ip   = ctx.ip
            const encrypt_pwd = await ctx.helper.encryptPwd(register_data.user_pwd);
 
            const {rowCount} = await this.app.pg.query(sql,[user_id,register_data.user_name,encrypt_pwd,register_data.user_type,register_data.user_nick_name,register_data.open_id,last_ip]);
            if(rowCount){
                logger.debug(`${register_data.user_name}创建账号成功`)
                return true
            }
            else{
                logger.debug(`${register_data.user_name}创建账号失败`)
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
     * @returns {Promise<{
     * verify_result : boolean,
     * user_pwd      : string,
     * user_name     : string,
     * user_type     : string,
     * open_id       : string,
     * user_nick_name: string,
     * wx_url        : string,
     * is_enable     : string
     * }>} 
     */
    async login(login_data){
        const { logger,ctx,app} = this;
        logger.debug(`service login,param:${login_data}`)
        try {
            const sql           = `select user_pwd,user_name,user_type,open_id,user_nick_name,wx_url,is_enable from sys_user where user_name = $1;`;
            const {rows}        = await app.pg.query(sql,[login_data.user_name]);
            const sql_result    = rows.pop()
            const sql_pwd       = sql_result.user_pwd;
            const verify_result = await ctx.helper.verifyPwd(sql_pwd,login_data.user_pwd)

            if(verify_result){
                //更新最后登录时间/ip
                const update = `update sys_user set last_login = 'now()',last_ip='${ctx.ip}' where user_name = $1;`
                await app.pg.query(update,[login_data.user_name]);
            }

            const result = {
                verify_result: verify_result,
                ...sql_result
            }
            
            return result
        } catch (err) {
            logger.error(err)
            throw err
        }
    }
}

module.exports = SysUserService;
