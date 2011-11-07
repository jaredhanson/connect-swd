var vows = require('vows');
var assert = require('assert');
var util = require('util');
var discovery = require('discovery');


function MockRequest() {
}

function MockResponse() {
  this._headers = {};
  this._data = '';
}

MockResponse.prototype.setHeader = function(name, value) {
  this._headers[name] = value;
}

MockResponse.prototype.end = function(data, encoding) {
  this._data += data;
  if (this.done) { this.done(); }
}


vows.describe('discovery').addBatch({

  'middleware with a sync function that returns a single location': {
    topic: function() {
      return discovery(function(principal, service) {
        if (principal == 'joe@example.com' && service == 'urn:adatum.com:calendar') {
          return 'http://calendars.proseware.com/calendars/joseph';
        }
        return '';
      });
    },
    
    'when handling a request': {
      topic: function(redirect) {
        var self = this;
        
        var req = new MockRequest();
        req.query = {};
        req.query['principal'] = 'joe@example.com';
        req.query['service'] = 'urn:adatum.com:calendar';
        
        var res = new MockResponse();
        res.done = function() {
          self.callback(null, req, res);
        }
        
        function next(err) {
          self.callback(new Error('should not be called'));
        }
        process.nextTick(function () {
          redirect(req, res, next)
        });
      },
      
      'should not call next' : function(err, req, res) {
        assert.isNull(err);
      },
      'should set header' : function(err, req, res) {
        assert.equal(res._headers['Content-Type'], 'application/json');
      },
      'should set location in response data' : function(err, req, res) {
        assert.equal(res._data, '{"locations":["http://calendars.proseware.com/calendars/joseph"]}');
      },
    },
  },

}).export(module);
