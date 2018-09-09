<?php
/**
 * @package Nbdesigner
 */
/*
Plugin Name: Nbdesigner
Plugin URI: https://cmsmart.net/wordpress-plugins/woocommerce-online-product-designer-plugin
Description: Allow customer design product before purchase.
Version: 1.8.0
Author: Netbaseteam
Author URI: http://netbaseteam.com/
License: GPLv2 or later
Text Domain: web-to-print-online-designer
Domain Path: /langs
*/

if ( !function_exists( 'add_action' ) ) {
    echo 'Hi there!  I\'m just a plugin, not much I can do when called directly.';
    exit;
}

$upload_dir = wp_upload_dir();
$basedir = $upload_dir['basedir'];
$baseurl = $upload_dir['baseurl'];

$nbd_plugin_dir_url = plugin_dir_url(__FILE__);
if ( function_exists( 'icl_get_home_url' ) ) {
    $nbd_plugin_dir_url = str_replace(untrailingslashit(get_option('home')), untrailingslashit(icl_get_home_url()), $nbd_plugin_dir_url);
}

nbd_define('NBDESIGNER_VERSION', '1.8.0');
nbd_define('NBDESIGNER_NUMBER_VERSION', 180);
nbd_define('NBDESIGNER_MINIMUM_WP_VERSION', '4.1.1');
nbd_define('NBDESIGNER_MINIMUM_PHP_VERSION', '5.4');
nbd_define('NBDESIGNER_PLUGIN_URL', $nbd_plugin_dir_url);
nbd_define('NBDESIGNER_PLUGIN_DIR', plugin_dir_path(__FILE__));
nbd_define('NBDESIGNER_PLUGIN_BASENAME', plugin_basename(__FILE__));
nbd_define('NBDESIGNER_MODE_DEV', FALSE);
nbd_define('NBDESIGNER_MODE_DEBUG', FALSE);
nbd_define('NBDESIGNER_DATA_DIR', $basedir . '/nbdesigner');
nbd_define('NBDESIGNER_DATA_URL', $baseurl . '/nbdesigner');
nbd_define('NBDESIGNER_FONT_DIR', NBDESIGNER_DATA_DIR . '/fonts');
nbd_define('NBDESIGNER_FONT_URL', NBDESIGNER_DATA_URL . '/fonts');
nbd_define('NBDESIGNER_ART_DIR', NBDESIGNER_DATA_DIR . '/cliparts');
nbd_define('NBDESIGNER_ART_URL', NBDESIGNER_DATA_URL . '/cliparts');
nbd_define('NBDESIGNER_DOWNLOAD_DIR', NBDESIGNER_DATA_DIR . '/download');
nbd_define('NBDESIGNER_DOWNLOAD_URL', NBDESIGNER_DATA_URL . '/download');
nbd_define('NBDESIGNER_TEMP_DIR', NBDESIGNER_DATA_DIR . '/temp');
nbd_define('NBDESIGNER_LOG_DIR', NBDESIGNER_DATA_DIR . '/logs');
nbd_define('NBDESIGNER_TEMP_URL', NBDESIGNER_DATA_URL . '/temp');
nbd_define('NBDESIGNER_ADMINDESIGN_DIR', NBDESIGNER_DATA_DIR . '/admindesign');
nbd_define('NBDESIGNER_ADMINDESIGN_URL', NBDESIGNER_DATA_URL . '/admindesign');
nbd_define('NBDESIGNER_PDF_DIR', NBDESIGNER_DATA_DIR . '/pdfs');
nbd_define('NBDESIGNER_PDF_URL', NBDESIGNER_DATA_URL . '/pdfs');
nbd_define('NBDESIGNER_CUSTOMER_DIR', NBDESIGNER_DATA_DIR . '/designs');
nbd_define('NBDESIGNER_CUSTOMER_URL', NBDESIGNER_DATA_URL . '/designs');
nbd_define('NBDESIGNER_UPLOAD_DIR', NBDESIGNER_DATA_DIR . '/uploads');
nbd_define('NBDESIGNER_UPLOAD_URL', NBDESIGNER_DATA_URL . '/uploads');
nbd_define('NBDESIGNER_SUGGEST_DESIGN_DIR', NBDESIGNER_DATA_DIR . '/suggest_designs');
nbd_define('NBDESIGNER_SUGGEST_DESIGN_URL', NBDESIGNER_DATA_URL . '/suggest_designs');
nbd_define('NBDESIGNER_DATA_CONFIG_DIR', NBDESIGNER_DATA_DIR . '/data');
nbd_define('NBDESIGNER_DATA_CONFIG_URL', NBDESIGNER_DATA_URL . '/data');
nbd_define('NBDESIGNER_ASSETS_URL', NBDESIGNER_PLUGIN_URL . 'assets/');
nbd_define('NBDESIGNER_JS_URL', NBDESIGNER_PLUGIN_URL . 'assets/js/');
nbd_define('NBDESIGNER_CSS_URL', NBDESIGNER_PLUGIN_URL . 'assets/css/');
nbd_define('NBDESIGNER_TEMPLATES', 'nbdesigner_templates');
nbd_define('NBDESIGNER_CATEGORY_TEMPLATES', 'nbdesigner_category_templates');
nbd_define('NBDESIGNER_AUTHOR_SITE', 'https://cmsmart.net/');
nbd_define('NBDESIGNER_SKU', 'WPP1074');
nbd_define('NBDESIGNER_PAGE_STUDIO', 'designer-studio');
nbd_define('NBDESIGNER_PAGE_CREATE_YOUR_OWN', 'create-your-own');

