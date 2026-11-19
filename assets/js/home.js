/* TradeStallion custom home – interactions (v1.2, no dependencies). */
(function () {
	'use strict';
	var root = document.querySelector('.ts');
	if (!root) { return; }
	var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
	root.classList.add('ts-js');
	var $ = function (s, c) { return (c || root).querySelector(s); };
	var $$ = function (s, c) { return Array.prototype.slice.call((c || root).querySelectorAll(s)); };
	var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };

	/* ---------- Split hero heading into words ---------- */
	var h1 = $('[data-split]');
	if (h1 && !reduce) {
		var w = 0;
		var splitNode = function (node) {
			Array.prototype.slice.call(node.childNodes).forEach(function (n) {
				if (n.nodeType === 3) {
					var frag = document.createDocumentFragment();
					n.textContent.split(/(\s+)/).forEach(function (part) {
						if (!part) { return; }
						if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
						var outer = document.createElement('span');
						outer.className = 'ts-split-word';
						var inner = document.createElement('span');
						inner.style.setProperty('--w', w++);
						inner.textContent = part;
						outer.appendChild(inner);
						frag.appendChild(outer);
					});
					node.replaceChild(frag, n);
				} else if (n.nodeType === 1) { splitNode(n); }
			});
		};
		splitNode(h1);
	}
	var started = false;
	var start = function () {
		if (started) { return; }
		started = true;
		root.classList.add('ts-loaded');
		if (h1) { raf(function () { h1.classList.add('ts-split-ready'); }); }
	};
	if (document.readyState === 'complete') { raf(start); } else { window.addEventListener('load', start); setTimeout(start, 1200); }

	/* ---------- Steps progress (used by scroll handler) ---------- */
	var stepsBox = $('[data-steps]');
	var stepEls = stepsBox ? $$('.ts-step', stepsBox) : [];
	var fill = stepsBox ? $('.ts-steps__fill', stepsBox) : null;
	var updateSteps = function () {
		if (!stepsBox) { return; }
		var r = stepsBox.getBoundingClientRect();
		var vh = window.innerHeight;
		var p = reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height + vh * 0.35)));
		if (fill) { fill.style.setProperty('--sp', p.toFixed(3)); }
		stepEls.forEach(function (s, i) { s.classList.toggle('is-lit', p >= (i / Math.max(1, stepEls.length - 1)) * 0.95); });
	};

	/* ---------- Header, progress bar, back-to-top ---------- */
	var header = document.getElementById('ts-header');
	var bar = $('.ts-progress span');
	var toTop = $('.ts-totop');
	var ticking = false;
	var onScroll = function () {
		if (ticking) { return; }
		ticking = true;
		raf(function () {
			var y = window.scrollY || window.pageYOffset;
			var max = document.documentElement.scrollHeight - window.innerHeight;
			if (header) { header.classList.toggle('is-scrolled', y > 10); }
			if (bar) { bar.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0); }
			if (toTop) { toTop.classList.toggle('is-on', y > window.innerHeight); }
			updateSteps();
			ticking = false;
		});
	};

	/* ---------- Mobile menu ---------- */
	var burger = $('.ts-burger');
	if (burger && header) {
		burger.addEventListener('click', function () {
			var open = header.classList.toggle('is-open');
			burger.setAttribute('aria-expanded', open ? 'true' : 'false');
			burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
		});
		$$('.ts-nav a', header).forEach(function (a) {
			a.addEventListener('click', function () { header.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); });
		});
	}

	/* ---------- Reveal on scroll + counters ---------- */
	var countUp = function (el) {
		var target = parseFloat(el.getAttribute('data-count'));
		var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
		if (reduce || isNaN(target)) { return; }
		var t0 = null; var dur = 1600;
		var step = function (t) {
			if (!t0) { t0 = t; }
			var k = Math.min(1, (t - t0) / dur);
			var e = 1 - Math.pow(1 - k, 3);
			el.textContent = (target * e).toFixed(dec);
			if (k < 1) { raf(step); }
		};
		el.textContent = (0).toFixed(dec);
		raf(step);
	};
	var revealItems = $$('.ts-reveal, .ts-head, .ts-strip .ts-wrap');
	if (!('IntersectionObserver' in window) || reduce) {
		revealItems.forEach(function (el) { el.classList.add('is-in'); });
	} else {
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (e) {
				if (!e.isIntersecting) { return; }
				var t = e.target;
				var idx = Array.prototype.indexOf.call(t.parentNode.children, t);
				var delay = Math.min(Math.max(idx, 0), 6) * 80;
				t.style.transitionDelay = delay + 'ms';
				t.classList.add('is-in');
				setTimeout(function () { t.style.transitionDelay = ''; }, delay + 900);
				io.unobserve(t);
			});
		}, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
		revealItems.forEach(function (el) { io.observe(el); });
	}
	if ('IntersectionObserver' in window) {
		var co = new IntersectionObserver(function (entries) {
			entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); co.unobserve(e.target); } });
		}, { threshold: 0.6 });
		$$('[data-count]').forEach(function (el) { co.observe(el); });
	}

	/* ---------- Active nav link ---------- */
	var links = $$('.ts-nav a[href^="#"]');
	if ('IntersectionObserver' in window && links.length) {
		var spy = new IntersectionObserver(function (entries) {
			entries.forEach(function (e) {
				if (!e.isIntersecting) { return; }
				links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id); });
			});
		}, { rootMargin: '-45% 0px -50% 0px' });
		links.forEach(function (l) { var s = document.querySelector(l.getAttribute('href')); if (s) { spy.observe(s); } });
	}

	/* ---------- Pointer effects (desktop only) ---------- */
	if (finePointer && !reduce) {
		root.classList.add('ts-has-pointer');
		var cursor = $('.ts-cursor');
		window.addEventListener('pointermove', function (ev) {
			if (cursor) { cursor.style.setProperty('--cx', ev.clientX + 'px'); cursor.style.setProperty('--cy', ev.clientY + 'px'); }
		}, { passive: true });

		$$('[data-magnetic]').forEach(function (b) {
			b.addEventListener('pointermove', function (ev) {
				var r = b.getBoundingClientRect();
				b.style.setProperty('--mx', ((ev.clientX - r.left - r.width / 2) * 0.25).toFixed(1) + 'px');
				b.style.setProperty('--my', ((ev.clientY - r.top - r.height / 2) * 0.35).toFixed(1) + 'px');
			});
			b.addEventListener('pointerleave', function () { b.style.setProperty('--mx', '0px'); b.style.setProperty('--my', '0px'); });
		});

		$$('[data-tilt], [data-spot]').forEach(function (c) {
			var tilt = c.hasAttribute('data-tilt');
			c.addEventListener('pointermove', function (ev) {
				var r = c.getBoundingClientRect();
				var x = (ev.clientX - r.left) / r.width; var y = (ev.clientY - r.top) / r.height;
				c.style.setProperty('--sx', (x * 100).toFixed(1) + '%');
				c.style.setProperty('--sy', (y * 100).toFixed(1) + '%');
				if (tilt) {
					c.classList.add('is-tilting');
					c.style.setProperty('--ty', ((x - 0.5) * 10).toFixed(2) + 'deg');
					c.style.setProperty('--tx', ((0.5 - y) * 10).toFixed(2) + 'deg');
				}
			});
			c.addEventListener('pointerleave', function () { c.classList.remove('is-tilting'); });
		});

		var hero = $('.ts-hero');
		var frame = $('.ts-hero__frame');
		if (hero && frame) {
			hero.addEventListener('pointermove', function (ev) {
				var r = hero.getBoundingClientRect();
				frame.style.setProperty('--ry', (((ev.clientX - r.left) / r.width - 0.5) * 10).toFixed(2) + 'deg');
				frame.style.setProperty('--rx', ((0.5 - (ev.clientY - r.top) / r.height) * 8).toFixed(2) + 'deg');
			});
			hero.addEventListener('pointerleave', function () { frame.style.setProperty('--rx', '0deg'); frame.style.setProperty('--ry', '0deg'); });
		}

		var cta = $('[data-cta]'); var blob = cta && $('.ts-cta__blob', cta);
		if (cta && blob) {
			cta.addEventListener('pointermove', function (ev) {
				var r = cta.getBoundingClientRect();
				blob.style.setProperty('--bx', ((ev.clientX - r.left) / r.width * 100).toFixed(1) + '%');
				blob.style.setProperty('--by', ((ev.clientY - r.top) / r.height * 100).toFixed(1) + '%');
			});
		}
	}

	/* ---------- Marketplace tabs ---------- */
	$$('[data-tabs]').forEach(function (box) {
		var tabs = $$('[role="tab"]', box);
		var ink = $('.ts-tabs__ink', box);
		var timer = null;
		var current = function () { return tabs.filter(function (t) { return t.classList.contains('is-active'); })[0] || tabs[0]; };
		var moveInk = function (tab) {
			if (!ink || !tab) { return; }
			ink.style.width = tab.offsetWidth + 'px';
			ink.style.height = tab.offsetHeight + 'px';
			ink.style.transform = 'translate(' + tab.offsetLeft + 'px,' + tab.offsetTop + 'px)';
		};
		var select = function (tab, focus) {
			tabs.forEach(function (t) {
				var on = t === tab;
				t.classList.toggle('is-active', on);
				t.setAttribute('aria-selected', on ? 'true' : 'false');
				t.setAttribute('tabindex', on ? '0' : '-1');
				var p = document.getElementById(t.getAttribute('aria-controls'));
				if (p) { p.hidden = !on; p.classList.toggle('is-active', on); }
			});
			moveInk(tab);
			if (focus) { tab.focus(); }
		};
		var stopAuto = function () { if (timer) { clearInterval(timer); timer = null; } box.setAttribute('data-touched', '1'); };
		tabs.forEach(function (t, i) {
			t.addEventListener('click', function () { select(t); stopAuto(); });
			t.addEventListener('keydown', function (ev) {
				var k = ev.key; var n = null;
				if (k === 'ArrowRight' || k === 'ArrowDown') { n = tabs[(i + 1) % tabs.length]; }
				if (k === 'ArrowLeft' || k === 'ArrowUp') { n = tabs[(i - 1 + tabs.length) % tabs.length]; }
				if (k === 'Home') { n = tabs[0]; }
				if (k === 'End') { n = tabs[tabs.length - 1]; }
				if (n) { ev.preventDefault(); select(n, true); stopAuto(); }
			});
		});
		moveInk(current());
		window.addEventListener('resize', function () { moveInk(current()); });
		window.addEventListener('load', function () { moveInk(current()); });
		if (!reduce && 'IntersectionObserver' in window) {
			new IntersectionObserver(function (entries) {
				entries.forEach(function (e) {
					if (e.isIntersecting && !timer && !box.hasAttribute('data-touched')) {
						timer = setInterval(function () { select(tabs[(tabs.indexOf(current()) + 1) % tabs.length]); }, 4500);
					} else if (!e.isIntersecting && timer) { clearInterval(timer); timer = null; }
				});
			}, { threshold: 0.5 }).observe(box);
			box.addEventListener('pointerenter', stopAuto);
			box.addEventListener('focusin', stopAuto);
		}
	});

	/* ---------- Marquee speed by content width ---------- */
	$$('[data-marquee]').forEach(function (m) {
		var track = $('.ts-marquee__track', m);
		if (track && !m.classList.contains('ts-marquee--reviews')) {
			track.style.setProperty('--dur', Math.max(20, Math.round(track.scrollWidth / 90)) + 's');
		}
	});

	/* ---------- Hero particle network (canvas) ---------- */
	var canvas = $('.ts-hero__canvas');
	if (canvas && canvas.getContext && !reduce) {
		var ctx = canvas.getContext('2d');
		var heroEl = canvas.parentNode;
		var dpr = Math.min(window.devicePixelRatio || 1, 2);
		var W = 0, H = 0, pts = [], mouse = { x: -9999, y: -9999 }, running = true, LINK = 130;
		var resize = function () {
			W = heroEl.offsetWidth; H = heroEl.offsetHeight;
			canvas.width = W * dpr; canvas.height = H * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			var n = Math.round(Math.min(90, (W * H) / 16000));
			pts = [];
			for (var i = 0; i < n; i++) {
				pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.6 + 0.6, hot: Math.random() < 0.18 });
			}
		};
		var draw = function () {
			if (!running) { return; }
			ctx.clearRect(0, 0, W, H);
			for (var i = 0; i < pts.length; i++) {
				var p = pts[i];
				var dxm = p.x - mouse.x, dym = p.y - mouse.y, dm = Math.sqrt(dxm * dxm + dym * dym);
				if (dm < 160 && dm > 0) { p.x += dxm / dm * 0.9; p.y += dym / dm * 0.9; }
				p.x += p.vx; p.y += p.vy;
				if (p.x < 0 || p.x > W) { p.vx *= -1; }
				if (p.y < 0 || p.y > H) { p.vy *= -1; }
				for (var j = i + 1; j < pts.length; j++) {
					var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
					if (d < LINK * LINK) {
						var a = (1 - Math.sqrt(d) / LINK) * 0.35;
						ctx.strokeStyle = (p.hot || q.hot) ? 'rgba(255,106,19,' + a + ')' : 'rgba(255,255,255,' + (a * 0.45) + ')';
						ctx.lineWidth = 1;
						ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
					}
				}
				if (dm < 200) {
					ctx.strokeStyle = 'rgba(255,106,19,' + ((1 - dm / 200) * 0.5) + ')';
					ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
				}
				ctx.fillStyle = p.hot ? 'rgba(255,138,69,.95)' : 'rgba(255,255,255,.55)';
				ctx.beginPath(); ctx.arc(p.x, p.y, p.hot ? p.r + 0.8 : p.r, 0, Math.PI * 2); ctx.fill();
			}
			raf(draw);
		};
		resize();
		window.addEventListener('resize', resize);
		heroEl.addEventListener('pointermove', function (ev) { var r = heroEl.getBoundingClientRect(); mouse.x = ev.clientX - r.left; mouse.y = ev.clientY - r.top; });
		heroEl.addEventListener('pointerleave', function () { mouse.x = -9999; mouse.y = -9999; });
		if ('IntersectionObserver' in window) {
			new IntersectionObserver(function (es) { var was = running; running = es[0].isIntersecting; if (running && !was) { raf(draw); } }).observe(heroEl);
		}
		raf(draw);
	}

	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll);
	onScroll();
})();
