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
};
