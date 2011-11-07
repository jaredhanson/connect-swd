var vows = require('vows');
var assert = require('assert');
var util = require('util');
var redirect = require('redirect');


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


vows.describe('redirect').addBatch({

  'middleware with a url': {
    topic: function() {
      return redirect('https://swd.example.com/swd_server');
    },
    
    'when handling a request': {
      topic: function(redirect) {
        var self = this;
        var req = new MockRequest();
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
      'should set service level redirection in response data' : function(err, req, res) {
        assert.equal(res._data, '{"SWD_service_redirect":{"location":"https://swd.example.com/swd_server"}}');
      },
    },
  },
  
  'middleware with a url and expires date': {
    topic: function() {
      return redirect('https://swd.example.com/swd_server', new Date("Wed, 09 Aug 1995 00:00:00 GMT"));
    },
    
    'when handling a request': {
      topic: function(redirect) {
        var self = this;
        var req = new MockRequest();
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
      'should set service level redirection in response data' : function(err, req, res) {
        assert.equal(res._data, '{"SWD_service_redirect":{"location":"https://swd.example.com/swd_server","expires":807926400}}');
      },
    },
  },
  
  'middleware with a url and expires date with fractional seconds': {
    topic: function() {
      return redirect('https://swd.example.com/swd_server', new Date("Wed, 09 Aug 1995 00:00:00.001 GMT"));
    },
    
    'when handling a request': {
      topic: function(redirect) {
        var self = this;
        var req = new MockRequest();
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
      'should set service level redirection in response data' : function(err, req, res) {
        assert.equal(res._data, '{"SWD_service_redirect":{"location":"https://swd.example.com/swd_server","expires":807926400}}');
      },
    },
  },
  
  'middleware with a url and expires number': {
    topic: function() {
      return redirect('https://swd.example.com/swd_server', 1300752001);
    },
    
    'when handling a request': {
      topic: function(redirect) {
        var self = this;
        var req = new MockRequest();
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
      'should set service level redirection in response data' : function(err, req, res) {
        assert.equal(res._data, '{"SWD_service_redirect":{"location":"https://swd.example.com/swd_server","expires":1300752001}}');
      },
    },
  },
  
  'middleware setup without a url': {
    topic: function() {
      return null;
    },
    
    'should throw an error' : function() {
      assert.throws(function() { redirect(); }, Error);
    },
  },

}).export(module);
