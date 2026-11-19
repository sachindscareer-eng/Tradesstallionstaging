<?php
/**
 * Template Name: TradeStallion Home (Custom)
 * Approved dark homepage design. Content: inc/home-data.php. Styles: assets/css/home.css.
 */
defined( 'ABSPATH' ) || exit;

$booking  = tsd_booking_url();
$whatsapp = tsd_whatsapp_url();
$audit_state = isset( $_GET['tsd_audit'] ) ? sanitize_key( wp_unslash( $_GET['tsd_audit'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
$news_state  = isset( $_GET['tsd_news'] ) ? sanitize_key( wp_unslash( $_GET['tsd_news'] ) ) : '';   // phpcs:ignore WordPress.Security.NonceVerification
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="ts-skip" href="#main">Skip to content</a>

<div class="ts">

<!-- ================= NAV ================= -->
<header class="ts-header" id="ts-header">
	<div class="ts-wrap ts-header__in">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="ts-logo" aria-label="TradeStallion home">
			<span>TRADE</span><span>STALLION</span><span class="ts-logo__bar"></span>
		</a>
		<button class="ts-burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="ts-menu"><span></span><span></span><span></span></button>
		<div class="ts-menu" id="ts-menu">
			<nav aria-label="Main" class="ts-nav">
				<a href="#top" class="is-active">Home</a>
				<a href="#who">Who We Help</a>
				<a href="#services">Services</a>
				<a href="#faq">FAQ</a>
			</nav>
			<div class="ts-header__cta">
				<a href="<?php echo esc_url( $whatsapp ); ?>" class="ts-btn-pill ts-btn-pill--ghost"><?php echo tsd_icon( 'whatsapp', 16, 'currentColor', 2 ); // phpcs:ignore ?> WhatsApp</a>
				<a href="<?php echo esc_url( $booking ); ?>" class="ts-btn-pill ts-btn-pill--solid">Free Audit</a>
			</div>
		</div>
	</div>
</header>

<main id="main">

<!-- ================= HERO ================= -->
<section id="top" class="ts-hero">
	<div aria-hidden="true" class="ts-glow ts-glow--hero"></div>
	<div class="ts-wrap ts-hero__in">
		<div class="ts-hero__copy">
			<div class="ts-badge"><span class="ts-badge__dot"></span>Marketplace Growth Partner</div>
			<h1 class="ts-h1">Turn Marketplace Chaos Into <span class="ts-accent">Growth.</span></h1>
			<p class="ts-hero__lead">UK marketplace management for Amazon, eBay, Etsy, Shopify, TikTok Shop and bol.com sellers. We manage the listings, ads, account health and operations that drain your time — so you can focus on your products while we focus on growth.</p>
			<div class="ts-row">
				<a href="<?php echo esc_url( $booking ); ?>" class="ts-btn ts-btn--primary ts-btn--glow">Book My Free Account Audit <?php echo tsd_icon( 'arrow' ); // phpcs:ignore ?></a>
				<a href="#services" class="ts-btn ts-btn--ghost">Explore Services</a>
			</div>
			<div class="ts-stats">
				<div class="ts-stat"><div class="ts-stat__num">12+</div><div class="ts-stat__label">Years selling experience</div></div>
				<div class="ts-stat"><div class="ts-stat__num">6</div><div class="ts-stat__label">Marketplaces, one team</div></div>
				<div class="ts-stat"><div class="ts-stat__num ts-accent">Free</div><div class="ts-stat__label">No-obligation audit</div></div>
			</div>
		</div>

		<div class="ts-hero__art">
			<div class="ts-hero__frame">
				<?php tsd_picture( 'hero', 'Marketplace specialist managing seller accounts on a laptop', 'width="864" height="1080" fetchpriority="high" decoding="async" class="ts-hero__img"' ); ?>
			</div>
			<div class="ts-float ts-float--bl">
				<span class="ts-float__icon"><?php echo tsd_icon( 'check', 20, 'currentColor', 2 ); // phpcs:ignore ?></span>
				<div><div class="ts-float__title">Free account audit</div><div class="ts-float__sub">No cost, no obligation</div></div>
			</div>
			<div class="ts-float ts-float--tr">
				<div class="ts-float__sub">London-based team</div>
				<div class="ts-float__title">6 marketplaces · 1 point of contact</div>
			</div>
		</div>
	</div>
</section>

<!-- ================= MARKETPLACE STRIP ================= -->
<section class="ts-strip">
	<div class="ts-wrap ts-center">
		<div class="ts-eyebrow">Marketplace expertise</div>
		<h2 class="ts-h2 ts-h2--sm">Built for Sellers Who Want to Grow</h2>
		<p class="ts-muted ts-strip__lead">We provide marketplace management for sellers across the channels where modern ecommerce happens.</p>
		<div class="ts-logos">
			<?php foreach ( tsd_marketplace_names() as $m ) : ?>
				<div class="ts-logos__item"><?php echo esc_html( $m ); ?></div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<!-- ================= PROBLEM ================= -->
<section class="ts-section ts-section--alt">
	<div class="ts-wrap">
		<div class="ts-head ts-head--split">
			<div class="ts-head__title" style="max-width:620px">
				<div class="ts-eyebrow">The problem</div>
				<h2 class="ts-h2">What's Holding Your Marketplace Back?</h2>
			</div>
			<p class="ts-muted ts-head__aside" style="max-width:380px">Before you invest more time or ad budget, find the leaks in your marketplace management.</p>
		</div>
		<div class="ts-grid ts-grid--280">
			<?php foreach ( tsd_problems() as $i => $p ) : ?>
				<article class="ts-card ts-card--lg ts-reveal">
					<div class="ts-card__top">
						<span class="ts-iconbox"><?php echo tsd_icon( $p['icon'], 24, 'currentColor', 2 ); // phpcs:ignore ?></span>
						<span class="ts-bignum"><?php echo esc_html( sprintf( '%02d', $i + 1 ) ); ?></span>
					</div>
					<h3 class="ts-h3"><?php echo esc_html( $p['title'] ); ?></h3>
					<p class="ts-muted"><?php echo esc_html( $p['desc'] ); ?></p>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<!-- ================= WHO WE HELP ================= -->
<section id="who" class="ts-section">
	<div class="ts-wrap">
		<div class="ts-head ts-center">
			<div class="ts-eyebrow">Who we help</div>
			<h2 class="ts-h2">Is TradeStallion Right for You?</h2>
		</div>
		<div class="ts-grid ts-grid--340">
			<?php foreach ( tsd_audiences() as $a ) : ?>
				<article class="ts-card ts-card--xl ts-reveal">
					<div class="ts-for">FOR</div>
					<h3 class="ts-h3 ts-h3--lg"><?php echo esc_html( $a['title'] ); ?></h3>
					<ul class="ts-checks">
						<?php foreach ( $a['items'] as $item ) : ?>
							<li><?php echo tsd_icon( 'check', 20, '#FF6A13' ); // phpcs:ignore ?><?php echo esc_html( $item ); ?></li>
						<?php endforeach; ?>
					</ul>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<!-- ================= MARKETPLACES BENTO ================= -->
<section class="ts-section ts-section--alt">
	<div class="ts-wrap">
		<div class="ts-head" style="max-width:760px">
			<div class="ts-eyebrow">Marketplaces we manage</div>
			<h2 class="ts-h2 ts-h2--gap">Marketplace Management Across 6 Leading Marketplaces</h2>
			<p class="ts-muted">Every marketplace has its own rules, fees and algorithm. We run each channel the way it needs to be run, while keeping your brand, stock and pricing consistent across all of them.</p>
		</div>
		<div class="ts-bento">
			<div class="ts-bento__photo ts-reveal">
				<?php tsd_picture( 'marketplaces', 'Happy customer with shopping bags', 'width="576" height="720" loading="lazy" decoding="async"' ); ?>
				<div aria-hidden="true" class="ts-bento__shade"></div>
				<div class="ts-bento__cap">
					<div class="ts-bento__num">6</div>
					<div class="ts-bento__title">marketplaces, one team</div>
					<div class="ts-bento__sub">Brand, stock and pricing kept consistent everywhere you sell.</div>
				</div>
			</div>
			<div class="ts-bento__grid">
				<?php foreach ( tsd_marketplaces() as $m ) : ?>
					<article class="ts-card ts-card--md ts-reveal">
						<div class="ts-mk__head">
							<span class="ts-mk__letter<?php echo ! empty( $m['primary'] ) ? ' is-primary' : ''; ?>"><?php echo esc_html( $m['letter'] ); ?></span>
							<h3 class="ts-h3 ts-h3--sm"><?php echo esc_html( $m['title'] ); ?></h3>
						</div>
						<p class="ts-muted ts-small"><?php echo esc_html( $m['desc'] ); ?></p>
					</article>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
</section>

<!-- ================= SERVICES ================= -->
<section id="services" class="ts-section">
	<div class="ts-wrap">
		<div class="ts-head ts-head--split">
			<div style="max-width:640px">
				<div class="ts-eyebrow">Solutions</div>
				<h2 class="ts-h2">Marketplace Management Services That Move the Needle</h2>
			</div>
			<p class="ts-muted" style="max-width:360px">Start with one problem or hand us your full marketplace management.</p>
		</div>
		<div class="ts-grid ts-grid--250 ts-grid--tight">
			<?php foreach ( tsd_services() as $s ) : ?>
				<a href="<?php echo esc_url( tsd_page_url( $s['slug'] ) ); ?>" class="ts-service ts-reveal">
					<span class="ts-service__num"><?php echo esc_html( $s['num'] ); ?></span>
					<span class="ts-service__title"><?php echo esc_html( $s['title'] ); ?></span>
					<span class="ts-service__desc"><?php echo esc_html( $s['desc'] ); ?></span>
					<span class="ts-service__more">View service <?php echo tsd_icon( 'arrow', 16 ); // phpcs:ignore ?></span>
				</a>
			<?php endforeach; ?>
		</div>
		<div class="ts-row ts-row--center" style="margin-top:40px">
			<a href="<?php echo esc_url( $booking ); ?>" class="ts-btn ts-btn--outline">Not Sure What You Need? Get a Free Audit <?php echo tsd_icon( 'arrow' ); // phpcs:ignore ?></a>
		</div>
	</div>
</section>

<!-- ================= REVIEWS ================= -->
<section class="ts-section ts-section--alt">
	<div class="ts-wrap">
		<div class="ts-head ts-head--split">
			<div>
				<div class="ts-eyebrow">Proof</div>
				<h2 class="ts-h2 ts-h2--gap-sm">What Clients Say</h2>
				<p class="ts-muted">Real feedback from marketplace projects delivered by TradeStallion.</p>
			</div>
			<div class="ts-rating">
				<div class="ts-rating__num">4.9</div>
				<div><div class="ts-stars" aria-label="5 out of 5 stars">★★★★★</div><div class="ts-rating__sub">Average across 10 client projects</div></div>
			</div>
		</div>
		<div class="ts-grid ts-grid--320 ts-grid--tight">
			<?php foreach ( tsd_reviews() as $r ) : ?>
				<article class="ts-review ts-reveal">
					<div class="ts-review__top"><span class="ts-stars" aria-label="5 out of 5 stars">★★★★★</span><span class="ts-review__score"><?php echo esc_html( $r['score'] ); ?></span></div>
					<p class="ts-review__quote">“<?php echo esc_html( $r['quote'] ); ?>”</p>
					<div class="ts-review__meta">
						<div class="ts-review__title"><?php echo esc_html( $r['title'] ); ?></div>
						<div class="ts-review__date"><?php echo esc_html( $r['date'] ); ?></div>
					</div>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<!-- ================= FREE AUDIT ================= -->
<section id="audit" class="ts-section">
	<div class="ts-wrap">
		<div class="ts-audit">
			<div aria-hidden="true" class="ts-glow ts-glow--audit"></div>
			<div class="ts-audit__copy">
				<div class="ts-eyebrow">Your next step</div>
				<h2 class="ts-h2 ts-h2--xl">Get a <span class="ts-accent">Free</span> Account Audit</h2>
				<p class="ts-muted" style="margin-bottom:30px">Let's find out what's holding your marketplace back. No cost, no obligation — just clear insights and practical recommendations for your business.</p>
				<div class="ts-grid ts-grid--220 ts-grid--xs">
					<?php foreach ( tsd_audit_benefits() as $b ) : ?>
						<div class="ts-benefit"><?php echo tsd_icon( 'check', 22, '#FF6A13' ); // phpcs:ignore ?><span><?php echo esc_html( $b ); ?></span></div>
					<?php endforeach; ?>
				</div>
			</div>

			<?php
			$shortcode = apply_filters( 'tsd_audit_form_shortcode', '' );
			if ( $shortcode ) :
				?>
				<div class="ts-form ts-form--plugin"><?php echo do_shortcode( $shortcode ); ?></div>
			<?php else : ?>
				<form class="ts-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
					<input type="hidden" name="action" value="tsd_audit">
					<?php wp_nonce_field( 'tsd_audit', 'tsd_nonce' ); ?>
					<div>
						<div class="ts-form__title">Tell us about your store</div>
						<div class="ts-form__sub">Submit your details and our team will review your request.</div>
					</div>
					<?php if ( '1' === $audit_state ) : ?>
						<div class="ts-notice ts-notice--ok" role="status">Thank you! Your audit request has been sent. Our team will be in touch shortly.</div>
					<?php elseif ( 'error' === $audit_state ) : ?>
						<div class="ts-notice ts-notice--err" role="alert">Please add your name and a valid email address.</div>
					<?php endif; ?>
					<label class="ts-field">Full name<input type="text" name="tsd_name" placeholder="Your name" autocomplete="name" required></label>
					<div class="ts-row ts-row--fields">
						<label class="ts-field">Email<input type="email" name="tsd_email" placeholder="you@company.com" autocomplete="email" required></label>
						<label class="ts-field">Phone<input type="tel" name="tsd_phone" placeholder="+44" autocomplete="tel"></label>
					</div>
					<label class="ts-field">Store or marketplace link<input type="url" name="tsd_store" placeholder="https://"></label>
					<label class="ts-field">What do you need help with?<textarea name="tsd_message" placeholder="Listings, PPC, account health…"></textarea></label>
					<label class="ts-hp" aria-hidden="true">Website<input type="text" name="tsd_company_website" tabindex="-1" autocomplete="off"></label>
					<button type="submit" class="ts-form__submit">Request My Free Audit</button>
					<div class="ts-form__note">No cost, no obligation — just clear insights for your business.</div>
				</form>
			<?php endif; ?>
		</div>
	</div>
</section>

<!-- ================= WHY US ================= -->
<section class="ts-section ts-section--flush-top">
	<div class="ts-wrap">
		<div class="ts-head ts-center" style="max-width:720px;margin-left:auto;margin-right:auto">
			<div class="ts-eyebrow">Why TradeStallion</div>
			<h2 class="ts-h2 ts-h2--gap">Why Sellers Choose TradeStallion</h2>
			<p class="ts-muted">A London-based marketplace management team that works like an extension of your business, not a faceless agency.</p>
		</div>
		<div class="ts-why">
			<?php foreach ( tsd_why() as $i => $w ) : ?>
				<div class="ts-why__item">
					<div class="ts-why__n"><?php echo esc_html( sprintf( '%02d', $i + 1 ) ); ?></div>
					<h3 class="ts-h3 ts-h3--md"><?php echo esc_html( $w['title'] ); ?></h3>
					<p class="ts-muted ts-body15"><?php echo esc_html( $w['desc'] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<!-- ================= HOW IT WORKS ================= -->
<section class="ts-section ts-section--alt">
	<div class="ts-wrap">
		<div class="ts-head ts-center" style="margin-bottom:56px">
			<div class="ts-eyebrow">How it works</div>
			<h2 class="ts-h2">A Simple Path From Problem to Growth</h2>
		</div>
		<div class="ts-steps">
			<div aria-hidden="true" class="ts-steps__line"></div>
			<?php foreach ( tsd_steps() as $i => $st ) : ?>
				<div class="ts-step ts-reveal">
					<div class="ts-step__dot<?php echo 0 === $i ? ' is-first' : ''; ?>"><?php echo (int) ( $i + 1 ); ?></div>
					<h3 class="ts-h3 ts-h3--md"><?php echo esc_html( $st['title'] ); ?></h3>
					<p class="ts-muted ts-body15"><?php echo esc_html( $st['desc'] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<!-- ================= FAQ ================= -->
<section id="faq" class="ts-section">
	<div class="ts-wrap ts-faq">
		<div class="ts-faq__intro">
			<div class="ts-eyebrow">Questions</div>
			<h2 class="ts-h2 ts-h2--gap">Frequently Asked Questions</h2>
			<p class="ts-muted" style="margin-bottom:24px">Still have a question? Talk to the team directly.</p>
			<a href="<?php echo esc_url( $whatsapp ); ?>" class="ts-btn-sm">Chat on WhatsApp</a>
		</div>
		<div class="ts-faq__list">
			<?php foreach ( tsd_faqs() as $i => $f ) : ?>
				<details class="ts-qa"<?php echo 0 === $i ? ' open' : ''; ?>>
					<summary><?php echo esc_html( $f['q'] ); ?><span aria-hidden="true" class="ts-qa__plus">+</span></summary>
					<p><?php echo esc_html( $f['a'] ); ?></p>
				</details>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<!-- ================= FINAL CTA ================= -->
<section class="ts-section ts-section--flush-top">
	<div class="ts-wrap">
		<div class="ts-cta">
			<div class="ts-cta__eyebrow">Ready when you are</div>
			<h2 class="ts-cta__title">Ready to See If We're the Right Fit?</h2>
			<p class="ts-cta__lead">Book a free account audit and discover how TradeStallion's marketplace management can help you save costs, avoid risks and grow sales with confidence.</p>
			<div class="ts-row ts-row--center ts-row--12">
				<a href="<?php echo esc_url( $booking ); ?>" class="ts-btn ts-btn--dark">Book My Free Account Audit <?php echo tsd_icon( 'arrow' ); // phpcs:ignore ?></a>
				<a href="<?php echo esc_url( $whatsapp ); ?>" class="ts-btn ts-btn--darkline">Chat on WhatsApp</a>
			</div>
			<div class="ts-cta__note">No cost, no obligation — just clear insights for your business.</div>
		</div>
	</div>
</section>

</main>

<!-- ================= FOOTER ================= -->
<footer class="ts-footer" id="footer">
	<div class="ts-wrap">
		<div class="ts-footer__cols">
			<div class="ts-footer__brand">
				<div class="ts-footer__logo">TRADE<br>STALLION</div>
				<div class="ts-footer__bar"></div>
				<p class="ts-muted ts-small">Helping Amazon, eBay, Etsy, Shopify, TikTok Shop and bol.com sellers grow with tailored strategies that boost sales and simplify marketplace management.</p>
			</div>
			<nav aria-label="Footer" class="ts-footer__col ts-footer__col--links">
				<div class="ts-footer__h">Quick Links</div>
				<a href="#top">Home</a>
				<a href="#who">Who We Help</a>
				<a href="#services">Services</a>
				<a href="#faq">FAQ</a>
			</nav>
			<div class="ts-footer__col ts-footer__col--contact">
				<div class="ts-footer__h">Contact</div>
				<a href="tel:08445884252">0844 588 4252</a>
				<a href="mailto:connect@tradestallion.com">connect@tradestallion.com</a>
				<span>128 City Road, London, EC1V 2NX, United Kingdom</span>
			</div>
			<form class="ts-footer__news" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="tsd_news">
				<?php wp_nonce_field( 'tsd_news', 'tsd_nonce' ); ?>
				<div class="ts-footer__h ts-footer__h--flat">Subscribe to our newsletter</div>
				<div class="ts-footer__sub"><?php echo '1' === $news_state ? 'Thanks for subscribing!' : 'Exclusive updates for marketplace sellers.'; ?></div>
				<div class="ts-news">
					<label class="screen-reader-text" for="tsd-news-email">Email address</label>
					<input id="tsd-news-email" type="email" name="tsd_email" placeholder="Email address" required>
					<input type="text" name="tsd_company_website" class="ts-hp" tabindex="-1" autocomplete="off" aria-hidden="true">
					<button type="submit" aria-label="Subscribe"><?php echo tsd_icon( 'arrow' ); // phpcs:ignore ?></button>
				</div>
			</form>
		</div>
		<div class="ts-footer__bottom">
			<span>TradeStallion. All Rights Reserved © <?php echo esc_html( gmdate( 'Y' ) ); ?></span>
			<span>
				<?php
				$legal = array();
				if ( get_privacy_policy_url() ) {
					$legal[] = '<a href="' . esc_url( get_privacy_policy_url() ) . '">Privacy Policy</a>';
				}
				if ( get_page_by_path( 'terms-and-conditions' ) ) {
					$legal[] = '<a href="' . esc_url( tsd_page_url( 'terms-and-conditions' ) ) . '">Terms &amp; Conditions</a>';
				}
				if ( get_page_by_path( 'cookie-policy' ) ) {
					$legal[] = '<a href="' . esc_url( tsd_page_url( 'cookie-policy' ) ) . '">Cookie Policy</a>';
				}
				echo implode( '  ·  ', $legal ); // phpcs:ignore -- escaped above.
				?>
			</span>
		</div>
	</div>
</footer>

</div>

<?php
// FAQPage structured data (same questions as shown on the page).
$faq_schema = array(
	'@context'   => 'https://schema.org',
	'@type'      => 'FAQPage',
	'mainEntity' => array_map(
		function ( $f ) {
			return array(
				'@type'          => 'Question',
				'name'           => $f['q'],
				'acceptedAnswer' => array( '@type' => 'Answer', 'text' => $f['a'] ),
			);
		},
		tsd_faqs()
	),
);
echo '<script type="application/ld+json">' . wp_json_encode( $faq_schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "\n";

wp_footer();
?>
</body>
</html>
