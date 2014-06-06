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
//	var destPropMatcher = /(?:(.+?)\s*->)?\s*(.+)\s*/;
//	function parseDestProp(str) {
//
//		var match = str.match(destPropMatcher);
//
//		return {
//			selector    : match[1],
//			methodString: match[2]
//		};
//	};


	var destPropMatcher = /(?:(.+?)\s*\|)?(?:(.+?)\s*->)?\s*(.+)\s*/;
	// (?:(.+?)\s*\|)? -> optional format |
	// (?:(.+?)\s*->)? -> optional selector ->
	// \s*(.+)\s*/     -> required methodString
	//

	// 'currency|.selector->attr:value'
	// 'format|.selector -> method:partial1'
	// 'currency|html'
	// 'html'
	/**
	 * Parses the destination property of the jquery-pump.
	 *
	 * @param  {[type]} str [description]
	 * @return {[type]}     [description]
	 */
	function parseDestProp(str) {
		var match = str.match(destPropMatcher);

		// match[0] the full matched string
		// match[1] the format
		// match[2] the selector
		// match[3] the methodString

		// parse out the methodString
		var parsedMethodString = parseMethodString(match[3]);

		return {
			format  : match[1],
			selector: match[2],
			method  : parsedMethodString.method,
			args    : parsedMethodString.args
		};
	}
	exports.destProp = parseDestProp;
});
