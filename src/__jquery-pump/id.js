define(function (require, exports, module) {
	'use strict';

	exports.generatePipeId = function generatePipeId($el) {
		return _.uniqueId(this.pipeIdDataAttribute);
	};

	exports.pipeIdDataAttribute = 'jq-pipe-id';
});
