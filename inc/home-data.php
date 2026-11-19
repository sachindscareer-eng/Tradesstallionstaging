<?php
/**
 * Homepage content. Edit text here; the layout lives in templates/.
 * Every array is passed through a filter so it can also be changed from a theme.
 */
defined( 'ABSPATH' ) || exit;

function tsd_marketplace_names() {
	return apply_filters( 'tsd_marketplace_names', array( 'Amazon', 'eBay', 'Etsy', 'Shopify' ) );
}

/**
 * Official marketplace logos from the site's own media library (attachment ID => fallback file).
 * Using attachment IDs keeps URLs correct on staging and live.
 */
function tsd_marketplace_logos() {
	$logos = array(
		'amazon'  => array( 'name' => 'Amazon', 'id' => 1330, 'file' => '2026/09/Amazon-logo.png' ),
		'ebay'    => array( 'name' => 'eBay', 'id' => 1331, 'file' => '2026/09/eBay-logo.png' ),
		'etsy'    => array( 'name' => 'Etsy', 'id' => 1332, 'file' => '2026/09/Etsy-logo.png' ),
		'shopify' => array( 'name' => 'Shopify', 'id' => 1333, 'file' => '2026/09/Shopify-logo.png' ),
	);
	foreach ( $logos as $key => $logo ) {
		$url = function_exists( 'wp_get_attachment_url' ) ? wp_get_attachment_url( $logo['id'] ) : '';
		if ( ! $url ) {
			$uploads = function_exists( 'wp_get_upload_dir' ) ? wp_get_upload_dir() : array( 'baseurl' => home_url( '/wp-content/uploads' ) );
			$url     = trailingslashit( $uploads['baseurl'] ) . $logo['file'];
		}
		$logos[ $key ]['url'] = $url;
	}
	return apply_filters( 'tsd_marketplace_logos', $logos );
}

/** Logo <img> for a marketplace key. */
function tsd_logo_img( $key, $class = '' ) {
	$logos = tsd_marketplace_logos();
	if ( empty( $logos[ $key ] ) ) {
		return '';
	}
	return sprintf( '<img src="%s" alt="%s logo" class="%s" loading="lazy" decoding="async">', esc_url( $logos[ $key ]['url'] ), esc_attr( $logos[ $key ]['name'] ), esc_attr( $class ) );
}

function tsd_problems() {
	return apply_filters( 'tsd_problems', array(
		array( 'icon' => 'trend', 'title' => 'Sales Have Stalled', 'desc' => 'Listings, keywords and conversion opportunities are not being fully leveraged.' ),
		array( 'icon' => 'pound', 'title' => 'Ad Spend Is Leaking', 'desc' => 'Weak targeting and campaign structure can quietly erode your margins.' ),
		array( 'icon' => 'alert', 'title' => 'Account Risk Is Growing', 'desc' => 'Compliance, account health and catalogue issues can become expensive distractions.' ),
	) );
}

function tsd_audiences() {
	return apply_filters( 'tsd_audiences', array(
		array(
			'title' => 'Growing Sellers & Small Businesses',
			'items' => array(
				'Need help with day-to-day marketplace management',
				'Want growth without another internal hire',
				'Need practical support with listings, PPC or account issues',
			),
		),
		array(
			'title' => 'Brands, Manufacturers & Wholesalers',
			'items' => array(
				'Want to expand into Amazon, eBay, Etsy or Shopify',
				'Need catalogue, storefront and brand presentation support',
				'Want scalable operations with clear reporting',
			),
		),
	) );
}

function tsd_marketplaces() {
	return apply_filters( 'tsd_marketplaces', array(
		array( 'letter' => 'A', 'primary' => true, 'key' => 'amazon', 'title' => 'Amazon Account Management', 'desc' => 'Full Amazon marketplace management: Seller Central operations, listing and keyword optimisation, Amazon PPC, A+ Content, storefronts and Brand Registry support, backed by more than 12 years of hands-on selling experience.' ),
		array( 'letter' => 'e', 'key' => 'ebay', 'title' => 'eBay Account Management', 'desc' => 'eBay marketplace management covering store setup, listing creation, item specifics, advertising and account health monitoring, so your seller performance stays strong while sales grow.' ),
		array( 'letter' => 'E', 'key' => 'etsy', 'title' => 'Etsy Shop Management', 'desc' => 'Etsy shop setup, listing titles and tags, product photography and day-to-day shop management for handmade, small-batch and growing product brands that want more visibility on Etsy search.' ),
		array( 'letter' => 'S', 'key' => 'shopify', 'title' => 'Shopify Store Management', 'desc' => 'Shopify store management covering product uploads, collections, product pages and catalogue updates, so your own online store stays as strong as your marketplace listings.' ),
	) );
}

