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
		return dest.format ? this.formats[dest.format].parse.call(this, res) : res;
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
		value = dest.format ? this.formats[dest.format].stringify.call(this, value) : value;

		// clone the args array, so that the original one remains untouched
		var args = _.clone(dest.args);

		// add the value to the arguments array
		args.push(value);

		// run the method
		return $el[dest.method].apply($el, args);
	};
});
