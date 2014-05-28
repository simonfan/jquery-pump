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
