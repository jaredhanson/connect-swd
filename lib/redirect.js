/**
 * Redirect all Simple Web Discovery requests.
 *
 * This middleware redirects all SWD requests using a service-level redirect.
 * Often times, it is not possible to run a full SWD server at the well-known
 * location.  In these cases, a service-level redirect is issued.  Clients that
 * are SWD-compliant will follow this redirect and reissue the SWD request at
 * the redirect location.
 *
 * Examples:
 *
 *      app.get('/.well-known/simple-web-discovery', swd.redirect('https://swd.example.com/swd_server'));
 *
 *      app.get('/.well-known/simple-web-discovery', swd.redirect('https://swd.example.com/swd_server',
 *                                                                new Date("Wed, 09 Aug 1995 00:00:00 GMT")));
 *
 * @param {String} url
 * @param {Date|Number} expires
 * @return {Function}
 * @api public
 */
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
