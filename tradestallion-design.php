<?php
/**
 * Plugin Name:       TradeStallion Design
 * Description:       Custom dark homepage template for TradeStallion (approved design). Adds the "TradeStallion Home (Custom)" page template. Theme-independent: works on top of Astra without touching its settings.
 * Version:           1.2.0
 * Requires at least: 6.2
 * Requires PHP:      7.4
 * Author:            TradeStallion
 * Text Domain:       tradestallion-design
 */

defined( 'ABSPATH' ) || exit;

define( 'TSD_VERSION', '1.2.0' );
define( 'TSD_DIR', plugin_dir_path( __FILE__ ) );
define( 'TSD_URL', plugin_dir_url( __FILE__ ) );
define( 'TSD_TEMPLATE', 'tradestallion-home.php' );

require_once TSD_DIR . 'inc/helpers.php';
require_once TSD_DIR . 'inc/home-data.php';
require_once TSD_DIR . 'inc/forms.php';
require_once TSD_DIR . 'inc/github-sync.php';

/**
 * Register the page template so it shows in Page Attributes → Template.
 */
add_filter( 'theme_page_templates', function ( $templates ) {
	$templates[ TSD_TEMPLATE ] = __( 'TradeStallion Home (Custom)', 'tradestallion-design' );
	return $templates;
} );

/**
 * Is the current request a page using our template?
 */
function tsd_is_custom_home() {
	if ( ! is_singular( 'page' ) ) {
		return false;
	}
	return get_page_template_slug( get_queried_object_id() ) === TSD_TEMPLATE;
}

/**
 * Load our template file instead of the theme's.
 * Priority 999 so Elementor / Astra cannot override it.
 */
add_filter( 'template_include', function ( $template ) {
	if ( tsd_is_custom_home() ) {
		$file = TSD_DIR . 'templates/' . TSD_TEMPLATE;
		if ( file_exists( $file ) ) {
			return $file;
		}
	}
	return $template;
}, 999 );

/**
 * Assets: only on the custom template. Theme / Elementor CSS that would fight
 * the design is dequeued on this page only.
 */
add_action( 'wp_enqueue_scripts', function () {
	if ( ! tsd_is_custom_home() ) {
		return;
	}

	wp_enqueue_style(
		'tsd-fonts',
		'https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&family=Inter:wght@400;500;600;700&display=swap',
		array(),
		null
	);
	wp_enqueue_style( 'tsd-home', TSD_URL . 'assets/css/home.css', array( 'tsd-fonts' ), TSD_VERSION );
	wp_enqueue_style( 'tsd-motion', TSD_URL . 'assets/css/motion.css', array( 'tsd-home' ), TSD_VERSION );
	wp_enqueue_script( 'tsd-home', TSD_URL . 'assets/js/home.js', array(), TSD_VERSION, array( 'strategy' => 'defer', 'in_footer' => true ) );

	// Styles from the theme/page builder are not needed on this page.
	foreach ( array( 'astra-theme-css', 'astra-google-fonts', 'elementor-frontend', 'elementor-post-114', 'wp-block-library', 'global-styles', 'classic-theme-styles' ) as $handle ) {
		wp_dequeue_style( $handle );
	}
}, 100 );

/**
 * Preconnect + preload the hero image (LCP) and fonts (prevents CLS).
 */
add_action( 'wp_head', function () {
	if ( ! tsd_is_custom_home() ) {
		return;
	}
	echo '<link rel="preconnect" href="https://fonts.googleapis.com">' . "\n";
	echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
	echo '<link rel="preload" as="image" href="' . esc_url( TSD_URL . 'assets/img/hero.webp' ) . '" type="image/webp" fetchpriority="high">' . "\n";
}, 1 );

/**
 * Body class + no admin-bar bump styling issues.
 */
add_filter( 'body_class', function ( $classes ) {
	if ( tsd_is_custom_home() ) {
		$classes[] = 'tsd-page';
	}
	return $classes;
} );
