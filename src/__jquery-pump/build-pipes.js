define(function (require, exports, module) {
	'use strict';

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
