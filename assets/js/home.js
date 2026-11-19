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
						ctx.strokeStyle = (p.hot || q.hot) ? 'rgba(255,106,19,' + a.toFixed(3) + ')' : 'rgba(255,255,255,' + (a * 0.45).toFixed(3) + ')';
						ctx.lineWidth = 1;
						ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
					}
				}
				if (dm < 200) {
					ctx.strokeStyle = 'rgba(255,106,19,' + ((1 - dm / 200) * 0.5).toFixed(3) + ')';
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


	/* ---------- Hero motion scene ---------- */
	(function () {
	var scene = $('[data-scene]');
	if (scene) {
		var logos = {};
		try { logos = JSON.parse(scene.getAttribute('data-logos') || '{}'); } catch (e) { logos = {}; }
		var feed = $('[data-scene-feed]', scene);
		var revEl = $('[data-scene-rev]', scene);
		var acosEl = $('[data-scene-acos]', scene);
		var events = [
			{ k: 'amazon', t: 'New order · Amazon UK', s: 'Wireless earbuds ×2', v: '+£59.98' },
			{ k: 'ebay', t: 'Listing optimised', s: 'Title & item specifics', v: 'Live' },
			{ k: 'shopify', t: 'Stock synced', s: '128 SKUs across channels', v: 'Done' },
			{ k: 'amazon', t: 'PPC bids adjusted', s: '9 wasted keywords paused', v: '−£42/wk' },
			{ k: 'etsy', t: 'New order · Etsy', s: 'Personalised mug', v: '+£18.50' },
			{ k: 'ebay', t: 'New order · eBay', s: 'Phone case bundle', v: '+£24.99' },
			{ k: 'amazon', t: 'Policy warning resolved', s: 'Account health protected', v: 'Fixed' },
			{ k: 'shopify', t: 'New order · Shopify', s: 'Gift set', v: '+£42.00' }
		];
		var ROW = 56, MAX = 2, shown = [], ei = 0;
		var makeItem = function (ev) {
			var el = document.createElement('div');
			el.className = 'ts-scene__item';
			var logo = document.createElement('span'); logo.className = 'ts-scene__logo';
			if (logos[ev.k]) { var im = document.createElement('img'); im.src = logos[ev.k]; im.alt = ''; logo.appendChild(im); }
			var txt = document.createElement('div');
			var b = document.createElement('b'); b.textContent = ev.t;
			var sm = document.createElement('small'); sm.textContent = ev.s;
			txt.appendChild(b); txt.appendChild(sm);
			var val = document.createElement('i'); val.textContent = ev.v;
			el.appendChild(logo); el.appendChild(txt); el.appendChild(val);
			return el;
		};
		var layout = function () {
			shown.forEach(function (el, i) {
				el.style.transform = 'translateY(' + (i * ROW) + 'px)' + (i === 0 ? '' : ' scale(' + (1 - i * 0.03) + ')');
				el.style.opacity = i >= MAX ? '0' : String(1 - i * 0.3);
			});
		};
		var push = function () {
			var el = makeItem(events[ei % events.length]); ei++;
			el.style.transform = 'translateY(-' + ROW + 'px)'; el.style.opacity = '0';
			feed.appendChild(el);
			shown.unshift(el);
			raf(function () { raf(layout); });
			if (shown.length > MAX + 1) { var old = shown.pop(); setTimeout(function () { if (old.parentNode) { old.parentNode.removeChild(old); } }, 700); }
		};
		var rev = 0, revTarget = 0, acos = 34;
		var tick = function () {
			rev += (revTarget - rev) * 0.08;
			if (revEl) { revEl.textContent = '£' + Math.round(rev).toLocaleString('en-GB'); }
			raf(tick);
		};
		var cycle = function () {
			revTarget = 0; rev = 0; acos = 34;
			if (acosEl) { acosEl.textContent = acos + '%'; }
		};
		cycle();
		push(); push();
		if (!reduce) {
			raf(tick);
			var t0 = Date.now();
			setInterval(function () {
				var phase = ((Date.now() - t0) % 12000) / 12000;
				if (phase < 0.02) { cycle(); }
				revTarget = Math.round(4280 * Math.min(1, phase / 0.85));
				var a = Math.max(18, Math.round(34 - 16 * Math.min(1, phase / 0.8)));
				if (acosEl && acosEl.textContent !== a + '%') { acosEl.textContent = a + '%'; }
			}, 120);
			setInterval(push, 1700);
		} else if (revEl) { revEl.textContent = '£4,280'; if (acosEl) { acosEl.textContent = '18%'; } }
	}

	}());

	/* ---------- Interactive client dashboard demo ---------- */
	(function () {
	var dash = $('[data-dash]');
	if (dash) {
		var dLogos = {};
		try { dLogos = JSON.parse(dash.getAttribute('data-logos') || '{}'); } catch (e2) { dLogos = {}; }
		var MP = {
			amazon: { name: 'Amazon UK', rev: 48200, ord: 1530, acos: [31, 17], lift: 0.42, health: 100, issues: 0,
				actions: [['Rewrote 14 listing titles and bullet points', 'Keyword research applied to top sellers'], ['Paused 23 non-converting search terms', 'Saved wasted ad spend'], ['Raised bids on 6 high-ROAS keywords', 'Sponsored Products'], ['Resolved 2 listing policy warnings', 'Account health kept green'], ['Launched A+ Content on 3 hero products', 'Brand Registry']],
				products: [['Wireless earbuds', 34], ['Phone stand', 22], ['Charging cable 2-pack', 18], ['Laptop sleeve', 12]] },
			ebay: { name: 'eBay UK', rev: 21600, ord: 940, acos: [14, 8], lift: 0.33, health: 98, issues: 0,
				actions: [['Completed item specifics on 62 listings', 'Better search visibility'], ['Set up Promoted Listings Standard', 'Rate tuned per category'], ['Fixed 4 late-dispatch risks', 'Seller performance protected'], ['Grouped variations on 9 listings', 'Cleaner catalogue']],
				products: [['Phone case bundle', 29], ['Car charger', 24], ['Screen protector', 19], ['USB hub', 11]] },
			etsy: { name: 'Etsy shop', rev: 9800, ord: 610, acos: [22, 12], lift: 0.38, health: 100, issues: 0,
				actions: [['Rewrote titles and all 13 tags on 28 listings', 'Etsy search optimisation'], ['Added lifestyle photos to 12 listings', 'Higher click-through'], ['Adjusted Etsy Ads budget', 'Focused on best sellers'], ['Answered 31 buyer messages same day', 'Star Seller criteria']],
				products: [['Personalised mug', 36], ['Name necklace', 25], ['Wedding sign', 17], ['Gift box', 9]] },
			shopify: { name: 'Shopify store', rev: 27400, ord: 820, acos: [26, 15], lift: 0.29, health: 100, issues: 0,
				actions: [['Uploaded 46 new products with SEO fields', 'Collections organised'], ['Synced stock with marketplaces', 'No overselling'], ['Improved 8 product pages', 'Copy, images and FAQs'], ['Set up abandoned-cart flow', 'Recovering lost sales']],
				products: [['Gift set', 31], ['Candle trio', 23], ['Bath bundle', 18], ['Travel kit', 13]] }
		};
		var RANGE = { 7: 0.24, 30: 1, 90: 2.9 };
		var curMp = 'amazon', curRange = 30;
		var seed = function (str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return function () { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; }; };
		var series = function (key, n, lift) {
			var rnd = seed(key + n);
			var before = [], after = [], base = 100;
			for (var i = 0; i < n; i++) {
				var noise = (rnd() - 0.5) * 14;
				var b = base + Math.sin(i / 2.3) * 5 + noise;
				before.push(b);
				after.push(b * (1 + lift * Math.min(1, i / (n * 0.7))) + (rnd() - 0.4) * 8);
			}
			return { before: before, after: after };
		};
		var W = 600, H = 220, PAD = 14;
		var pathOf = function (arr, max, min) {
			return arr.map(function (v, i) {
				var x = (i / (arr.length - 1)) * W;
				var y = H - PAD - ((v - min) / (max - min)) * (H - PAD * 2);
				return (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
			}).join(' ');
		};
		var spark = function (arr) {
			var mx = Math.max.apply(null, arr), mn = Math.min.apply(null, arr);
			return arr.map(function (v, i) { return (i ? 'L' : 'M') + (i / (arr.length - 1) * 100).toFixed(1) + ',' + (26 - (v - mn) / ((mx - mn) || 1) * 24).toFixed(1); }).join(' ');
		};
		var animNum = function (el, to, fmt) {
			if (!el) { return; }
			var from = parseFloat(el.getAttribute('data-v') || '0'); var t0 = null;
			el.setAttribute('data-v', to);
			if (reduce) { el.textContent = fmt(to); return; }
			var step = function (t) { if (!t0) { t0 = t; } var k = Math.min(1, (t - t0) / 900); var e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(from + (to - from) * e); if (k < 1) { raf(step); } };
			raf(step);
		};
		var gbp = function (v) { return '£' + Math.round(v).toLocaleString('en-GB'); };
		var int = function (v) { return Math.round(v).toLocaleString('en-GB'); };
		var plot = $('[data-plot]', dash);
		var pBefore = $('[data-path="before"]', dash), pAfter = $('[data-path="after"]', dash), pArea = $('[data-path="area"]', dash);
		var cursor = $('[data-cursor]', dash), cdot = $('[data-cursor-dot]', dash), tip = $('[data-tip]', dash);
		var current = null;
		var render = function () {
			var m = MP[curMp], f = RANGE[curRange];
			var n = curRange === 7 ? 7 : (curRange === 30 ? 30 : 45);
			var s = series(curMp, n, m.lift);
			var all = s.before.concat(s.after);
			var mx = Math.max.apply(null, all) * 1.05, mn = Math.min.apply(null, all) * 0.9;
			var dAfter = pathOf(s.after, mx, mn);
			pBefore.setAttribute('d', pathOf(s.before, mx, mn));
			pAfter.setAttribute('d', dAfter);
			pArea.setAttribute('d', dAfter + ' L' + W + ',' + H + ' L0,' + H + ' Z');
			pAfter.classList.remove('is-drawing'); void pAfter.getBBox(); pAfter.classList.add('is-drawing');
			current = { s: s, mx: mx, mn: mn, n: n, total: m.rev * f };
			$('[data-dash-title]', dash).textContent = m.name + ' performance';
			animNum($('[data-kpi="rev"]', dash), m.rev * f, gbp);
			animNum($('[data-kpi="ord"]', dash), m.ord * f, int);
			animNum($('[data-kpi="acos"]', dash), m.acos[1], function (v) { return v.toFixed(1) + '%'; });
			$('[data-kpi-d="rev"]', dash).textContent = '▲ ' + Math.round(m.lift * 100) + '% vs before';
			$('[data-kpi-d="ord"]', dash).textContent = '▲ ' + Math.round(m.lift * 80) + '% vs before';
			$('[data-kpi-d="acos"]', dash).textContent = '▼ ' + (m.acos[0] - m.acos[1]) + ' pts (was ' + m.acos[0] + '%)';
			$('[data-kpi="health"]', dash).textContent = m.health >= 99 ? 'Healthy' : 'Good';
			$('[data-kpi-d="health"]', dash).textContent = m.issues + ' open issues';
			$('[data-health-bar]', dash).style.width = m.health + '%';
			$('[data-spark="rev"]', dash).setAttribute('d', spark(s.after));
			$('[data-spark="ord"]', dash).setAttribute('d', spark(s.after.map(function (v, i) { return v * (0.9 + (i % 3) * 0.05); })));
			$('[data-spark="acos"]', dash).setAttribute('d', spark(s.after.map(function (v, i) { return 200 - v - i; })));
			var list = $('[data-actions]', dash); list.innerHTML = '';
			var acts = m.actions.slice(0, curRange === 7 ? 3 : m.actions.length);
			acts.forEach(function (a, i) {
				var li = document.createElement('li');
				var tk = document.createElement('span'); tk.className = 'ts-dash__tick'; tk.textContent = '✓';
				var tx = document.createElement('div'); tx.textContent = a[0];
				var sm = document.createElement('small'); sm.textContent = a[1]; tx.appendChild(sm);
				li.appendChild(tk); li.appendChild(tx); list.appendChild(li);
				setTimeout(function () { li.classList.add('is-in'); }, 120 + i * 140);
			});
			$('[data-actions-count]', dash).textContent = acts.length + ' completed';
			var pl = $('[data-products]', dash); pl.innerHTML = '';
			m.products.forEach(function (p) {
				var li = document.createElement('li');
				var a = document.createElement('span'); a.textContent = p[0];
				var b = document.createElement('span'); b.textContent = p[1] + '%';
				var bar = document.createElement('i'); bar.style.setProperty('--w', '0%');
				li.appendChild(a); li.appendChild(b); li.appendChild(bar); pl.appendChild(li);
				setTimeout(function () { bar.style.setProperty('--w', (p[1] / 40 * 100) + '%'); }, 80);
			});
		};
		$$('[data-mp]', dash).forEach(function (b) {
			b.addEventListener('click', function () {
				curMp = b.getAttribute('data-mp');
				$$('[data-mp]', dash).forEach(function (x) { var on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-selected', on ? 'true' : 'false'); });
				render();
			});
		});
		$$('[data-range]', dash).forEach(function (b) {
			b.addEventListener('click', function () {
				curRange = parseInt(b.getAttribute('data-range'), 10);
				$$('[data-range]', dash).forEach(function (x) { x.classList.toggle('is-active', x === b); });
				render();
			});
		});
		if (plot) {
			plot.addEventListener('pointermove', function (ev) {
				if (!current) { return; }
				var r = plot.getBoundingClientRect();
				var x = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
				var i = Math.round(x * (current.n - 1));
				var v = current.s.after[i];
				var px = (i / (current.n - 1)) * W;
				var py = H - PAD - ((v - current.mn) / (current.mx - current.mn)) * (H - PAD * 2);
				cursor.setAttribute('x1', px); cursor.setAttribute('x2', px);
				cdot.setAttribute('cx', px); cdot.setAttribute('cy', py);
				var sum = current.s.after.reduce(function (a2, b2) { return a2 + b2; }, 0);
				var day = current.total * v / sum;
				tip.hidden = false;
				tip.style.left = (i / (current.n - 1) * 100) + '%';
				tip.style.top = (py / H * 100) + '%';
				tip.innerHTML = '';
				var bb = document.createElement('b'); bb.textContent = gbp(day);
				tip.appendChild(bb); tip.appendChild(document.createTextNode('Day ' + (i + 1) + ' of ' + current.n));
				plot.classList.add('is-hover');
			});
			plot.addEventListener('pointerleave', function () { plot.classList.remove('is-hover'); tip.hidden = true; });
		}
		var started2 = false;
		var go = function () { if (!started2) { started2 = true; render(); } };
		if ('IntersectionObserver' in window) {
			new IntersectionObserver(function (es, ob) { if (es[0].isIntersecting) { go(); ob.disconnect(); } }, { threshold: 0.25 }).observe(dash);
		} else { go(); }
	}
	}());

	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll);
	onScroll();
})();
