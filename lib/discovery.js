module.exports = function discovery(fn) {
  
  return function discovery(req, res, next) {
    var principal = req.query['principal'];
    var service = req.query['service'];
    var locations = fn(principal, service);
    
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
}
