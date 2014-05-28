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
