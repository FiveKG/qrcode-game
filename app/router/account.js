//@ts-check
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app; 
    
  /** ----------------------------Api-account---------------------------- */
  router.post('/api/account/register',controller.v1.sysUser.registerUser);
  router.post('/api/account/login',controller.v1.sysUser.login);
  router.get('/api/account/logout',controller.v1.sysUser.logout);
}