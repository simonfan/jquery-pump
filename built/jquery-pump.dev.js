define('__jquery-pump/parse',['require','exports','module','jquery'],function (require, exports, module) {
	

	var $ = require('jquery');





	/**
	 * Parses a string into methodName and args.
	 * Example string: 'css:background-color'
	 *                 'attr:href'
	 *                 'val'
	 * @param  {[type]} str [description]
	 * @return {[type]}     [description]
	 */
	var colonSplitter = /\s*:\s*/g;
	function parseMethodString(str) {

		// parsing out the method string
		var tokens = str.split(colonSplitter),
			method = tokens.shift();

		return {
			method  : method,
			args    : tokens
		};
	};
	exports.methodString = parseMethodString;

	/**
	 * Returns optionally destProp string and method string
	 * [0] full match
	 * [1] selector
	 * [2] method string
	 */
	var destPropMatcher = /(?:(.+?)\s*\|)?\s*(.+)\s*/;
	function parseDestProp(str) {

		var match = str.match(destPropMatcher);

		return {
			selector    : match[1],
			methodString: match[2]
		};
	};
	exports.destProp = parseDestProp;
});

define('__jquery-pump/build-pipes',['require','exports','module','jquery','lodash','./parse'],function (require, exports, module) {
	

	var $ = require('jquery'),
		_ = require('lodash');

	var parse = require('./parse');



	/**
	 * Builds a single pipe.
	 *
	 * @param  {[type]} map [description]
	 * @param  {[type]} $el [description]
	 * @return {[type]}     [description]
	 */
	function buildPipe(map, $el) {

			// generate pipeId
		var pipeId = this.generatePipeId($el);

		// set pipeId to the $el as a data attribute
		$el.data(this.pipeIdDataAttribute, pipeId);

		// create pipe and set its destination
		var pipe = this.pipe(pipeId, map).to($el);

		return pipe;
	}

	/**
	 * [pipes description]
	 * @param  {[type]} map [description]
	 * @return {[type]}     [description]
	 *
	 *
	 * $mainEl:
	 * {
	 *   from: 'to:method',
	 *   prop: '.selector|to:method:arg'  -> is a new el.
	 *   another: '.another-selector|to:method:arg' -> another el
	 *   fromprop: 'toprop'
	 * }
	 *
	 * results in:
	 * {
	 *   pipe1: {
	 *     destination: $mainEl,
	 *     map: {
	 *       from: 'to:method',
	 *       frmprop: 'toprop'
	 *     }
	 *   },
	 *   pipe2: {
	 *     destination: $mainEl.find(.selector),
	 *     map: {
	 *       prop: 'to:method:arg'
	 *     }
	 *   },
	 *   pipe3: {
	 *     destination: $mainEl.find('.another-selector'),
	 *     map: {
	 *       another: 'to:method:arg'
	 *     }
	 *   }
	 * }
	 *
	 */
	module.exports = function buildPipes($selection, metaDataOptions) {

		// loop through the $selection
		_.each($selection, function (el) {

				// $el
			var $el = $(el),
				// the map
				elMap = {};

				// get data
			var raw = $el.metaData(metaDataOptions);

			// loop through the map
			_.each(raw, function (destProps, srcProp) {

				_.each(destProps, function (destProp) {



					// check if there is a selector defined
					var parsedDestProp = parse.destProp(destProp);

					if (parsedDestProp.selector) {
						// this refers to a $subEl

						// find the $subEl
						var $subEl  = $el.find(parsedDestProp.selector);

						// build the map
						var subMap = {};
						subMap[srcProp] = parsedDestProp.methodString;

						// build pipe
						buildPipe.call(this, subMap, $subEl);

					} else {
						// a map property of the $el
						// [1] check if the prop is in elMap already
						if (elMap[srcProp]) {
							elMap[srcProp].push(destProp);
						} else {
							elMap[srcProp] = [destProp];
						}
					}

				}, this)

			}, this);

			// create main pipe
			buildPipe.call(this, elMap, $el);

		}, this);

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

define('__jquery-pump/getter-setter',['require','exports','module','jquery','./parse'],function (require, exports, module) {
	

	var $ = require('jquery');


	var parse = require('./parse');

	/**
	 * Get from the jquery object
	 *
	 * @param  {[type]} $el [description]
	 * @param  {[type]} methodString        [description]
	 * @return {[type]}             [description]
	 */
	exports.destGet = function destGet($el, methodString) {

		// arguments = [$el, methodString]
		var parsed = parse.methodString(methodString),
			// partial arguments
			args     = parsed.args;

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
		var parsed   = parse.methodString(methodString),
			// partial arguments
			args     = parsed.args;

		// add the value to the arguments array
		args.push(value);

		return $el[parsed.method].apply($el, args);
	};
});

define('__jquery-pump/id',['require','exports','module'],function (require, exports, module) {
	

	exports.generatePipeId = function generatePipeId($el) {
		return _.uniqueId(this.pipeIdDataAttribute);
	};

	exports.pipeIdDataAttribute = 'jq-pipe-id';
});

//     jquery-pump
//     (c) simonfan
//     jquery-pump is licensed under the MIT terms.

/**
 * AMD module.
 *
 * @module jquery-pump
 */

define('jquery-pump',['require','exports','module','pump','jquery','jquery-meta-data','lodash','./__jquery-pump/build-pipes','./__jquery-pump/getter-setter','./__jquery-pump/id'],function (require, exports, module) {
	

	var pump       = require('pump'),
		$          = require('jquery'),
		jqMetaData = require('jquery-meta-data'),
		_          = require('lodash');

	var buildPipes = require('./__jquery-pump/build-pipes');


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

			// build pipes
			buildPipes.call(this, $el, options);
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

		/**
		 * Overwrite drain to get the id automatically from jqeury elements
		 *
		 * @param  {[type]} source   [description]
		 * @param  {[type]} options) {		options   = options || {};		options.destination = this;		return _jqPump(source, options);	};} [description]
		 * @return {[type]}          [description]
		 */
		drain: function jqPumpDrain(id, properties, force) {

			// id may be actually a jquery object
			id = (id instanceof $) ? id.data(this.pipeIdDataAttribute) : id;

			return pump.prototype.drain.call(this, id, properties, force);
		},
	});

	// assign getter setters.
	_jqPump
		.assignProto(require('./__jquery-pump/getter-setter'))
		.assignProto(require('./__jquery-pump/id'));

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

