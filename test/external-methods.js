(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././src' :
		// browser
		'jquery-pump',
		// dependencies for the test
		deps = [mod, 'should'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(jqPump, should) {
	'use strict';

	describe('jqPump external-methods hash', function () {
		beforeEach(function (done) {
			done();
		});

		it('works for set', function () {

			var source = {},
				$el  = $('#some-id'),
				mtds = {
					doSomethingWithId: function (id) {
						if (arguments.length === 0) {

							console.log('read ' + $(this).prop('id'));

							// reader
							return $(this).prop('id').replace(/-modified$/, '');
						} else {

							console.log('set ' + id);
							// setter
							return $(this).prop('id', id + '-modified');
						}
					}
				}

			// create pump
			var pump = $el.pump(source, { methods: mtds });

			// check the original id
			$el.prop('id').should.eql('some-id');

			// set data onto source
			source.id = 'another-id';
			pump.pump();

			// check that id was changed
			$el.prop('id').should.eql('another-id-modified');



			// set id directly onto $el
			$el.prop('id', 'some-other-id-modified');

			// drain
			pump.drain($el);

			// check value on source object
			source.id.should.eql('some-other-id');
		});

		it('works for get', function () {

		})
	});
});
