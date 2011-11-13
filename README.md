# connect-swd

Simple Web Discovery (SWD) middleware middleware for [Connect](http://senchalabs.github.com/connect/)
and [Express](http://expressjs.com/).

Simple Web Discovery is mechanism to discover the location of a given type of
service for a given entity on the Internet.  For example, the location of a
person's address book or calendar can be found using their email address or
website as an identifier.

## Installation

    $ npm install connect-swd

## Usage

#### Discovery Middleware

To service SWD requests, use `swd.discovery()` middleware in your application.

    app.get('/.well-known/simple-web-discovery', swd.discovery(function(principal, service, done) {
      User.findByUri({ uri: principal }, function (err, user) {
        if (err) { return done(err); }
        return done(null, [ user.services.calendar[0], user.services.calendar[1] ]);
      });
    }));

The function supplied to `swd.discovery()` takes `principal`, `service`, and a
`done` callback as arguments.  `principal` is a URI that identifies the entity.
`service` is a URI that identifies a service type.  `done` is a callback which
should be called with  a location or array of locations where the `service` can
be found.  If an exception occurred, `err` should be set.

#### Redirect Middleware

Often times, it may not be possible to run a full SWD server at the well-known
location.  In these circumstances, use `swd.discovery()` middleware to redirect
SWD-compliant clients to the location of the full SWD server.

    app.get('/.well-known/simple-web-discovery', swd.redirect('https://swd.example.com/swd_server'));

#### Examples

For a complete, working example, refer to the [discovery example](https://github.com/jaredhanson/connect-swd/blob/master/examples/discovery/app.js)
and [redirect example](https://github.com/jaredhanson/connect-swd/blob/master/examples/redirect/app.js).

## Implementation

This module is implemented based on [Simple Web Discovery (SWD)](http://tools.ietf.org/html/draft-jones-simple-web-discovery-01),
Draft 01.  Implementers are encouraged to track the progress of this
specification and update update their implementations as necessary.
Furthermore, the implications of relying on a non-final draft specification
should be understood prior to deployment.

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

(The MIT License)

Copyright (c) 2011 Jared Hanson

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
