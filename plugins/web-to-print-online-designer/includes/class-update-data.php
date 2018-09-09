<?php
if ( ! defined( 'ABSPATH' ) ) exit;
class NBD_Update_Data{
    
    public function ajax(){
        $ajax_events = array(
            'nbd_update_all_template' => false
        );
	foreach ($ajax_events as $ajax_event => $nopriv) {
            add_action('wp_ajax_' . $ajax_event, array($this, $ajax_event));
            if ($nopriv) {
                // NBDesigner AJAX can be used for frontend ajax requests
                add_action('wp_ajax_nopriv_' . $ajax_event, array($this, $ajax_event));
            }
        }        
    }    
    public static function update_vatiation_config_v180(){
        if (!wp_verify_nonce($_POST['_nbdesigner_cupdate_product'], 'nbdesigner-update-product') || !current_user_can('administrator')) {
            die('Security error');
        }         
        $args_query = array(
            'post_type' => 'product',
            'post_status' => 'publish',
            'meta_key' => '_nbdesigner_enable',
            'orderby' => 'date',
            'order' => 'DESC',
            'posts_per_page'=> -1,
            'meta_query' => array(
                array(
                    'key' => '_nbdesigner_enable',
                    'value' => 1,
                )
            )
        ); 
        $posts = get_posts($args_query);  
        $result = array('flag' => 1);
        if(is_array($posts)){    
            foreach ($posts as $post){
                $pid = get_wpml_original_id( $post->ID );
                $product = wc_get_product( $pid );    
                if( $pid != $post->ID ) continue;
                if( $product->is_type( 'variable' ) ) { 
                    $variations = $product->get_available_variations( false );
                    foreach ($variations as $variation){
                        $vid = $variation['variation_id'];
                        $designer_enable = get_post_meta($vid, '_nbdesigner_enable'.$vid, true);
                        $_designer_enable = get_post_meta($vid, '_nbdesigner_variation_enable'.$vid, true);
                        if( $_designer_enable ) continue;
                        $designer_setting = unserialize(get_post_meta($vid, '_designer_setting'.$vid, true));
                        if( $designer_enable ) {
                            update_post_meta($vid, '_designer_variation_setting', serialize($designer_setting));
                            update_post_meta($vid, '_nbdesigner_variation_enable', $designer_enable);
                        }
                    }
                }                  
            }
        }
        echo json_encode($result);
        wp_die();        
    }
    /* Fix missing folder templates after update verion 1.6.2 to 1.7 */
    public function nbd_update_all_template() {
        if (!wp_verify_nonce($_POST['_nbdesigner_update_product'], 'nbdesigner-update-product') || !current_user_can('administrator')) {
            die('Security error');
        } 
        global $wpdb;
        $sql = "SELECT * FROM {$wpdb->prefix}nbdesigner_templates";
        $templates = $wpdb->get_results($sql, 'ARRAY_A');
        foreach ($templates as $template) {
            $nb_item_key = substr(md5(uniqid()), 0, 10);
            $src_path = NBDESIGNER_ADMINDESIGN_DIR . '/' . $template['product_id'] . '/' . $template['folder'];
            $dist_path = NBDESIGNER_CUSTOMER_DIR . '/' . $nb_item_key;
            Nbdesigner_IO::copy_dir($src_path, $dist_path);
            $id = $template['id'];
            $product_id = $template['product_id'];
            $product_option = get_post_meta($product_id, '_nbdesigner_option', true);
            $product_config = get_post_meta($product_id, '_designer_setting', true);
            file_put_contents($dist_path . '/option.json', $product_option);
            file_put_contents($dist_path . '/product.json', $product_config);
            $arr = array('variation_id' => 0, 'folder' => $nb_item_key);
            $wpdb->update("{$wpdb->prefix}nbdesigner_templates", $arr, array('id' => $id));
        } 
        $result = array('flag' => 1);
        echo json_encode($result);
        wp_die();
    }    
    public static function insert_default_files(){
        $default_background = get_option('nbdesigner_default_background' );
        $default_overlay = get_option('nbdesigner_default_overlay' );
        if( !$default_background ) {
            $background_file = NBDESIGNER_PLUGIN_URL . 'assets/images/default.png';
            $bg_id = nbd_add_attachment( $background_file );
            update_option('nbdesigner_default_background', $bg_id );
        }
        if( !$default_overlay ) {
            $overlay_file = NBDESIGNER_PLUGIN_URL . 'assets/images/overlay.png';
            $ol_id = nbd_add_attachment( $overlay_file );
            update_option('nbdesigner_default_overlay', $ol_id );
        }
    }
    public static function nbd_update_media_v180( $designer_setting ){
        $default_background = get_option('nbdesigner_default_background' );
        $default_overlay = get_option('nbdesigner_default_overlay' );
        foreach( $designer_setting as $key => $value ){
            if( $default_background && strpos( $value['img_src'], 'assets/images/default.png' ) !== false ) {
                $designer_setting[$key]['img_src'] = $default_background;
            }
            if( $default_overlay && strpos( $value['img_overlay'], 'assets/images/overlay.png' ) !== false ) {
                $designer_setting[$key]['img_overlay'] = $default_overlay;
            }            
        }
        return $designer_setting;  
    }
}