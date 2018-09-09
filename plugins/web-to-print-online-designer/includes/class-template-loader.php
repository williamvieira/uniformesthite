<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}
class NBD_Template_Loader {
    public static function init() {
        add_filter( 'template_include', array( __CLASS__, 'template_loader' ) );
    }
    public static function template_loader( $template ) {
        if ( $default_file = self::get_template_loader_default_file() ) {
            $template = nbdesigner_locate_template($default_file);         
        }
        return $template;
    }
    private static function get_template_loader_default_file() {
        $default_file = '';
        if ( is_nbd_designer_page() ) {
            $default_file = 'gallery/artist.php';
        }     
        return $default_file;
    }
}
NBD_Template_Loader::init();