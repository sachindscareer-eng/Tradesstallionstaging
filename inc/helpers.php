<?php
defined( 'ABSPATH' ) || exit;

/** Booking + WhatsApp links (filterable). */
function tsd_booking_url() {
	return apply_filters( 'tsd_booking_url', 'https://ts.tradestallion.com/widget/booking/6SgCFwQeqUjLy5f0f3wg' );
}
function tsd_whatsapp_url() {
	return apply_filters( 'tsd_whatsapp_url', 'https://wa.me/+447458649153' );
}

/** URL of a page by slug on THIS site (so staging links stay on staging). */
function tsd_page_url( $slug ) {
	$page = get_page_by_path( $slug );
	return $page ? get_permalink( $page ) : home_url( '/' . trim( $slug, '/' ) . '/' );
}

/** Image helper: <picture> with webp + jpg fallback. */
function tsd_picture( $name, $alt, $attrs = '' ) {
	$base = TSD_URL . 'assets/img/' . $name;
	printf(
		'<picture><source srcset="%1$s" type="image/webp"><img src="%2$s" alt="%3$s" %4$s></picture>',
		esc_url( $base . '.webp' ),
		esc_url( $base . '.jpg' ),
		esc_attr( $alt ),
		$attrs // Static attributes from our own templates only.
	);
}

/** Inline stroke icons used by the design. */
function tsd_icon( $name, $size = 18, $stroke = 'currentColor', $width = 2.4 ) {
	$paths = array(
		'arrow'    => '<path d="M5 12h14M13 6l6 6-6 6"></path>',
		'check'    => '<path d="M20 6 9 17l-5-5"></path>',
		'whatsapp' => '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z"></path>',
		'trend'    => '<path d="M3 7l6 6 4-4 8 8"></path><path d="M21 11v6h-6"></path>',
		'pound'    => '<path d="M18 7c0-2-1.5-3-3.5-3S11 5.2 11 8v10"></path><path d="M7 12h8"></path><path d="M7 20h11"></path>',
		'alert'    => '<path d="M12 3 2 20h20L12 3z"></path><path d="M12 10v4"></path><path d="M12 17h.01"></path>',
		'setup'    => '<rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M3 9h18"></path><path d="M8 14h3"></path>',
		'manage'   => '<path d="M3 12h4l3-8 4 16 3-8h4"></path>',
		'ads'      => '<path d="M3 11l15-6v14L3 13z"></path><path d="M7 13v5a2 2 0 0 0 4 0v-4"></path>',
		'globe'    => '<circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18"></path>',
		'image'    => '<rect x="3" y="4" width="18" height="16" rx="2"></rect><circle cx="9" cy="10" r="2"></circle><path d="M21 16l-5-5-9 9"></path>',
		'catalogue'=> '<path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h10"></path>',
		'launch'   => '<path d="M5 19c2-6 6-10 14-14c-4 8-8 12-14 14z"></path><path d="M9 15l-2-2"></path>',
		'shield'   => '<path d="M12 3l8 3v6c0 5-3.5 8-8 9c-4.5-1-8-4-8-9V6z"></path><path d="M9 12l2 2 4-4"></path>',
	);
	if ( ! isset( $paths[ $name ] ) ) {
		return '';
	}
	return sprintf(
		'<svg aria-hidden="true" width="%1$d" height="%1$d" viewBox="0 0 24 24" fill="none" stroke="%2$s" stroke-width="%3$s" stroke-linecap="round" stroke-linejoin="round">%4$s</svg>',
		(int) $size,
		esc_attr( $stroke ),
		esc_attr( $width ),
		$paths[ $name ]
	);
}
