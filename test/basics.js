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

})('test', function(jqPump, should, $, undefined) {
	'use strict';

	describe('jqPump basics', function () {
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
				.drain($a)
				.then(function () {

					source.top.should.eql('235px');
					source.url.should.eql('some-url');

					testdone();
				})
				.done();
		});

		it('pump to many', function (testdone) {

			// select all elements within fixture
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

					var $a          = $all.filter('a'),
						$div        = $all.filter('div'),
						$textInput  = $all.filter('input[type="text"]'),
						$checkboxes = $all.filter('#checkboxes').find('input[type="checkbox"]');

					$a.css('top').should.eql('300px');
					$div.css('bottom').should.eql('400px');
					$div.html().should.eql('some-other-url');

					$textInput.val().should.eql(source.title);

					// use the usual method to get value from checkboxes.
					$checkboxes.filter(':checked').val().should.eql('F');

					// use jquery.value to read checkboxes
					$checkboxes.value().should.eql(['F']);

					testdone();
				})
				.done();


		});
	});
});
