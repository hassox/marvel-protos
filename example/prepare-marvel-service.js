// Create a keys.json file with your 'public' and 'private' keys
// Each request needs to be signed with the private/public key and timestamp
var registry = require('protob').Protob.registry,
    fs = require('fs'),
    FenderClient = require('fender/client'),
    fenderClient = new FenderClient(),
    Message = require('protob').Message,
    KEYS = JSON.parse(fs.readFileSync('./keys.json')),
    PUBLIC_KEY = KEYS.public,
    PRIVATE_KEY = KEYS.private,
    marvel = registry.scope('marvel.cable.public'),
    MarvelService = marvel.lookup('MarvelService');

// prepare the given services to make http requests based on their fender_method options
fenderClient.prepareClientServiceHandlers(marvel.services());

function signMessage(req, requestBodyField) {
  req = req || {};
  var ts = new Date().getTime(),
      MD5 = require('crypto').createHash('md5'),
      body, hash;

  MD5.update(ts + PRIVATE_KEY + PUBLIC_KEY);
  hash = MD5.digest('hex');

  if(!requestBodyField) {
    body = req;
  } else {
    if(req.getf) {
      body = req.getf(requestBodyField.name);
    } else {
      body = req[requestBodyField.name];
    }
  }

  if(!body) return req;

  if(body.setf) {
    body.setf(PUBLIC_KEY, 'apikey');
    body.setf(ts, 'ts');
    body.setf(hash, 'hash');
  } else {
    body.apikey = PUBLIC_KEY;
    body.ts = ts;
    body.hash = hash;
  }
  return req;
}

// need to add authentication
Object.keys(MarvelService.methods).forEach(function(meth) {
  var method = MarvelService.methods[meth],
      fn = MarvelService.prototype[meth],
      methodOpts = method.getf('options'),
      fenderOpts, requestBodyField;

  // get the body field out if there is one
  if(methodOpts && (fenderOpts = methodOpts.getf('fender_method', 'fender.v1'))) {
    requestBodyField = fenderOpts.getf('request_body_field');
    requestBodyField = requestBodyField && requestBodyField.asJSON();
  }

  MarvelService.prototype[meth] = function(req) {
    return fn.call(this, signMessage(req, requestBodyField));
  };
});

