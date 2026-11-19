<?php
/**
 * Homepage content. Edit text here; the layout lives in templates/.
 * Every array is passed through a filter so it can also be changed from a theme.
 */
defined( 'ABSPATH' ) || exit;

function tsd_marketplace_names() {
	return apply_filters( 'tsd_marketplace_names', array( 'amazon', 'ebay', 'Etsy', 'shopify', 'TikTok Shop', 'bol.com' ) );
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
				'Want to expand into Amazon, eBay, Etsy, Shopify, TikTok Shop or bol.com',
				'Need catalogue, storefront and brand presentation support',
				'Want scalable operations with clear reporting',
			),
		),
	) );
}

function tsd_marketplaces() {
	return apply_filters( 'tsd_marketplaces', array(
		array( 'letter' => 'A', 'primary' => true, 'title' => 'Amazon Account Management', 'desc' => 'Full Amazon marketplace management: Seller Central operations, listing and keyword optimisation, Amazon PPC, A+ Content, storefronts and Brand Registry support, backed by more than 12 years of hands-on selling experience.' ),
		array( 'letter' => 'e', 'title' => 'eBay Account Management', 'desc' => 'eBay marketplace management covering store setup, listing creation, item specifics, advertising and account health monitoring, so your seller performance stays strong while sales grow.' ),
		array( 'letter' => 'E', 'title' => 'Etsy Shop Management', 'desc' => 'Etsy shop setup, listing titles and tags, product photography and day-to-day shop management for handmade, small-batch and growing product brands that want more visibility on Etsy search.' ),
		array( 'letter' => 'S', 'title' => 'Shopify Store Management', 'desc' => 'Shopify store management covering product uploads, collections, product pages and catalogue updates, so your own online store stays as strong as your marketplace listings.' ),
		array( 'letter' => 'T', 'title' => 'TikTok Shop Management', 'desc' => 'TikTok Shop setup, product listings, shop health and day-to-day operations, so you can turn TikTok traffic into orders without adding work for your team.' ),
		array( 'letter' => 'b', 'title' => 'bol.com Account Management', 'desc' => 'bol.com seller account setup, listings and performance monitoring for brands selling to shoppers in the Netherlands and Belgium.' ),
	) );
}

function tsd_services() {
	return apply_filters( 'tsd_services', array(
		array( 'num' => '01', 'title' => 'Account Setup', 'desc' => 'Build the marketplace foundation correctly.', 'slug' => 'account-setup-services' ),
		array( 'num' => '02', 'title' => 'Account Management', 'desc' => 'Keep your store healthy and moving.', 'slug' => 'account-management' ),
		array( 'num' => '03', 'title' => 'Ads Optimisation', 'desc' => 'Improve campaigns and reduce wasted spend.', 'slug' => 'ads-optimisation-services' ),
		array( 'num' => '04', 'title' => 'Global Selling', 'desc' => 'Expand into new marketplace regions.', 'slug' => 'global-selling-services' ),
		array( 'num' => '05', 'title' => 'Image & Graphic Design', 'desc' => 'Strengthen product presentation.', 'slug' => 'image-editing-graphic-designing' ),
		array( 'num' => '06', 'title' => 'Catalogue & Listings', 'desc' => 'Create and manage marketplace catalogues.', 'slug' => 'catalogue-management-new-listing-creation' ),
		array( 'num' => '07', 'title' => 'New Product Launch', 'desc' => 'Support launches and product opportunities.', 'slug' => 'new-product-launch-suggestions' ),
		array( 'num' => '08', 'title' => 'Brand Registry', 'desc' => 'Protect and strengthen your Amazon brand.', 'slug' => 'amazon-brand-registry' ),
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
		array( 'title' => 'UK-Based Team', 'desc' => 'We are based in London and understand how UK shoppers buy on Amazon.co.uk, eBay.co.uk, Etsy and TikTok Shop, and what UK sellers need from their marketplace accounts.' ),
		array( 'title' => '12+ Years Selling Experience', 'desc' => 'Our team has sold on marketplaces for over 12 years, so our recommendations come from hands-on experience rather than theory.' ),
		array( 'title' => 'One Team, Every Channel', 'desc' => 'Marketplace management for Amazon, eBay, Etsy, Shopify, TikTok Shop and bol.com through one point of contact, instead of juggling freelancers for listings, ads and account issues.' ),
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
		array( 'q' => 'Do you manage both Amazon and eBay?', 'a' => 'Yes. TradeStallion manages Amazon and eBay accounts, as well as Etsy, Shopify, TikTok Shop and bol.com, all through one team.' ),
		array( 'q' => 'How do you measure results?', 'a' => 'We track relevant commercial and account-health metrics and provide clear reporting.' ),
		array( 'q' => 'What does onboarding involve?', 'a' => 'We align on goals, tools, reporting and responsibilities before execution begins.' ),
		array( 'q' => 'How much does it cost?', 'a' => 'Our current standard retainer is £350 per month for accounts up to £5,000 in sales, with tiered commission beyond that.' ),
		array( 'q' => 'Which marketplaces do you manage?', 'a' => 'We provide marketplace management for six channels: Amazon, eBay, Etsy, Shopify, TikTok Shop and bol.com.' ),
		array( 'q' => 'Are you a UK marketplace management agency?', 'a' => 'Yes. TradeStallion is based in London and provides marketplace management for UK sellers and brands on Amazon, eBay, Etsy, Shopify, TikTok Shop and bol.com.' ),
	) );
}
