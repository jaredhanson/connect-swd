var express = require('express')
  , swd = require('connect-swd')


var app = express.createServer();

// configure Express
app.configure(function() {
  app.use(express.logger());
  // SWD parameters are contained in the query portion of the URL, so ensure
  // that query middleware is in use.
  app.use(express.query());
});

// Mount `swd.discovery()` middleware at the well-known location.
//   To keep the example simple, the response always contains a hard-coded
//   location.  In a production-ready application, one would want to examine the
//   `principal` and `service` and return relevant locations.
//
// curl -v -G "http://127.0.0.1:3000/.well-known/simple-web-discovery?principal=mailto%3Ajoe%40example.com&service=urn%3Aadatum.com%3Acalendar"
app.get('/.well-known/simple-web-discovery', swd.discovery(function(principal, service, done) {
  return done(null, 'http://calendars.proseware.com/calendars/joseph')
}));

app.listen(3000);
