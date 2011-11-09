var vows = require('vows');
var assert = require('assert');
var swd = require('index');


vows.describe('connect-swd').addBatch({
  
  'module': {
    'should export discovery middleware': function () {
      assert.isFunction(swd.discovery);
    },
    'should export redirect middleware': function () {
      assert.isFunction(swd.redirect);
    },
  },
  
}).export(module);
