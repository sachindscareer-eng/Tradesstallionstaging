<?php
/**
 * Free-audit form + newsletter form handlers.
 * Submissions are emailed to the site admin (change with the tsd_form_recipient filter).
 * To use another form plugin instead, set the shortcode with the tsd_audit_form_shortcode filter.
 */
defined( 'ABSPATH' ) || exit;

function tsd_form_recipient() {
	return apply_filters( 'tsd_form_recipient', get_option( 'admin_email' ) );
}

function tsd_redirect_back( $flag, $anchor ) {
	$back = wp_get_referer() ? wp_get_referer() : home_url( '/' );
	$back = remove_query_arg( array( 'tsd_audit', 'tsd_news' ), $back );
	wp_safe_redirect( add_query_arg( $flag, '1', $back ) . '#' . $anchor );
	exit;
}

/* ---------- Free account audit ---------- */
function tsd_handle_audit() {
	if ( ! isset( $_POST['tsd_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['tsd_nonce'] ) ), 'tsd_audit' ) ) {
		wp_die( esc_html__( 'Security check failed. Please go back and try again.', 'tradestallion-design' ), '', array( 'response' => 403 ) );
	}
	// Honeypot: bots fill hidden fields.
	if ( ! empty( $_POST['tsd_company_website'] ) ) {
		tsd_redirect_back( 'tsd_audit', 'audit' );
	}

	$name    = sanitize_text_field( wp_unslash( $_POST['tsd_name'] ?? '' ) );
	$email   = sanitize_email( wp_unslash( $_POST['tsd_email'] ?? '' ) );
	$phone   = sanitize_text_field( wp_unslash( $_POST['tsd_phone'] ?? '' ) );
	$store   = esc_url_raw( wp_unslash( $_POST['tsd_store'] ?? '' ) );
	$message = sanitize_textarea_field( wp_unslash( $_POST['tsd_message'] ?? '' ) );

	if ( '' === $name || ! is_email( $email ) ) {
		$back = wp_get_referer() ? wp_get_referer() : home_url( '/' );
		wp_safe_redirect( add_query_arg( 'tsd_audit', 'error', remove_query_arg( 'tsd_audit', $back ) ) . '#audit' );
		exit;
	}

	$body  = "New free account audit request\n\n";
	$body .= "Name: {$name}\nEmail: {$email}\nPhone: {$phone}\nStore: {$store}\n\nNeeds help with:\n{$message}\n";
	wp_mail( tsd_form_recipient(), 'Free Account Audit request – ' . $name, $body, array( 'Reply-To: ' . $name . ' <' . $email . '>' ) );

	do_action( 'tsd_audit_submitted', compact( 'name', 'email', 'phone', 'store', 'message' ) );
	tsd_redirect_back( 'tsd_audit', 'audit' );
}
add_action( 'admin_post_nopriv_tsd_audit', 'tsd_handle_audit' );
add_action( 'admin_post_tsd_audit', 'tsd_handle_audit' );

/* ---------- Newsletter ---------- */
function tsd_handle_newsletter() {
	if ( ! isset( $_POST['tsd_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['tsd_nonce'] ) ), 'tsd_news' ) ) {
		wp_die( esc_html__( 'Security check failed. Please go back and try again.', 'tradestallion-design' ), '', array( 'response' => 403 ) );
	}
	$email = sanitize_email( wp_unslash( $_POST['tsd_email'] ?? '' ) );
	if ( is_email( $email ) && empty( $_POST['tsd_company_website'] ) ) {
		wp_mail( tsd_form_recipient(), 'New newsletter subscriber', "Email: {$email}\n" );
		do_action( 'tsd_newsletter_submitted', $email );
	}
	tsd_redirect_back( 'tsd_news', 'footer' );
}
add_action( 'admin_post_nopriv_tsd_news', 'tsd_handle_newsletter' );
add_action( 'admin_post_tsd_news', 'tsd_handle_newsletter' );
