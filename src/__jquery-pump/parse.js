define(function (require, exports, module) {
	'use strict';

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
