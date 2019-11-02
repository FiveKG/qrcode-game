// @ts-check
'use strict';

const moment = require('moment');
const shortid = require('shortid');
const jwt = require('jsonwebtoken');

const resData = require('../tool/resData');

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
        
        return '';
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
     * @description 返回当前时间戳
     */
    getTimestamp() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
    }
}