function nbd_define( $name, $value ) {
    if ( ! defined( $name ) ) {
        define( $name, $value );
    }
}

require_once(NBDESIGNER_PLUGIN_DIR . 'includes/class-util.php');
require_once(NBDESIGNER_PLUGIN_DIR . 'includes/class-template-loader.php');
require_once(NBDESIGNER_PLUGIN_DIR . 'includes/class-settings.php');
require_once(NBDESIGNER_PLUGIN_DIR . 'includes/class-debug.php');
require_once(NBDESIGNER_PLUGIN_DIR . 'includes/class-helper.php');
require_once(NBDESIGNER_PLUGIN_DIR . 'includes/class-update-data.php');
require_once(NBDESIGNER_PLUGIN_DIR . 'includes/class.category.php');
require_once(NBDESIGNER_PLUGIN_DIR . 'includes/table/class.product.templates.php');
require_once(NBDESIGNER_PLUGIN_DIR . 'includes/class-install.php');
require_once(NBDESIGNER_PLUGIN_DIR . 'includes/class.nbdesigner.php');
require_once(NBDESIGNER_PLUGIN_DIR . 'includes/class.my.design.php');

$nb_design_endpoint = new My_Design_Endpoint();
$nb_design_endpoint->init();

register_activation_hook( __FILE__, array( 'Nbdesigner_Plugin', 'plugin_activation' ) );
register_deactivation_hook( __FILE__, array( 'Nbdesigner_Plugin', 'plugin_deactivation' ) );
$prefix = is_network_admin() ? 'network_admin_' : '';       
add_filter( $prefix.'plugin_action_links_' . NBDESIGNER_PLUGIN_BASENAME, array('Nbdesigner_Plugin', 'nbdesigner_add_action_links') );
add_filter( 'plugin_row_meta', array( 'Nbdesigner_Plugin', 'nbdesigner_plugin_row_meta' ), 10, 2 );
if ( ! function_exists( 'is_plugin_active_for_network' ) ) {
    require_once( ABSPATH . '/wp-admin/includes/plugin.php' );
}
$nb_designer = new Nbdesigner_Plugin();
$nb_designer->init();

require_once(NBDESIGNER_PLUGIN_DIR . 'includes/class-widget.php');

/**
 * With the upgrade to WordPress 4.7.1, some non-image files fail to upload on certain server setups. 
 * This will be fixed in 4.7.3, see the Trac ticket: https://core.trac.wordpress.org/ticket/39550
 * 
 */
if (version_compare($GLOBALS['wp_version'], '4.7.2', '<=')) {
    add_filter( 'wp_check_filetype_and_ext', 'wp39550_disable_real_mime_check', 10, 4 );
}
function wp39550_disable_real_mime_check( $data, $file, $filename, $mimes ) {
    $wp_filetype = wp_check_filetype( $filename, $mimes );
    $ext = $wp_filetype['ext'];
    $type = $wp_filetype['type'];
    $proper_filename = $data['proper_filename'];
    return compact( 'ext', 'type', 'proper_filename' );
}