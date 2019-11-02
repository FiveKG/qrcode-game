//@ts-check
'use strict';

const resData = function(success, message, data, code) {
    let resData = {}
    if (success) {
        resData = {
            "success": true,
            "data": data,
            "code": code,
            "message": message
        }
    } else {
        resData = {
            "success": false,
            "data": data,
            "code": code,
            "message": message
        }
    }
    return resData;
}

module.exports = resData;