Description
===========

Connect middleware for [busboy](https://github.com/mscdex/busboy).


Requirements
============

* [node.js](http://nodejs.org/) -- v0.8.0 or newer


Install
============

    npm install connect-busboy


Example
=======

```javascript
var busboy = require('connect-busboy');

// default options, no immediate parsing
app.use(busboy());
// ...
app.use(function(req, res) {
  if (req.busboy) {
    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      // ...
    });
    req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
      // ...
    });
    req.pipe(req.busboy);
  }
  // etc ...
});

// default options, immediately start reading from the request stream and
// parsing
app.use(busboy({ immediate: true }));
// ...
app.use(function(req, res) {
  if (req.busboy) {
    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      // ...
    });
    req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
      // ...
    });
  }
  // etc ...
});

// any valid Busboy options can be passed in also
app.use(busboy({
  highWaterMark: 2 * 1024 * 1024,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
}));

```

## Troubleshooting

### 'TypeError: Cannot call method 'on' of undefined'

If you find that `req.busboy` is not defined in your code when you expect it to be, check that the following conditions are met. If they are not, `req.busboy` won't be defined:

 1. The request method is not GET or HEAD
 2. The Content-Type header specifies  that is "application/x-www-formurlencoded" or starts with "multipart/*"
 3. The Content-Length header is defined or chunked transfer encoding is in use. *This criteria should be met by all well-behaved HTTP clients and is unlikely the problem*.
