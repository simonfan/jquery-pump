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

	var $ = require('jquery'),
		_ = require('lodash');

	function _getFormat(formats, formatName) {

		// get the format specified
		var format = formats[formatName];

		if (!format) {
			throw new Error('[jquery-pump|destGet] ' + formatName + ' could not be found on formats hash.');
		}

		return format;
	}


	/**
	 * Get from the jquery object
	 *
	 * @param  {[type]} $el [description]
	 * @param  {[type]} dest        [description]
	 * @return {[type]}             [description]
	 */
	exports.destGet = function destGet($el, dest) {

		// dest:
		//   - method
		//   - args
		//   - format
		//   - selector (to be ignored)

		// get result
		var res = $el[dest.method].apply($el, dest.args);

		// parse result if format is defined
		if (dest.format) {

			// get the format specified
			var format = _getFormat(this.formats, dest.format);

			// only parse if a parser was defined.
			return format.parse ? format.parse.call(this, res) : res;

		} else {
			return res;
		}
	};

	/**
	 * Set to the jquery object
	 * @param  {[type]} $el [description]
	 * @param  {[type]} dest        [description]
	 * @param  {[type]} value       [description]
	 * @return {[type]}             [description]
	 */
	exports.destSet = function destSet($el, dest, value) {

		// dest:
		//   - method
		//   - args
		//   - format
		//   - selector (to be ignored)

		// stringify value if format is defined
		if (dest.format) {
			// get format specified
			var format = _getFormat(this.formats, dest.format);

			// only stringify if stringifier is defined
			value = format.stringify ? format.stringify.call(this, value) : value;
		}

		// clone the args array, so that the original one remains untouched
		var args = _.clone(dest.args);

		// add the value to the arguments array
		args.push(value);

		// run the method
		return $el[dest.method].apply($el, args);
	};
});
