//@ts-check
'use strict';

const dateFns = require('date-fns');
const shortid = require('shortid');
const jwt = require('jsonwebtoken');
const resData = require('../tool/resData');

const svgCaptcha = require('svg-captcha');
const upash = require('upash');
upash.install('argon2', require('@phc/argon2'));

module.exports = {
    renderSuccess(code, message, data) {
        let msg = message;
        if (this.messageByCode(code)) {
            msg = this.messageByCode(code);
        }
        return resData(true, msg, data, code);
    },
    renderError(code, message) {
        let msg = message;
        if (this.messageByCode(code)) {
            msg = this.messageByCode(code);
        }
        return resData(false, msg, '', code);
    },
    /**
     * @description 根据状态码获取文本
     * @param {Number} code 
     */
    messageByCode(code) {
        //@ts-ignore
        const explainCode = require('../tool/explainCode.json');
        return explainCode[code] || false;
    },
    /**
     * @description 生成主键
     */
    getPrimaryKey() {
        return this.getRandomAlphaNum(4) + '-' + shortid.generate();
    },
    /**
     * @description 生成字母加数字的随机数
     * @param {Number} len 生成的字符串长度
     */
    getRandomAlphaNum(len) {
        var rdmString = "";
        for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
        return rdmString.substr(0, len).toLocaleUpperCase();
    },
    /**
     * @description 生成Token
     * @param accountInfo
     */
    generateToken(accountInfo) {
        const { secret, expiresIn } = this.config.token;
        return jwt.sign(accountInfo, secret, {
            expiresIn,
        });
    },
    /**
     * @description 解码Token
     */
    decodeToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    },
    getUri() {
        return this.ctx.request.path;
    },
    /**
     * @description 返回当前时间
     */
    getNow() {
        return dateFns.format(new Date(), 'YYYY-MM-DDTHH:mm:ssZ');
    },
    /**
     * @description 加密密码
     * @param {String} password 
     * @returns {Promise<String>} 返回加密后的hash字符串
     */
    async encryptPwd(password){
        const hashStr = await upash.hash(password);
        return hashStr
    },
    /**
     * @description 验证密码
     * @param {String} hashStr
     * @param {String} password 
     * @returns {Promise<boolean>} 
     */
    async verifyPwd(hashStr,password){
        const match = await upash.verify(hashStr,password);
        return match
    },
    /**
     * @description 生成验证码
     * @returns {Promise<{data:string,text:string}>}
     */
    async getCaptcha(){
        const options = {
            size: 4, // 验证码长度
            ignoreChars: '0o1i', // 验证码字符中排除 0o1i
            noise: 5 ,// 干扰线条的数量
            color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
            background: '#cc9966', // 验证码图片背景颜色
            width:144,
            height:39
        }
        const result = svgCaptcha.createMathExpr(options)
        return result
    },

    /**
     * 
     * @param {string} user_name
     * @returns {Promise<String>} 
     */
    async setCookies(user_name){
        const token = await this.generateToken({user_name})
        const {jwt_key,cookies_options} = this.config.cookies
        this.ctx.cookies.set(jwt_key,token,cookies_options)
        return token
    }
    
}