function tsd_services() {
	return apply_filters( 'tsd_services', array(
		array( 'num' => '01', 'title' => 'Account Setup', 'desc' => 'Build the marketplace foundation correctly.', 'slug' => 'account-setup-services', 'icon' => 'setup' ),
		array( 'num' => '02', 'title' => 'Account Management', 'desc' => 'Keep your store healthy and moving.', 'slug' => 'account-management', 'icon' => 'manage' ),
		array( 'num' => '03', 'title' => 'Ads Optimisation', 'desc' => 'Improve campaigns and reduce wasted spend.', 'slug' => 'ads-optimisation-services', 'icon' => 'ads' ),
		array( 'num' => '04', 'title' => 'Global Selling', 'desc' => 'Expand into new marketplace regions.', 'slug' => 'global-selling-services', 'icon' => 'globe' ),
		array( 'num' => '05', 'title' => 'Image & Graphic Design', 'desc' => 'Strengthen product presentation.', 'slug' => 'image-editing-graphic-designing', 'icon' => 'image' ),
		array( 'num' => '06', 'title' => 'Catalogue & Listings', 'desc' => 'Create and manage marketplace catalogues.', 'slug' => 'catalogue-management-new-listing-creation', 'icon' => 'catalogue' ),
		array( 'num' => '07', 'title' => 'New Product Launch', 'desc' => 'Support launches and product opportunities.', 'slug' => 'new-product-launch-suggestions', 'icon' => 'launch' ),
		array( 'num' => '08', 'title' => 'Brand Registry', 'desc' => 'Protect and strengthen your Amazon brand.', 'slug' => 'amazon-brand-registry', 'icon' => 'shield' ),
	) );
}

function tsd_reviews() {
	return apply_filters( 'tsd_reviews', array(
		array( 'score' => '5.0', 'quote' => 'Excellent experience working on Amazon Seller Support and PPC. Highly professional, knowledgeable and great to work with!', 'title' => 'Amazon Seller Support + Amazon PPC', 'date' => 'Dec 15, 2025 – Jul 17, 2026' ),
		array( 'score' => '5.0', 'quote' => 'Trade Stallion and team were very efficient and worked hard to make sure the listing and storefront represented our brand appropriately', 'title' => 'Amazon Storefront Rebuild', 'date' => 'Jun 11, 2026 – Jul 10, 2026' ),
		array( 'score' => '5.0', 'quote' => "Trade Stallion's team was efficient and professional. I will definitely be using them again as projects arise.", 'title' => 'Amazon Storefront Enhancement & Product Addition Specialist', 'date' => 'Apr 22, 2026 – Jun 10, 2026' ),
		array( 'score' => '5.0', 'quote' => 'good experience working with Trade Stallion! very knowledgeable about amazon', 'title' => 'Second Amazon Seller Account Setup & Brand Registry Transfer', 'date' => 'Jul 3, 2026 – Aug 14, 2026' ),
		array( 'score' => '5.0', 'quote' => 'Excellent communication and delivery', 'title' => 'Amazon Private Label – Keywords, SEO and Search Terms', 'date' => 'Mar 25, 2026 – Apr 29, 2026' ),
		array( 'score' => '5.0', 'quote' => 'Great experience working with Trade Stallion.', 'title' => 'New Packaging Design', 'date' => 'Oct 7, 2025 – Dec 10, 2025' ),
	) );
}

function tsd_audit_benefits() {
	return apply_filters( 'tsd_audit_benefits', array(
		'Identify listing and conversion opportunities',
		'Spot wasted PPC spend and optimisation gaps',
		'Review account health and marketplace risks',
		'Get a practical next-step recommendation',
	) );
}

