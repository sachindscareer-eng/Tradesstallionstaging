<?php
/**
 * GitHub → WordPress sync ("git pull" for this plugin).
 *
 * The repo is public, so no token is needed. The site only ever downloads the
 * configured repo/branch; a webhook call just tells it "check now".
 *
 *  - Webhook:  POST {site}/wp-json/tsd/v1/sync   (GitHub → Settings → Webhooks, event: push)
 *  - Fallback: WP-Cron check every 15 minutes (compares the latest commit SHA).
 *  - Manual:   Tools → TradeStallion Sync → "Sync now".
 */
defined( 'ABSPATH' ) || exit;

define( 'TSD_GH_OWNER', 'sachindscareer-eng' );
define( 'TSD_GH_REPO', 'Tradesstallionstaging' );
define( 'TSD_GH_BRANCH', 'main' );

/** Files/folders from the repo that are never copied into the plugin. */
function tsd_sync_ignored( $rel ) {
	return (bool) preg_match( '#^(\.github/|\.git|README\.md$)#', $rel );
}

/** Latest commit SHA on the branch (GitHub API, unauthenticated). */
function tsd_sync_remote_sha() {
	$res = wp_remote_get(
		sprintf( 'https://api.github.com/repos/%s/%s/commits/%s', TSD_GH_OWNER, TSD_GH_REPO, TSD_GH_BRANCH ),
		array( 'timeout' => 15, 'headers' => array( 'Accept' => 'application/vnd.github.sha', 'User-Agent' => 'TradeStallion-Sync' ) )
	);
	if ( is_wp_error( $res ) || 200 !== wp_remote_retrieve_response_code( $res ) ) {
		return '';
	}
	$sha = trim( wp_remote_retrieve_body( $res ) );
	return preg_match( '/^[0-9a-f]{40}$/', $sha ) ? $sha : '';
}

/**
 * Download the branch zip and copy its files over this plugin.
 *
 * @param string $sha Commit to pull ('' = branch head).
 * @return true|WP_Error
 */
function tsd_sync_pull( $sha = '' ) {
	if ( get_transient( 'tsd_sync_lock' ) ) {
		return new WP_Error( 'tsd_busy', 'A sync is already running.' );
	}
	set_transient( 'tsd_sync_lock', 1, 120 );

	require_once ABSPATH . 'wp-admin/includes/file.php';

	$ref = $sha ? $sha : 'refs/heads/' . TSD_GH_BRANCH;
	$url = sprintf( 'https://codeload.github.com/%s/%s/zip/%s', TSD_GH_OWNER, TSD_GH_REPO, $ref );
	$zip = download_url( $url, 60 );
	if ( is_wp_error( $zip ) ) {
		delete_transient( 'tsd_sync_lock' );
		return $zip;
	}

	WP_Filesystem();
	global $wp_filesystem;
	$tmp = trailingslashit( get_temp_dir() ) . 'tsd-sync-' . wp_generate_password( 8, false );
	$unz = unzip_file( $zip, $tmp );
	@unlink( $zip ); // phpcs:ignore
	if ( is_wp_error( $unz ) ) {
		$wp_filesystem->delete( $tmp, true );
		delete_transient( 'tsd_sync_lock' );
		return $unz;
	}

	// The zip has one top folder: <repo>-<ref>/
	$dirs = glob( trailingslashit( $tmp ) . '*', GLOB_ONLYDIR );
	$src  = $dirs ? trailingslashit( $dirs[0] ) : '';
	if ( ! $src || ! file_exists( $src . 'tradestallion-design.php' ) ) {
		$wp_filesystem->delete( $tmp, true );
		delete_transient( 'tsd_sync_lock' );
		return new WP_Error( 'tsd_bad_package', 'Downloaded package does not look like the plugin.' );
	}

	// Refuse obviously broken PHP (missing opening tag / empty file) before touching the live copy.
	$it = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $src, FilesystemIterator::SKIP_DOTS ) );
	$files = array();
	foreach ( $it as $file ) {
		$rel = str_replace( '\\', '/', substr( $file->getPathname(), strlen( $src ) ) );
		if ( tsd_sync_ignored( $rel ) ) {
			continue;
		}
		if ( substr( $rel, -4 ) === '.php' ) {
			$head = file_get_contents( $file->getPathname(), false, null, 0, 5 ); // phpcs:ignore
			if ( '<?php' !== $head ) {
				$wp_filesystem->delete( $tmp, true );
				delete_transient( 'tsd_sync_lock' );
				return new WP_Error( 'tsd_bad_php', 'Sync stopped: ' . $rel . ' does not start with <?php' );
			}
		}
		$files[ $rel ] = $file->getPathname();
	}

	$copied = 0;
	foreach ( $files as $rel => $path ) {
		$dest = TSD_DIR . $rel;
		wp_mkdir_p( dirname( $dest ) );
		if ( ! file_exists( $dest ) || md5_file( $dest ) !== md5_file( $path ) ) {
			if ( $wp_filesystem->copy( $path, $dest, true, FS_CHMOD_FILE ) ) {
				$copied++;
			}
		}
	}
	$wp_filesystem->delete( $tmp, true );

	if ( function_exists( 'opcache_reset' ) ) {
		@opcache_reset(); // phpcs:ignore
	}
	do_action( 'litespeed_purge_all' ); // Clear LiteSpeed cache so the change shows.

	update_option( 'tsd_sync_status', array(
		'sha'    => $sha ? $sha : tsd_sync_remote_sha(),
		'time'   => time(),
		'copied' => $copied,
		'error'  => '',
	), false );
	delete_transient( 'tsd_sync_lock' );
	return true;
}

