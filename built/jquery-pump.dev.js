//     jquery-meta-data
//     (c) simonfan
//     jquery-meta-data is licensed under the MIT terms.

define("__jquery-meta-data/helpers",["require","exports","module","jquery","lodash"],function(e,r){e("jquery"),e("lodash");r.buildPrefixRegExp=function(e){return new RegExp("^"+e+"([A-Z$_].*$)")},r.lowercaseFirst=function(e){return e.charAt(0).toLowerCase()+e.slice(1)},r.uppercaseFirst=function(e){return e.charAt(0).toUpperCase()+e.slice(1)},r.fullKey=function(e,t){return e?e+r.uppercaseFirst(t):t}}),define("__jquery-meta-data/read",["require","exports","module","lodash","./helpers"],function(e,r){function t(e){return e}var a=e("lodash"),n=e("./helpers");r.all=function(e,r){var u=e.data(),s=r.parse||t;if(r.prefix){var i=n.buildPrefixRegExp(r.prefix);return a.transform(u,function(t,a,u){var l=u.match(i);if(l){var o=n.lowercaseFirst(l[1]);a=s(a,o,u),r.replace&&e.data(u,a),t[o]=a}})}return a.mapValues(u,function(e,r){return s(e,r,r)})},r.single=function(e,r,t){var a=n.fullKey(r.prefix,t),u=e.data(a);return r.parse&&(u=r.parse(u,t,a),r.replace&&e.data(a,u)),u}}),define("__jquery-meta-data/set",["require","exports","module","lodash","./helpers"],function(e,r){var t=e("lodash"),a=e("./helpers");r.single=function(e,r,t,n){var u=a.fullKey(r.prefix,t);n=r.stringify?r.stringify(n,t,u):n,e.data(u,n)},r.multiple=function(e,a,n){t.each(n,function(t,n){r.single(e,a,n,t)})}}),define("jquery-meta-data",["require","exports","module","jquery","lodash","./__jquery-meta-data/read","./__jquery-meta-data/set"],function(e){var r=e("jquery"),t=e("lodash"),a=e("./__jquery-meta-data/read"),n=e("./__jquery-meta-data/set"),u={};r.metaData=function(){t.isObject(arguments[0])?t.assign(u,arguments[0]):u[arguments[0]]=arguments[1]},r.prototype.metaData=function(e){return e=t.isString(e)?u[e]:e,1===arguments.length?a.all(this,e):2!==arguments.length?(n.single(this,e,arguments[1],arguments[2]),this):t.isString(arguments[1])?a.single(this,e,arguments[1]):t.isObject(arguments[1])?(n.multiple(this,e,arguments[1]),this):void 0}});
//     jquery-pump
//     (c) simonfan
//     jquery-pump is licensed under the MIT terms.

/**
 * AMD module.
 *
 * @module jquery-pump
 */

define('__jquery-pump/parse-method-string',['require','exports','module'],function (require, exports, module) {
	

	var colonSplitter = /\s*:\s*/g;

	/**
	 * [0] full string
	 * [1] the selector
	 * [2] method string
	 *
	 * @type {RegExp}
	 */
	var methodStringMatcher = /(?:(.+?)\|)?(.+?)$/;

	/**
	 * Parses a string into methodName and args.
	 * Example string: 'css:background-color'
	 *                 'attr:href'
	 *                 'val'
	 * @param  {[type]} str [description]
	 * @return {[type]}     [description]
	 */
	module.exports = function parseMethodString(str) {
		/**
		 * [0] full string
		 * [1] the selector
		 * [2] method string
		 */

		// parse the strng
		var match = str.match(methodStringMatcher);

		// parsing out the method string
		var tokens = match[2].split(colonSplitter),
			method = tokens.shift();

		return {
			selector: match[1],
			method  : method,
			args    : tokens
		};
	};
});

//     jquery-pump
//     (c) simonfan
//     jquery-pump is licensed under the MIT terms.

/**
 * AMD module.
 *
 * @module jquery-pump
 */

define('__jquery-pump/getter-setter',['require','exports','module','jquery','./parse-method-string'],function (require, exports, module) {
	

	var $ = require('jquery');


	var parseMethodString = require('./parse-method-string');

	/**
	 * Get from the jquery object
	 *
	 * @param  {[type]} $el [description]
	 * @param  {[type]} methodString        [description]
	 * @return {[type]}             [description]
	 */
	exports.destGet = function destGet($el, methodString) {

		// arguments = [$el, methodString]
		var parsed = parseMethodString(methodString);

		return $el[parsed.method].apply($el, parsed.args);
	};

	/**
	 * Set to the jquery object
	 * @param  {[type]} $el [description]
	 * @param  {[type]} methodString        [description]
	 * @param  {[type]} value       [description]
	 * @return {[type]}             [description]
	 */
	exports.destSet = function destSet($el, methodString, value) {
			// the parsed methodString
		var parsed   = parseMethodString(methodString),
			// the selector
			selector = parsed.selector,
			// partial arguments
			args     = parsed.args;

		// add the value to the arguments array
		args.push(value);

		// check if a selector is available
		$el = (selector) ? $el.find(selector) : $el;

		return $el[parsed.method].apply($el, args);
	};
});

//     jquery-pump
//     (c) simonfan
//     jquery-pump is licensed under the MIT terms.

/**
 * AMD module.
 *
 * @module jquery-pump
 */

define('jquery-pump',['require','exports','module','pump','jquery','jquery-meta-data','./__jquery-pump/getter-setter'],function (require, exports, module) {
	

	var pump       = require('pump'),
		$          = require('jquery'),
		jqMetaData = require('jquery-meta-data');


	var _jqPump = module.exports = pump.extend({

		/**
		 * [initialize description]
		 * @param  {[type]} source  [description]
		 * @param  {[type]} options [description]
		 * @return {[type]}         [description]
		 */
		initialize: function initializeJqPump(source, options) {


			// set default options
			options = options || {};

			// the $el is always the destination of the pump
			var $el = options.destination;

			// set metadata options default values
			_.defaults(options, this.metaDataOptions);
			_.defaults(options, { prefix: this.prefix });

			// initialize the pump
			pump.prototype.initialize.call(this, source);

			// PIPES
			// build one pipe for each element.
			_.each($el, function (el) {

				var $el      = $(el),
					pipeData = $el.metaData(options);

					// build pipe
				var pipe = this.pipe(pipeData);

					// set pipe destination
				pipe.to($el);

			}, this);
		},

		/**
		 * Prefix of the binding data attribute
		 * @type {String}
		 */
		prefix: 'pipe',

		/**
		 * Options for the metadata reader.
		 * @type {Object}
		 */
		metaDataOptions: {
			parse: function parsePipeDestinations(destinations) {

				// split destinations string into array.
				return destinations.split(/\s*,\s*/g);
			},
		},
	});

	// assign getter setters.
	_jqPump.assignProto(require('./__jquery-pump/getter-setter'));

	/**
	 * Creates a pump that has the $selection as destination.
	 *
	 * @param  {[type]} source  [description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	$.prototype.pump = function jqPump(source, options) {

		options = options || {};
		options.destination = this;

		return _jqPump(source, options);
	};
});