function tsd_why() {
	return apply_filters( 'tsd_why', array(
		array( 'title' => 'UK-Based Team', 'desc' => 'We are based in London and understand how UK shoppers buy on Amazon.co.uk, eBay.co.uk, Etsy and Shopify stores, and what UK sellers need from their marketplace accounts.' ),
		array( 'title' => '12+ Years Selling Experience', 'desc' => 'Our team has sold on marketplaces for over 12 years, so our recommendations come from hands-on experience rather than theory.' ),
		array( 'title' => 'One Team, Every Channel', 'desc' => 'Marketplace management for Amazon, eBay, Etsy and Shopify through one point of contact, instead of juggling freelancers for listings, ads and account issues.' ),
		array( 'title' => 'Flexible, Transparent Pricing', 'desc' => 'A simple monthly retainer with 30-day notice and no long-term contract, so you stay with us because it works.' ),
		array( 'title' => 'Clear Reporting', 'desc' => 'We track the commercial and account-health metrics that matter and report on them clearly, so you always know what is happening in your accounts.' ),
		array( 'title' => 'Free Audit First', 'desc' => 'Every engagement starts with a free, no-obligation account audit that shows where you are losing sales, wasting ad spend or taking on risk.' ),
	) );
}

function tsd_steps() {
	return apply_filters( 'tsd_steps', array(
		array( 'title' => 'Quick Call', 'desc' => 'We understand your store, challenges and goals.' ),
		array( 'title' => 'Free Account Audit', 'desc' => 'We identify opportunities, risks and wasted spend.' ),
		array( 'title' => 'Onboarding', 'desc' => 'We align goals, tools, reporting and support.' ),
		array( 'title' => 'Hands-On Growth', 'desc' => 'We handle day-to-day marketplace management and keep you informed.' ),
	) );
}

function tsd_faqs() {
	return apply_filters( 'tsd_faqs', array(
		array( 'q' => 'Do I need a long-term contract?', 'a' => 'No. We work on a flexible monthly retainer with a simple 30-day notice.' ),
		array( 'q' => 'Can you fix specific marketplace issues?', 'a' => 'Yes. You can start with focused support such as listings, PPC or account issues.' ),
		array( 'q' => 'Do you manage both Amazon and eBay?', 'a' => 'Yes. TradeStallion manages Amazon and eBay accounts, as well as Etsy and Shopify, all through one team.' ),
		array( 'q' => 'How do you measure results?', 'a' => 'We track relevant commercial and account-health metrics and provide clear reporting.' ),
		array( 'q' => 'What does onboarding involve?', 'a' => 'We align on goals, tools, reporting and responsibilities before execution begins.' ),
		array( 'q' => 'How much does it cost?', 'a' => 'Our current standard retainer is £350 per month for accounts up to £5,000 in sales, with tiered commission beyond that.' ),
		array( 'q' => 'Which marketplaces do you manage?', 'a' => 'We provide marketplace management for four channels: Amazon, eBay, Etsy and Shopify.' ),
		array( 'q' => 'Are you a UK marketplace management agency?', 'a' => 'Yes. TradeStallion is based in London and provides marketplace management for UK sellers and brands on Amazon, eBay, Etsy and Shopify.' ),
	) );
}

/**
 * Promo reel for the marketplaces card.
 * Uses the plugin copy (assets/video) if present, otherwise a Media Library
 * upload named "tradestallion-promo-reel".
 *
 * @return array|null { src, poster }
 */
function tsd_promo_video() {
	$file = 'assets/video/tradestallion-promo-reel.mp4';
	$out  = null;
	if ( file_exists( TSD_DIR . $file ) ) {
		$out = array(
			'src'    => TSD_URL . $file . '?ver=' . filemtime( TSD_DIR . $file ),
			'poster' => file_exists( TSD_DIR . 'assets/video/tradestallion-promo-poster.jpg' ) ? TSD_URL . 'assets/video/tradestallion-promo-poster.jpg' : '',
		);
	} else {
		$found = get_posts(
			array(
				'post_type'      => 'attachment',
				'post_status'    => 'inherit',
				'post_mime_type' => 'video',
				'name'           => 'tradestallion-promo-reel',
				'posts_per_page' => 1,
				'fields'         => 'ids',
			)
		);
		if ( $found ) {
			$out = array( 'src' => wp_get_attachment_url( $found[0] ), 'poster' => '' );
		}
	}
	return apply_filters( 'tsd_promo_video', $out );
}