/** Pull only if the remote has a newer commit. */
function tsd_sync_if_changed( $sha = '' ) {
	$sha    = $sha ? $sha : tsd_sync_remote_sha();
	$status = get_option( 'tsd_sync_status', array() );
	if ( ! $sha || ( ! empty( $status['sha'] ) && $status['sha'] === $sha ) ) {
		return false;
	}
	$r = tsd_sync_pull( $sha );
	if ( is_wp_error( $r ) ) {
		$status['error'] = $r->get_error_message();
		$status['time']  = time();
		update_option( 'tsd_sync_status', $status, false );
	}
	return $r;
}

/* ---------- Webhook endpoint ---------- */
add_action( 'rest_api_init', function () {
	register_rest_route( 'tsd/v1', '/sync', array(
		'methods'             => array( 'POST', 'GET' ),
		'permission_callback' => '__return_true', // Public: it can only pull the fixed repo above.
		'callback'            => function ( WP_REST_Request $req ) {
			if ( 'ping' === $req->get_header( 'x_github_event' ) ) {
				return array( 'ok' => true, 'pong' => true );
			}
			if ( get_transient( 'tsd_sync_rate' ) ) {
				return new WP_REST_Response( array( 'ok' => false, 'msg' => 'Too many requests, try again shortly.' ), 429 );
			}
			set_transient( 'tsd_sync_rate', 1, 15 );

			$body = $req->get_json_params();
			$sha  = ( is_array( $body ) && ! empty( $body['after'] ) && preg_match( '/^[0-9a-f]{40}$/', $body['after'] ) ) ? $body['after'] : '';
			if ( is_array( $body ) && ! empty( $body['ref'] ) && 'refs/heads/' . TSD_GH_BRANCH !== $body['ref'] ) {
				return array( 'ok' => true, 'skipped' => 'other branch' );
			}
			$r = tsd_sync_if_changed( $sha );
			if ( is_wp_error( $r ) ) {
				return new WP_REST_Response( array( 'ok' => false, 'msg' => $r->get_error_message() ), 500 );
			}
			return array( 'ok' => true, 'updated' => (bool) $r, 'status' => get_option( 'tsd_sync_status' ) );
		},
	) );
} );

