module.exports = function redirect(url, expires) {
  if (!url) throw new Error('connect-swd redirect middleware requires a url');
  
  return function redirect(req, res, next) {
    var obj = { 'SWD_service_redirect': { 'location': url } };
    if (expires) {
      if (expires instanceof Date) {
        var sec = Math.round(expires.getTime() / 1000); // milliseconds to seconds
        obj['SWD_service_redirect']['expires'] = sec;
      } else if (typeof expires == 'number') {
        obj['SWD_service_redirect']['expires'] = expires;
      }
    }
    
    var json = JSON.stringify(obj);
    res.setHeader('Content-Type', 'application/json');
    res.end(json);
  }
}
