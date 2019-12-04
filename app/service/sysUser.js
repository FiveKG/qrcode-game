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
        logger.debug(`findSysUser请求参数,start:${start},size:${size},search:${JSON.stringify(search,null,4)}`)
        try {
            let joinStr = ` WHERE 1 = 1`;
            let params = [];
            let i = 1;
            if (search['user_id']) {
                joinStr += ` AND user_id = $${i}`;
                params.push(search['user_id']);
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
                if (search['is_enable'] === 'true') {
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
                last_ip,
                phone_num
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
     * 检查用户名是否存在,存在返回true，不存在false
     * @param {String} user_name
     * @returns {Promise<boolean>} 
     */
    async _is_user_name(user_name){
        const {logger,app} = this;
        let sql = `
            select user_name from public."sys_user" where user_name = '${user_name}'
        `
        try{
            const {rows} = await app.pg.query(sql)
            if(rows.length===0){
                return false
            }
            return true;
        }catch(err){
            logger.error(err)
            throw err
        }
    }
    /**
     * 检查电话号码是否存在,存在返回true，不存在false
     * @param {String} phone_num
     * @returns {Promise<boolean>} 
     */
    async _is_phone_num(phone_num){
        const {logger,app} = this;
        let sql = `
            select phone_num from public."sys_user" where phone_num = '${phone_num}'
        `
        try{
            const {rows} = await app.pg.query(sql)
            if(rows.length===0){
                return false
            }
            return true;
        }catch(err){
            logger.error(err)
            throw err
        }
    }

    /**
     *      
     * @param {Object} register_data 
     * @returns {Promise<Object>}
     */
    async register(register_data){
        const { logger,ctx } = this;
        //检查用户名
        //检查手机号码
        logger.debug(`register请求参数,param:`,register_data)
        let result = {
            is_pass:false,
            explainCode:null,
            message:null,
            data:null
        }
        try{
            const is_user_name = await this._is_user_name(register_data.user_name);
            const is_phone_num = await this._is_phone_num(register_data.is_phone_num);

            if(is_user_name){
                result.explainCode =400005;
                result.message='该用户已存在';
                return result
            }
            if(is_phone_num){
                result.explainCode =400005;
                result.message='该手机号码已被使用';
                return result
            }

            //注册
            let sql = `INSERT INTO public."sys_user"
            ("user_id"
            ,"user_name"
            ,"user_pwd"
            ,"user_type"
            ,"user_nick_name"
            ,"open_id"
            ,"last_ip"
            ,"phone_num"
            )VALUES($1,$2,$3,$4,$5,$6,$7,$8)`
            const user_id   = ctx.helper.getPrimaryKey()
            const last_ip   = ctx.ip
            const encrypt_pwd = await ctx.helper.encryptPwd(register_data.user_pwd);
 
            const {rowCount} = await this.app.pg.query(sql,[user_id,register_data.user_name,encrypt_pwd,register_data.user_type,register_data.user_nick_name,register_data.open_id,last_ip,register_data.phone_num]);
            if(rowCount){
                logger.debug(`${register_data.user_name}创建账号成功`)
                result.is_pass = true;
                result.explainCode =200004;
                result.message = '注册成功';
                return result
            }
            else{
                logger.debug(`${register_data.user_name}创建账号失败`)
                result.is_pass = false;
                result.explainCode =400005;
                result.message = '注册失败';
                return result
            }

        }catch(err){
            logger.error(err)
            throw err
        }
    }

    /**
     * 通过user_id查询用户，存在则返回用户数据，否则返回false
     * @param {String} user_name 
     * @returns {Promise<boolean|Object>}
     */
    async _findOneUser(user_name) {
        const { logger,app} = this;
        try{
            const sql           = `select user_id,user_pwd,user_name,user_type,open_id,user_nick_name,wx_url,is_enable from sys_user where user_name = $1;`;
            const {rows}        = await app.pg.query(sql,[user_name]);

            if(rows.length===0){
                return false
            }else{
                return rows.pop()
            }
        }catch(err){
            logger.error(err)
            throw err
        }
    }
    
    /**
     * 更新用户的最后登录时间和IP
     * @param {string} user_id 
     */
    async _updateLoginTimeAndIp(user_id){
        const { logger,ctx,app} = this;
        try{
            const update = `update sys_user set last_login = 'now()',last_ip='${ctx.ip}' where user_id = $1;`
            await app.pg.query(update,[user_id]);
        }catch(err){
            logger.error(err)
            throw err
        }
    }
    /**
     * 登录接口
     * @param {{
     * user_name:string,
     * user_pwd:string,       
     * }} login_data
     * @returns {Promise<Object>}
     */
    async login(login_data){
        const { logger,ctx} = this;
        logger.debug(`login请求参数,param:${login_data}`)
        let result = {
            is_pass:false,
            explainCode:null,
            data:null
        }
        try {
            //是否存在
            const sql_result = await this._findOneUser(login_data.user_name);
            if(!sql_result){
                result.explainCode = 400003;
                return result
            }

            //检验密码   
            const verify_result = await ctx.helper.verifyPwd(sql_result.user_pwd,login_data.user_pwd)
            if(!verify_result){
                result.explainCode = 400001;
                return result
            }

            //检验持否可用
            if(!sql_result.is_enable){
                result.explainCode = 400002;
                return result
            }

            //通过
            result.is_pass = true;
            result.explainCode = 200000;
            result.data = sql_result
            return result
        } catch (err) {
            logger.error(err)
            throw err
        }
    }
}

module.exports = SysUserService;
