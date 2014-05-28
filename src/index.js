//     jquery-pump
//     (c) simonfan
//     jquery-pump is licensed under the MIT terms.

/**
 * AMD module.
 *
 * @module jquery-pump
 */

define(function (require, exports, module) {
	'use strict';

	var pump       = require('pump'),
		$          = require('jquery'),
		jqMetaData = require('jquery-meta-data');

	var msSplitter = /\s*:\s*/g;

	/**
	 * Parses a string into methodName and args.
	 * @param  {[type]} str [description]
	 * @return {[type]}     [description]
	 */
	function parseMethodString(str) {

		var tokens = str.split(msSplitter);

		var method = tokens.shift();

		return {
			method: method,
			args  : tokens
		};
	}


	var _jqPump = module.exports = pump.extend({

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


		prefix: 'pipe',

		metaDataOptions: {
			parse: function parsePipeDestinations(destinations) {

				// split destinations string into array.
				return destinations.split(/\s*,\s*/g);
			},
		},


		/**
		 * Get from the jquery object
		 *
		 * @param  {[type]} $el [description]
		 * @param  {[type]} methodString        [description]
		 * @return {[type]}             [description]
		 */
		destGet: function destGet($el, methodString) {
			// arguments = [$el, methodString]
			var parsed = parseMethodString(methodString);

			return $el[parsed.method].apply($el, parsed.args);
		},

		/**
		 * Set to the jquery object
		 * @param  {[type]} $el [description]
		 * @param  {[type]} methodString        [description]
		 * @param  {[type]} value       [description]
		 * @return {[type]}             [description]
		 */
		destSet: function destSet($el, methodString, value) {
			var parsed = parseMethodString(methodString),
				args   = parsed.args;

			args.push(value);

			return $el[parsed.method].apply($el, args);
		},

	});


	$.prototype.pump = function jqPump(source, options) {

		options = options || {};
		options.destination = this;

		return _jqPump(source, options);
	};
});
