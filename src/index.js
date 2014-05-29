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
