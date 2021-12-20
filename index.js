'use strict';

const busboy = require('busboy');

const RE_MIME = /^(?:multipart\/.+)|(?:application\/x-www-form-urlencoded)$/i;

module.exports = (options) => {
  options = options || {};

  return (req, res, next) => {
    if (req.busboy
        || req.method === 'GET'
        || req.method === 'HEAD'
        || !hasBody(req)
        || !RE_MIME.test(mime(req))) {
      return next();
    }

    const cfg = { ...options, headers: req.headers };

    req.busboy = busboy(cfg);

    if (options.immediate) {
      process.nextTick(() => {
        req.pipe(req.busboy);
      });
    }

    next();
  };
};

// Utility functions copied from Connect

function hasBody(req) {
  const encoding = ('transfer-encoding' in req.headers);
  const length = (
    'content-length' in req.headers && req.headers['content-length'] !== '0'
  );
  return (encoding || length);
}

function mime(req) {
  const str = (req.headers['content-type'] || '');
  return str.split(';')[0];
}
