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
