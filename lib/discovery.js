/**
 * Service Simple Web Discovery requests.
 *
 * This middleware services SWD requests.  Applications provide a `fn` that is
 * invoked when a SWD request is received.  The signature of `fn` is:
 *
 *     function(principal, service, done) { ... }
 *
 * `principal` is a URI that identifies the entity.  `service` is a URI that
 * identifies a service type.  `done` is a callback which should be called with
 * a location or array of locations where the `service` can be found.  If an
 * exception occurred, `err` should be set.
 *
 * Examples:
 *
 *      app.get('/.well-known/simple-web-discovery', swd.discovery(function(principal, service, done) {
 *        return done(null, 'http://calendars.proseware.com/calendars/joseph')
 *      }));
 *
 *      app.get('/.well-known/simple-web-discovery', swd.discovery(function(principal, service, done) {
 *        return done(null, ['http://calendars.proseware.com/calendars/joseph',
 *                           'http://calendars.elsewhere.com/calendars/joseph'])
 *      }));
 *
 * @param {String} url
 * @param {Date|Number} expires
 * @return {Function}
 * @api public
 */
module.exports = function discovery(fn) {
  
  return function discovery(req, res, next) {
    var principal = req.query['principal'];
    var service = req.query['service'];
    
    if (!principal || !service) {
      res.statusCode = 400;
      return res.end();
    }
    
    function found(err, locations) {
      if (err) { return next(err); }
      
      var obj = {};
      if (Array.isArray(locations)) {
        obj['locations'] = locations;
      } else {
        obj['locations'] = [ locations ];
      }
      var json = JSON.stringify(obj);
      res.setHeader('Content-Type', 'application/json');
      res.end(json);
    }
    
    var arity = fn.length;
    if (arity == 3) { // async
      fn(principal, service, found);
    } else { // sync
      var locations = fn(principal, service);
      found(null, locations);
    }
  }
}
