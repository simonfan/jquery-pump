(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././src' :
		// browser
		'jquery-pump',
		// dependencies for the test
		deps = [mod, 'should', 'jquery', 'jquery-value'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(jqPump, should, $, jqValue) {
	'use strict';

	describe('jqPump drain-from-selector-method', function () {

		it('is fine (:', function (testdone) {

			var $checkboxesDIV = $('#checkboxes');

			var	source = {},
				pump   = $checkboxesDIV.pump(source);

			source.items = ['D','E'];

			pump.pump()
				.then(function () {

					var checked = $checkboxesDIV.find('input[name="items"]').value();

					checked.should.eql(['D', 'E']);
				})
				.then(function () {

					// modify source items
					source.items = ['C'];


				//	console.log($checkboxesDIV.find('input[name="items"]').data(pump.pipeIdDataAttribute));

					// drain
					return pump.drain($checkboxesDIV.find('input[name="items"]'));
				})
				.then(function () {

					source.items.should.eql(['D', 'E']);
					testdone();
				})
				.done();
		});
	});
});
