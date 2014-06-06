(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././src' :
		// browser
		'jquery-pump',
		// dependencies for the test
		deps = [mod, 'should', 'jquery'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(jqPump, should, $) {
	'use strict';

	describe('jqPump format', function () {
		it('is fine (:', function (testdone) {

			var source = {};

			var formats = {
				currency: {
					parse: function parseCurrencyToValue(curr) {
						return parseInt(curr.replace('R$', ''));
					},
					stringify: function stringifyValueToCurrency(value) {
						return 'R$' + value;
					}
				}
			}

			var $currency = $('#currency'),
				$currencyInput = $currency.find('input');

			// instnatiate the pump
			var cPump = $currency.pump(source, { formats: formats });

			// set data onto source
			source.value = 10;

			// pump
			cPump.pump().then(function (argument) {

				// check currency
				$currency.data('value').should.be.exactly('R$10');

				// check currency input
				$currencyInput.val().should.be.exactly('R$10');

				// set value onto input
				$currencyInput.val('R$ 5000');

				// drain from it
				return cPump.drain($currencyInput);
			})
			.then(function () {
				source.value.should.be.exactly(5000);

				testdone();
			})
			.done();
		});
	});
});
