//@ts-check
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  /** ----------------------------Api---------------------------- */
  //获取主键值
  router.get('/api/common/generate_key', controller.tool.getPrimaryKey);

  /** ----------------------------Page---------------------------- */
  router.get('/index', controller.v1.index.index);
};
