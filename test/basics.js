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

})('test', function(jqPipe, should, $, undefined) {
	'use strict';

	describe('jqPipe basics', function () {
		beforeEach(function () {
			this.$a = $('#a');
		});

		it('pumpTo jquery element', function (testdone) {

			var $a = this.$a;

			var source = {
				top: '100px',
				url: 'banana',
			};

			var toFixture = $a.pump();

			toFixture.from(source);

			toFixture.pump()
			.then(function () {


				$a.css('top').should.eql('100px');
				$a.attr('href').should.eql('banana');

				source.top = '200px';
				source.url = 'another';

				return toFixture.pump();

			})
			.then(function () {

				$a.css('top').should.eql('200px');
				$a.attr('href').should.eql('another');

				testdone();
			})
			.done();

		});

		it('drainFrom jquery element', function (testdone) {
			var $a = this.$a;

			$a.attr('href', 'some-url');
			$a.css('top', '235px');

			var toFixture = $a.pump();

			var source = {};

			toFixture
				.from(source)
				.drain()
				.then(function () {

					source.top.should.eql('235px');
					source.url.should.eql('some-url');

					testdone();
				})
				.done();
		});

		it('pump to many', function (testdone) {
			var $all = $('#fixture > *');

			var pump = $all.pump();

			var source = {
				top   : '300px',
				bottom: '400px',
				url   : 'some-other-url',
				title : 'some-title',
				items : ['F']
			};

			pump.from(source)
				.pump()
				.then(function () {

					var $a          = $all.find('a'),
						$div        = $all.find('div'),
						$textInput  = $all.find('input[type="text"]'),
						$checkboxes = $all.find('input[type="checkbox"]');

					$a.css('top').should.eql('300px');
					$div.css('bottom').should.eql('400px');
					$div.html().should.eql('some-other-url');

					$textInput.val().should.eql(source.title);

					testdone();
				})
				.done();


		});
	});
});
