var http = require('http');
var _ = require('lodash');

var methods = {};
var codes = {};

var defaultMethodsForMiddleware = [
	'ok',
	'badRequest',
	'noContent',
	'forbidden',
	'unauthorized',
	'badRequest',
];

// Map methods and codes to objects for future use
_.forIn(http.STATUS_CODES, function(value, key) {
  var methodName = _.camelCase(value.toLowerCase());
  methods[methodName] = Number.parseInt(key);
  //console.log('//', key, methodName, '-', value);
  codes[key] = methodName;
});

// List of available methods (from http.STATUS_CODES)
// 100 continue - Continue
// 101 switchingProtocols - Switching Protocols
// 102 processing - Processing
// 200 ok - OK
// 201 created - Created
// 202 accepted - Accepted
// 203 nonAuthoritativeInformation - Non-Authoritative Information
// 204 noContent - No Content
// 205 resetContent - Reset Content
// 206 partialContent - Partial Content
// 207 multiStatus - Multi-Status
// 208 alreadyReported - Already Reported
// 226 imUsed - IM Used
// 300 multipleChoices - Multiple Choices
// 301 movedPermanently - Moved Permanently
// 302 found - Found
// 303 seeOther - See Other
// 304 notModified - Not Modified
// 305 useProxy - Use Proxy
// 307 temporaryRedirect - Temporary Redirect
// 308 permanentRedirect - Permanent Redirect
// 400 badRequest - Bad Request
// 401 unauthorized - Unauthorized
// 402 paymentRequired - Payment Required
// 403 forbidden - Forbidden
// 404 notFound - Not Found
// 405 methodNotAllowed - Method Not Allowed
// 406 notAcceptable - Not Acceptable
// 407 proxyAuthenticationRequired - Proxy Authentication Required
// 408 requestTimeout - Request Timeout
// 409 conflict - Conflict
// 410 gone - Gone
// 411 lengthRequired - Length Required
// 412 preconditionFailed - Precondition Failed
// 413 payloadTooLarge - Payload Too Large
// 414 uriTooLong - URI Too Long
// 415 unsupportedMediaType - Unsupported Media Type
// 416 rangeNotSatisfiable - Range Not Satisfiable
// 417 expectationFailed - Expectation Failed
// 418 iMATeapot - I'm a teapot
// 421 misdirectedRequest - Misdirected Request
// 422 unprocessableEntity - Unprocessable Entity
// 423 locked - Locked
// 424 failedDependency - Failed Dependency
// 425 unorderedCollection - Unordered Collection
// 426 upgradeRequired - Upgrade Required
// 428 preconditionRequired - Precondition Required
// 429 tooManyRequests - Too Many Requests
// 431 requestHeaderFieldsTooLarge - Request Header Fields Too Large
// 500 internalServerError - Internal Server Error
// 501 notImplemented - Not Implemented
// 502 badGateway - Bad Gateway
// 503 serviceUnavailable - Service Unavailable
// 504 gatewayTimeout - Gateway Timeout
// 505 httpVersionNotSupported - HTTP Version Not Supported
// 506 variantAlsoNegotiates - Variant Also Negotiates
// 507 insufficientStorage - Insufficient Storage
// 508 loopDetected - Loop Detected
// 509 bandwidthLimitExceeded - Bandwidth Limit Exceeded
// 510 notExtended - Not Extended
// 511 networkAuthenticationRequired - Network Authentication Required

function middlewareHandler(res, code, data) {
	if (arguments.length > 2) {
		res.status(code).send(data);
	} else {
		return res.status(code);
	}
}

function middleware(userMethods, handler) {
	if (!userMethods) {
		userMethods = [];
	}
	var defineMethods = defaultMethodsForMiddleware.concat(userMethods);

	if (typeof handler !== 'function') {
		handler = middlewareHandler;
	}

	return function (req, res, next) {
		defineMethods.forEach(function(methodName) {
			res[methodName] = function() {
				var args = [res, methods[methodName]].concat(Array.prototype.slice.call(arguments));
				return handler.apply(null, args);
			};
		});
		next();
	};
}
module.exports.middleware = middleware;
