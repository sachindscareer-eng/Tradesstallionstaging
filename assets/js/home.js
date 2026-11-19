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
	var updateSteps = function () {};
	if (stepsBox && fill) {
		var setSteps = function (p, cur) {
			fill.style.setProperty('--sp', p.toFixed(4));
			stepEls.forEach(function (st, i) {
				var at = i / Math.max(1, stepEls.length - 1);
				st.classList.toggle('is-lit', p >= at - 0.001);
				st.classList.toggle('is-current', i === cur);
			});
		};
		if (reduce) { setSteps(1, -1); } else {
			setSteps(0, 0);
			var CYCLE = 11000, FILL = 8000, stepsOn = false, t0s = 0, stepsRaf = 0;
			var ease = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
			var loop = function (t) {
				if (!stepsOn) { return; }
				if (!t0s) { t0s = t; }
				var e = (t - t0s) % CYCLE;
				var n = stepEls.length - 1;
				var p, cur;
				if (e < FILL) {
					var seg = FILL / n, k = Math.floor(e / seg), local = (e - k * seg) / seg;
					/* pause on each dot, then glide to the next one */
					var move = Math.max(0, (local - 0.35) / 0.65);
					p = (k + ease(move)) / n;
					cur = move > 0.9 ? k + 1 : k;
				} else { p = 1; cur = n; }
				if (e > CYCLE - 500) { fill.style.opacity = String((CYCLE - e) / 500); } else { fill.style.opacity = '1'; }
				setSteps(Math.min(1, p), cur);
				stepsRaf = raf(loop);
			};
			if ('IntersectionObserver' in window) {
				new IntersectionObserver(function (es) {
					var vis = es[0].isIntersecting;
					if (vis && !stepsOn) { stepsOn = true; t0s = 0; stepsRaf = raf(loop); }
					if (!vis) { stepsOn = false; }
				}, { threshold: 0.35 }).observe(stepsBox);
			} else { stepsOn = true; stepsRaf = raf(loop); }
		}
	}

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

		/* ----- Workspace views (listings, ads, health, reports) ----- */
		var curView = 'overview';
		var crumb = $('[data-dash-crumb]', dash);
		var mk = function (tag, cls, txt) { var e = document.createElement(tag); if (cls) { e.className = cls; } if (txt !== undefined && txt !== null) { e.textContent = txt; } return e; };
		var stagger = function (list) { list.forEach(function (n, i) { setTimeout(function () { n.classList.add('is-in'); }, 60 + i * 90); }); };
		var statRow = function (items) {
			var row = mk('div', 'ts-vstats');
			items.forEach(function (it) {
				var c = mk('div', 'ts-vstat'); c.appendChild(mk('small', '', it[0]));
				var st = mk('strong', '', it[2](0)); c.appendChild(st);
				if (it[3]) { c.appendChild(mk('em', it[4] || '', it[3])); }
				row.appendChild(c);
				setTimeout(function () { animNum(st, it[1], it[2]); }, 50);
			});
			return row;
		};
		var pct1 = function (v) { return v.toFixed(1) + '%'; };
		var VIEWS = {
			listings: function (panel, m, rnd, f) {
				var total = Math.round(40 + rnd() * 120), opt = Math.round(total * (0.62 + rnd() * 0.25));
				panel.appendChild(statRow([['Listings live', total, int], ['Optimised by us', opt, int, Math.round(opt / total * 100) + '% of catalogue', 'is-good'], ['Avg listing score', 70 + Math.round(rnd() * 22), function (v) { return Math.round(v) + '/100'; }, '▲ from ' + (42 + Math.round(rnd() * 12)), 'is-good']]));
				var card = mk('div', 'ts-dash__card ts-vcard');
				var head = mk('div', 'ts-dash__card-head'); head.appendChild(mk('strong', '', 'Listing quality')); 
				var chips = mk('div', 'ts-vchips'); ['All', 'Optimised', 'In progress'].forEach(function (c, i) { var b = mk('button', i ? '' : 'is-active', c); b.type = 'button'; b.setAttribute('data-filter', c); chips.appendChild(b); });
				head.appendChild(chips); card.appendChild(head);
				var ul = mk('ul', 'ts-vlist');
				m.products.concat([['Bundle pack', 0], ['Gift edition', 0]]).forEach(function (p, i) {
					var before = 38 + Math.round(rnd() * 20), after = i < 4 ? 84 + Math.round(rnd() * 14) : before + 18 + Math.round(rnd() * 10);
					var done = i < 4;
					var li = mk('li', 'ts-vrow'); li.setAttribute('data-state', done ? 'Optimised' : 'In progress');
					var top = mk('button', 'ts-vrow__top'); top.type = 'button';
					top.appendChild(mk('span', 'ts-vrow__name', p[0]));
					var bar = mk('span', 'ts-vbar'); var fill = mk('i'); bar.appendChild(fill); top.appendChild(bar);
					top.appendChild(mk('span', 'ts-vrow__score', before + ' → ' + after));
					top.appendChild(mk('span', 'ts-vchip ' + (done ? 'is-ok' : 'is-wip'), done ? 'Optimised' : 'In progress'));
					li.appendChild(top);
					var det = mk('div', 'ts-vrow__det');
					var b1 = mk('div'); b1.appendChild(mk('small', '', 'Before')); b1.appendChild(mk('p', '', p[0] + ' – new'));
					var b2 = mk('div', 'is-after'); b2.appendChild(mk('small', '', 'After')); b2.appendChild(mk('p', '', p[0] + ' | Premium Quality, UK Stock, Fast Dispatch – Ideal Gift'));
					det.appendChild(b1); det.appendChild(b2); li.appendChild(det);
					top.addEventListener('click', function () { li.classList.toggle('is-open'); });
					ul.appendChild(li);
					setTimeout(function () { fill.style.width = after + '%'; }, 200 + i * 90);
				});
				card.appendChild(ul); card.appendChild(mk('p', 'ts-vhint', 'Tip: click a product to see a sample title rewrite.'));
				panel.appendChild(card);
				chips.addEventListener('click', function (e) {
					var b = e.target.closest('button'); if (!b) { return; }
					$$('button', chips).forEach(function (x) { x.classList.toggle('is-active', x === b); });
					var fv = b.getAttribute('data-filter');
					$$('.ts-vrow', ul).forEach(function (r) { r.hidden = !(fv === 'All' || r.getAttribute('data-state') === fv); });
				});
				stagger($$('.ts-vrow', ul));
			},
			ads: function (panel, m, rnd, f) {
				var camps = [['Sponsored Products – Auto', 0.34], ['Sponsored Products – Exact', 0.28], ['Brand defence', 0.14], ['Competitor targeting', 0.12], ['Retargeting', 0.12]];
				var spendTotal = m.rev * f * (m.acos[1] / 100) * 0.55;
				var stats = statRow([['Ad spend', spendTotal, gbp], ['Ad sales', spendTotal / (m.acos[1] / 100), gbp], ['ACoS', m.acos[1], pct1, '▼ was ' + m.acos[0] + '%', 'is-good']]);
				panel.appendChild(stats);
				var card = mk('div', 'ts-dash__card ts-vcard');
				var h = mk('div', 'ts-dash__card-head'); h.appendChild(mk('strong', '', 'Weekly spend vs ad sales')); var lg = mk('div', 'ts-vlegend'); lg.appendChild(mk('span', 'is-a', 'Spend')); lg.appendChild(mk('span', 'is-b', 'Ad sales')); h.appendChild(lg); card.appendChild(h);
				var chart = mk('div', 'ts-vbars'); var tip = mk('div', 'ts-vbars__tip'); tip.hidden = true;
				var weeks = curRange === 7 ? 7 : (curRange === 30 ? 8 : 12);
				for (var w = 0; w < weeks; w++) {
					var sp = 0.5 + rnd() * 0.3 - w * 0.012, sa = sp * (2.4 + w * 0.22 + rnd() * 0.5);
					var g = mk('div', 'ts-vbars__g');
					var a = mk('i', 'is-a'), bb = mk('i', 'is-b');
					g.appendChild(a); g.appendChild(bb); g.appendChild(mk('span', '', (curRange === 7 ? 'D' : 'W') + (w + 1)));
					(function (g2, a2, b2, spv, sav, wi) {
						setTimeout(function () { a2.style.height = (spv / 3) * 100 + '%'; b2.style.height = Math.min(100, (sav / 3) * 100) + '%'; }, 120 + wi * 60);
						g2.addEventListener('pointerenter', function () { tip.hidden = false; tip.textContent = ''; tip.appendChild(mk('b', '', (curRange === 7 ? 'Day ' : 'Week ') + (wi + 1))); tip.appendChild(mk('span', '', 'ROAS ' + (sav / spv).toFixed(1) + 'x')); tip.style.left = ((wi + 0.5) / weeks * 100) + '%'; });
					}(g, a, bb, sp, sa, w));
					chart.appendChild(g);
				}
				chart.addEventListener('pointerleave', function () { tip.hidden = true; });
				chart.appendChild(tip); card.appendChild(chart); panel.appendChild(card);
				var c2 = mk('div', 'ts-dash__card ts-vcard');
				var h2 = mk('div', 'ts-dash__card-head'); h2.appendChild(mk('strong', '', 'Campaigns')); var live = mk('span', '', ''); h2.appendChild(live); c2.appendChild(h2);
				var ul = mk('ul', 'ts-vcamps');
				var upd = function () { var on = $$('.ts-vswitch.is-on', ul).length; live.textContent = on + ' of ' + camps.length + ' live · try the switches'; };
				camps.forEach(function (c, i) {
					var li = mk('li', 'ts-vcamp');
					var sw = mk('button', 'ts-vswitch' + (i < 4 ? ' is-on' : '')); sw.type = 'button'; sw.setAttribute('aria-label', 'Toggle ' + c[0]); sw.setAttribute('aria-pressed', i < 4 ? 'true' : 'false'); sw.appendChild(mk('i'));
					li.appendChild(sw);
					var t = mk('div', 'ts-vcamp__t'); t.appendChild(mk('b', '', c[0])); t.appendChild(mk('small', '', gbp(spendTotal * c[1]) + ' spend · ACoS ' + (m.acos[1] + Math.round((rnd() - 0.5) * 8)) + '%')); li.appendChild(t);
					var share = mk('span', 'ts-vbar ts-vbar--sm'); var fi = mk('i'); share.appendChild(fi); li.appendChild(share);
					setTimeout(function () { fi.style.width = (c[1] / 0.34 * 100) + '%'; }, 200 + i * 80);
					sw.addEventListener('click', function () { var on = sw.classList.toggle('is-on'); sw.setAttribute('aria-pressed', on ? 'true' : 'false'); li.classList.toggle('is-off', !on); upd(); });
					if (i >= 4) { li.classList.add('is-off'); }
					ul.appendChild(li);
				});
				upd(); c2.appendChild(ul); panel.appendChild(c2);
				stagger($$('.ts-vcamp', ul));
			},
			health: function (panel, m, rnd) {
				var wrap = mk('div', 'ts-vhealth');
				var g = mk('div', 'ts-vgauge');
				g.innerHTML = '<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="50" class="ts-vgauge__bg"></circle><circle cx="60" cy="60" r="50" class="ts-vgauge__fg" pathLength="100"></circle></svg>';
				var score = m.health - Math.round(rnd() * 2);
				var num = mk('strong', '', '0'); var lab = mk('div', 'ts-vgauge__lab'); lab.appendChild(num); lab.appendChild(mk('small', '', 'Health score'));
				g.appendChild(lab); wrap.appendChild(g);
				setTimeout(function () { $('.ts-vgauge__fg', g).style.strokeDashoffset = String(100 - score); animNum(num, score, function (v) { return String(Math.round(v)); }); }, 120);
				var mets = mk('ul', 'ts-vmetrics');
				[['Order defect rate', 0.1 + rnd() * 0.4, 1, '<'], ['Late dispatch rate', 0.4 + rnd() * 1.2, 4, '<'], ['Pre-fulfilment cancellations', 0.1 + rnd() * 0.6, 2.5, '<'], ['Valid tracking rate', 97 + rnd() * 2.8, 95, '>']].forEach(function (x, i) {
					var li = mk('li', 'ts-vmetric');
					var t = mk('div', 'ts-vmetric__t'); t.appendChild(mk('span', '', x[0])); t.appendChild(mk('b', '', x[1].toFixed(1) + '%')); li.appendChild(t);
					var bar = mk('span', 'ts-vbar ts-vbar--ok'); var fi = mk('i'); bar.appendChild(fi); li.appendChild(bar);
					li.appendChild(mk('small', '', 'Target ' + x[3] + ' ' + x[2] + '% · ✓ within target'));
					var w = x[3] === '<' ? Math.max(6, 100 - (x[1] / x[2]) * 100) : x[1];
					setTimeout(function () { fi.style.width = w + '%'; }, 250 + i * 120);
					mets.appendChild(li);
				});
				wrap.appendChild(mets); panel.appendChild(wrap);
				var card = mk('div', 'ts-dash__card ts-vcard');
				var h = mk('div', 'ts-dash__card-head'); h.appendChild(mk('strong', '', 'Issues we handled')); h.appendChild(mk('span', '', 'All resolved')); card.appendChild(h);
				var tl = mk('ul', 'ts-vtimeline');
				[['Listing policy warning', 'Reviewed, fixed and appealed within 48h'], ['Suppressed listing', 'Missing attributes added, listing back live'], ['Stranded inventory', 'Listings relinked to stock'], ['Negative feedback', 'Customer contacted and resolved']].forEach(function (x) { var li = mk('li'); li.appendChild(mk('b', '', x[0])); li.appendChild(mk('small', '', x[1])); tl.appendChild(li); });
				card.appendChild(tl); panel.appendChild(card);
				stagger($$('li', tl).concat($$('.ts-vmetric', mets)));
			},
			reports: function (panel, m, rnd, f) {
				var intro = mk('p', 'ts-vhint', 'Every week you get a short report like this. Click a week to open it.');
				panel.appendChild(intro);
				var list = mk('div', 'ts-vreports');
				for (var w = 0; w < 4; w++) {
					var rev = m.rev / 4.3 * (1 + m.lift * (1 - w * 0.18)) * (0.92 + rnd() * 0.16), ch = Math.round((m.lift * 100) / 3 * (1 - w * 0.2) + rnd() * 4);
					var item = mk('div', 'ts-vreport' + (w === 0 ? ' is-open' : ''));
					var top = mk('button', 'ts-vreport__top'); top.type = 'button';
					var ttl = mk('div'); ttl.appendChild(mk('b', '', w === 0 ? 'This week' : w + (w === 1 ? ' week ago' : ' weeks ago'))); ttl.appendChild(mk('small', '', m.name + ' · weekly summary')); top.appendChild(ttl);
					top.appendChild(mk('span', 'ts-vreport__rev', gbp(rev)));
					top.appendChild(mk('span', 'ts-vchip is-ok', '▲ ' + ch + '%'));
					top.appendChild(mk('span', 'ts-vreport__chev', '⌄'));
					item.appendChild(top);
					var body = mk('div', 'ts-vreport__body');
					var ul = mk('ul');
					m.actions.slice(w % 2, (w % 2) + 3).forEach(function (a) { ul.appendChild(mk('li', '', a[0])); });
					body.appendChild(mk('small', '', 'What we did'));
					body.appendChild(ul);
					var nx = mk('p', 'ts-vreport__next'); nx.appendChild(mk('b', '', 'Next week: ')); nx.appendChild(document.createTextNode(['Scale best-performing keywords', 'Refresh main images on two products', 'Test a new coupon on slow sellers', 'Expand into a new category'][w])); body.appendChild(nx);
					item.appendChild(body);
					(function (it) { top.addEventListener('click', function () { it.classList.toggle('is-open'); }); }(item));
					list.appendChild(item);
				}
				panel.appendChild(list);
				stagger($$('.ts-vreport', list));
			}
		};
		var renderView = function () {
			var panel = $('[data-view-panel="' + curView + '"]', dash);
			if (!panel || curView === 'overview') { return; }
			panel.innerHTML = '';
			VIEWS[curView](panel, MP[curMp], seed(curMp + curView + curRange), RANGE[curRange]);
		};
		var renderOverview = render;
		render = function () { renderOverview(); renderView(); };
		var VIEW_NAMES = { overview: 'Overview', listings: 'Listings', ads: 'Advertising', health: 'Account health', reports: 'Weekly reports' };
		$$('[data-view]', dash).forEach(function (b) {
			b.addEventListener('click', function () {
				curView = b.getAttribute('data-view');
				$$('[data-view]', dash).forEach(function (x) { var on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-selected', on ? 'true' : 'false'); });
				$$('[data-view-panel]', dash).forEach(function (pn) { var on = pn.getAttribute('data-view-panel') === curView; pn.hidden = !on; pn.classList.toggle('is-active', on); });
				if (crumb) { crumb.textContent = VIEW_NAMES[curView]; }
				if (curView === 'overview') { renderOverview(); } else { renderView(); }
			});
		});

		/* ----- Auto demo: plays like a video, hands over control on interaction ----- */
		var demo = { on: !reduce, timer: 0, sweep: 0, idle: 0, i: 0, visible: false };
		var badge = mk('button', 'ts-dash__auto'); badge.type = 'button';
		var bDot = mk('i', 'ts-dash__auto-ic'); var bTxt = mk('span', '', 'Playing demo'); var bBar = mk('b'); bBar.appendChild(mk('em'));
		badge.setAttribute('aria-label', 'Pause demo');
		badge.appendChild(bDot); badge.appendChild(bTxt); badge.appendChild(bBar);
		var topBar = $('.ts-dash__top', dash); if (topBar) { topBar.appendChild(badge); }
		var mpKeys = ['amazon', 'ebay', 'etsy', 'shopify'];
		var STEPS = [];
		mpKeys.forEach(function (k, mi) {
			STEPS.push({ mp: k, view: 'overview', range: [30, 90, 7, 30][mi], ms: 6500, sweep: true });
			STEPS.push({ view: ['listings', 'ads', 'health', 'reports'][mi], ms: 6000, extra: ['row', 'switch', null, 'report'][mi] });
		});
		var clickEl = function (el) { if (el) { el.click(); } };
		var stopSweep = function () { if (demo.sweep) { clearInterval(demo.sweep); demo.sweep = 0; } if (plot) { plot.classList.remove('is-hover'); } if (tip) { tip.hidden = true; } };
		var runSweep = function () {
			if (!plot) { return; }
			var t = 0; stopSweep();
			demo.sweep = setInterval(function () {
				var r = plot.getBoundingClientRect(); if (!r.width) { return; }
				t += 0.012; var x = r.left + r.width * (0.04 + 0.92 * Math.min(1, t));
				plot.dispatchEvent(new PointerEvent('pointermove', { clientX: x, clientY: r.top + r.height / 2, bubbles: true }));
				if (t >= 1) { stopSweep(); }
			}, 50);
		};
		var setBar = function (ms) {
			var em = $('em', bBar); em.style.transition = 'none'; em.style.width = '0%';
			void em.offsetWidth; em.style.transition = 'width ' + ms + 'ms linear'; em.style.width = '100%';
		};
		var play = function () {
			clearTimeout(demo.timer);
			if (!demo.on || !demo.visible) { return; }
			var st = STEPS[demo.i % STEPS.length]; demo.i++;
			if (st.mp) { clickEl($('[data-mp="' + st.mp + '"]', dash)); }
			if (st.range) { clickEl($('[data-range="' + st.range + '"]', dash)); }
			clickEl($('[data-view="' + st.view + '"]', dash));
			if (st.sweep) { setTimeout(runSweep, 1300); }
			if (st.extra === 'row') { setTimeout(function () { clickEl($('[data-view-panel="listings"] .ts-vrow__top', dash)); }, 1800); }
			if (st.extra === 'switch') { setTimeout(function () { clickEl($$('[data-view-panel="ads"] .ts-vswitch', dash)[4]); }, 2200); }
			if (st.extra === 'report') { setTimeout(function () { clickEl($$('[data-view-panel="reports"] .ts-vreport__top', dash)[1]); }, 2200); }
			setBar(st.ms);
			demo.timer = setTimeout(play, st.ms);
		};
		var setMode = function (on) {
			demo.on = on;
			badge.classList.toggle('is-paused', !on);
			bTxt.textContent = on ? 'Playing demo' : 'Play demo';
			badge.setAttribute('aria-label', on ? 'Pause demo' : 'Play demo');
			if (on) { play(); } else { clearTimeout(demo.timer); stopSweep(); var em = $('em', bBar); em.style.transition = 'none'; em.style.width = '0%'; }
		};
		/* Real visitor interaction pauses the tour; the play button starts it again. */
		dash.addEventListener('pointerdown', function (e) {
			if (!e.isTrusted || badge.contains(e.target)) { return; }
			if (demo.on) { setMode(false); }
		});
		dash.addEventListener('pointermove', function (e) { if (e.isTrusted && demo.on && plot && plot.contains(e.target)) { stopSweep(); } });
		badge.addEventListener('click', function () { setMode(!demo.on); });
		if (reduce) { setMode(false); }
		if ('IntersectionObserver' in window) {
			new IntersectionObserver(function (es) {
				demo.visible = es[0].isIntersecting;
				if (demo.visible && demo.on) { if (!demo.timer || demo.i === 0) { setTimeout(play, 1500); } else { play(); } }
				if (!demo.visible) { clearTimeout(demo.timer); stopSweep(); }
			}, { threshold: 0.4 }).observe(dash);
		}
		var started2 = false;
		var go = function () { if (!started2) { started2 = true; render(); } };
		if ('IntersectionObserver' in window) {
			new IntersectionObserver(function (es, ob) { if (es[0].isIntersecting) { go(); ob.disconnect(); } }, { threshold: 0.25 }).observe(dash);
		} else { go(); }
	}
	}());


	/* ---------- Promo reel: autoplay (muted by browser rules), sound on tap ---------- */
	(function () {
		var box = $('[data-reel]');
		if (!box) { return; }
		var v = $('video', box), btn = $('[data-reel-sound]', box), lab = $('[data-reel-label]', box);
		var userMuted = false, visible = false;
		var setSound = function (on) {
			v.muted = !on;
			if (on) { v.volume = 1; var pr = v.play(); if (pr && pr.catch) { pr.catch(function () {}); } }
			btn.classList.toggle('is-on', on);
			btn.setAttribute('aria-pressed', on ? 'true' : 'false');
			lab.textContent = on ? 'Sound on' : 'Tap for sound';
		};
		btn.addEventListener('click', function (e) { e.stopPropagation(); var on = v.muted; userMuted = !on; setSound(on); });
		box.addEventListener('click', function (e) { if (e.target === v) { var on2 = v.muted; userMuted = !on2; setSound(on2); } });
		/* Browsers only allow sound after the visitor interacts with the page. */
		var firstTouch = function () {
			if (!userMuted && visible && v.muted) { setSound(true); }
			['pointerdown', 'keydown'].forEach(function (t) { document.removeEventListener(t, firstTouch, true); });
		};
		['pointerdown', 'keydown'].forEach(function (t) { document.addEventListener(t, firstTouch, true); });
		if ('IntersectionObserver' in window) {
			new IntersectionObserver(function (es) {
				visible = es[0].isIntersecting;
				if (visible) { var pr = v.play(); if (pr && pr.catch) { pr.catch(function () {}); } } else { v.pause(); }
			}, { threshold: 0.35 }).observe(box);
		}
	}());

	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll);
	onScroll();
})();
