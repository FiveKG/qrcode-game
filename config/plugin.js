//@ts-check
'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  pg: {
    enable: true,
    package: '@yz/egg-postgres',
  },
  redis:{
    enable: true,
    package: 'egg-redis',
  },
  oss:{
    enable: true,
    package: 'egg-oss',
  }
};
