var Busboy = require('busboy'),
    connect = require('connect'),
    utils = connect.utils;

var RE_MIME = /^(?:multipart\/.+)|(?:application\/x-www-form-urlencoded)$/i;

module.exports = function(options) {
  options = options || {};

  return function(req, res, next) {
    if (req.busboy
        || req.method === 'GET'
        || req.method === 'HEAD'
        || !utils.hasBody(req)
        || !RE_MIME.test(utils.mime(req))) return next();

    var cfg = {};
    for (var prop in options)
      cfg[prop] = options[prop];
    cfg.headers = req.headers;

    req.busboy = new Busboy(cfg);

    if (options.immediate)
      req.pipe(req.busboy);

    next();
  }
};