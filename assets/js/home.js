/* TradeStallion custom home – small progressive enhancements (no dependencies). */
(function () {
	'use strict';
	var root = document.querySelector('.ts');
	if (!root) { return; }
	root.classList.add('ts-js');

	// Sticky header shadow.
	var header = document.getElementById('ts-header');
	var onScroll = function () {
		if (header) { header.classList.toggle('is-scrolled', window.scrollY > 10); }
	};
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	// Mobile menu.
	var burger = root.querySelector('.ts-burger');
	if (burger && header) {
		burger.addEventListener('click', function () {
			var open = header.classList.toggle('is-open');
			burger.setAttribute('aria-expanded', open ? 'true' : 'false');
			burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
		});
		header.querySelectorAll('.ts-nav a').forEach(function (a) {
			a.addEventListener('click', function () {
				header.classList.remove('is-open');
				burger.setAttribute('aria-expanded', 'false');
			});
		});
	}

	// Active nav link while scrolling.
	var links = root.querySelectorAll('.ts-nav a[href^="#"]');
	var sections = [];
	links.forEach(function (a) {
		var el = document.querySelector(a.getAttribute('href'));
		if (el) { sections.push({ a: a, el: el }); }
	});

	// Reveal on scroll.
	var items = root.querySelectorAll('.ts-reveal');
	if (!('IntersectionObserver' in window)) {
		items.forEach(function (el) { el.classList.add('is-in'); });
		return;
	}
	var io = new IntersectionObserver(function (entries) {
		entries.forEach(function (e) {
			if (e.isIntersecting) {
				var siblings = Array.prototype.indexOf.call(e.target.parentNode.children, e.target);
				var delay = Math.min(siblings, 6) * 70;
				var target = e.target;
				target.style.transitionDelay = delay + 'ms';
				target.classList.add('is-in');
				// Clear the delay once revealed so hover effects stay instant.
				setTimeout(function () { target.style.transitionDelay = ''; }, delay + 750);
				io.unobserve(e.target);
			}
		});
	}, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
	items.forEach(function (el) { io.observe(el); });

	if (sections.length) {
		var spy = new IntersectionObserver(function (entries) {
			entries.forEach(function (e) {
				if (e.isIntersecting) {
					links.forEach(function (l) { l.classList.remove('is-active'); });
					var hit = sections.filter(function (s) { return s.el === e.target; })[0];
					if (hit) { hit.a.classList.add('is-active'); }
				}
			});
		}, { rootMargin: '-45% 0px -50% 0px' });
		sections.forEach(function (s) { spy.observe(s.el); });
	}
})();
