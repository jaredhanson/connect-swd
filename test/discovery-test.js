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
  if (data) {this._data += data; };
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
  
  'middleware with a sync function that returns multiple locations': {
    topic: function() {
      return discovery(function(principal, service) {
        if (principal == 'joe@example.com' && service == 'urn:adatum.com:calendar') {
          return [ 'http://calendars.proseware.com/calendars/joseph',
                   'http://calendars.elsewhere.com/calendars/joseph' ];
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
        assert.equal(res._data, '{"locations":["http://calendars.proseware.com/calendars/joseph","http://calendars.elsewhere.com/calendars/joseph"]}');
      },
    },
  },
  
  'middleware with an async function that calls callback with a single location': {
    topic: function() {
      return discovery(function(principal, service, done) {
        if (principal == 'joe@example.com' && service == 'urn:adatum.com:calendar') {
          return done(null, 'http://calendars.proseware.com/calendars/joseph')
        }
        return done(new Error('unknown principal'));
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
  
  'middleware with an async function that calls callback with a single location': {
    topic: function() {
      return discovery(function(principal, service, done) {
        if (principal == 'joe@example.com' && service == 'urn:adatum.com:calendar') {
          return done(null, ['http://calendars.proseware.com/calendars/joseph', 'http://calendars.elsewhere.com/calendars/joseph'])
        }
        return done(new Error('unknown principal'));
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
        assert.equal(res._data, '{"locations":["http://calendars.proseware.com/calendars/joseph","http://calendars.elsewhere.com/calendars/joseph"]}');
      },
    },
  },
  
  'middleware with an async function that encounters an error': {
    topic: function() {
      return discovery(function(principal, service, done) {
        return done(new Error('something went wrong'));
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
          self.callback(new Error('should not be called'));
        }
        
        function next(err) {
          self.callback(null, err);
        }
        process.nextTick(function () {
          redirect(req, res, next)
        });
      },
      
      'should not send response' : function(err, e) {
        assert.isNull(err);
      },
      'should call next with an error' : function(err, e) {
        assert.instanceOf(e, Error);
      },
    },
  },
  
  'middleware for handling a bad request': {
    topic: function() {
      return discovery(function(principal, service) {
        return 'http://calendars.proseware.com/calendars/joseph';
      });
    },
    
    'when handling a bad request': {
      topic: function(redirect) {
        var self = this;
        
        var req = new MockRequest();
        req.query = {};
        
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
      'should set status code' : function(err, req, res) {
        assert.equal(res.statusCode, 400);
      },
      'should not set header' : function(err, req, res) {
        assert.isUndefined(res._headers['Content-Type']);
      },
      'should not send data' : function(err, req, res) {
        assert.isEmpty(res._data);
      },
    },
  },

}).export(module);