/* ---------- Cron fallback (every 15 minutes) ---------- */
add_filter( 'cron_schedules', function ( $s ) {
	$s['tsd_15min'] = array( 'interval' => 900, 'display' => 'Every 15 minutes' );
	return $s;
} );
add_action( 'init', function () {
	if ( ! wp_next_scheduled( 'tsd_sync_cron' ) ) {
		wp_schedule_event( time() + 300, 'tsd_15min', 'tsd_sync_cron' );
	}
} );
add_action( 'tsd_sync_cron', 'tsd_sync_if_changed' );

/* ---------- Tools → TradeStallion Sync ---------- */
add_action( 'admin_menu', function () {
	add_management_page( 'TradeStallion Sync', 'TradeStallion Sync', 'manage_options', 'tsd-sync', 'tsd_sync_admin_page' );
} );

add_action( 'admin_post_tsd_sync_now', function () {
	if ( ! current_user_can( 'manage_options' ) || ! check_admin_referer( 'tsd_sync_now' ) ) {
		wp_die( 'Not allowed.' );
	}
	$r = tsd_sync_pull();
	$q = is_wp_error( $r ) ? array( 'tsd_err' => rawurlencode( $r->get_error_message() ) ) : array( 'tsd_ok' => 1 );
	wp_safe_redirect( add_query_arg( $q, admin_url( 'tools.php?page=tsd-sync' ) ) );
	exit;
} );

function tsd_sync_admin_page() {
	$st = get_option( 'tsd_sync_status', array() );
	?>
	<div class="wrap">
		<h1>TradeStallion Sync</h1>
		<?php if ( isset( $_GET['tsd_ok'] ) ) : // phpcs:ignore ?>
			<div class="notice notice-success"><p>Synced from GitHub.</p></div>
		<?php elseif ( isset( $_GET['tsd_err'] ) ) : // phpcs:ignore ?>
			<div class="notice notice-error"><p><?php echo esc_html( wp_unslash( $_GET['tsd_err'] ) ); // phpcs:ignore ?></p></div>
		<?php endif; ?>
		<p>This plugin pulls its code from
			<a href="<?php echo esc_url( 'https://github.com/' . TSD_GH_OWNER . '/' . TSD_GH_REPO ); ?>" target="_blank" rel="noopener"><?php echo esc_html( TSD_GH_OWNER . '/' . TSD_GH_REPO ); ?></a>
			(branch <code><?php echo esc_html( TSD_GH_BRANCH ); ?></code>).</p>
		<table class="widefat striped" style="max-width:760px">
			<tr><th>Webhook URL</th><td><code><?php echo esc_html( rest_url( 'tsd/v1/sync' ) ); ?></code></td></tr>
			<tr><th>Last synced commit</th><td><code><?php echo esc_html( ! empty( $st['sha'] ) ? substr( $st['sha'], 0, 7 ) : '—' ); ?></code></td></tr>
			<tr><th>Last run</th><td><?php echo ! empty( $st['time'] ) ? esc_html( wp_date( 'j M Y, H:i', $st['time'] ) ) : '—'; ?></td></tr>
			<tr><th>Files updated</th><td><?php echo isset( $st['copied'] ) ? (int) $st['copied'] : '—'; ?></td></tr>
			<tr><th>Last error</th><td><?php echo ! empty( $st['error'] ) ? esc_html( $st['error'] ) : 'None'; ?></td></tr>
		</table>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="margin-top:16px">
			<input type="hidden" name="action" value="tsd_sync_now">
			<?php wp_nonce_field( 'tsd_sync_now' ); ?>
			<?php submit_button( 'Sync now', 'primary', 'submit', false ); ?>
		</form>
	</div>
	<?php
}

register_deactivation_hook( TSD_DIR . 'tradestallion-design.php', function () {
	wp_clear_scheduled_hook( 'tsd_sync_cron' );
} );
