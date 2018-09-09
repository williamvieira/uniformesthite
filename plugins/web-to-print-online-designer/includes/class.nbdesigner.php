<?php
if (!function_exists('add_action')) {
    echo 'Hi there!  I\'m just a plugin, not much I can do when called directly.';
    exit;
}

class Nbdesigner_Plugin {
    public $textdomain;
    public $plugin_id;
    public $activedomain;
    public $removedomain;
    public function __construct() {
        $this->plugin_id = 'nbdesigner';
        $this->activedomain = 'activedomain/netbase/';
        $this->removedomain = 'removedomain/netbase/';   
    }
    public function init(){
        $this->hook();
        $this->schehule();
        $this->nbdesigner_lincense_notices();    
        add_action( 'nbdesigner_lincense_event', array($this, 'nbdesigner_lincense_event_action') ); 
        if (in_array('woocommerce/woocommerce.php',get_option('active_plugins')) || is_plugin_active_for_network( 'woocommerce/woocommerce.php' )) {
            $this->woocommerce_hook();
        }
        if (is_admin()) {
            $this->admin_hook();           
            $this->ajax();           
            
        } else {    
            $this->frontend_hook();    
        }          
    }
    public function ajax(){
        // Nbdesigner_EVENT => nopriv
        $ajax_events = array(
            'nbdesigner_add_font_cat' => false,
            'nbdesigner_add_art_cat' => false,
            'nbdesigner_add_google_font' => false,
            'nbdesigner_delete_font_cat' => false,
            'nbdesigner_delete_art_cat' => false,
            'nbdesigner_delete_font' => false,
            'nbdesigner_delete_art' => false,
            'nbdesigner_get_product_info' => true,
            'nbdesigner_get_qrcode' => true,
            'nbdesigner_get_facebook_photo' => true,
            'nbdesigner_get_art' => true,
            'nbdesigner_design_approve' => false,
            'nbdesigner_design_order_email' => false,
            'nbdesigner_customer_upload' => true,
            'nbd_upload_design_file' => true,
            'nbdesigner_get_font' => true,
            'nbdesigner_get_pattern' => true,
            'nbdesigner_get_info_license' => false,
            'nbdesigner_remove_license' => false,
            'nbdesigner_get_license_key' => false,
            'nbdesigner_get_language' => true,
            'nbdesigner_save_language' => false,
            'nbdesigner_create_language' => false,
            'nbdesigner_make_primary_design' => false,
            'nbdesigner_load_admin_design' => true,
            'nbdesigner_save_webcam_image' => true,
            'nbdesigner_migrate_domain' => false,
            'nbdesigner_restore_data_migrate_domain' => false,
            'nbdesigner_theme_check' => false,
            'nbdesigner_custom_css' => false,
            'nbdesigner_copy_image_from_url' => true,
            'nbdesigner_get_suggest_design' => true,
            'nbdesigner_save_design_to_pdf' => false,
            'nbdesigner_delete_language' => false,
            'nbdesigner_update_all_product' => false,
            'nbd_save_customer_design' => true,
            'nbd_update_customer_upload' => true,
            'nbd_save_cart_design' => true,
            'nbd_get_nbd_products' => true,
            'nbd_remove_cart_design' => true,
            'nbd_get_product_description' => true,
            'nbd_convert_files' => true,
            'nbd_frontend_download_pdf' => true,
            'nbdesigner_update_variation_v180'  =>  false,
            'nbdesigner_update_all_template'  =>  false,
            'nbd_clear_transients'  =>  false,
            'nbd_create_pages'  =>  false
        );
	foreach ($ajax_events as $ajax_event => $nopriv) {
            add_action('wp_ajax_' . $ajax_event, array($this, $ajax_event));
            if ($nopriv) {
                // NBDesigner AJAX can be used for frontend ajax requests
                add_action('wp_ajax_nopriv_' . $ajax_event, array($this, $ajax_event));
            }
        }
    }
    public function hook(){
        add_action('plugins_loaded', array($this, 'translation_load_textdomain'));
        add_filter( 'cron_schedules', array($this, 'set_schedule'));      
        add_filter( 'query_vars', array($this, 'nbdesigner_add_query_vars_filter') );           
        add_shortcode( 'nbdesigner_button', array($this,'nbdesigner_button') );
        add_shortcode( 'nbd_loggin_redirect', array($this,'nbd_loggin_redirect_func') );
        add_action( 'template_redirect', array( $this, 'nbdesigner_editor_html' ) );    
        add_action('admin_head', array($this, 'nbdesigner_add_tinymce_editor'));
        add_action( 'init', array( $this, 'init_session' ) );
        add_filter( 'body_class', array($this, 'add_body_class'), 10, 1 );
        add_filter( 'display_post_states', array( $this, 'add_display_post_states' ), 10, 2 );
    }
    public function init_session(){
        global $woocommerce;
        if( !is_admin() ){
            $woocommerce->session->set_customer_session_cookie(true);
        }
    }
    public function admin_hook(){    
        add_action('plugins_loaded', array($this, 'nbdesigner_user_role'));
        add_action('admin_menu', array($this, 'nbdesigner_menu'));
        add_action('add_meta_boxes', array($this, 'add_design_box'), 30);
        add_action('save_post', array($this, 'save_settings'));
        add_action('save_post', array($this, 'delete_nbd_product_transient'));
        add_action('delete_post', array($this, 'delete_nbd_product_transient'));
        add_filter('upload_mimes', array($this, 'upload_mimes'));
        add_filter('manage_product_posts_columns', array($this, 'nbdesigner_add_design_column'));
        add_action('manage_product_posts_custom_column', array($this, 'nbdesigner_display_posts_design'), 1, 2);
        add_filter('nbdesigner_notices', array($this, 'nbdesigner_notices'));     
        add_filter( 'set-screen-option', array($this, 'set_screen' ), 10, 3 );
        add_filter( 'parse_query', array($this, 'nbdesigner_admin_posts_filter') );
        add_filter( 'views_edit-product', array( $this, 'nbdesigner_product_sorting_nbd' ),30 );
        add_action('admin_enqueue_scripts', array($this, 'nbdesigner_admin_enqueue_scripts'), 30, 1);
        add_filter( 'admin_footer_text', array( $this, 'admin_footer_text' ), 1 );
    }
    public function frontend_hook(){
        add_action('wp_enqueue_scripts', array($this, 'frontend_enqueue_scripts'));
    }
    public function woocommerce_hook(){
        /* ADMIN */
        add_filter( 'woocommerce_admin_order_actions', array($this, 'add_nbdesinger_order_actions_button'), 30, 2 );
        
        /* FRONTEND */
        add_filter('woocommerce_cart_item_name', array($this, 'nbdesigner_render_cart'), 1, 3);
        add_action('woocommerce_add_to_cart', array($this, 'set_nbd_session_cart'), 10, 6);
        if( ! is_woo_v3() ){		
            add_action('woocommerce_add_order_item_meta', array($this, 'nbdesigner_add_order_design_data'), 1, 3);
        }else{
            add_action('woocommerce_new_order_item', array($this, 'nbdesigner_add_new_order_item'), 1, 3);
        }          
        add_action('woocommerce_checkout_order_processed', array($this, 'set_nbd_order_data'), 1, 1);
        add_filter('woocommerce_locate_template', array($this, 'nbdesigner_locate_plugin_template'), 20, 3 );
        add_filter( 'woocommerce_order_item_name', array($this, 'order_item_name'), 1, 2);
        add_filter( 'woocommerce_order_item_quantity_html', array($this, 'nbdesigner_order_item_quantity_html'), 1, 2);
        add_filter( 'woocommerce_checkout_cart_item_quantity', array($this, 'nbd_checkout_cart_item_quantity'), 10, 3);
        add_filter( 'woocommerce_hidden_order_itemmeta', array($this, 'nbdesigner_hidden_custom_order_item_metada'));
        add_action( 'nbdesigner_admin_notifications_event', array($this, 'nbdesigner_admin_notifications_event_action') );
        add_action( 'woocommerce_cart_item_removed', array($this, 'nbdesigner_remove_cart_item_design'), 10, 2 );
        add_action( 'woocommerce_product_after_variable_attributes', array($this,'nbdesigner_variation_settings_fields'), 10, 3 );
        add_action( 'woocommerce_save_product_variation', array($this,'nbdesigner_save_variation_settings_fields'), 10, 2 );
        add_filter( 'woocommerce_add_cart_item_data', array($this, 'nbd_add_cart_item_data'), 10, 3 );      
        add_filter( 'woocommerce_add_cart_item', array($this, 'nbd_add_cart_item'), 99999, 1 ); 
        add_filter( 'woocommerce_cart_item_price', array(&$this, 'change_cart_item_prices_text'), 10, 3 );
        add_filter( 'woocommerce_cart_item_subtotal', array(&$this, 'change_cart_item_prices_text'), 10, 3 );
        add_action( 'woocommerce_before_calculate_totals', array($this, 'nbd_before_calculate_totals'), 10, 1);
        //add_action('woocommerce_cart_loaded_from_session', array($this, 'cart_loaded_from_session'), 100);
        add_action( 'woocommerce_before_add_to_cart_button', array( $this, 'nbd_before_add_to_cart_button' ) );
        //add_action( 'woocommerce_ordered_again', array( $this, 'nbd_ordered_again' ), 10, 1 );
        add_filter( 'woocommerce_order_again_cart_item_data', array( $this, 'nbd_order_again_cart_item_data' ), 10, 3 );
        $page_design = nbdesigner_get_option('nbdesigner_page_design_tool');
        if($page_design == 2){
            add_action('woocommerce_before_single_product', array($this, 'check_has_design'));   
            add_filter('woocommerce_add_to_cart_redirect', array($this, 'nbd_add_to_cart_redirect'));
        }else{
            add_filter( 'woocommerce_product_single_add_to_cart_text', array($this, 'add_to_cart_text'), 20, 2);
            $position = nbdesigner_get_option('nbdesigner_position_button_product_detail');
            if($position == 1){
                add_action('woocommerce_before_add_to_cart_button', array($this, 'nbdesigner_button'), 30);
            }else if($position == 2){
                add_action('woocommerce_before_add_to_cart_form', array($this, 'nbdesigner_button'), 30);
            }else if($position == 3){
                add_action('woocommerce_after_add_to_cart_form', array($this, 'nbdesigner_button'), 30);
            } 
        }
        $catalog_button_pos = nbdesigner_get_option('nbdesigner_position_button_in_catalog');
        if($catalog_button_pos == 2){
           add_action( 'woocommerce_after_shop_loop_item', array(&$this, 'add_catalog_nbdesign_button'), 20 );
        }elseif($catalog_button_pos == 1) {
            add_filter( 'woocommerce_loop_add_to_cart_link', array(&$this, 'nbdesigner_add_to_cart_shop_link'), 10, 2 );
        }
        if( get_option('nbdesigner_attachment_admin_email', false) == 'yes' ){
            add_filter('woocommerce_email_attachments', array(&$this, 'attach_design_to_admin_email'), 10, 3);
        }
    }    
    public function nbd_order_again_cart_item_data( $arr, $item, $order ){
        $order_items = $order->get_items();
        foreach( $order_items AS $order_item_id => $item ){    
            $nbd_item_key = wc_get_order_item_meta($order_item_id, '_nbd');
            $nbu_item_key = wc_get_order_item_meta($order_item_id, '_nbu'); 
            if( $nbd_item_key ){
                $arr['_nbd'] = $nbd_item_key;
            }     
            if( $nbu_item_key ){
                $arr['_nbu'] = $nbu_item_key;
            }     
        }
        return $arr;
    }
    public function add_to_cart_text( $text, $product ){ 
        $option = unserialize(get_post_meta($product->get_id(), '_nbdesigner_option', true));  
        if($option['request_quote']){
            return __('Get a Quote', 'web-to-print-online-designer'); 
        }else {
            return $text;
        }            
    }
    public function nbdesigner_add_to_cart_shop_link($handler, $product){
        if(is_nbdesigner_product($product->get_id())){    
            $label = __('Personalizar', 'web-to-print-online-designer');
            ob_start();            
            nbdesigner_get_template('loop/start-design.php', array('product' => $product, 'label' => $label, 'type' =>  $product->get_type()));
            $button = ob_get_clean();    
            return $button;
        }
        return $handler;
    }
    public function add_catalog_nbdesign_button(){
        global $product;
        if(is_nbdesigner_product($product->get_id())){  
            $label = __('Personalizar', 'web-to-print-online-designer');
            printf( '<a href="%s" rel="nofollow" class="button">%s</a>',
                esc_url( get_permalink($product->get_id()) ),
                esc_html( $label )
            );            
        }
    }
    public function check_has_design(){
        global $product;
        if(is_nbdesigner_product($product->get_id())){  
            add_filter( 'woocommerce_product_single_add_to_cart_text', function(){
                return __('Add to cart & start design', 'web-to-print-online-designer');               
            });           
        }
    }
    public function add_body_class( $classes ){
        if( is_product() ){
            $product_id = get_the_ID();   
            if( is_nbdesigner_product( $product_id ) ){
                $classes[] = 'nbd-single-product-page';
            }
        }
	return $classes;          
    }
    public function nbd_add_to_cart_redirect($url){
        if(!isset($_REQUEST['add-to-cart'])) return $url;
        $product_id = absint( $_REQUEST['add-to-cart'] );
        $variation_id = isset($_REQUEST['variation_id']) ? absint( $_REQUEST['variation_id'] ) : 0;
        $nbd_item_cart_key = ($variation_id > 0) ? $product_id . '_' . $variation_id : $product_id; 
        if(is_nbdesigner_product($product_id)){  
            $cart_item_key = WC()->session->get('nbd_last_item_cart');
            $url =  add_query_arg(array(
                    'task2'  => 'update',
                    'product_id'    =>  $product_id,
                    'cik'    =>  $cart_item_key
                    ),  getUrlPageNBD('create'));    
            if( $variation_id > 0 ) $url .= '&variation_id='.$variation_id;
            WC()->session->__unset('nbd_last_item_cart');
            $nbd_item_key = substr(md5(uniqid()),0,10);
            WC()->session->set('nbd_item_key_'.$nbd_item_cart_key, $nbd_item_key); 
            WC()->session->set('nbu_item_key_'.$nbd_item_cart_key, $nbd_item_key); 
        }
        return $url;
    }
    public function change_cart_item_prices_text( $price, $cart_item, $cart_item_key ){
        $nbd_session = WC()->session->get($cart_item_key . '_nbd');   
        $nbu_session = WC()->session->get($cart_item_key . '_nbu');   
        if( isset($nbd_session) || isset($nbu_session) ){
            $option = unserialize(get_post_meta($cart_item['product_id'], '_nbdesigner_option', true));
            if( $option['request_quote'] ){
                return '-';
            }
        }
        return $price;
    }
    public function nbd_before_add_to_cart_button(){
        $product_id = get_the_ID();   
        $is_nbupload = get_post_meta($product_id, '_nbdesigner_enable_upload', true);      
        if( $is_nbupload ){
            echo '<input type="hidden" class="nbd-upload" id="nbd-upload-files" name="nbd-upload-files" value="" />';
        }       
    }
    public function nbd_remove_cart_design(){
        if ( !wp_verify_nonce($_POST['nonce'], 'save-design') ) {
            die('Security error');
        }  
        $type = $_POST['type'];
        $cart_item_key = $_POST['cart_item_key'];
        if( $type == 'custom' ){
            WC()->session->__unset($cart_item_key . '_nbd');   
        }else {
            WC()->session->__unset($cart_item_key . '_nbu');   
        }
        echo 'success';
        wp_die();
    }    
    public function nbd_before_calculate_totals( $cart_obj ){
        if ( is_admin() && ! defined( 'DOING_AJAX' ) ) return;
        foreach ( $cart_obj->get_cart() as $key => $cart_item_data ) {
            $product_id = $cart_item_data['product_id'];
            $variation_id = $cart_item_data['variation_id'];   
            $product_id = get_wpml_original_id( $product_id );  
            $variation_id = get_wpml_original_id( $variation_id );  
            $nbd_item_cart_key = ($variation_id > 0) ? $product_id . '_' . $variation_id : $product_id; 
            $nbd_session = WC()->session->get($key . '_nbd');   
            $nbu_session = WC()->session->get($key . '_nbu');    
            if( isset($nbd_session) || isset($nbu_session) ){
                $option = unserialize(get_post_meta($product_id, '_nbdesigner_option', true)); 
                if( isset($nbd_session) ) {
                    $path = NBDESIGNER_CUSTOMER_DIR . '/' . $nbd_session . '/config.json';
                    $config = nbd_get_data_from_json($path);
                    if( isset( $config->custom_dimension ) && isset( $config->custom_dimension->price ) ){
                        $nbd_variation_price = $config->custom_dimension->price;
                    }
                }
                if( $option['request_quote'] || $option['extra_price'] || (isset($nbd_variation_price) && $nbd_variation_price != 0) ){
                    $initial_price = WC()->session->get($key . '_nbd_initial_price');
                    if( $initial_price ){
                        $price = $initial_price;
                    }else {
                        $price = $cart_item_data['data']->get_price();
                        WC()->session->set($key . '_nbd_initial_price', $price);
                    }  
                }
                if( $option['request_quote'] ){
                    $cart_item_data['data']->set_price( 0 );                       
                } else if( $option['extra_price'] || (isset($nbd_variation_price) && $nbd_variation_price != 0) ){
                    $decimals = wc_get_price_decimals();  
                    $new_price = $price;
                    if( $option['type_price'] == 1 ){
                        $new_price += $option['extra_price'];	
                    }else{
                        $new_price += $price * $option['extra_price'] / 100;	   
                    }
                    if( (isset($nbd_variation_price) && $nbd_variation_price != 0) ) $new_price += $nbd_variation_price;
                    $new_price = round($new_price, $decimals);	 
                    $cart_item_data['data']->set_price( $new_price ); 
                } 	             
            } else {
                /* Destroy get a quote or extra price when remove design */
                if ( WC()->session->__isset($key . '_nbd_initial_price') ) {
                    $initial_price = WC()->session->get($key . '_nbd_initial_price');
                    WC()->session->__unset($key . '_nbd_initial_price');
                    $cart_item_data['data']->set_price( $initial_price ); 
                }
            }          
        }          
    }
    public function nbd_add_cart_item( $cart_item_data ){
        $product_id = $cart_item_data['product_id'];
        $variation_id = $cart_item_data['variation_id'];      
        $nbd_item_cart_key = ($variation_id > 0) ? $product_id . '_' . $variation_id : $product_id; 
        $nbd_item_session = WC()->session->get('nbd_item_key_'.$nbd_item_cart_key);
        $nbu_item_session = WC()->session->get('nbu_item_key_'.$nbd_item_cart_key);
        if( isset($nbd_item_session) || isset($nbu_item_session) ){
            $option = unserialize(get_post_meta($product_id, '_nbdesigner_option', true)); 
            if( $option['request_quote'] ){
                $cart_item_data['data']->set_price( 0 );                
            }    
        }              
        return $cart_item_data;
    } 
    public function nbdesigner_admin_enqueue_scripts($hook){   
        wp_register_style('nbd-general', NBDESIGNER_CSS_URL . 'nbd-general.css', array('dashicons'), NBDESIGNER_VERSION);
        wp_enqueue_style(array('nbd-general'));     
        if (($hook == 'post.php') || ($hook == 'post-new.php') || ($hook == 'toplevel_page_nbdesigner') ||
                ($hook == 'nbdesigner_page_nbdesigner_manager_product' ) || ($hook == 'toplevel_page_nbdesigner_shoper') || ($hook == 'nbdesigner_page_nbdesigner_frontend_translate') ||
                ($hook == 'nbdesigner_page_nbdesigner_manager_fonts') || ($hook == 'nbdesigner_page_nbdesigner_manager_arts') 
                 || ($hook == 'nbdesigner_page_nbdesigner_tools')) {
            wp_register_style('admin_nbdesigner', NBDESIGNER_CSS_URL . 'admin-nbdesigner.css', array('wp-color-picker'), NBDESIGNER_VERSION);
            wp_register_script('admin_nbdesigner', NBDESIGNER_JS_URL . 'admin-nbdesigner.js', array('jquery', 'jquery-ui-resizable', 'jquery-ui-draggable', 'jquery-ui-autocomplete', 'wp-color-picker'), NBDESIGNER_VERSION);
            wp_localize_script('admin_nbdesigner', 'admin_nbds', array(
                'url' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('nbdesigner_add_cat'),
                'mes_success' => 'Success!',
                'url_check' => NBDESIGNER_AUTHOR_SITE,
                'sku' => NBDESIGNER_SKU,       
                'url_gif' => NBDESIGNER_PLUGIN_URL . 'assets/images/loading.gif',
                'assets_images'  =>  NBDESIGNER_PLUGIN_URL . 'assets/images/',
                'nbds_lang' => nbd_get_i18n_javascript() ));                
            wp_enqueue_style(array('wp-pointer', 'wp-jquery-ui-dialog', 'admin_nbdesigner'));
            wp_enqueue_script(array('wp-pointer', 'wpdialogs', 'admin_nbdesigner'));                            
        }
        if($hook == 'admin_page_nbdesigner_detail_order'){
            wp_enqueue_media();
            wp_register_style(
                    'admin_nbdesigner_detail_order_slider',
                    NBDESIGNER_CSS_URL . 'owl.carousel.css'
                    );
            wp_register_style(
                    'admin_nbdesigner_detail_order', 
                    NBDESIGNER_CSS_URL . 'detail_order.css', 
                    array('jquery-ui-style-css'), NBDESIGNER_VERSION);
            wp_register_style(
                    'jquery-ui-style-css', 
                    '//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.min.css', 
                    array(), '1.11.4');                
            wp_enqueue_style(array('admin_nbdesigner_detail_order_slider', 'admin_nbdesigner_detail_order','jquery-ui-style-css'));
            wp_register_script(
                    'admin_nbdesigner_detail_order_slider',
                    NBDESIGNER_JS_URL . 'owl.carousel.min.js', 
                    array('jquery', 'jquery-ui-tabs', 'jquery-ui-resizable', 'jquery-ui-draggable'), 
                    NBDESIGNER_VERSION);
            wp_enqueue_script('admin_nbdesigner_detail_order_slider');              
        }
        if($hook == 'nbdesigner_page_nbdesigner_frontend_translate'){
            wp_register_script('admin_nbdesigner_jeditable', NBDESIGNER_JS_URL . 'jquery.jeditable.js', array('jquery'));
            wp_enqueue_script('admin_nbdesigner_jeditable');
        }
        if($hook == 'nbdesigner_page_nbdesigner_tools'){
            wp_enqueue_style('admin_nbdesigner_codemirror', NBDESIGNER_PLUGIN_URL . 'assets/codemirror/codemirror.css');
            wp_enqueue_script( 'nbdesigner_codemirror_js', NBDESIGNER_PLUGIN_URL . 'assets/codemirror/codemirror.js' , array());
            wp_enqueue_script( 'nbdesigner_codemirror_css_js', NBDESIGNER_PLUGIN_URL . 'assets/codemirror/css.js' , array());
        }
        if($hook == 'nbdesigner_page_nbdesigner_admin_template' || $hook == 'nbdesigner_page_nbdesigner_manager_arts'
            || $hook == 'admin_page_nbdesigner_detail_order' || $hook == 'nbdesigner_page_nbdesigner_manager_fonts'   
            || $hook == 'nbdesigner_page_nbdesigner_tools' || $hook == 'nbdesigner_page_nbdesigner_frontend_translate'   ){
            wp_enqueue_style('nbdesigner_sweetalert_css', NBDESIGNER_CSS_URL . 'sweetalert.css');
            wp_enqueue_script( 'nbdesigner_sweetalert_js', NBDESIGNER_JS_URL . 'sweetalert.min.js' , array('jquery'));
        }
        if($hook == 'toplevel_page_nbdesigner'){
            wp_enqueue_style('nbdesigner_settings_css', NBDESIGNER_CSS_URL . 'admin-settings.css', array(), NBDESIGNER_VERSION);
        }
        if(is_rtl()){
            wp_enqueue_style('nbd-rtl',NBDESIGNER_CSS_URL . 'nbd-rtl.css',array(), NBDESIGNER_VERSION);   
        }   
    }
    public function frontend_enqueue_scripts(){
        wp_register_style('nbdesigner', NBDESIGNER_CSS_URL . 'nbdesigner.css', array(), NBDESIGNER_VERSION);
        wp_enqueue_style('nbdesigner');              
        wp_register_script('nbdesigner', NBDESIGNER_JS_URL . 'nbdesigner.js', array('jquery', 'jquery-blockui'), NBDESIGNER_VERSION);
        wp_localize_script('nbdesigner', 'nbds_frontend', array(
            'url' => admin_url('admin-ajax.php'),
            'sid' => session_id(),
            'nonce' => wp_create_nonce('save-design'),
            'nonce_get' => wp_create_nonce('nbdesigner-get-data'),
            'cart_url'   =>   esc_url( wc_get_cart_url() ),
            'hide_cart_button'  =>  nbdesigner_get_option('nbdesigner_hide_button_cart_in_detail_page')));
        wp_enqueue_script('nbdesigner');
    }
    public static function plugin_activation() {
        if (version_compare($GLOBALS['wp_version'], NBDESIGNER_MINIMUM_WP_VERSION, '<')) {
            $message = sprintf(__('<p>Plugin <strong>not compatible</strong> with WordPress %s. Requires WordPress %s to use this Plugin.</p>', 'web-to-print-online-designer'), $GLOBALS['wp_version'], NBDESIGNER_MINIMUM_WP_VERSION);
            die($message);
        }
        if(version_compare(PHP_VERSION, '5.4.0', '<=')){
            $message = sprintf(__('<p>Plugin <strong>not compatible</strong> with PHP %s. Requires PHP %s to use this Plugin.</p>', 'web-to-print-online-designer'), PHP_VERSION, NBDESIGNER_MINIMUM_PHP_VERSION);
            die($message);            
        }
        if (!is_plugin_active('woocommerce/woocommerce.php')) {
            $message = '<div class="error"><p>' . sprintf(__('WooCommerce is not active. Please activate WooCommerce before using %s.', 'web-to-print-online-designer'), '<b>Nbdesigner</b>') . '</p></div>';
            die($message);
        }
        Nbdesigner_IO::mkdir(NBDESIGNER_TEMP_DIR);
        Nbdesigner_IO::mkdir(NBDESIGNER_UPLOAD_DIR);
        Nbdesigner_IO::mkdir(NBDESIGNER_DOWNLOAD_DIR);
        Nbdesigner_IO::mkdir(NBDESIGNER_FONT_DIR);
        Nbdesigner_IO::mkdir(NBDESIGNER_ART_DIR);
        Nbdesigner_IO::mkdir(NBDESIGNER_DATA_CONFIG_DIR . '/language');
        Nbdesigner_IO::mkdir(NBDESIGNER_SUGGEST_DESIGN_DIR);
        Nbdesigner_IO::mkdir(NBDESIGNER_LOG_DIR);
        $check_version_150 = false;
        $version = get_option("nbdesigner_version_plugin");
        if (version_compare($version, "1.5.0", '<')) {    
            $check_version_150 = true;
        }         
        self::nbdesigner_add_custom_page();
        self::nbdesigner_create_table_templates();
        $version = get_option("nbdesigner_version_plugin");
        if ($check_version_150) {    
            self::nbdesigner_update_data_150();
        } 
        NBD_Update_Data::insert_default_files();
        if( class_exists('Nbdesigner_Studio') ){
            Nbdesigner_Studio::update_content_stuido_page();
        }     
        $design_endpoint = new My_Design_Endpoint();
        $design_endpoint->add_endpoints();
        flush_rewrite_rules();
    }
    public function set_schedule($schedules){   
        if(!isset($schedules['hourly'])){
            $schedules['hourly'] = array('interval' => 60*60, 'display' => __('Once Hourly'));
            //$schedules['every5min'] = array('interval' => 60*5, 'display' => __('Every 5 Minutes', 'web-to-print-online-designer'));
        }
        return $schedules;
    }
    public function schehule(){
        $timestamp = wp_next_scheduled( 'nbdesigner_lincense_event' );
        if( $timestamp == false ){
            wp_schedule_event( time(), 'daily', 'nbdesigner_lincense_event' );
        }   
        $timestamp2 = wp_next_scheduled( 'nbdesigner_admin_notifications_event' );
        $notifications = get_option('nbdesigner_notifications', false);
        $recurrence = 'hourly';	        
        if( $timestamp2 == false && $notifications === false){
            wp_schedule_event( time(), $recurrence, 'nbdesigner_admin_notifications_event' );
        }         
    }
    public function nbdesigner_lincense_event_action(){
        $path = NBDESIGNER_PLUGIN_DIR . 'data/license.json';   
        $path_data = NBDESIGNER_DATA_CONFIG_DIR . '/license.json';
        if(file_exists($path) || file_exists($path_data)){
            $license = $this->nbdesigner_check_license();
            $now = strtotime("now");
            if(isset($license['type']) && $license['type'] != 'free' && isset($license['expiry']) && $license['expiry'] < $now ){
                $result = $this->nbdesiger_request_license($license['key'], $this->activedomain);
                if($result){
                    $data = (array) json_decode($result);               
                    $data['key'] = $license['key'];
                    if($data['type'] == 'free') $data['number_domain'] = "5";
                    $data['salt'] = md5($license['key'].$data['type']);                   
                    $this->nbdesigner_write_license(json_encode($data));  
                }   
            }
        }
        add_action( 'admin_notices', array( $this, 'nbdesigner_lincense_notices' ) );	
    }
    public function nbdesigner_admin_notifications_event_action(){       
        $notifications = get_option('nbdesigner_notifications', false);
        $owner_email = get_option('nbdesigner_notifications_emails', false);
        if($notifications != false){
            global $woocommerce;         
            if($notifications == 'yes'){                
                if( version_compare( $woocommerce->version, "2.2", ">=" ) ){
                    $post_status = array( 'wc-processing', 'wc-completed', 'wc-on-hold', 'wc-pending' );
                }else{
                    $post_status = 'publish';
                }	               
                $args = array(
                    'post_type' => 'shop_order',
                    'meta_key' => '_nbdesigner_order_changed',
                    'orderby' => 'date',
                    'order' => 'DESC',
                    'posts_per_page'=>-1,
                    'post_status' => $post_status,
                    'meta_query' => array(
                        array(
                            'key' => '_nbdesigner_order_changed',
                            'value' => 1,
                        )
                    )
        	); 
                $post_orders = get_posts($args);   
                $orders = array();
                foreach ($post_orders AS $order) {
                    $the_order = new WC_Order($order->ID);
                    $orders[$order->ID] = $the_order->get_order_number();                    
                }
                if (count($orders)) {
                    foreach ($orders AS $order => $order_number) {
                        update_post_meta($order, '_nbdesigner_order_changed', 0);
                    }                    
                    $subject = __('New / Modified order(s)', 'web-to-print-online-designer');
                    $mailer = $woocommerce->mailer();
                    ob_start();
                    wc_get_template('emails/nbdesigner-admin-notifications.php', array(
                        'plugin_id' => 'nbdesigner',
                        'orders' => $orders,
                        'heading' => $subject
                    )); 
                    $emails = new WC_Emails();
                    $woo_recipient = $emails->emails['WC_Email_New_Order']->recipient;
                    if($owner_email == ''){
                        if(!empty($woo_recipient)) {
                            $user_email = esc_attr($woo_recipient);
                        } else {
                            $user_email = get_option( 'admin_email' );
                        }                        
                    }else{
                        $user_email = $owner_email;
                    }
                    $body = ob_get_clean();                  
                    if (!empty($user_email)) {                                            
                        $mailer->send($user_email, $subject, $body);
                    }                    
                }
            }
        }
    }
    public function nbdesigner_add_query_vars_filter($vars){
        $vars[] = "nbds-adid";
        $vars[] = "nbds-ref";
        return $vars;   
    }
    public function nbdesigner_admin_posts_filter($query){
        global $typenow;
        if ( 'product' == $typenow ) {
            if ( !empty($_GET['has_nbd']) ) {
                $query->query_vars['meta_key'] = '_nbdesigner_enable';
                $query->query_vars['meta_value']    = esc_sql($_GET['has_nbd']);
            }    
        }    
    }
    public function nbdesigner_product_sorting_nbd($views){
        global $wp_query;
        $class            = '';
        $query_string     = remove_query_arg(array( 'orderby', 'order' ));
        $query_string     = add_query_arg( 'has_nbd', urlencode('1'), $query_string );        
	$views['has_nbd'] = '<a href="' . esc_url( $query_string ) . '" class="' . esc_attr( $class ) . '">' . __( 'Has NBDesigner', 'web-to-print-online-designer') . '</a>';        
        return $views;
    }
    public function nbdesigner_lincense_notices(){            
        $license = $this->nbdesigner_check_license();
        if($license['status'] == 0){
            add_action( 'admin_notices', array( $this, 'nbdesigner_lincense_notices_content' ) );     
        } 
    }
    public function nbdesigner_lincense_notices_content(){     
        $mes = $this->nbdesigner_custom_notices('notices', 'You\'re using NBDesigner free version (full features and function but for max 5 products) or expired pro version. <br /><a class="nbd-notice-action" href="http://cmsmart.net/wordpress-plugins/woocommerce-online-product-designer-plugin" target="_blank">Please buy the Premium version here to use for all product </a>');
        printf($mes);
    }
    public function translation_load_textdomain() {	 
        load_plugin_textdomain('web-to-print-online-designer', false, dirname(dirname( plugin_basename( __FILE__ ))) . '/langs/');
    }
    public static function plugin_deactivation() {
        wp_clear_scheduled_hook( 'nbdesigner_lincense_event' );
        wp_clear_scheduled_hook( 'nbdesigner_admin_notifications_event' );
        flush_rewrite_rules();
    }
    public function upload_mimes($mimes) {
        $mimes['svg'] = 'image/svg+xml';
        $mimes['svgz'] = 'image/svg+xml';
        $mimes['woff'] = 'application/x-font-woff';
        $mimes['ttf'] = 'application/x-font-ttf';
        $mimes['eps'] = 'application/postscript';
        return $mimes;
    }
    public function nbdesigner_settings(){
        $page_id = 'nbdesigner';
        $tabs = apply_filters('nbdesigner_settings_tabs', array(
            'general' => '<span class="dashicons dashicons-admin-generic"></span> ' . __('General', 'web-to-print-online-designer'),
            'frontend' => '<span class="dashicons dashicons-admin-customizer"></span> '. __('Design Tool', 'web-to-print-online-designer'),            
            'color' => '<span class="dashicons dashicons-art"></span> '. __('Colors', 'web-to-print-online-designer'),         
            'upload' => '<span class="dashicons dashicons-upload"></span> '. __('Upload design', 'web-to-print-online-designer')         
        ));
        require_once(NBDESIGNER_PLUGIN_DIR . 'includes/settings/general.php');
        require_once(NBDESIGNER_PLUGIN_DIR . 'includes/settings/frontend.php');
        require_once(NBDESIGNER_PLUGIN_DIR . 'includes/settings/colors.php');
        require_once(NBDESIGNER_PLUGIN_DIR . 'includes/settings/upload.php');
        $Nbdesigner_Settings = new Nbdesigner_Settings(array(
            'page_id' => $page_id,
            'tabs' => $tabs    
        ));   
        $blocks = apply_filters('nbdesigner_settings_blocks', array(
            'general' => array(
                'general-settings' => __('General Settings', 'web-to-print-online-designer'),
                'admin-notifications' => __('Notifications', 'web-to-print-online-designer'),
                'application' => __('Application', 'web-to-print-online-designer'),
                'nbd-pages' => __('NBD Pages', 'web-to-print-online-designer')
            ),
            'frontend' => array(
                'tool-text' =>  __('Text Options', 'web-to-print-online-designer'),
                'tool-clipart' =>  __('Clipart Options', 'web-to-print-online-designer'),
                'tool-image' =>  __('Image Options', 'web-to-print-online-designer'),
                'tool-draw' =>  __('Free draw Options', 'web-to-print-online-designer'),
                'tool-qrcode' =>  __('Qr Code Options', 'web-to-print-online-designer')
            ),
            'color' => array(
                'color-setting' =>  __('Setting color', 'web-to-print-online-designer')
            ),
            'upload' => array(
                'upload-settings' =>  __('Upload settings', 'web-to-print-online-designer')
            )            
        ));  
        $Nbdesigner_Settings->add_blocks($blocks);
        $Nbdesigner_Settings->add_blocks_description(array());
        $frontend_options = Nbdesigner_Settings_Frontend::get_options();
        $general_options = Nbdesigner_Settings_General::get_options();
        $color_options = Nbdesigner_Settings_Colors::get_options();
        $upload_options = Nbdesigner_Settings_Upload::get_options();
        $options = apply_filters('nbdesigner_settings_options', array(
            'general-settings' => $general_options['general-settings'],
            'admin-notifications' => $general_options['admin-notifications'],
            'application' => $general_options['application'],
            'nbd-pages' => $general_options['nbd-pages'],
            'tool-text' => $frontend_options['tool-text'],
            'tool-clipart' => $frontend_options['tool-clipart'],
            'tool-image' => $frontend_options['tool-image'],
            'tool-draw' => $frontend_options['tool-draw'],
            'tool-qrcode' => $frontend_options['tool-qrcode'],
            'color-setting' => $color_options['color-setting'],
            'upload-settings' => $upload_options['upload-settings']
        ));    
        foreach($options as $key => $option){
            $Nbdesigner_Settings->add_block_options( $key, $option);  
        }    
        do_action( 'nbdesigner_before_options_save', $page_id );
        if ( isset($_POST['nbdesigner_save_options_'.$page_id]) ) {
            check_admin_referer( $page_id.'_nonce' );             
            $Nbdesigner_Settings->save_options();
        }
        else if( isset($_POST['nbdesigner_reset_options_'.$page_id]) ) {
            check_admin_referer( $page_id.'_nonce' );
            $Nbdesigner_Settings->reset_options();
        } 
        add_action('nbdesigner_settings_header_start', array(&$this, 'display_license_key'));
        $Nbdesigner_Settings->output();    
    }
    public function admin_footer_text($footer_text){
        $current_screen = get_current_screen();
        $nbd_pages = array(
            'toplevel_page_nbdesigner', 
            'nbdesigner_page_nbdesigner_manager_product', 
            'toplevel_page_nbdesigner_shoper',
            'nbdesigner_page_nbdesigner_frontend_translate',
            'nbdesigner_page_nbdesigner_tools',
            'nbdesigner_page_nbdesigner_manager_arts',
            'nbdesigner_page_nbdesigner_manager_fonts',
            'admin_page_nbdesigner_detail_order'
        );
        if ( isset( $current_screen->id ) && in_array( $current_screen->id, $nbd_pages ) ){
            $footer_text = sprintf( __( 'If you <span style="color: #e25555;">♥</span> <strong>NBDesigner</strong> please leave us a %s&#9733;&#9733;&#9733;&#9733;&#9733;%s rating. A huge thanks in advance!', 'web-to-print-online-designer'), '<a href="https://wordpress.org/support/view/plugin-reviews/web-to-print-online-designer?filter=5#new-post" target="_blank" class="nbd-rating-link" data-rated="' . esc_attr__( 'Thanks :)', 'web-to-print-online-designer') . '">', '</a>' );
        }
        return $footer_text;
    }
    public function display_license_key(){
        $license = $this->nbdesigner_check_license();
        $site_title = get_bloginfo( 'name' );
        $site_url = base64_encode(rtrim(get_bloginfo('wpurl'), '/'));   
        require_once(NBDESIGNER_PLUGIN_DIR . 'views/nbdesigner-settings.php');
    }
    public function nbdesigner_menu() {       
        if (current_user_can('manage_nbd_setting')) {
            add_menu_page('Nbdesigner', 'NBDesigner', 'manage_nbd_setting', 'nbdesigner', array($this, 'nbdesigner_settings'), NBDESIGNER_PLUGIN_URL . 'assets/images/logo.png', 26);
            $nbdesigner_manage = add_submenu_page(
                    'nbdesigner', 'NBDesigner Settings', 'Settings', 'manage_nbd_setting', 'nbdesigner', array($this, 'nbdesigner_settings')
            );
            add_action('load-'.$nbdesigner_manage, array('Nbdesigner_Helper', 'settings_helper'));
        }
        if(current_user_can('manage_nbd_product')){
            $product_hook = add_submenu_page(
                    'nbdesigner', 'Manager Products', 'Products', 'manage_nbd_product', 'nbdesigner_manager_product', array($this, 'nbdesigner_manager_product')
            );
            add_action( "load-$product_hook", array( $this, 'nbdesigner_template_screen_option' ));
            add_submenu_page(
                    '', 'Detail Design Order', 'Detail Design Order', 'manage_nbd_product', 'nbdesigner_detail_order', array($this, 'nbdesigner_detail_order')
            );
        }
        if(current_user_can('manage_nbd_art')){    
            add_submenu_page(
                    'nbdesigner', 'Manager Cliparts', 'Cliparts', 'manage_nbd_art', 'nbdesigner_manager_arts', array($this, 'nbdesigner_manager_arts')
            );
        }
        if(current_user_can('manage_nbd_font')){    
            add_submenu_page(
                    'nbdesigner', 'Manager Fonts', 'Fonts', 'manage_nbd_font', 'nbdesigner_manager_fonts', array($this, 'nbdesigner_manager_fonts')
            );
        }
        if(current_user_can('manage_nbd_language')){  
            add_submenu_page(
                    'nbdesigner', 'Frontend Translate', 'Frontend Translate', 'manage_nbd_language', 'nbdesigner_frontend_translate', array($this, 'nbdesigner_frontend_translate')
            );             
        }
        if (current_user_can('manage_nbd_tool')) {    
            add_submenu_page(
                    'nbdesigner', 'NBDesigner Tools', 'Tools', 'manage_nbd_tool', 'nbdesigner_tools', array($this, 'nbdesigner_tools')
            );  
//            add_submenu_page(
//                    'nbdesigner', 'NBDesigner Analytics', 'Analytics', 'administrator', 'nbdesigner_analytics', array($this, 'nbdesigner_analytics')
//            );            
        }
    }
    public function nbdesigner_template_screen_option() {
        if(isset($_GET['view']) && $_GET['view'] == 'templates'){
            $option = 'per_page';
            $args   = array(
                'label'   => 'Templates',
                'default' => 10,
                'option'  => 'templates_per_page'
            );
            add_screen_option( $option, $args );            
        }
    }    
    public static function set_screen( $status, $option, $value ) {
        return $value;
    }
    public function nbdesigner_get_license_key(){       
        if (!wp_verify_nonce($_POST['nbdesigner_getkey_hidden'], 'nbdesigner-get-key') || !current_user_can('administrator')) {
            die('Security error');
        }        
        if(isset($_POST['nbdesigner'])){
            $data =$_POST['nbdesigner'];
            $email = base64_encode($data['email']);
            $domain = $data['domain'];
            $title = ($data['name'] != '') ? urlencode($data['name']) : urlencode($data['title']);
            $ip = base64_encode($this->nbdesigner_get_ip());
            $url = NBDESIGNER_AUTHOR_SITE.'subcrible/WPP1074/'.$email.'/'.$domain.'/'.$title .'/'.$ip;	 	            
            $result = nbd_file_get_contents($url);
            if(isset($result)) {
                echo $result;
            }else{
                echo 'Please try later!';
            }
            wp_die();
        }
    }
    public function nbdesigner_get_ip(){
        $ip = $_SERVER['REMOTE_ADDR'];
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        }
        return $ip;        
    }
    public static function nbdesigner_add_action_links($links){	       
        $mylinks = array(
            'setting' => '<a href="' . admin_url('options-general.php?page=nbdesigner') . '">Settings</a>'
        );
        return array_merge($mylinks, $links);
    }
    public static function nbdesigner_plugin_row_meta( $links, $file ) {      
        if($file == NBDESIGNER_PLUGIN_BASENAME){           
            $row_meta = array(
                'upgrade' => '<a href="https://cmsmart.net/support_ticket" target="_blank">Support</a>'
            );
            return array_merge( $links, $row_meta );
        }
        return (array) $links;
    }
    public function nbdesigner_manager_product() {
        if(isset($_GET['view']) && $_GET['view'] == "templates"){
            $pid = $_GET['pid'];
            $pro = wc_get_product($pid);            
            $templates_obj = new Product_Template_List_Table();  
            include_once(NBDESIGNER_PLUGIN_DIR . 'views/nbdesigner-admin-template.php');
        }else{
            $q = '';
            if( isset($_POST['q']) ){
                $q = $_POST['q'] != '' ? $_POST['q'] : '';
            }else if( isset($_GET['s']) && $_GET['s'] != '' ){
                $q =  $_GET['s'];
            }
            $products = get_transient( 'nbd_list_products' );
            $number_pro = get_transient( 'nbd_number_of_products' );
            $limit = apply_filters('nbd_admin_products_per_page', 20);
            if ( $q != '' || false === $products ) {
                $args_query = array(
                    'post_type' => 'product',
                    'post_status' => 'publish',
                    'meta_key' => '_nbdesigner_enable',
                    'orderby' => 'id',
                    'order' => 'DESC',
                    'posts_per_page'=> -1,
                    'meta_query' => array(
                        array(
                            'key' => '_nbdesigner_enable',
                            'value' => 1,
                        )
                    )
                );     
                if( $q != '' ) $args_query['s'] = $q;
                $products = get_posts($args_query);
                $number_pro = count( $products );
                if( $q == '' ){
                    set_transient( 'nbd_list_products' , $products, DAY_IN_SECONDS );  
                    set_transient( 'nbd_number_of_products' , $number_pro, DAY_IN_SECONDS );                      
                }
            }  
            $page = filter_input(INPUT_GET, "p", FILTER_VALIDATE_INT);
            if(isset($page)){
                $_tp = ceil($number_pro / $limit);
                if($page > $_tp) $page = $_tp;
                $products = array_slice($products, ($page-1)*$limit, $limit);
            }else{
                $page = 1;
                if($number_pro > $limit) $products = array_slice($products, ($page-1)*$limit, $limit);	
            }                
            foreach ($products as $product) {
                $product_id = $product->ID;
                $_product = wc_get_product( $product_id );
                $pro[] = array(
                    'url'   => admin_url('post.php?post=' . absint( $product_id ) . '&action=edit'),
                    'img'   => $_product->get_image(),
                    'name'  => $product->post_title,
                    'id'    => absint( $product_id ),
                    'number_template'  =>  Product_Template_List_Table::count_product_template( $product_id )
                );
            }                       
            $url = admin_url('admin.php?page=nbdesigner_manager_product');
            if( $q != '' ) $url .= "&s={$q}";
            require_once NBDESIGNER_PLUGIN_DIR . 'includes/class.nbdesigner.pagination.php';
            $paging = new Nbdesigner_Pagination();
            $config = array(
                'current_page'  => isset($page) ? $page : 1, 
                'total_record'  => $number_pro,
                'limit'         => $limit,
                'link_full'     => $url.'&p={p}',
                'link_first'    => $url              
            );	        
            $paging->init($config);            
            include_once(NBDESIGNER_PLUGIN_DIR . 'views/manager-product.php');
        }
    }
    public function delete_nbd_product_transient(){
        delete_transient( 'nbd_list_products' );
        delete_transient( 'nbd_number_of_products' );
        delete_transient( 'nbd_frontend_products' );
    }
    public function nbdesigner_add_font_cat() {
        $data = array(
                'mes'   =>  __('You do not have permission to add/edit font category!', 'web-to-print-online-designer'),
                'flag'  => 0
            );	        
        if (!wp_verify_nonce($_POST['nonce'], 'nbdesigner_add_cat') || !current_user_can('edit_nbd_font')) {
            echo json_encode($data);
            wp_die();
        }
        $path = NBDESIGNER_DATA_DIR . '/font_cat.json';
        $list = $this->nbdesigner_read_json_setting($path);
        $cat = array(
            'name' => $_POST['name'],
            'id' => $_POST['id']
        );
        $this->nbdesigner_update_json_setting($path, $cat, $cat['id']);
        $data['mes'] = __('Category has been added/edited successfully!', 'web-to-print-online-designer');
        $data['flag'] = 1;        
        echo json_encode($data);
        wp_die();
    }
    public function nbdesigner_add_art_cat() {    
        $data = array(
                'mes'   =>  __('You do not have permission to add/edit clipart category!', 'web-to-print-online-designer'),
                'flag'  => 0
            );	        
        if (!wp_verify_nonce($_POST['nonce'], 'nbdesigner_add_cat') || !current_user_can('edit_nbd_art')) {
            echo json_encode($data);
            wp_die();
        }
        $path = NBDESIGNER_DATA_DIR . '/art_cat.json';
        $cat = array(
            'name' => sanitize_text_field($_POST['name']),
            'id' => $_POST['id']
        );
        $this->nbdesigner_update_json_setting($path, $cat, $cat['id']);
        $data['mes'] = __('Category has been added/edited successfully!', 'web-to-print-online-designer');
        $data['flag'] = 1;        
        echo json_encode($data);
        wp_die();
    }
    public function nbdesigner_delete_font_cat() {
        $data = array(
                'mes'   =>  __('You do not have permission to delete font category!', 'web-to-print-online-designer'),
                'flag'  => 0
            );        
        if (!wp_verify_nonce($_POST['nonce'], 'nbdesigner_add_cat') || !current_user_can('edit_nbd_font')) {
            echo json_encode($data);
            wp_die();
        }
        $path = NBDESIGNER_DATA_DIR . '/font_cat.json';
        $id = $_POST['id'];
        $this->nbdesigner_delete_json_setting($path, $id, true);
        $font_path = NBDESIGNER_DATA_DIR . '/fonts.json';
        $this->nbdesigner_update_json_setting_depend($font_path, $id);
        $data['mes'] = __('Category has been delete successfully!', 'web-to-print-online-designer');
        $data['flag'] = 1;        
        echo json_encode($data);
        wp_die();
    }
    public function nbdesigner_delete_art_cat() {
        $data = array(
                'mes'   =>  __('You do not have permission to delete clipart category!', 'web-to-print-online-designer'),
                'flag'  => 0
            );          
        if (!wp_verify_nonce($_POST['nonce'], 'nbdesigner_add_cat') || !current_user_can('delete_nbd_art')) {
            echo json_encode($data);
            wp_die();
        }
        $path = NBDESIGNER_DATA_DIR . '/art_cat.json';
        $id = $_POST['id'];
        $this->nbdesigner_delete_json_setting($path, $id, true);
        $art_path = NBDESIGNER_DATA_DIR . '/arts.json';
        $this->nbdesigner_update_json_setting_depend($art_path, $id);
        $data['mes'] = __('Category has been delete successfully!', 'web-to-print-online-designer');
        $data['flag'] = 1;        
        echo json_encode($data);
        wp_die();
    }
    public function nbdesigner_get_list_google_font() {
        $path = NBDESIGNER_PLUGIN_DIR . 'data/listgooglefonts.json';
        $data = (array) $this->nbdesigner_read_json_setting($path);
        return json_encode($data);
    }
    public function nbdesigner_add_google_font() {
        $data = array(
                'mes'   =>  __('You do not have permission to add font!', 'web-to-print-online-designer'),
                'flag'  => 0
            );        
        if (!wp_verify_nonce($_POST['nonce'], 'nbdesigner_add_cat') || !current_user_can('edit_nbd_font')) {
            die('Security error');
        }
        $name = $_POST['name'];
        $id = $_POST['id'];
        $path_font = NBDESIGNER_DATA_DIR . '/googlefonts.json';
        $data = array("name" => $name, "alias" => $name, "id" => $id, "type"   =>  "google", "cat" => array("99"));
        $this->nbdesigner_update_json_setting($path_font, $data, $id);
        $data['mes'] = __('The font has been added successfully!', 'web-to-print-online-designer');
        $data['flag'] = 1;        
        echo json_encode($data);
        wp_die();
    }
    public function nbdesigner_manager_fonts() {
        $notice = '';
        $font_id = 0;
        $cats = array("0");
        $current_font_cat_id = 0;
        $update = false;
        $list = $this->nbdesigner_read_json_setting(NBDESIGNER_DATA_DIR . '/fonts.json');	
        $cat = $this->nbdesigner_read_json_setting(NBDESIGNER_DATA_DIR . '/font_cat.json');
        $data_font_google = $this->nbdesigner_read_json_setting(NBDESIGNER_DATA_DIR . '/googlefonts.json');
        $list_all_google_font = $this->nbdesigner_get_list_google_font();
        $current_cat = filter_input(INPUT_GET, "cat_id", FILTER_VALIDATE_INT);
        if (is_array($cat))
            $current_font_cat_id = sizeof($cat);
        if (isset($_GET['id'])) {
            $font_id = $_GET['id'];
            $update = true;
            if (isset($list[$font_id])) {
                $font_data = $list[$font_id];
                $cats = $font_data->cat;
            }
        }
        if (isset($_POST[$this->plugin_id . '_hidden']) && wp_verify_nonce($_POST[$this->plugin_id . '_hidden'], $this->plugin_id) && current_user_can('edit_nbd_font')) {
            $font = array();
            $font['name'] = esc_html($_POST['nbdesigner_font_name']);
            $font['alias'] = 'nbfont' . substr(md5(rand(0, 999999)), 0, 10);
            $font['id'] = $_POST['nbdesigner_font_id'];
            $font['cat'] = $cats;
            if (isset($_POST['nbdesigner_font_cat']))
                $font['cat'] = $_POST['nbdesigner_font_cat'];
            if (isset($_FILES['woff']) && ($_FILES['woff']['size'] > 0) && ($_POST['nbdesigner_font_name'] != '')) {
                $uploaded_file_name = basename($_FILES['woff']['name']);	               
                $allowed_file_types = array('woff', 'ttf');
                $font['type'] = $this->nbdesigner_get_extension($uploaded_file_name);              
                if (Nbdesigner_IO::checkFileType($uploaded_file_name, $allowed_file_types)) {
                    $upload_overrides = array('test_form' => false);
                    $uploaded_file = wp_handle_upload($_FILES['woff'], $upload_overrides);
                    if (isset($uploaded_file['url'])) {
                        $new_path_font = Nbdesigner_IO::create_file_path(NBDESIGNER_FONT_DIR, $font['alias'], $font['type']);
                        $font['file'] = $uploaded_file['file'];
                        $font['url'] = $uploaded_file['url'];
                        if (!copy($font['file'], $new_path_font['full_path'].'.'.$font['type'])) {
                            $notice = apply_filters('nbdesigner_notices', $this->nbdesigner_custom_notices('error', __('Failed to copy.', 'web-to-print-online-designer')));
                        }else{
                            $font['file'] = $new_path_font['date_path'] .'.'. $font['type'];
                            $font['url'] = $new_path_font['date_path'] .'.'. $font['type'];
                        }
                        if ($update) {
                            $this->nbdesigner_update_list_fonts($font, $font_id);
                        } else {
                            $this->nbdesigner_update_list_fonts($font);
                        }
                        $notice = apply_filters('nbdesigner_notices', $this->nbdesigner_custom_notices('success', __('Your font has been saved.', 'web-to-print-online-designer')));
                    } else {
                        $notice = apply_filters('nbdesigner_notices', $this->nbdesigner_custom_notices('error', __('Error while upload font, please try again!', 'web-to-print-online-designer')));
                    }
                } else {
                    $notice = apply_filters('nbdesigner_notices', $this->nbdesigner_custom_notices('error', __('Incorrect file extensions.', 'web-to-print-online-designer')));
                }
            } else if ($update && ($_POST['nbdesigner_font_name'] != '')) {
                $font_data->name = $_POST['nbdesigner_font_name'];
                $font_data->cat = $font['cat'];
                $this->nbdesigner_update_list_fonts($font_data, $font_id);
                $notice = apply_filters('nbdesigner_notices', $this->nbdesigner_custom_notices('success', __('Your font has been saved.', 'web-to-print-online-designer')));
            } else {
                $notice = apply_filters('nbdesigner_notices', $this->nbdesigner_custom_notices('warning', __('Please choose font file or font name.', 'web-to-print-online-designer')));
            }
            $list = $this->nbdesigner_read_json_setting(NBDESIGNER_DATA_DIR . '/fonts.json');
            $cats = $font['cat'];
        }        
        if(isset($current_cat)){
            $new_list = array();
            foreach($list as $art){    
                if(in_array((string)$current_cat, $art->cat)) $new_list[] = $art;
            }
            foreach($cat as $c){
                if($c->id == $current_cat){
                    $name_current_cat = $c->name;
                    break;
                } 
                $name_current_cat = 'uploaded';
            }
            $list = $new_list;             
        }else{
            $name_current_cat = 'uploaded';
        }
        $total = sizeof($list);
        include_once(NBDESIGNER_PLUGIN_DIR . 'views/nbdesigner-manager-fonts.php');
    }
    /**
     * Analytics and statistics customer used product design
     * @since 1.5
     * 
    */    
    public function nbdesigner_analytics() {
        //TODO something analytics
        include_once(NBDESIGNER_PLUGIN_DIR . 'views/nbdesigner-analytics.php');
    }    
    public function nbdesigner_update_list_fonts($font, $id = null) {
        if (isset($id)) {
            $this->nbdesigner_update_font($font, $id);
            return;
        }
        $list_font = array();
        $path = NBDESIGNER_DATA_DIR . '/fonts.json';
        $list = $this->nbdesigner_read_json_setting($path);
        if (is_array($list)) {
            $list_font = $list;
            $id = sizeOf($list_font);
            $font['id'] = (string) $id;
        }
        $list_font[] = $font;
        $res = json_encode($list_font);
        file_put_contents($path, $res);
    }
    public function nbdesigner_update_list_arts($art, $id = null) {
        $path = NBDESIGNER_DATA_DIR . '/arts.json';
        if (isset($id)) {
            $this->nbdesigner_update_json_setting($path, $art, $id);
            return;
        }
        $list_art = array();
        $list = $this->nbdesigner_read_json_setting($path);
        if (is_array($list)) {
            $list_art = $list;
            $id = sizeOf($list_art);
            $art['id'] = (string) $id;
        }
        $list_art[] = $art;
        $res = json_encode($list_art);
        file_put_contents($path, $res);
    }
    public function nbdesigner_read_json_setting($fullname) {
        if (file_exists($fullname)) {
            $list = json_decode(file_get_contents($fullname));           
        } else {
            $list = '';
            file_put_contents($fullname, $list);
        }
        return $list;
    }
    public function nbdesigner_delete_json_setting($fullname, $id, $reindex = true) {
        $list = $this->nbdesigner_read_json_setting($fullname);
        if (is_array($list)) {
            array_splice($list, $id, 1);
            if ($reindex) {
                $key = 0;
                foreach ($list as $val) {
                    $val->id = (string) $key;
                    $key++;
                }
            }
        }
        $res = json_encode($list);
        file_put_contents($fullname, $res);
    }
    public function nbdesigner_update_json_setting($fullname, $data, $id) {
        $list = $this->nbdesigner_read_json_setting($fullname);
        if (is_array($list))
            $list[$id] = $data;
        else {
            $list = array();
            $list[] = $data;
        }
        $_list = array();
        foreach ($list as $val) {
            $_list[] = $val;
        }
        $res = json_encode($_list);
        file_put_contents($fullname, $res);
    }
    public function nbdesigner_update_json_setting_depend($fullname, $id) {
        $list = $this->nbdesigner_read_json_setting($fullname);
        if (!is_array($list)) return;
        foreach ($list as $val) {             
            if (!((sizeof($val) > 0))) continue;
            //if (!sizeof($val->cat)) break;           
            foreach ($val->cat as $k => $v) {
                if ($v == $id) {                   
                    array_splice($val->cat, $k, 1);
                    break;
                }
            }
            foreach ($val->cat as $k => $v) {
                if ($v > $id) {
                    $new_v = (string) --$v;
                    unset($val->cat[$k]);
                    array_splice($val->cat, $k, 0, $new_v);
                    //$val->cat[$k] = (string)--$v;										
                }
            }
        }
        $res = json_encode($list);
        file_put_contents($fullname, $res);
    }
    public function nbdesigner_delete_font() {
        $data = array(
                'mes'   =>  __('You do not have permission to delete font!', 'web-to-print-online-designer'),
                'flag'  => 0
            );        
        if (!wp_verify_nonce($_POST['nonce'], 'nbdesigner_add_cat') || !current_user_can('delete_nbd_font')) {
            echo json_encode($data);
            wp_die();
        }
        $id = $_POST['id'];
        $type = $_POST['type'];
        if ($type == 'custom') {
            $path = NBDESIGNER_DATA_DIR . '/fonts.json';
            $list = $this->nbdesigner_read_json_setting($path);
            $file_font = $list[$id]->file;
            if(file_exists($file_font)){
                unlink($file_font);
            }else{
                $file_font = NBDESIGNER_FONT_DIR . $list[$id]->file;
                unlink($file_font);
            }
            
        } else
            $path = NBDESIGNER_DATA_DIR . '/googlefonts.json';
        $this->nbdesigner_delete_json_setting($path, $id);
        $data['mes'] = __('The font has been deleted successfully!', 'web-to-print-online-designer');
        $data['flag'] = 1;
        echo json_encode($data);
        wp_die();
    }
    public function nbdesigner_delete_art() {
        $data = array(
                'mes'   =>  __('You do not have permission to delete clipart!', 'web-to-print-online-designer'),
                'flag'  => 0
            );
        if (!wp_verify_nonce($_POST['nonce'], 'nbdesigner_add_cat') || !current_user_can('delete_nbd_art')) {
            echo json_encode($data);
            wp_die();
        }
        $id = $_POST['id'];
        $path = NBDESIGNER_DATA_DIR . '/arts.json';
        $list = $this->nbdesigner_read_json_setting($path);
        $file_art = $list[$id]->file;
        if(file_exists($file_art)){
            unlink($file_art);
        }else{
            $file_art = NBDESIGNER_ART_DIR . $list[$id]->file;
            unlink($file_art);
        }	     
        $this->nbdesigner_delete_json_setting($path, $id);
        $data['mes'] = __('Clipart has been deleted successfully!', 'web-to-print-online-designer');
        $data['flag'] = 1;
        echo json_encode($data);
        wp_die();
    }
    public function nbdesigner_update_font($font, $id) {
        $path = NBDESIGNER_DATA_DIR . '/fonts.json';
        $this->nbdesigner_update_json_setting($path, $font, $id);
    }
    public function nbdesigner_notices($value = '') {
        return $value;
    }
    public function nbdesigner_custom_notices($command, $mes) {
        switch ($command) {
            case 'success':
                if (!isset($mes))
                    $mes = __('Your settings have been saved.', 'web-to-print-online-designer');
                $notice = '<div class="updated notice notice-success is-dismissible">
                                <p>' . $mes . '</p>
                                <button type="button" class="notice-dismiss">
                                    <span class="screen-reader-text">Dismiss this notice.</span>
                                </button>				  
                            </div>';
                break;
            case 'error':
                if (!isset($mes))
                    $mes = __('Irks! An error has occurred.', 'web-to-print-online-designer');
                $notice = '<div class="notice notice-error is-dismissible">
                                <p>' . $mes . '</p>
                                <button type="button" class="notice-dismiss">
                                    <span class="screen-reader-text">Dismiss this notice.</span>
                                </button>				  
                            </div>';
                break;
            case 'notices':
                if (!isset($mes))
                    $mes = __('Irks! An error has occurred.', 'web-to-print-online-designer');
                $notice = '<div class="notice notice-warning">
                                <p>' . $mes . '</p>				  
                            </div>';
                break;             
            case 'warning':
                if (!isset($mes))
                    $mes = __('Warning.', 'web-to-print-online-designer');
                $notice = '<div class="notice notice-warning is-dismissible">
                                <p>' . $mes . '</p>
                                <button type="button" class="notice-dismiss">
                                    <span class="screen-reader-text">Dismiss this notice.</span>
                                </button>				  
                            </div>';
                break;
            default:
                $notice = '';
        }
        return $notice;
    }
    public function nbdesigner_manager_arts() {
        $notice = '';
        $current_art_cat_id = 0;
        $art_id = 0;
        $update = false;
        $cats = array("0");
        $list = $this->nbdesigner_read_json_setting(NBDESIGNER_DATA_DIR . '/arts.json');
        $cat = $this->nbdesigner_read_json_setting(NBDESIGNER_DATA_DIR . '/art_cat.json');
        $total = sizeof($list);
        $limit = 40;
        if (is_array($cat))
            $current_art_cat_id = sizeof($cat);
        if (isset($_GET['id'])) {
            $art_id = $_GET['id'];
            $update = true;
            if (isset($list[$art_id])) {
                $art_data = $list[$art_id];
                $cats = $art_data->cat;
            }
        }
        $page = filter_input(INPUT_GET, "p", FILTER_VALIDATE_INT);
        $current_cat = filter_input(INPUT_GET, "cat_id", FILTER_VALIDATE_INT);

        if (isset($_POST[$this->plugin_id . '_hidden']) && wp_verify_nonce($_POST[$this->plugin_id . '_hidden'], $this->plugin_id) && current_user_can('edit_nbd_art')) {
            $art = array();
            $art['name'] = esc_html($_POST['nbdesigner_art_name']);
            $art['title'] = esc_html($_POST['nbdesigner_art_name']);
            $art['id'] = $_POST['nbdesigner_art_id'];
            $art['cat'] = $cats;
            if (isset($_POST['nbdesigner_art_cat'])) $art['cat'] = $_POST['nbdesigner_art_cat'];
            
            if (isset($_FILES['svg'])) {
                $files = $_FILES['svg'];
                foreach ($files['name'] as $key => $value) {
                    $file = array(
                      'name'     => $files['name'][$key],
                      'type'     => $files['type'][$key],
                      'tmp_name' => $files['tmp_name'][$key],
                      'error'    => $files['error'][$key],
                      'size'     => $files['size'][$key]
                    );                    
                    $uploaded_file_name = basename($file['name']);
                    $allowed_file_types = array('svg', 'png', 'jpg', 'jpeg');
                    if (Nbdesigner_IO::checkFileType($uploaded_file_name, $allowed_file_types)) {
                        $upload_overrides = array('test_form' => false);
                        $uploaded_file = wp_handle_upload($file, $upload_overrides);
                        if (isset($uploaded_file['url'])) {
                            $new_path_art = Nbdesigner_IO::create_file_path(NBDESIGNER_ART_DIR, $uploaded_file_name);
                            $art['file'] = $uploaded_file['file'];
                            $art['url'] = $uploaded_file['url'];
                            $art['name'] = pathinfo($art['file'], PATHINFO_FILENAME);
                            if (!copy($art['file'], $new_path_art['full_path'])) {
                                $notice = apply_filters('nbdesigner_notices', $this->nbdesigner_custom_notices('error', __('Failed to copy.', 'web-to-print-online-designer')));
                            }else{
                                $art['file'] = $new_path_art['date_path'];
                                $art['url'] = $new_path_art['date_path'];
                                //$art['url'] = NBDESIGNER_ART_URL . $new_path_art['date_path'];
                            }                                               
                            if ($update) {
                                $this->nbdesigner_update_list_arts($art, $art_id);
                            } else {
                                $this->nbdesigner_update_list_arts($art);
                            }
                            $notice = apply_filters('nbdesigner_notices', $this->nbdesigner_custom_notices('success', __('Your art has been saved.', 'web-to-print-online-designer')));
                        } else {
                            $notice = apply_filters('nbdesigner_notices', $this->nbdesigner_custom_notices('error', __('Error while upload art, please try again!', 'web-to-print-online-designer')));
                        }
                    } else {
                        $notice = apply_filters('nbdesigner_notices', $this->nbdesigner_custom_notices('error', __('Incorrect file extensions.', 'web-to-print-online-designer')));
                    }
                }
            } else if ($update && ($_POST['nbdesigner_art_name'] != '')) {
                $art_data->name = $_POST['nbdesigner_art_name'];
                $art_data->cat = $art['cat'];
                $this->nbdesigner_update_list_arts($art_data, $art_id);
                $notice = apply_filters('nbdesigner_notices', $this->nbdesigner_custom_notices('success', __('Your art has been saved.', 'web-to-print-online-designer')));
            } else {
                $notice = apply_filters('nbdesigner_notices', $this->nbdesigner_custom_notices('warning', __('Please choose art file or art name.', 'web-to-print-online-designer')));
            }
            $list = $this->nbdesigner_read_json_setting(NBDESIGNER_DATA_DIR . '/arts.json');
            $cats = $art['cat'];
            $total = sizeof($list);
            
        }
        $name_current_cat = 'uploaded';
        if($total){
            if(isset($current_cat)){
                $new_list = array();
                foreach($list as $art){  
                    if(in_array((string)$current_cat, $art->cat)) $new_list[] = $art;
                    if(($current_cat == 0) && sizeof($art->cat) == 0) $new_list[] = $art;
                }
                foreach($cat as $c){
                    if($c->id == $current_cat){
                        $name_current_cat = $c->name;
                        break;
                    } 
                    $name_current_cat = 'uploaded';
                }
                $list = $new_list;
                $total = sizeof($list);               
            }else{
                $name_current_cat = 'uploaded';
            }
            if(isset($page)){
                $_tp = ceil($total / $limit);
                if($page > $_tp) $page = $_tp;
                $_list = array_slice($list, ($page-1)*$limit, $limit);
            }else{
                $_list = $list;
                if($total > $limit) $_list = array_slice($list, 0, $limit);	
            }
        } else{
            $_list = array();
        }        
        if(isset($current_cat)){
            $url = add_query_arg(array('cat_id' => $current_cat), admin_url('admin.php?page=nbdesigner_manager_arts'));
        }else{
            $url = admin_url('admin.php?page=nbdesigner_manager_arts');   
        }
        require_once NBDESIGNER_PLUGIN_DIR . 'includes/class.nbdesigner.pagination.php';
        $paging = new Nbdesigner_Pagination();
        $config = array(
            'current_page'  => isset($page) ? $page : 1, 
            'total_record'  => $total,
            'limit'         => $limit,
            'link_full'     => $url.'&p={p}',
            'link_first'    => $url              
        );	        
        $paging->init($config);         
        include_once(NBDESIGNER_PLUGIN_DIR . 'views/nbdesigner-manager-arts.php');
    }
    public function admin_success() {
        if (isset($_POST[$this->plugin_id . '_hidden']) && wp_verify_nonce($_POST[$this->plugin_id . '_hidden'], $this->plugin_id)){
            echo '<div class="updated notice notice-success is-dismissible">
                        <p>' . __('Your settings have been saved.', 'web-to-print-online-designer') . '</p>
                        <button type="button" class="notice-dismiss">
                            <span class="screen-reader-text">Dismiss this notice.</span>
                        </button>				  
                  </div>';
        }
    }
    public function add_design_box() {
        add_meta_box('nbdesigner_setting', __('Setting NBDesigner', 'web-to-print-online-designer'), array($this, 'setting_design'), 'product', 'normal', 'high');
        add_meta_box('nbdesigner_order', __('Customer Design', 'web-to-print-online-designer'), array($this, 'order_design'), 'shop_order', 'side', 'default');
    }
    public function nbdesigner_detail_order() {
        if(isset($_GET['order_id'])){
            $order_id = absint( $_GET['order_id'] );
            $order = new WC_Order($order_id);   
            $zip_files = array();
            if(isset($_GET['download-type']) && ($_GET['download-type'] == 'png' || $_GET['download-type'] == 'jpg' || $_GET['download-type'] == 'cmyk' || $_GET['download-type'] == 'svg')){
                $type =$_GET['download-type'];
                $path = NBDESIGNER_CUSTOMER_DIR .'/'. $_GET['nbd_item_key'];
                if( $type != 'png' && $type != 'svg' ) $path = $path . '/' .$type;
                if( $type == 'svg' ){
                    $svg_path = $path . '/svg';  
                    if( !file_exists($svg_path) ){
                        $this->convert_svg_embed($path);
                    }
                    $files = Nbdesigner_IO::get_list_svgs($svg_path, 1);  
                }else{
                    $files = Nbdesigner_IO::get_list_images($path, 1);   
                }
                if(count($files) > 0){
                    foreach($files as $key => $file){
                        $zip_files[] = $file;
                    }
                } else{
                    exit();
                }                 
                $pathZip = NBDESIGNER_DATA_DIR.'/download/customer-design-'.$_GET['nbd_item_key'].'-'.$type.'.zip';
                $nameZip = 'customer-design-'.$_GET['nbd_item_key'].'-'.$type.'.zip';
                $this->zip_files_and_download($zip_files, $pathZip, $nameZip); 
                exit();
            }
            if(isset($_GET['download-all']) && ($_GET['download-all'] == 'true')){
                $products = $order->get_items();
                foreach($products AS $order_item_id => $product){                
                    if(wc_get_order_item_meta($order_item_id, '_nbd') || wc_get_order_item_meta($order_item_id, '_nbu')){
                        $nbd_item_key = wc_get_order_item_meta($order_item_id, '_nbd');
                        $nbu_item_key = wc_get_order_item_meta($order_item_id, '_nbu');
                        if( $nbd_item_key ){
                            $list_images = Nbdesigner_IO::get_list_images(NBDESIGNER_CUSTOMER_DIR .'/'. $nbd_item_key, 1);
                            if(count($list_images) > 0){
                                foreach($list_images as $key => $image){
                                    $zip_files[] = $image;
                                }
                            }                            
                        }
                        if( $nbu_item_key ){
                            $files = Nbdesigner_IO::get_list_files( NBDESIGNER_UPLOAD_DIR .'/'. $nbu_item_key );
                            if(count($files) > 0){
                                foreach($files as $key => $file){
                                    $zip_files[] = $file;
                                }
                            }                             
                        }
                    }              
                }
                $pathZip = NBDESIGNER_DATA_DIR.'/download/customer-design-'.$_GET['order_id'].'.zip';
                $nameZip = 'customer-design-'.$_GET['order_id'].'.zip';
                $this->zip_files_and_download($zip_files, $pathZip, $nameZip);
            }
            if(isset($_GET['nbd_item_key'])){
                $license = $this->nbdesigner_check_license();
                $path = NBDESIGNER_CUSTOMER_DIR .'/'. $_GET['nbd_item_key'];
                $list_images = Nbdesigner_IO::get_list_images($path, 1);
                $_list_pdfs = Nbdesigner_IO::get_list_files($path . '/pdfs', 2);
                $list_design = array();
                $list_pdfs = array();
                $datas = unserialize(file_get_contents($path .'/product.json'));
                $option = unserialize(file_get_contents($path .'/option.json'));
                $path_config = $path . '/config.json';  
                $resources = (array)json_decode( file_get_contents( $path. '/design.json' ) );
                $fonts = array();
                if(file_exists( NBDESIGNER_DATA_DIR . '/fonts.json') ){
                    $fonts = (array)json_decode( file_get_contents( NBDESIGNER_DATA_DIR . '/fonts.json' ) );        
                }               
                $config = nbd_get_data_from_json($path_config);
                if( isset( $config->product ) && count( $config->product ) ){
                    $datas = array();
                    foreach($config->product as $side){
                        $datas[] = (array)$side;
                    }
                };                    
                if( isset( $config->custom_dimension ) ){
                    $custom_side = absint( $config->custom_dimension->side );
                    $custom_width = $config->custom_dimension->width;
                    $custom_height = $config->custom_dimension->height;
                    $datas = $this->merge_product_config( $datas, $custom_width, $custom_height, $custom_side );
                }                  
                foreach ($_list_pdfs as $_pdf){
                    if(is_dir($_pdf)) continue;
                    $list_pdfs[] = array(
                        'title' => basename($_pdf),
                        'url'   =>  Nbdesigner_IO::wp_convert_path_to_url($_pdf)
                    );
                }
                foreach ($list_images as $img){
                    $name = basename($img);
                    $arr = explode('.', $name);
                    $_frame = explode('_', $arr[0]);
                    $frame = $_frame[1];
                    $list_design[$frame] = Nbdesigner_IO::wp_convert_path_to_url($img);
                }              
            }
        }
        require_once NBDESIGNER_PLUGIN_DIR .'views/detail-order.php';
    }
    public function setting_design() {
        $current_screen = get_current_screen();
        $post_id = get_the_ID();
        $_designer_setting = unserialize(get_post_meta($post_id, '_designer_setting', true));
        $enable = get_post_meta($post_id, '_nbdesigner_enable', true);  
        $enable_upload = get_post_meta($post_id, '_nbdesigner_enable_upload', true);  
        $upload_without_design = get_post_meta($post_id, '_nbdesigner_enable_upload_without_design', true);  
        $unit = nbdesigner_get_option('nbdesigner_dimensions_unit');
        if (isset($_designer_setting[0])){
            foreach ($_designer_setting as $key => $set ){
                $_designer_setting[$key] = array_merge(nbd_default_product_setting(), $set);
            }
            $designer_setting = $_designer_setting;
            if(! isset($designer_setting[0]['version']) || $_designer_setting[0]['version'] < 160) {
                $designer_setting = $this->update_config_product_160($designer_setting);              
            }
            if(! isset($designer_setting[0]['version']) || $_designer_setting[0]['version'] < 180) {
                $designer_setting = NBD_Update_Data::nbd_update_media_v180($designer_setting);
            }
        }else {   
            $designer_setting = array();
            $designer_setting[0] = nbd_default_product_setting();           
        }
        $option = unserialize(get_post_meta($post_id, '_nbdesigner_option', true));
        $_option = nbd_get_default_product_option();
        if( !is_array($option) ){
            $option = array();
        }
        $option = array_merge($_option, $option);       
        $upload_setting = unserialize(get_post_meta($post_id, '_nbdesigner_upload', true));
        $_upload_setting = nbd_get_default_upload_setting();
        if( !is_array($upload_setting) ){
            $upload_setting = array();
        }   
        $upload_setting = array_merge($_upload_setting, $upload_setting);
        $designer_setting = $this->update_config_default($designer_setting);
        include_once(NBDESIGNER_PLUGIN_DIR . 'views/metabox-design-setting.php');
    }
    public function update_config_default($designer_setting) {
        $default =  nbd_default_product_setting();    
        foreach ($designer_setting as $key => $setting){
            $designer_setting[$key] = array_merge($default, $setting);
        }
        return $designer_setting;
    }
    public function update_config_product_160($designer_setting){
        $newSetting = array();
        $default =  nbd_default_product_setting();    
        foreach ($designer_setting as $key => $setting){
            $setting160 = array();     
            $scale = 1;
            if(($setting['img_src_width'] > $setting['img_src_height']) && ($setting['img_src_width'] < 300)) $scale = 300/ $setting['img_src_width'];
            if(($setting['img_src_width'] < $setting['img_src_height']) && ($setting['img_src_height'] < 300)) $scale = 300/ $setting['img_src_height'];
            $ratio150 = 300 / $setting['area_design_width'] / $scale * $setting['real_width'];
            $product_width = round($ratio150 * $setting['img_src_width'] * $scale / 300, 2);
            $product_height = round($ratio150 * $setting['img_src_height'] * $scale / 300, 2);
            $area_design_width = round($setting['area_design_width'] * $scale * 5/3);
            $area_design_height = round($setting['area_design_height'] * $scale * 5/3);
            $old_real_top = $ratio150 * $setting['area_design_top'] * $scale / 300;
            $old_real_left = $ratio150 * $setting['area_design_left'] * $scale / 300;
            $ratio = 500 / $product_height;
            $img_src_top = 0;
            $img_src_left = round(($product_height - $product_width) * $ratio / 2, 2);
            $img_src_height = 500;
            $img_src_width = round($product_width * $ratio);
            $real_top = round($old_real_top, 2);
            $real_left = round($old_real_left - ($product_height - $product_width) / 2, 2);
            if($product_width > $product_height){
                $img_src_top = round(($product_width - $product_height) * $ratio / 2, 2);
                $img_src_left = 0;
                $img_src_width = 500;
                $img_src_height = round($product_height * $ratio);
                $real_left = round($old_real_left, 2);
                $real_top = round($old_real_top - ($product_width - $product_height) / 2, 2);
            }
            $area_design_left = round($setting['area_design_left'] * $scale * 5/3);
            $area_design_top = round($setting['area_design_top'] * $scale * 5/3);
            $setting160['product_width'] = $product_width;
            $setting160['product_height'] = $product_height;
            $setting160['real_width'] = $setting['real_width'];
            $setting160['real_height'] = $setting['real_height'];
            $setting160['real_left'] = $real_left;
            $setting160['real_top'] = $real_top;
            $setting160['area_design_left'] = $area_design_left;
            $setting160['area_design_top'] = $area_design_top;
            $setting160['area_design_width'] = $area_design_width;
            $setting160['area_design_height'] = $area_design_height;
            $setting160['img_src_top'] = $img_src_top;
            $setting160['img_src_left'] = $img_src_left;
            $setting160['img_src_height'] = $img_src_height;
            $setting160['img_src_width'] = $img_src_width;
            $setting160['img_src'] = $setting['img_src'];
            $setting160['orientation_name'] = $setting['orientation_name'];   
            $setting160 = array_merge($default, $setting160);
            $newSetting[$key] = $setting160;
        }
        return $newSetting;
    }
    public function nbdesigner_update_all_product(){
        if (!wp_verify_nonce($_POST['_nbdesigner_update_product'], 'nbdesigner-update-product') || !current_user_can('administrator')) {
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
                $product = wc_get_product($post->ID);       
                if( $product->is_type( 'variable' ) ) { 
                    $variations = $product->get_available_variations( false );
                    foreach ($variations as $variation){
                        $vid = $variation['variation_id'];
                        $designer_setting = unserialize(get_post_meta($vid, '_designer_setting'.$vid, true));
//                        if(! isset($designer_setting[0]['version']) || $designer_setting[0]['version'] < 160) {
//                            $newSetting = $this->update_config_product_160($designer_setting);
//                            update_post_meta($vid, '_designer_setting'.$vid, serialize($newSetting));                     
//                        } 
                        if(! isset($designer_setting[0]['version']) || $designer_setting[0]['version'] < 170) {
                            $setting_design = $this->update_config_product_170($designer_setting);
                            update_post_meta($vid, '_designer_variation_setting', serialize($setting_design));
                        }
                    }
                }
                $pid = $post->ID;
                $designer_setting = unserialize(get_post_meta($pid, '_designer_setting', true));
//                if(! isset($designer_setting[0]['version']) || $designer_setting[0]['version'] < 160) {
//                    $newSetting = $this->update_config_product_160($designer_setting);
//                    update_post_meta($pid, '_designer_setting', serialize($newSetting));                  
//                }  
                if(! isset($designer_setting[0]['version']) || $designer_setting[0]['version'] < 170) {
                    $dpi = get_post_meta($pid, '_nbdesigner_dpi', true);
                    $option = nbd_get_default_product_option();
                    $option['dpi'] = $dpi;
                    update_post_meta($pid, '_nbdesigner_option', serialize($option)); 
                    $setting_upload = nbd_get_default_upload_setting();
                    update_post_meta($pid, '_nbdesigner_upload', $setting_upload);
                    $setting_design = $this->update_config_product_170($designer_setting);
                    update_post_meta($pid, '_designer_setting', serialize($setting_design));
                }                   
            }
        }
        echo json_encode($result);
        wp_die();
    }
    public function update_config_product_170($designer_setting){
        foreach($designer_setting as $key => $val ){
            $designer_setting[$key] = array_merge(nbd_default_product_setting(), $val);
        }
        return $designer_setting;
    }
    public function order_design($post) {
        $order_id = $post->ID;
        $order = new WC_Order($order_id);         
        $products = $order->get_items();
        $_data_designs = unserialize(get_post_meta($order_id, '_nbdesigner_design_file', true));
        if(isset($_data_designs) && is_array($_data_designs))    $data_designs = $_data_designs;
        $_data_uploads = unserialize(get_post_meta($order_id, '_nbdesigner_upload_file', true));
        if(isset($_data_uploads) && is_array($_data_uploads))    $data_uploads = $_data_uploads;        
        $has_design = get_post_meta($order_id, '_nbd', true);
        $has_upload = get_post_meta($order_id, '_nbu', true);
        include_once(NBDESIGNER_PLUGIN_DIR . 'views/box-order-metadata.php');
    }
    public function nbdesigner_allow_create_product($id){
        $args = array(
            'post_type'  => 'product',
            'meta_key' => '_nbdesigner_enable',
            'meta_value' => 1
        );
        $query = new WP_Query($args);
        $pros = get_posts($args);
        $list = array();
        foreach ($pros as $pro){
            $list[] = $pro->ID;
        }        
        $count = $query->found_posts;
        $license = $this->nbdesigner_check_license();
        if(!isset($license['key'])) return false;
        if(in_array($id, $list)) return true;
        $salt = md5($license['key'].'pro'); 
        if(($salt != $license['salt']) && ($count > 5)) return false;
        return true;
    }
    public function nbdesigner_get_info_license(){
        if (!wp_verify_nonce($_POST['_nbdesigner_license_nonce'], 'nbdesigner-active-key') || !current_user_can('administrator')) {
            die('Security error');
        } 
        $result = array();
        if(isset($_POST['nbdesigner']['license'])) {
            $license = $_POST['nbdesigner']['license'];            
            $result_from_json = $this->nbdesiger_request_license($license, $this->activedomain);
            $data = (array)json_decode($result_from_json);            
            if(isset($data)) {
                switch ($data["code"]) {
                    case -1 :
                        $result['mes'] = __('Missing necessary information!', 'web-to-print-online-designer');
                        $result['flag'] = 0;
                        break;
                    case 0 :
                        $result['mes'] = __('Incorrect information, check again license key', 'web-to-print-online-designer');
                        $result['flag'] = 0;
                        break;     
                    case 1 :
                        $result['mes'] = __('Incorrect License key', 'web-to-print-online-designer');
                        $result['flag'] = 0;
                        break;
                    case 2 :
                        $result['mes'] = __('License key is locked ', 'web-to-print-online-designer');
                        $result['flag'] = 0;
                        break; 
                    case 3 :
                        $result['mes'] = __('License key have expired', 'web-to-print-online-designer');
                        $result['flag'] = 0;
                        break;
                    case 4 :
                        $result['mes'] = __('Link your website incorrect', 'web-to-print-online-designer');
                        $result['flag'] = 0;
                        break;     
                    case 5 :
                        $result['mes'] = __('License key can using', 'web-to-print-online-designer');
                        $result['flag'] = 1;
                        break;
                    case 6 :
                        $result['mes'] = __('Domain has been added successfully', 'web-to-print-online-designer');
                        $result['flag'] = 1;
                        break;     
                    case 7 :
                        $result['mes'] = __('Exceed your number of domain license', 'web-to-print-online-designer');
                        $result['flag'] = 0;
                        break;
                    case 8 :
                        $result['mes'] = __('Unsuccessfully active license key', 'web-to-print-online-designer');
                        $result['flag'] = 0;
                        break;                     
                }            
                $data['key'] = $license;
                $data['salt'] = md5($license.$data['type']);
                if($data['type'] == 'free') $data['number_domain'] = "5";
                if(($data["code"] == 5) || ($data["code"] == 6)){
                    $this->nbdesigner_write_license(json_encode($data));  
                }                      
            }else{
                $result['mes'] = __('Try again later!', 'web-to-print-online-designer');
            }
        }else {
            $result['mes'] = __('Please fill your license!', 'web-to-print-online-designer');
        }
        echo json_encode($result);
        wp_die();
    }
    public function nbdesigner_remove_license(){
        if (!wp_verify_nonce($_POST['_nbdesigner_license_nonce'], 'nbdesigner-active-key') || !current_user_can('administrator')) {
            die('Security error');
        } 	        
        $result = array();
        $result['flag'] = 0;
        $path = NBDESIGNER_PLUGIN_DIR . 'data/license.json';
        $path_data = NBDESIGNER_DATA_CONFIG_DIR . '/license.json';
        if(file_exists($path_data)) {
            $path = $path_data;
        }
        $license = $this->nbdesigner_check_license();
        if(!file_exists($path)){
            $result['mes'] = __('You haven\'t any license!', 'web-to-print-online-designer');
        }else{
            $license = $this->nbdesigner_check_license();
            $key = (isset($license['key'])) ? $license['key'] : '';
            $_request = $this->nbdesiger_request_license($key, $this->removedomain);             
            if(isset($_request)){              
                $request = (array)json_decode($_request);                   
                switch ($request["code"]) {
                    case -1:
                        $result['mes'] = __('Missing necessary information', 'web-to-print-online-designer');
                        break;
                    case 0:
                        $result['mes'] = __('Incorrect information', 'web-to-print-online-designer');
                        break;
                    case 1:
                        $result['mes'] = __('Incorrect License key', 'web-to-print-online-designer');
                        break;
                    case 2: 
                        if(!unlink($path)){
                            $result['mes'] = __('Error, try again later!', 'web-to-print-online-designer');
                        }else{
                            $_path = NBDESIGNER_PLUGIN_DIR . 'data/license.json';
                            if(file_exists($_path)) unlink($_path);                        
                            $result['mes'] = __('Remove license key Successfully', 'web-to-print-online-designer');
                            $result['flag'] = 1;
                        };                        
                        break;  
                    case 3:
                        $result['mes'] = __('Remove license key Unsuccessfully!', 'web-to-print-online-designer');
                        break;                    
                }
            }
        }       
        echo json_encode($result);
        wp_die();        
    }
    private function nbdesiger_request_license($license, $task){
        $url_root = base64_encode(rtrim(get_bloginfo('wpurl'), '/'));	
        $url = NBDESIGNER_AUTHOR_SITE.$task.NBDESIGNER_SKU.'/'.$license.'/'.$url_root;	        
        return nbd_file_get_contents($url);
    }
    private function nbdesigner_write_license($license){
        $path_data = NBDESIGNER_DATA_CONFIG_DIR . '/license.json';
        if (!file_exists(NBDESIGNER_DATA_CONFIG_DIR)) {
            wp_mkdir_p(NBDESIGNER_DATA_CONFIG_DIR);
        }         
        file_put_contents($path_data, $license);
    }
    private function nbdesigner_check_license(){
        $path_data = NBDESIGNER_DATA_CONFIG_DIR . '/license.json';
        $path = NBDESIGNER_PLUGIN_DIR . 'data/license.json';
        if(file_exists($path_data)) $path = $path_data;
        $result = array();
        $result['status'] = 1;
        if(!file_exists($path)){
            $result['status'] = 0;
        }else{
            $data = (array) json_decode(file_get_contents($path));
            $code = (isset($data["code"])) ? $data["code"] : 10;
            if(($code != 5) && ($code != 6)){
                $result['status'] = 0;	               
            }
            $now = strtotime("now");
            $expiry_date = (isset($data["expiry-date"])) ? $data["expiry-date"] : 0;
            $result['expiry'] = $expiry_date;
            if($expiry_date < $now){
                $result['status'] = 0;             
            }
            if(isset($data['key'])) $result['key'] = $data['key'];
            if(isset($data['type'])) {	                
                $result['type'] = $data['type'];
                $license = (isset($data['key'])) ? $data['key'] : 'somethingiswrong';
                $salt = (isset($data['salt'])) ? $data['salt'] : 'somethingiswrong';
                $new_salt = md5($license.'pro');	                
                if($salt == $new_salt){
                    $result['type'] = $data['type'];
                }else{
                    $result['type'] = 'free';
                    $result['status'] = 0;    
                } 
                $result['salt'] = $salt;
            }
        }
        return $result;
    }
    public function save_settings($post_id) {   
        if (!isset($_POST['nbdesigner_setting_box_nonce']) || !wp_verify_nonce($_POST['nbdesigner_setting_box_nonce'], 'nbdesigner_setting_box')
            || !(current_user_can('administrator') || current_user_can('shop_manager'))) {
            return $post_id;
        }
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return $post_id;
        }
        if ('page' == $_POST['post_type']) {
            if (!current_user_can('edit_page', $post_id)) {
                return $post_id;
            }
        } else {
            if (!current_user_can('edit_post', $post_id)) {
                return $post_id;
            }
        }
        $enable = $_POST['_nbdesigner_enable']; 
        $enable_upload = $_POST['_nbdesigner_enable_upload']; 
        $upload_without_design = $_POST['_nbdesigner_enable_upload_without_design']; 
        $option = serialize($_POST['_nbdesigner_option']); 
        $setting_design = serialize($_POST['_designer_setting']);  
        $setting_upload = serialize($_POST['_designer_upload']);  
        if(!$this->nbdesigner_allow_create_product($post_id)) return;
        update_post_meta($post_id, '_designer_setting', $setting_design);
        update_post_meta($post_id, '_nbdesigner_option', $option);
        update_post_meta($post_id, '_nbdesigner_upload', $setting_upload);
        update_post_meta($post_id, '_nbdesigner_enable_upload_without_design', $upload_without_design);
        update_post_meta($post_id, '_nbdesigner_enable', $enable);
        update_post_meta($post_id, '_nbdesigner_enable_upload', $enable_upload);
    }
    public function nbdesigner_get_extension($file_name) {
        $filetype = explode('.', $file_name);
        $file_exten = $filetype[count($filetype) - 1];
        return $file_exten;
    }
    public function nbdesigner_button() {
        if(isset($_POST['action'])) return ''; /*Hidden button Start Design on third-party plugin as Quick view*/
        $pid = get_the_ID();   
        $pid = get_wpml_original_id($pid);       
        $is_nbdesign = get_post_meta($pid, '_nbdesigner_enable', true); 
        $variation_id = 0;
        if ($is_nbdesign) {
            /* Multi language with WPML */
            if( count($_REQUEST) ){
                $attributes = array();
                $product = wc_get_product($pid);
                foreach ($_REQUEST as $key => $value){
                    if (strpos($key, 'attribute_') === 0) {
                        $attributes[$key] = $value;
                    }
                    if( count($attributes) ){
                        if (class_exists('WC_Data_Store')) {
                            $data_store = WC_Data_Store::load('product');
                            $variation_id = $data_store->find_matching_product_variation($product, $attributes);
                        }else{
                            $variation_id = $product->get_matching_variation($attributes);
                        }
                    }
                }
            }           
            $site_url = site_url();
            if ( class_exists('SitePress') ) {
                $site_url = home_url();
            }            
            $src = add_query_arg(array('action' => 'nbdesigner_editor_html', 'product_id' => $pid), $site_url . '/');    
            if(isset($_POST['variation_id']) &&  $_POST['variation_id'] != ''){
                $src .= '&variation_id='. absint($_POST['variation_id']);
            }
            if( isset($_GET['nbds-ref']) ){
                $src .= '&reference='. $_GET['nbds-ref'];
            }
            if( $variation_id != 0 ){
                $src .= '&variation_id='. $variation_id;
            }
            $option = unserialize(get_post_meta($pid, '_nbdesigner_option', true));
            $extra_price = '';
            if( $option['extra_price'] && ! $option['request_quote'] ){
                $extra_price = $option['type_price'] == 1 ? wc_price($option['extra_price']) : $option['extra_price'] . ' %';
            }
            ob_start();
            nbdesigner_get_template( 'nbd-section.php', array( 'src' => $src,  'extra_price' => $extra_price, 'pid' =>  $pid ) );
            $content = ob_get_clean();  
            $position = nbdesigner_get_option('nbdesigner_position_button_product_detail');
            if( $position == 4 ){
                return $content;
            }else{
                echo $content;
            }
        }
    }
    public function nbd_loggin_redirect_func(){
		if(is_admin()) return;
        ob_start();
        nbdesigner_get_template( 'auth-wp.php' );
        $content = ob_get_clean();         
        echo $content;        
    }
    public function nbd_get_nbd_products(){
        if (!wp_verify_nonce($_POST['nonce'], 'save-design')) {
            die('Security error');
        }
        $result = array();
        $nbd_products = get_transient('nbd_frontend_products');
        if( false === $nbd_products ){
            $products = $this->get_all_product_has_design();
            foreach ($products as $pro){
                $product = wc_get_product($pro->ID);
                $type = $product->get_type();
                $image = get_the_post_thumbnail_url($pro->ID, 'post-thumbnail');
                if( !$image ) $image = wc_placeholder_img_src();            
                $result[] = array(
                    'product_id'    =>  $pro->ID,
                    'name'  => $pro->post_title,
                    'src'   =>  $image,
                    'type'  =>  $type,
                    'url'   => get_permalink($pro->ID)
                );
            }
            set_transient( 'nbd_frontend_products' , $result ); 
        }else{
            $result = $nbd_products;
        }
        echo json_encode($result);
        wp_die();
    }
    public function nbd_get_product_description(){
        if (!wp_verify_nonce($_POST['nonce'], 'save-design')) {
            die('Security error');
        }
        $product_id = $_POST['product_id'];
        $result = $this->_get_product_description($product_id);
        wp_send_json( $result );
    }
    public function _get_product_description( $product_id ){
        $product = wc_get_product( $product_id );
        ob_start();
        $image = get_the_post_thumbnail_url($product_id, 'post-thumbnail');
        $image = $image ? $image : wc_placeholder_img_src();  
        nbdesigner_get_template('product-info.php', array(
            'id' =>  $product_id,
            'title' =>  $product->get_title(),
            'description' =>  $product->get_description(),
            'short_description' =>  $product->get_short_description(),
            'price' =>  $product->get_price(),
            'permalink' =>  $product->get_permalink(),
            'image' =>  $image
        ));         
        $html = ob_get_clean();        
        $result = array(
            'product_id' =>  $product_id,
            'html' =>  $html,
            'type'  =>  $product->get_type()
        );
        return $result;
    }    
    public function get_all_product_has_design(){
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
        return $posts;
    }
    public function nbd_get_variation_form( $product_id ){
        $_product = wc_get_product( $product_id );
        $attributes = $_product->get_variation_attributes();
        $available_variations = $_product->get_available_variations();
        $selected_attributes = $_product->get_default_attributes();
        $attribute_keys = array_keys( $attributes );  
        ob_start();
        nbdesigner_get_template('product-variation-form.php', array(
            'attributes' => $attributes,
            'available_variations' => $available_variations,
            'selected_attributes' => $selected_attributes,
            'attribute_keys' => $attribute_keys,
            '_product' => $_product
         ));         
        $html = ob_get_clean();
        return $html;
    }
    public function nbdesigner_get_product_info() {
        if (!wp_verify_nonce($_POST['nonce'], 'save-design')) {
            die('Security error');
        }
        $data = array();
        $product_id = (isset($_POST['product_id']) &&  $_POST['product_id'] != '') ? absint($_POST['product_id']) : '';
        $variation_id = (isset($_POST['variation_id']) &&  $_POST['variation_id'] != '') ? absint($_POST['variation_id']) : 0;
        $template_id = (isset($_POST['template_id']) &&  $_POST['template_id'] != '') ? $_POST['template_id'] : '';
        if( $template_id != '' ){
            $path = NBDESIGNER_CUSTOMER_DIR . '/' . $template_id;
            $data['fonts'] = nbd_get_data_from_json($path . '/used_font.json');
            $data['design'] = nbd_get_data_from_json($path . '/design.json');
            $data['config'] = nbd_get_data_from_json($path . '/config.json');
            nbd_update_hit_template( false, $template_id );
        }else {
            $data = nbd_get_product_info( $product_id, $variation_id, '', 'new' );  
        } 
        if( isset( $_POST['attach_product_info'] ) && $_POST['attach_product_info'] == 1 ){
            if( isset( $_POST['product_type'] ) && $_POST['product_type'] == 'variable' ){
                $data['variation_form'] = $this->nbd_get_variation_form($product_id);        
            }      
            $data['product_info'] = $this->_get_product_description($product_id);
        }
        echo json_encode($data);
        wp_die();
    }
    public function nbdesigner_save_partial_customer_design(){
        if (!wp_verify_nonce($_POST['nonce'], 'save-design')) {
            die('Security error');
        } 
        $result = array();
        $force_new_folder = true;
        $result['flag'] = 0;       
        $sid = esc_html($_POST['sid']);
        $pid = $_POST['product_id'];  
        $flag = (int)$_POST['flag'];  
        $order = 'nb_order';
        if(!$flag){
            $config = str_replace('\"', '"', $_POST['config']);
            $fonts = str_replace('\"', '"', $_POST['fonts']);            
        }
        if(isset($_POST['image'])){
            $data = $_POST['image']['img'];
            if(!$flag){
                $json = str_replace('\"', '"', $_POST['image']['json']);	
                $json = str_replace('\\\\', '\\', $json);	                
            }
        } else{
            die('Incorect data!');
        }        
        $uid = get_current_user_id(); 
        $iid = $sid;
        if($uid > 0) $iid = $uid;    
        $path = NBDESIGNER_CUSTOMER_DIR . '/' . $iid . '/' . $order . '/' . $pid;
        $path_thumb = $path . '/thumbs';
        if(!$flag){      
            $json_file = $path . '/design.json';
            $json_config = $path . '/config.json';
            $json_used_font = $path . '/used_font.json';    
            file_put_contents($json_file, $json);
            file_put_contents($json_config, $config);
            file_put_contents($json_used_font, $fonts);            
        }
        if(file_exists($path) && !$flag){
            Nbdesigner_IO::delete_folder($path);
        }    
        if (!file_exists($path) ) {
            if (wp_mkdir_p($path)) {
                if (!file_exists($path_thumb))
                    if (!wp_mkdir_p($path_thumb)) {
                        $result['mes'] = __('Your server not allow creat folder', 'web-to-print-online-designer');
                    }
            } else {
                $result['mes'] = __('Your server not allow creat folder', 'web-to-print-online-designer');
            }
        } 
        $configs = unserialize(get_post_meta($pid, '_designer_setting', true));      
        $thumb_width = nbdesigner_get_option('nbdesigner_thumbnail_width');
        $thumb_height = nbdesigner_get_option('nbdesigner_thumbnail_height');
        $thumb_quality = nbdesigner_get_option('nbdesigner_thumbnail_quality');  
        if($configs[$flag]["area_design_width"] > $configs[$flag]["area_design_height"]){
            $thumb_height = round($thumb_width * $configs[$flag]['area_design_height'] / $configs[$flag]['area_design_width']);
        }else {
            $thumb_width = round($thumb_height * $configs[$flag]['area_design_width'] / $configs[$flag]['area_design_height']);
        }         
        foreach ($data as $key => $val) {
            $temp = explode(';base64,', $val);
            $buffer = base64_decode($temp[1]);
            $full_name = $path . '/' . $key . '.png';
            if (Nbdesigner_IO::save_data_to_file($full_name, $buffer)) {
                $image = wp_get_image_editor($full_name);
                if (!is_wp_error($image)) {
                    $thumb_file = $path_thumb . '/' . $key . '.png';
                    $image->resize($thumb_width, $thumb_height, 1);
                    $image->set_quality($thumb_quality);
                    if ($image->save($thumb_file, 'image/png')) $result['link'] = Nbdesigner_IO::secret_image_url($thumb_file);
                }                
            } else {
                $result['mes'] = __('Your server not allow writable file', 'web-to-print-online-designer');
            }            
        }       
        $result['flag'] = "success";
        echo json_encode($result);
        wp_die();        
    }
    private function store_design_data($nbd_item_key, $data, $product_config, $product_option, $product_upload){
        $path = NBDESIGNER_CUSTOMER_DIR . '/' . $nbd_item_key;
        if(file_exists($path.'_old')) Nbdesigner_IO::delete_folder($path.'_old');
        if(file_exists($path)) rename($path, $path.'_old');
        if ( wp_mkdir_p($path) ) {
            file_put_contents($path . '/product.json', serialize($product_config));
            file_put_contents($path . '/option.json', $product_option);
            file_put_contents($path . '/upload.json', $product_upload);
            foreach ($data as $key => $val) {
                if($key == 'design'){
                    $full_name = $path . '/design.json';
                }else if($key == 'used_font'){
                    $full_name = $path . '/used_font.json';                  
                }else if($key == 'config'){
                    $full_name = $path . '/config.json';
                }else{
                    if( strpos($key, '_svg') > 0 ){
                        $ext = 'svg';
                    }else {
                        $ext = explode('/', $val["type"])[1];
                    }
                    $full_name = $path . '/' . $key . '.' .$ext;              
                }   
                if ( !move_uploaded_file($val["tmp_name"],$full_name) ) {      
                    return false;
                }
            }
        } else {
            Nbdesigner_DebugTool::wirite_log('Your server not allow creat folder', 'save design');
            rename($path.'_old', $path);
            return false;
        }
        return true;
    }
    private function create_preview_design($path_src, $path_dst, $product_config, $width, $height, $limit = false){
        if(!file_exists($path_dst)){
            wp_mkdir_p($path_dst);
        }          
        $scale = $width / 500;
        $count = 0;
        foreach ($product_config as $key => $val){
            $p_img = $path_src . '/frame_' . $key . '.png';
            $design_format = 'png';
            if(file_exists($path_src . '/frame_' . $key . '.jpeg')){
                $p_img = $path_src . '/frame_' . $key . '.jpeg';
                $design_format = 'jpeg';                
            }           
            if(file_exists($p_img)){
                $bg_width = $scale + $val["img_src_width"] * $scale;	
                $bg_height = $val["img_src_height"] * $scale;
                $ds_width = $val["area_design_width"] * $scale;
                $ds_height = $val["area_design_height"] * $scale;
                if($design_format == 'png'){
                    $image_design = NBD_Image::nbdesigner_resize_imagepng($p_img, $ds_width, $bg_height);
                }else{
                    $image_design = NBD_Image::nbdesigner_resize_imagejpg($p_img, $ds_width, $bg_height);
                }
                $image_product_ext = pathinfo($val["img_src"]);
                if($val["bg_type"] == 'image'){
                    $path_img_src  = Nbdesigner_IO::convert_url_to_path($val["img_src"]);
                    if($image_product_ext['extension'] == "png"){
                        $image_product = NBD_Image::nbdesigner_resize_imagepng($path_img_src, $bg_width, $bg_height);
                    }else{
                        $image_product = NBD_Image::nbdesigner_resize_imagejpg($path_img_src, $bg_width, $bg_height);
                    }     
                }
                if($design_format == 'png'){
                    $image = imagecreatetruecolor($bg_width, $bg_height);
                    imagesavealpha($image, true);
                    $color = imagecolorallocatealpha($image, 255, 255, 255, 127);
                    imagefill($image, 0, 0, $color);                    
                }else{
                    $image = imagecreatetruecolor($bg_width, $bg_height);
                    $bg = imagecolorallocate( $image, 255, 255, 255 );
                    imagefilledrectangle($image,0,0,$bg_width,$bg_height,$bg);                    
                }  
                if($val["bg_type"] == 'image'){
                    imagecopy($image, $image_product, 0, 0, 0, 0, $bg_width, $bg_height);
                } else if($val["bg_type"] == 'color'){
                    $_color = hex_code_to_rgb($val["bg_color_value"]);
                    $color = imagecolorallocate($image, $_color[0], $_color[1], $_color[2]);
                    imagefilledrectangle($image, 0, 0, $bg_width, $bg_height, $color);
                } else if($design_format == 'jpeg') {
                    $color = imagecolorallocate($image, 255, 255, 255);
                    imagefilledrectangle($image, 0, 0, $bg_width, $bg_height, $color);                    
                }
                imagecopy($image, $image_design, ($val["area_design_left"]-$val["img_src_left"]) * $scale, ($val["area_design_top"]-$val["img_src_top"]) * $scale, 0, 0, $ds_width, $ds_height);
                if($design_format == 'png'){
                    imagepng($image, $path_dst. '/frame_' . $key . '.png');
                }else{
                    imagejpeg($image, $path_dst. '/frame_' . $key . '.jpeg');
                }
                imagedestroy($image);
                imagedestroy($image_design);
                $count++;
            }
            if( $limit && $count == $limit ) break;
        }
    }
    /**
     * Save design, product configuration into NBDESIGNER_CUSTOMER_DIR <br />
     * Create folder based on the microtime or replace old folder when edit design <br />
     * Store folder name into WC()->session  
     */
    public function nbd_save_cart_design(){
        if (!wp_verify_nonce($_POST['nonce'], 'save-design') || !isset($_POST['product_id'])) {
            die('Security error');
        }       
        $result = array(
            'flag'  =>  'success'
        );
        do_action('before_nbd_save_cart_design');
        $product_id = absint($_POST['product_id']);    
        $variation_id = (isset($_POST['variation_id']) && $_POST['variation_id'] != '') ? absint($_POST['variation_id']) : 0;  
        $enable_upload_without_design = (isset($_POST['enable_upload_without_design']) && $_POST['enable_upload_without_design'] != '') ? absint($_POST['enable_upload_without_design']) : 1; 
        /* Save custom design */
        $nbd_item_cart_key = ($variation_id > 0) ? $product_id . '_' . $variation_id : $product_id;        
        $nbd_item_session = WC()->session->get('nbd_item_key_'.$nbd_item_cart_key);  
        $nbd_item_key = isset($nbd_item_session) ? $nbd_item_session : substr(md5(uniqid()),0,10);  
        $path = NBDESIGNER_CUSTOMER_DIR . '/' . $nbd_item_key;
        if($variation_id > 0){         
            $product_config = unserialize(get_post_meta($variation_id, '_designer_variation_setting', true));
            $enable_variation = get_post_meta($variation_id, '_nbdesigner_variation_enable', true);              
            if ( !($enable_variation && isset($product_config[0]))){
                $product_config = unserialize(get_post_meta($product_id, '_designer_setting', true)); 
            }                   
        }else {
            $product_config = unserialize(get_post_meta($product_id, '_designer_setting', true)); 
        } 
        $product_option = get_post_meta($product_id, '_nbdesigner_option', true); 
        $product_upload = get_post_meta($product_id, '_nbdesigner_upload', true); 
        if( $enable_upload_without_design == 1 ){
            $save_status = $this->store_design_data($nbd_item_key, $_FILES, $product_config, $product_option, $product_upload);     
            $width = absint(nbdesigner_get_option('nbdesigner_thumbnail_width')) ? absint(nbdesigner_get_option('nbdesigner_thumbnail_width')) : 300;
            if(false != $save_status){
                $path_config = $path . '/config.json';
                $config = nbd_get_data_from_json($path_config);
                if( count( $config->product ) ){
                    $product_config = array();
                    foreach($config->product as $side){
                        $product_config[] = (array)$side;
                    }
                };             
                if( isset( $config->custom_dimension ) ){
                    $custom_side = absint( $config->custom_dimension->side );
                    $custom_width = $config->custom_dimension->width;
                    $custom_height = $config->custom_dimension->height;
                    $product_config = $this->merge_product_config( $product_config, $custom_width, $custom_height, $custom_side );
                }
                $this->create_preview_design($path, $path.'/preview', $product_config, $width, $width);
                WC()->session->set('nbd_item_key_'.$nbd_item_cart_key, $nbd_item_key); 
            } else {
                $result['flag'] = 'failure';
            }
        }
        /* Save upload design */
        if( isset($_POST['nbd_file']) && $_POST['nbd_file'] != '' ){
            $nbu_item_session = WC()->session->get('nbu_item_key_'.$nbd_item_cart_key);  
            $nbu_item_key = isset($nbu_item_session) ? $nbu_item_session : substr(md5(uniqid()),0,10);         
            $this->update_files_upload( $_POST['nbd_file'], $nbu_item_key );
            WC()->session->set('nbu_item_key_'.$nbd_item_cart_key, $nbu_item_key);              
        }
        if( isset($_POST['task2']) && $_POST['task2'] != '' ){          
            /* Destroy nbd_item session and init cart session */
            $cart_item_key = $_POST['cart_item_key'];
            WC()->session->__unset('nbd_item_key_'.$nbd_item_cart_key);
            WC()->session->__unset('nbu_item_key_'.$nbd_item_cart_key);
            WC()->session->set($cart_item_key. '_nbd', $nbd_item_key);
            if( isset($_POST['nbd_file']) && $_POST['nbd_file'] != '' ){
                WC()->session->set($cart_item_key. '_nbu', $nbu_item_key);      
            }
        }else {             
            /* Add to cart directly in custom page */
            $quantity = 1;
            $product_status    = get_post_status( $product_id );
            if ( false !== WC()->cart->add_to_cart( $product_id, $quantity, $variation_id ) && 'publish' === $product_status ) {
                do_action( 'woocommerce_ajax_added_to_cart', $product_id );
            } else {
                $result['flag'] = 'failure';
                $result['mes'] = __('Error adding to the cart', 'web-to-print-online-designer');
            }              
        }
        do_action('after_nbd_save_cart_design', $result);
        echo json_encode($result);
        wp_die();         
    }
    public function nbd_save_customer_design(){
        if (!wp_verify_nonce($_POST['nonce'], 'save-design') || !isset($_POST['product_id'])) {
            die('Security error');
        }       
        $result = array(
            'flag'  =>  'failure',
            'link'  =>  ''
        );
        do_action('before_nbd_save_customer_design');
        /* Get data from $_POST */
        $product_id = absint($_POST['product_id']);    
        $variation_id = (isset($_POST['variation_id']) && $_POST['variation_id'] != '') ? absint($_POST['variation_id']) : 0;  
        $cart_item_key = (isset($_POST['cart_item_key']) && $_POST['cart_item_key'] != '') ? $_POST['cart_item_key'] : '';
        $task = (isset($_POST['task']) && $_POST['task'] != '') ? $_POST['task'] : 'new';
        $design_type = (isset($_POST['design_type']) && $_POST['design_type'] != '') ? $_POST['design_type'] : '';
        $nbd_item_cart_key = ($variation_id > 0) ? $product_id . '_' . $variation_id : $product_id; 
        if(isset($_POST['nbd_item_key']) && $_POST['nbd_item_key'] != ''){
            /* Edit design 
             * In case edit template, $design_type = 'template'
             */
            $nbd_item_key = $_POST['nbd_item_key'];
            if( ($design_type == '') && ( !nbd_check_cart_item_exist($cart_item_key) || !WC()->session->__isset($cart_item_key.'_nbd') ) ) {
                $result['mes'] = 'Item not exist in cart';
                nbd_die( $result );
            }
        }else {
            /* Create new design */
            $nbd_item_session = WC()->session->get('nbd_item_key_'.$nbd_item_cart_key);  
            if( $task == 'create' || !isset($nbd_item_session) ){
                $nbd_item_key = substr(md5(uniqid()),0,10);
            }else {
                $nbd_item_key = $nbd_item_session;
            }
        }              
        $path = NBDESIGNER_CUSTOMER_DIR . '/' . $nbd_item_key;
        if( $task == 'new' || $task == 'create' ){
            if($variation_id > 0){         
                $product_config = unserialize(get_post_meta($variation_id, '_designer_variation_setting', true));
                $enable_variation = get_post_meta($variation_id, '_nbdesigner_variation_enable', true);              
                if ( !($enable_variation && isset($product_config[0]))){
                    $product_config = unserialize(get_post_meta($product_id, '_designer_setting', true)); 
                }                   
            }else {
                $product_config = unserialize(get_post_meta($product_id, '_designer_setting', true)); 
            } 
        }else{
            $product_config = unserialize(file_get_contents($path . '/product.json'));
        }
        $product_option = get_post_meta($product_id, '_nbdesigner_option', true); 
        $product_upload = get_post_meta($product_id, '_nbdesigner_upload', true); 
        $save_status = $this->store_design_data($nbd_item_key, $_FILES, $product_config, $product_option, $product_upload);     
        $width = absint(nbdesigner_get_option('nbdesigner_thumbnail_width')) ? absint(nbdesigner_get_option('nbdesigner_thumbnail_width')) : 300;
        if(false != $save_status){
            /* todo edit $product_config if has custom dimension */
            $path_config = $path . '/config.json';
            $config = nbd_get_data_from_json($path_config);
            if( count( $config->product ) ){
                $product_config = array();
                foreach($config->product as $side){
                    $product_config[] = (array)$side;
                }
            };             
            if( isset( $config->custom_dimension ) ){
                $custom_side = absint( $config->custom_dimension->side );
                $custom_width = $config->custom_dimension->width;
                $custom_height = $config->custom_dimension->height;
                $product_config = $this->merge_product_config( $product_config, $custom_width, $custom_height, $custom_side );
            }   
            $this->create_preview_design($path, $path.'/preview', $product_config, $width, $width);
            $result['image'] = array();
            $images = Nbdesigner_IO::get_list_images($path.'/preview', 1);
            foreach($images as $image){
                $filename = pathinfo($image, PATHINFO_FILENAME);
                $result['image'][$filename] = Nbdesigner_IO::wp_convert_path_to_url($image);
                ksort($result['image']);
            }
            $result['flag'] = 'success';   
            $result['folder'] = $nbd_item_key;   
            if( $task == 'new' ) WC()->session->set('nbd_item_key_'.$nbd_item_cart_key, $nbd_item_key);  
            if( $task == 'create' ){
                if(!current_user_can('edit_nbd_template')){
                    $result['mes'] = __('You have not permission to create or edit template', 'web-to-print-online-designer'); echo json_encode($result); wp_die();
                } 
                if( $design_type == 'art' ){
                    My_Design_Endpoint::nbdesigner_insert_table_my_design($product_id, $variation_id, $nbd_item_key );
                }else{
                    $this->nbdesigner_insert_table_templates($product_id, $variation_id, $nbd_item_key, 0, 1, 0);
                }
            }
        }        
        do_action('after_nbd_save_customer_design', $result);
        echo json_encode($result);
        wp_die();   
    }
    public function merge_product_config( $product_config, $width, $height, $number_side ){
        foreach ( $product_config as $key => $side ) {
            $product_config[$key]["real_width"] = $product_config[$key]["product_width"] = $width;
            $product_config[$key]["real_height"] = $product_config[$key]["product_height"] = $height;            
            if( $width >= $height ) {
                $ratio = 500 / $width;
                $product_config[$key]["img_src_width"] = $product_config[$key]["area_design_width"] = 500;               
                $product_config[$key]["img_src_left"] = $product_config[$key]["area_design_left"] = 0;
                $product_config[$key]["area_design_height"] = $product_config[$key]["img_src_height"] = round( $ratio * $height );
                $product_config[$key]["img_src_top"] = $product_config[$key]["area_design_top"] = round( 250 - $product_config[$key]["area_design_height"] / 2 );
            }else {
                $ratio = 500 / $height;
                $product_config[$key]["img_src_height"] = $product_config[$key]["area_design_height"] = 500;
                $product_config[$key]["img_src_top"] = $product_config[$key]["area_design_top"] = 0;
                $product_config[$key]["area_design_width"] = $product_config[$key]["img_src_width"] = round( $ratio * $width );                
                $product_config[$key]["img_src_left"] = $product_config[$key]["area_design_left"] = round( 250 - $product_config[$key]["area_design_width"] / 2 );
            }
        }
        $len = count($product_config);
        if( $len >= $number_side ){
            array_splice($product_config, $number_side, $len - $number_side);
        }else {
            for( $i = $len; $i < $number_side; $i++ ){
                $product_config[$i] = $product_config[0];
            }
        } 
        return $product_config;
    }
    /**
     * Create table manager template
     * @since 1.5.0
     */
    public static function nbdesigner_create_table_templates(){
        global $wpdb;
        $collate = '';
        if ( $wpdb->has_cap( 'collation' ) ) {
            $collate = $wpdb->get_charset_collate();
        } 
        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        if (NBDESIGNER_VERSION != get_option("nbdesigner_version_plugin")) {
            //PRIMARY KEY must have 2 spaces before for dbDelta to work
            $tables =  "
CREATE TABLE {$wpdb->prefix}nbdesigner_templates ( 
 id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
 product_id BIGINT(20) UNSIGNED NOT NULL,
 variation_id BIGINT(20) NULL, 
 folder varchar(255) NOT NULL,
 user_id BIGINT(20) NULL, 
 created_date DATETIME NOT NULL default '0000-00-00 00:00:00',
 publish TINYINT(1) NOT NULL default 1,
 private TINYINT(1) NOT NULL default 0,
 priority  TINYINT(1) NOT NULL default 0,
 hit BIGINT(20) NULL, 
 sales INT(10) NOT NULL default 0,
 vote INT(10) NOT NULL default 0,
 name varchar(255) NULL,
 thumbnail INT(10) NULL,
 PRIMARY KEY  (id) 
) $collate;
CREATE TABLE {$wpdb->prefix}nbdesigner_mydesigns (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT(20) NOT NULL, 
  folder varchar(255) NOT NULL,
  product_id BIGINT(20) UNSIGNED NOT NULL,
  variation_id BIGINT(20) NULL,   
  price varchar(255) NOT NULL default '0',
  selling TINYINT(1) NOT NULL default 0,
  vote INT(10) NOT NULL default 0,
  publish TINYINT(1) NOT NULL default 1,
  created_date DATETIME NOT NULL default '0000-00-00 00:00:00',
  hit INT(10) NOT NULL default 0,
  sales INT(10) NOT NULL default 0,
  PRIMARY KEY  (id)
) $collate;    
            ";
            @dbDelta($tables);
        }
        update_option('nbdesigner_version_plugin', NBDESIGNER_VERSION);
        return true;
    }
    
    public function nbdesigner_user_role(){
        $capabilities = array(
            1   =>    'manage_nbd_tool',
            2   =>    'manage_nbd_art',
            3   =>    'manage_nbd_language',
            4   =>    'manage_nbd_template',
            5   =>    'manage_nbd_product',
            6   =>    'manage_nbd_analytic',
            7   =>    'manage_nbd_design_store',
            8   =>    'manage_nbd_font',
            9   =>    'export_nbd_font',
            10   =>    'export_nbd_art',
            11   =>    'export_nbd_product',
            12   =>    'export_nbd_language',
            13   =>    'import_nbd_font',
            14   =>    'import_nbd_art',
            15   =>    'import_nbd_product',
            16   =>    'import_nbd_language',
            17   =>    'edit_nbd_font',
            18   =>    'edit_nbd_art',
            19   =>    'edit_nbd_language',
            20   =>    'edit_nbd_template',
            21   =>    'delete_nbd_font',
            22   =>    'delete_nbd_art',
            23   =>    'delete_nbd_language',
            24   =>    'delete_nbd_template',
            25   =>    'sell_nbd_design',
            26   =>    'update_nbd_data',
            27   =>    'manage_nbd_setting'
        );
        $admin_role = get_role('administrator');
        if (null != $admin_role) {
            foreach ($capabilities as $cap){
                $admin_role->add_cap($cap);    
            }     
        }
        $shop_manager_role = get_role('shop_manager');
        if (null != $shop_manager_role) {
            foreach ($capabilities as $cap){
                $shop_manager_role->add_cap($cap);    
            }           
        }
        $shop_capabilities = $shop_manager_role->capabilities;
        $shop_capabilities['export_nbd_font'] = false;
        $shop_capabilities['export_nbd_art'] = false;
        $shop_capabilities['export_nbd_product'] = false;
        $shop_capabilities['export_nbd_language'] = false;        
        $shop_capabilities['import_nbd_font'] = false;
        $shop_capabilities['import_nbd_art'] = false;
        $shop_capabilities['import_nbd_product'] = false;
        $shop_capabilities['import_nbd_language'] = false;     
        $shop_capabilities['edit_nbd_font'] = false;
        $shop_capabilities['edit_nbd_language'] = false;
        $shop_capabilities['edit_nbd_template'] = false;
        $shop_capabilities['edit_nbd_art'] = false;        
        $shop_capabilities['delete_nbd_font'] = false;
        $shop_capabilities['delete_nbd_art'] = false;
        $shop_capabilities['delete_nbd_language'] = false;
        $shop_capabilities['delete_nbd_template'] = false;          
        $shop_capabilities['update_nbd_data'] = false;          
        $nbd_viewer = add_role('nbdesigner_viewer', 'NBDesigner Viewer', $shop_manager_role->capabilities);
        if (null === $nbd_viewer) {
            $nbd_viewer = get_role('nbdesigner_viewer');           
            $nbd_viewer->remove_cap('export_nbd_font');
            $nbd_viewer->remove_cap('export_nbd_art');
            $nbd_viewer->remove_cap('export_nbd_product');
            $nbd_viewer->remove_cap('export_nbd_language');
            $nbd_viewer->remove_cap('import_nbd_font');
            $nbd_viewer->remove_cap('import_nbd_art');
            $nbd_viewer->remove_cap('import_nbd_product');
            $nbd_viewer->remove_cap('import_nbd_language');
            $nbd_viewer->remove_cap('edit_nbd_font');
            $nbd_viewer->remove_cap('edit_nbd_art');
            $nbd_viewer->remove_cap('edit_nbd_language');
            $nbd_viewer->remove_cap('edit_nbd_template');
            $nbd_viewer->remove_cap('delete_nbd_font');
            $nbd_viewer->remove_cap('delete_nbd_art');
            $nbd_viewer->remove_cap('delete_nbd_language');
            $nbd_viewer->remove_cap('delete_nbd_template');
            $nbd_viewer->remove_cap('update_nbd_data');
        }      
    }
    /**
     * Insert table templates
     * @since 1.5.0
     * 
     * @global type $wpdb
     * @param int $product_id
     * @param varchar $folder
     * @param int $priority
     * @param int $publish
     * @param int $private
     */
    private function nbdesigner_insert_table_templates($product_id, $variation_id, $folder, $priority, $publish = 1, $private = 0){
        global $wpdb;
        $created_date = new DateTime();
        $user_id = wp_get_current_user()->ID;
        $table_name =  $wpdb->prefix . 'nbdesigner_templates';
        $wpdb->insert($table_name, array(
            'product_id' => $product_id,
            'variation_id' => $variation_id,
            'folder' => $folder,
            'user_id' => $user_id,
            'created_date' => $created_date->format('Y-m-d H:i:s'),
            'publish' => $publish,
            'private' => $private,
            'priority' => $priority
        ));
        return true;
    }
    /**
     * Update table templates
     * @since 1.5.0
     * 
     * @global type $wpdb
     * @param int $product_id product id
     * @param char $folder folder name
     * @param int $priority priority ex: primary, extra
     * @param int $publish publish or unpublish
     * @param int $private private or publish
     * @return boolean
     */
    private function nbdesigner_update_table_templates($product_id, $folder, $priority = '', $publish = '', $private = ''){
        global $wpdb;
        $data = array();
        if($priority !== '') $data['priority'] = $priority;
        if($publish !== '') $data['publish'] = $publish;
        if($private !== '') $data['private'] = $private;
        $wpdb->update( $wpdb->prefix . 'nbdesigner_templates', $data, array( 'product_id' => $product_id, 'folder' => $folder ) );
        return true;
    }
    private function update_template_hit($pid, $folder){
        global $wpdb;
        $table_name = $wpdb->prefix . 'nbdesigner_templates';
        $sql = "SELECT * FROM $table_name WHERE product_id = '$pid' AND folder = '$folder' ORDER BY created_date DESC";
        $tem =  $wpdb->get_results($sql, ARRAY_A);
        $data = array();
        if(count($tem)){
            if($tem[0]['hit']){
                $data['hit'] = $tem[0]['hit'] + 1; 
            }else{
                $data['hit'] = 1;
            }             
            $wpdb->update( $wpdb->prefix . 'nbdesigner_templates', $data, array( 'product_id' => $pid, 'folder' => $folder ) );
        }   
        return true;        
    }
    private function nbdesigner_delete_record_templates($product_id, $folder){
        global $wpdb;
        $wpdb->delete( $wpdb->prefix . 'nbdesigner_templates', array( 'product_id' => $product_id, 'folder' => $folder ) );
        return true;
    }
    private function nbdesigner_get_template_from_db($product_id, $status = 'publish'){
        global $wpdb;
        $table_name = $wpdb->prefix . 'nbdesigner_templates';
        if($status == 'unpublish'){
            $sql = "SELECT * FROM $table_name WHERE product_id = '$product_id' AND publish = 0 ORDER BY created_date DESC";
        }else if($status == 'publish'){
            $sql = "SELECT * FROM $table_name WHERE product_id = '$product_id' AND publish = 1 ORDER BY created_date DESC";
        }else {
            $sql = "SELECT * FROM $table_name WHERE product_id = '$product_id' AND private = 1 ORDER BY created_date DESC";
        }
        $results = $wpdb->get_results($sql);
        return $results;
    }   
    public function nbdesigner_save_webcam_image(){
        if (!wp_verify_nonce($_POST['nonce'], 'save-design')) {
            die('Security error');
        } 
        $result = array();
        $img = $_POST['image'];
        $data = base64_decode($img);
        $full_name = NBDESIGNER_DATA_DIR . '/temp/' . time() .'.png';
        $success = file_put_contents($full_name, $data);
        if($success){
            $result['flag'] = 'success';        
            $result['url'] = wp_convert_path_to_url( $full_name );
        }else{
            $result['flag'] = 'false';
        }
        echo json_encode($result);
        wp_die();        
    }
    private function nbdesigner_create_thumbnail_design($from_path, $to_path, $pid, $vid = 0, $_width = 500, $_height = 500){
        if($vid > 0){
            $configs = unserialize(get_post_meta($vid, '_designer_variation_setting', true));     
            if( !isset($configs[0]) ){
                $configs = unserialize(get_post_meta($pid, '_designer_setting', true));        
            }
        }else {
            $configs = unserialize(get_post_meta($pid, '_designer_setting', true));        
        }
        $path_preview = $to_path;
        if(!file_exists($path_preview)){
            wp_mkdir_p($path_preview);
        }
        foreach ($configs as $key => $val){
            $p_img = $from_path . '/frame_' . $key . '.png';
            if(file_exists($p_img)){
                $image_design = NBD_Image::nbdesigner_resize_imagepng($p_img, $val["area_design_width"], $val["area_design_height"]);
                $image_product_ext = pathinfo($val["img_src"]);
                if($val["bg_type"] == 'image'){
                    if($image_product_ext['extension'] == "png"){
                        $image_product = NBD_Image::nbdesigner_resize_imagepng($val["img_src"], $val["img_src_width"], $val["img_src_height"]);
                    }else{
                        $image_product = NBD_Image::nbdesigner_resize_imagejpg($val["img_src"], $val["img_src_width"], $val["img_src_height"]);
                    }     
                }
                $image = imagecreatetruecolor($_width, $_height);
                imagesavealpha($image, true);
                $color = imagecolorallocatealpha($image, 255, 255, 255, 127);
                imagefill($image, 0, 0, $color);
                if($val["bg_type"] == 'image'){
                    imagecopy($image, $image_product, $val["img_src_left"], $val["img_src_top"], 0, 0, $val["img_src_width"], $val["img_src_height"]);
                } else if($val["bg_type"] == 'color'){
                    $_color = hex_code_to_rgb($val["bg_color_value"]);
                    $color = imagecolorallocate($image, $_color[0], $_color[1], $_color[2]);
                    imagefilledrectangle($image, $val["img_src_left"], $val["img_src_top"], $val["img_src_left"] + $val["img_src_width"], $val["img_src_top"] + $val["img_src_height"], $color);
                }
                imagecopy($image, $image_design, $val["area_design_left"], $val["area_design_top"], 0, 0, $val["area_design_width"], $val["area_design_height"]);
                imagepng($image, $path_preview. '/frame_' . $key . '.png');
                imagedestroy($image);
                imagedestroy($image_design);
            }
        }
    }  
    public function set_nbd_order_data($order_id) {
        global $woocommerce;
        $items = $woocommerce->cart->get_cart();
        $has_nbd = false;
        $has_nbu = false;
        foreach($items as $item => $values){
            /* custom design */
            $nbd_session = WC()->session->get($item . '_nbd');
            if(isset($nbd_session)){
                WC()->session->__unset($item . '_nbd'); 
                $has_nbd = true;
            }
            /* upload design */
            $nbu_session = WC()->session->get($item . '_nbu');
            if(isset($nbu_session)){
                WC()->session->__unset($item . '_nbu'); 
                $has_nbu = true;
            } 
            WC()->session->__unset($item . '_nbd_initial_price');
        }
        if($has_nbd) {
            add_post_meta($order_id, '_nbdesigner_order_changed', 1);
            add_post_meta($order_id, '_nbd', 1);
        }
        if($has_nbu) {
            add_post_meta($order_id, '_nbdesigner_upload_order_changed', 1);
            add_post_meta($order_id, '_nbu', 1);
        }        
    }
    public function nbdesigner_copy_dir($src, $dst) {
        if (file_exists($dst)) $this->nbdesigner_delete_folder($dst);
        if (is_dir($src)) {
            wp_mkdir_p($dst);
            $files = scandir($src);
            foreach ($files as $file){
                if ($file != "." && $file != "..") $this->nbdesigner_copy_dir("$src/$file", "$dst/$file");
            }
        } else if (file_exists($src)) copy($src, $dst);
    }
    public function nbdesigner_list_thumb($path, $level = 2) {
        $list = array();
        $_list = $this->nbdesigner_list_files($path, $level);
        $list = preg_grep('/\.(jpg|jpeg|png|gif)(?:[\?\#].*)?$/i', $_list);
        return $list;
    }
    public function nbdesigner_list_files($folder = '', $levels = 100) {
        if (empty($folder))
            return false;
        if (!$levels)
            return false;
        $files = array();
        if ($dir = @opendir($folder)) {
            while (($file = readdir($dir) ) !== false) {
                if (in_array($file, array('.', '..')))
                    continue;
                if (is_dir($folder . '/' . $file)) {
                    $files2 = $this->nbdesigner_list_files($folder . '/' . $file, $levels - 1);
                    if ($files2)
                        $files = array_merge($files, $files2);
                    else
                        $files[] = $folder . '/' . $file . '/';
                } else {
                    $files[] = $folder . '/' . $file;
                }
            }
        }
        @closedir($dir);
        return $files;
    }
    public function nbdesigner_delete_folder($path) {
        if (is_dir($path) === true) {
            $files = array_diff(scandir($path), array('.', '..'));
            foreach ($files as $file) {
                $this->nbdesigner_delete_folder(realpath($path) . '/' . $file);
            }
            return rmdir($path);
        } else if (is_file($path) === true) {
            return unlink($path);
        }
        return false;
    }
    public function nbdesigner_display_posts_design($column, $post_id) {
        if ($column == 'design') {
            $is_design = get_post_meta($post_id, '_nbdesigner_enable', true);
            echo '<input type="checkbox" disabled', ( $is_design ? ' checked' : ''), '/>';
        }
    }
    public function nbdesigner_add_design_column($columns) {
        return array_merge($columns, array('design' => __('Design', 'web-to-print-online-designer')));
    }
    public function nbdesigner_render_cart($title = null, $cart_item = null, $cart_item_key = null) {
        if ($cart_item_key && ( is_cart() || is_checkout() )) {
            $nbd_session = WC()->session->get($cart_item_key . '_nbd'); 
            $nbu_session = WC()->session->get($cart_item_key . '_nbu');   
            $_show_design = nbdesigner_get_option('nbdesigner_show_in_cart');
            $product_id = $cart_item['product_id'];
            $product_id = get_wpml_original_id( $product_id );
            if ($_show_design == 'yes' && ( isset($nbd_session) || isset($nbu_session) )) {
                $html = is_checkout() ? $title . ' &times; <strong>' . $cart_item['quantity'] .'</strong>' : $title;               
                if( isset($nbd_session) ){
                    $id = 'nbd' . $cart_item_key;
                    $redirect_url = is_cart() ? wc_get_cart_url().'#'.$id : wc_get_checkout_url().'#'.$id;                     
                    $html .= '<div style="display: block;" id="'.$id.'" class="nbd-cart-upload-file">';
                    $remove_design = is_cart() ? '<a class="remove" style="display: inline-block;" href="javascript:void(0)" onclick="NBDESIGNERPRODUCT.remove_design(\'custom\', \''.$cart_item_key.'\')">&times;</a>' : '';
                    $html .= '<p>'. __('Design personalizado', 'web-to-print-online-designer') .$remove_design.'</p>';
                    $list = Nbdesigner_IO::get_list_images(NBDESIGNER_CUSTOMER_DIR . '/' . $nbd_session . '/preview');                   
                    foreach ($list as $img) {
                        $src = Nbdesigner_IO::convert_path_to_url($img) . '?&t=' . round(microtime(true) * 1000);
                        $html .= '<img style="max-width: 100%; display: inline-block; margin-right: 15px; margin-bottom: 15px; border: 1px solid #ddd; background: #ddd;" src="' . $src . '"/>';
                    }
                    $link_edit_design = add_query_arg(
                        array(
                            'task'  =>  'edit',
                            'product_id'    =>  $product_id,
                            'nbd_item_key'  =>  $nbd_session,
                            'cik'   =>  $cart_item_key,
                            'rd'    =>  urlencode($redirect_url)), 
                        getUrlPageNBD('create'));
                    if($cart_item['variation_id'] > 0){
                        $link_edit_design .= '&variation_id=' . $cart_item['variation_id'];
                    }
                    $html .= '<br /><a href="'.$link_edit_design.'">'. __('Editar', 'web-to-print-online-designer') .'</a>';
                    $html .= '</div>';
                }
                if( isset( $nbu_session ) ){
                    $id = 'nbu' . $cart_item_key;
                    $redirect_url = is_cart() ? wc_get_cart_url().'#'.$id : wc_get_checkout_url().'#'.$id;                     
                    $html .= '<div style="display: block;" id="'.$id.'" class="nbd-cart-upload-file">';
                    $remove_upload = is_cart() ? '<a class="remove" style="display: inline-block;" href="javascript:void(0)" onclick="NBDESIGNERPRODUCT.remove_design(\'upload\', \''.$cart_item_key.'\')">&times;</a>' : '';
                    $html .= '<p>'. __('Upload file', 'web-to-print-online-designer') .$remove_upload.'</p>';
                    $files = Nbdesigner_IO::get_list_files(NBDESIGNER_UPLOAD_DIR . '/' . $nbu_session);
                    $create_preview = nbdesigner_get_option('nbdesigner_create_preview_image_file_upload');
                    foreach ($files as $file) {
                        $ext = pathinfo( $file, PATHINFO_EXTENSION );
                        $src = Nbdesigner_IO::get_thumb_file( pathinfo( $file, PATHINFO_EXTENSION ), '');
                        if(  $create_preview == 'yes' && ( $ext == 'png' || $ext == 'jpg' ) ){
                            $dir = pathinfo( $file, PATHINFO_DIRNAME );
                            $filename = pathinfo( $file, PATHINFO_BASENAME );
                            if( file_exists($dir.'_preview/'.$filename) ){
                                    $src = Nbdesigner_IO::wp_convert_path_to_url( $dir.'_preview/'.$filename );
                            }else{
                                    $src = Nbdesigner_IO::get_thumb_file( $ext, '' );
                            }
                        }else {
                            $src = Nbdesigner_IO::get_thumb_file( $ext, '' );
                        }					                        
                        $html .= '<div style="width: 120px;display: inline-block; margin: 0 15px 15px 0; text-align: center; padding: 10px; border: 1px solid #ddd;"><img style="max-width: 100%;" src="' . $src . '"/><p style="width: 100%; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; height: 30px; line-height: 30px;">'. basename($file).'</p></div>';
                    }
                    $link_reup_design = add_query_arg(
                        array(
                            'task'  =>  'reup',
                            'product_id'    =>  $product_id,
                            'nbu_item_key'  =>  $nbu_session,
                            'cik'   =>  $cart_item_key,
                            'rd'    =>  urlencode($redirect_url)), 
                        getUrlPageNBD('create'));
                    if($cart_item['variation_id'] > 0){
                        $link_reup_design .= '&variation_id=' . $cart_item['variation_id'];
                    }                    
                    $html .= '<br /><a href="'.$link_reup_design.'">'. __('Reupload design', 'web-to-print-online-designer') .'</a>';
                    $html .= '</div>';
                }         
                $option = unserialize(get_post_meta($product_id, '_nbdesigner_option', true)); 
                if( isset($nbd_session) ) {
                    $path = NBDESIGNER_CUSTOMER_DIR . '/' . $nbd_session . '/config.json';
                    $config = nbd_get_data_from_json($path);
                    if( isset( $config->custom_dimension ) && isset( $config->custom_dimension->price ) ){
                        $nbd_variation_price = $config->custom_dimension->price;
                    }
                }                
                if( ((isset($nbd_variation_price) && $nbd_variation_price != 0) || $option['extra_price']) && ! $option['request_quote'] ){
                    $decimals = wc_get_price_decimals();
                    $extra_price = $option['extra_price'] ? $option['extra_price'] : 0;
                    if( (isset($nbd_variation_price) && $nbd_variation_price != 0) ) {
                        $extra_price = $option['type_price'] == 1 ? wc_price($extra_price + $nbd_variation_price) : $extra_price . ' % + ' . wc_price($nbd_variation_price);
                    }else {
                        $extra_price = wc_price($extra_price);
                    }
                    $html .= '<p id="nbx'.$cart_item_key.'">'. __('Extra price for design','web-to-print-online-designer').' + '. $extra_price .'</p>';
                }
                echo $html;
            } else {
                echo $title;
            }
        }else{
            echo $title;
        }
    }
    /**
     * Set session cart if manual add to cart <br />
     * Store last cart_item_key into session if add to cart before start design
     * @since 1.7.0
     * 
     * @param text $cart_item_key 
     * @param int $product_id
     * @param int $quantity
     * @param int $variation_id
     */
    public function set_nbd_session_cart($cart_item_key, $product_id, $quantity, $variation_id, $variation, $cart_item_data) { 
        $product_id = get_wpml_original_id($product_id);
        $variation_id = get_wpml_original_id($variation_id);
        $nbd_item_cart_key = ($variation_id > 0) ? $product_id . '_' . $variation_id : $product_id; 
        /* add to cart in custom design page */
        if(is_nbdesigner_product($product_id)){
            WC()->session->set('nbd_last_item_cart', $cart_item_key);
        }
        /* custom design */
        $nbd_session = WC()->session->get('nbd_item_key_'.$nbd_item_cart_key);
        if(isset($nbd_session)){
            WC()->session->set($cart_item_key. '_nbd', $nbd_session);
            WC()->session->__unset('nbd_item_key_'.$nbd_item_cart_key);
            
            $_enable_upload_without_design = get_post_meta($product_id, '_nbdesigner_enable_upload_without_design', true);  
            if( $_enable_upload_without_design ) WC()->session->__unset($cart_item_key. '_nbd');
        }
        /* up design */
        $nbu_session = WC()->session->get('nbu_item_key_'.$nbd_item_cart_key);
        if(isset($nbu_session)){
            WC()->session->set($cart_item_key. '_nbu', $nbu_session);
            WC()->session->__unset('nbu_item_key_'.$nbd_item_cart_key);
            
            $_enable_upload = get_post_meta($product_id, '_nbdesigner_enable_upload', true);  
            if( !$_enable_upload ) WC()->session->__unset($cart_item_key. '_nbu');            
        }   
        /* order again */
        if( isset( $cart_item_data['_nbd'] ) ){
            WC()->session->set($cart_item_key. '_nbd', $cart_item_data['_nbd']);
        }
        if( isset( $cart_item_data['_nbu'] ) ){
            WC()->session->set($cart_item_key. '_nbu', $cart_item_data['_nbu']);
        }        
    }
    public function nbdesigner_remove_cart_item_design($removed_cart_item_key, $instance){
        //$line_item = $instance->removed_cart_contents[ $removed_cart_item_key ];
        /* custom design */
        $nbd_session = WC()->session->get($removed_cart_item_key.'_nbd');      
        if($nbd_session){  
            WC()->session->__unset($removed_cart_item_key . '_nbd');          
        }  
        /* up design */
        $nbu_session = WC()->session->get($removed_cart_item_key.'_nbu');
        if($nbu_session){  
            WC()->session->__unset($removed_cart_item_key . '_nbu');          
        }
        /* remove session extra price */
        if( WC()->session->__isset($removed_cart_item_key . '_nbd_initial_price') ){
            WC()->session->__unset($removed_cart_item_key . '_nbd_initial_price');
        }
    }
    public function nbdesigner_add_new_order_item($item_id, $item, $order_id){
        if (isset($item->legacy_cart_item_key)){
            /* custom design */
            if (WC()->session->__isset($item->legacy_cart_item_key . '_nbd')) {
                $nbd_session = WC()->session->get($item->legacy_cart_item_key. '_nbd');
                wc_add_order_item_meta($item_id, "_nbd", $nbd_session);
            }
            /* up design */
            if (WC()->session->__isset($item->legacy_cart_item_key . '_nbu')) {
                $nbu_session = WC()->session->get($item->legacy_cart_item_key. '_nbu');
                wc_add_order_item_meta($item_id, "_nbu", $nbu_session);
            }    
            if( WC()->session->__isset($item->legacy_cart_item_key . '_nbd_initial_price') ){
                $product_id = $item->legacy_values['product_id'];
                $product_id = get_wpml_original_id( $product_id );      
                $option = unserialize(get_post_meta($product_id, '_nbdesigner_option', true));
                if( isset($nbd_session) ) {
                    $path = NBDESIGNER_CUSTOMER_DIR . '/' . $nbd_session . '/config.json';
                    $config = nbd_get_data_from_json($path);
                    if( isset( $config->custom_dimension ) && isset( $config->custom_dimension->price ) ){
                        $nbd_variation_price = $config->custom_dimension->price;
                    }
                }                 
                if( ((isset($nbd_variation_price) && $nbd_variation_price != 0) || $option['extra_price']) && ! $option['request_quote'] ){
                    $extra_price = $option['extra_price'] ? $option['extra_price'] : 0;
                    if( (isset($nbd_variation_price) && $nbd_variation_price != 0) ) {
                        $extra_price = $option['type_price'] == 1 ? wc_price($extra_price + $nbd_variation_price) : $extra_price . '% + ' . wc_price($nbd_variation_price);
                    }else {
                        $extra_price = wc_price($extra_price);
                    }
                    wc_add_order_item_meta($item_id, "_nbd_extra_price", $extra_price);
                }
            }
        }
    }    
    public function nbdesigner_add_order_design_data($item_id, $values, $cart_item_key) {
        /* custom design */
        if (WC()->session->__isset($cart_item_key . '_nbd')) {
            wc_add_order_item_meta($item_id, "_nbd", WC()->session->get($cart_item_key . '_nbd'));
        }
        /* up design */
        if (WC()->session->__isset($cart_item_key . '_nbu')) {
            wc_add_order_item_meta($item_id, "_nbu", WC()->session->get($cart_item_key . '_nbu'));
        }        
    }
    public function nbdesigner_design_approve(){
        check_admin_referer('approve-designs', '_nbdesigner_approve_nonce');	
        $order_id = $_POST['nbdesigner_design_order_id'];   
        $_design_action = $_POST['nbdesigner_order_file_approve'];       
        $response['mes'] = '';   
        if (is_numeric($order_id) && ( isset($_POST['_nbdesigner_design_file']) && is_array($_POST['_nbdesigner_design_file']) || isset($_POST['_nbdesigner_upload_file']) && is_array($_POST['_nbdesigner_upload_file']) ) ) {
            $has_design = $has_upload = $update_design = $update_upload = false;
            if( isset($_POST['_nbdesigner_design_file']) ){
                $_design_file = $_POST['_nbdesigner_design_file'];   
                $has_design = true;
            }
            if( isset($_POST['_nbdesigner_upload_file']) ){
                $_upload_file = $_POST['_nbdesigner_upload_file'];   
                $has_upload = true;
            }                    
            $design_data = unserialize(get_post_meta($order_id, '_nbdesigner_design_file', true));     
            $upload_data = unserialize(get_post_meta($order_id, '_nbdesigner_upload_file', true));   
            if( $has_design ){
                if(is_array($design_data)){
                    foreach($_design_file as $val){    
                        $check = false;
                        foreach($design_data as $key => $status){
                            $_key = str_replace('nbds_', '', trim($key));
                            if($_key == $val){
                                $design_data[$key] = $_design_action;  
                                $check = true;
                            }
                        }   
                        if(!$check) $design_data['nbds_'.$val] = $_design_action; 
                    }
                }else{
                    $design_data = array();
                    foreach ($_design_file as $val){
                        $design_data['nbds_'.$val] = $_design_action;
                    }
                } 
                $design_data = serialize($design_data);  
                $update_design = update_post_meta($order_id, '_nbdesigner_design_file', $design_data);
            }
            if( $has_upload ){
                if(is_array($upload_data)){
                    foreach($_upload_file as $val){    
                        $check = false;
                        foreach($upload_data as $key => $status){
                            $_key = str_replace('nbds_', '', trim($key));
                            if($_key == $val){
                                $upload_data[$key] = $_design_action;  
                                $check = true;
                            }
                        }   
                        if(!$check) $upload_data['nbds_'.$val] = $_design_action; 
                    }
                }else{
                    $upload_data = array();
                    foreach ($_upload_file as $val){
                        $upload_data['nbds_'.$val] = $_design_action;
                    }
                } 
                $upload_data = serialize($upload_data);   
                $update_upload = update_post_meta($order_id, '_nbdesigner_upload_file', $upload_data);
            }              
            if ( $update_design || $update_upload ){
                update_post_meta($order_id, '_nbdesigner_order_changed', 0);
                $response['mes'] = 'success';
            }else{
                update_post_meta($order_id, '_nbdesigner_order_changed', 0);
                $response['mes'] = __('You don\'t change anything? Or an error occured saving the data, please refresh this page and check if changes took place.', 'web-to-print-online-designer');
            }
        } else {
            $response['mes'] = __('You haven\'t chosen a item.', 'web-to-print-online-designer');
        }
        echo json_encode($response);
        wp_die();
    }
    public function nbdesigner_design_order_email(){
        check_admin_referer('approve-design-email', '_nbdesigner_design_email_nonce');	
        $response['success'] = 0;
        if (empty($_POST['nbdesigner_design_email_order_content'])) {
            $response['error'] = __('The reason cannot be empty', 'web-to-print-online-designer');        
        } elseif (!is_numeric($_POST['nbdesigner_design_email_order_id'])) {
            $response['error'] = __('Error while sending mail', 'web-to-print-online-designer');
        } 
        if (empty($response['error'])) {
            $message = $_POST['nbdesigner_design_email_order_content'];
            $order = new WC_Order($_POST['nbdesigner_design_email_order_id']);  
            $reason = ($_POST['nbdesigner_design_email_reason'] == 'approved')?__('Your design accepted', 'web-to-print-online-designer'): 'Your design rejected';
            $send_email = $this->nbdesigner_send_email($order, $reason, $message);
            if ($send_email)
                $response['success'] = 1;
            else
                $response['error'] = __('Error while sending mail', 'web-to-print-online-designer');            
        }
        echo json_encode($response);
        wp_die();        
    }
    public function nbdesigner_send_email($order, $reason, $message){
        global $woocommerce;
        $user_email = $order->get_billing_email();
        if (!empty($user_email)) {
            $mailer = $woocommerce->mailer();
            ob_start();
            wc_get_template('emails/nbdesigner-approve-order-design.php', array(
                'plugin_id' => 'nbdesigner',
                'order' => $order,
                'reason' => $reason,
                'message' => $message,
                'my_order_url' => $order->get_view_order_url(),
            ));
            $body = ob_get_clean();
            $subject = $reason . ' - Order ' . $order->get_order_number();	            
            $mailer->send($user_email, $subject, $body);
            
            //Send mail to admin
            $notifications = get_option('nbdesigner_enable_send_mail_when_approve', false);
            if( $notifications == 'yes' && $reason == 'Your design accepted' ){                
                ob_start();
                wc_get_template('emails/notify-admin-when-approve-design.php', array(
                    'order_number' => $order->get_order_number(),
                    'order_id' => $order->get_id()
                )); 
                $subject = __('Approve designs - Order ','web-to-print-online-designer') . $order->get_order_number();
                $owner_email = get_option('nbdesigner_admin_emails', false);
                $emails = new WC_Emails();	
                $woo_recipient = $emails->emails['WC_Email_New_Order']->recipient;
                if($owner_email == ''){
                    if(!empty($woo_recipient)) {
                        $user_email = esc_attr($woo_recipient);
                    } else {
                        $user_email = get_option( 'admin_email' );
                    }                        
                }else{
                    $user_email = $owner_email;
                }
                $body = ob_get_clean();    
                 
                $products = $order->get_items();
                $attachment = array();
                if( get_option('nbdesigner_attachment_admin_email', false) == 'yes' ){
                    foreach($products AS $order_item_id => $product){        
                        $nbd_item_key = wc_get_order_item_meta($order_item_id, '_nbd');
                        if( $nbd_item_key ){
                            $list_images = Nbdesigner_IO::get_list_images(NBDESIGNER_CUSTOMER_DIR .'/'. $nbd_item_key, 1);
                            foreach ($list_images as $image) {
                                $attachment[] = $image;
                            }                        
                        }
                    }
                }
                if (!empty($user_email)) {                                            
                    $mailer->send($user_email, $subject, $body, '', $attachment);
                }   	
            }                       
            return true;
        } else {
            return false;
        }
    }
    public function attach_design_to_admin_email($attachments, $type, $object){
        if( 'new_order' === $type ){
            $products = $object->get_items();
            foreach($products AS $order_item_id => $product){        
                $nbd_item_key = wc_get_order_item_meta($order_item_id, '_nbd');
                if( $nbd_item_key ){
                    $list_images = Nbdesigner_IO::get_list_images(NBDESIGNER_CUSTOMER_DIR .'/'. $nbd_item_key, 1);
                    foreach ($list_images as $image) {
                        $attachments[] = $image;
                    }                        
                }
            }            
        }
        return $attachments;
    }
    public function nbdesigner_locate_plugin_template($template, $template_name, $template_path){
        global $woocommerce;
        $_template = $template;
        if ( ! $template_path ) $template_path = $woocommerce->template_url;
        $plugin_path  = NBDESIGNER_PLUGIN_DIR . 'templates/';
        $template = locate_template(array(
            $template_path . $template_name,
            $template_name
        ));
        if ( ! $template && file_exists( $plugin_path . $template_name ) )
            $template = $plugin_path . $template_name;
        if ( ! $template )
          $template = $_template;
        return $template;
    }
    public function order_item_name($item_name, $item){   
        $show_design_in_order = nbdesigner_get_option('nbdesigner_show_in_order');
        if(( isset($item["item_meta"]["_nbd"]) || isset($item["item_meta"]["_nbu"]) ) && $show_design_in_order == 'yes'){
            $html = '';
            if( isset($item["item_meta"]["_nbd"]) ){
                $nbd_item_key = $item["item_meta"]["_nbd"]; 
                $images = Nbdesigner_IO::get_list_images(NBDESIGNER_CUSTOMER_DIR .'/'. $nbd_item_key .'/preview', 1);    
                $approve_status = unserialize(get_post_meta($item['order_id'], '_nbdesigner_design_file', true));
                $index = 'nbds_'.$item->get_id();
                $notice = '';
                $id = 'nbd' . $item->get_id();
                $redirect_url = wc_get_endpoint_url( 'view-order', $item['order_id'], wc_get_page_permalink( 'myaccount' ) ) . '#' . $id;
                $product_id = $item['product_id'];
                $product_id = get_wpml_original_id( $product_id ); 
                $redesign_link = add_query_arg(
                    array(
                        'task'  =>  'edit',
                        'product_id'    =>  $product_id,
                        'oid'   =>  $item['order_id'],
                        'design_type'  =>  'edit_order',
                        'rd'    => urlencode( $redirect_url ),
                        'nbd_item_key'  =>  $nbd_item_key), 
                    getUrlPageNBD('create'));  
                if($item['variation_id'] > 0){
                    $redesign_link .= '&variation_id=' . $item['variation_id'];
                }            
                $html .= '<div id="'.$id.'" class="nbd-order-upload-file">';
                $html .= '<p>'.__('Custom design', 'web-to-print-online-designer').'</p>';
                foreach ($images as $img){      
                    $src = Nbdesigner_IO::convert_path_to_url($img) . '?&t=' . round(microtime(true) * 1000);     
                    $html .= '<img style="max-width: 100%; border: 1px solid #ddd; display: inline-block; margin-right: 15px; margin-bottom: 15px; background: #ddd;" src="'.$src.'" />';
                }
                if(isset($approve_status[$index]) && $approve_status[$index] == "decline"){
                    $notice = "<small style='color:red;'>". __('(Rejected! Click ', 'web-to-print-online-designer')."<a href='".$redesign_link."' target='_blank'>". __('here ', 'web-to-print-online-designer'). "</a>". __(' to design again', 'web-to-print-online-designer')."!)</small>";
                }
                if(isset($approve_status[$index]) && $approve_status[$index] == "accept"){
                    $notice = __('<small> (Approved!)</small>', 'web-to-print-online-designer');
                }
                $html .= '<p>'.$notice.'</p>';
                if(nbdesigner_get_option('allow_customer_redesign_after_order') == 'yes'){
                    $html .= '<p><a class="button" href="'. $redesign_link .'">'. __('Edit design', 'web-to-print-online-designer') .'</a></p>';
                }            
                $html .= '<div>';
            }
            if( isset($item["item_meta"]["_nbu"]) ){
                $nbu_item_key = $item["item_meta"]["_nbu"]; 
                $files = Nbdesigner_IO::get_list_files( NBDESIGNER_UPLOAD_DIR .'/'. $nbu_item_key );     
                $notice = '';
                $id = 'nbu' . $item->get_id();
                $approve_status = unserialize(get_post_meta($item['order_id'], '_nbdesigner_upload_file', true));
                $index = 'nbds_'.$item->get_id();                
                $redirect_url = wc_get_endpoint_url( 'view-order', $item['order_id'], wc_get_page_permalink( 'myaccount' ) ) . '#' . $id;
                $product_id = $item['product_id'];
                $product_id = get_wpml_original_id( $product_id );                 
                $reup_link = add_query_arg(
                    array(
                        'task'  =>  'reup',
                        'product_id'    =>  $product_id,
                        'design_type'  =>  'edit_order',
                        'rd'    => urlencode( $redirect_url ),
                        'nbu_item_key'  =>  $nbu_item_key), 
                    getUrlPageNBD('create'));  
                if($item['variation_id'] > 0){
                    $reup_link .= '&variation_id=' . $item['variation_id'];
                } 
                $html .= '<div id="'.$id.'" class="nbd-order-upload-file">';
                $html .= '<p>'.__('Upload file', 'web-to-print-online-designer').'</p>';
                $create_preview = nbdesigner_get_option('nbdesigner_create_preview_image_file_upload');
                foreach ($files as $file){      
                    $ext = pathinfo( $file, PATHINFO_EXTENSION );
                    $src = Nbdesigner_IO::get_thumb_file( pathinfo( $file, PATHINFO_EXTENSION ), '');
                    if(  $create_preview == 'yes' && ( $ext == 'png' || $ext == 'jpg' ) ){
                        $dir = pathinfo( $file, PATHINFO_DIRNAME );
                        $filename = pathinfo( $file, PATHINFO_BASENAME );
                        if( file_exists($dir.'_preview/'.$filename) ){
                            $src = Nbdesigner_IO::wp_convert_path_to_url( $dir.'_preview/'.$filename );
                        }else{
                            $src = Nbdesigner_IO::get_thumb_file( $ext, '' );
                        }
                    }else {
                        $src = Nbdesigner_IO::get_thumb_file( $ext, '' );
                    }	    
                    $html .= '<div style="width: 120px;display: inline-block; margin: 0 15px 15px 0; text-align: center; padding: 10px; border: 1px solid #ddd;"><img style="max-width: 100%;" src="' . $src . '"/><p style="width: 100%; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; height: 30px; line-height: 30px;">'. basename($file).'</p></div>';
                }   
                if(isset($approve_status[$index]) && $approve_status[$index] == "decline"){
                    $notice = "<small style='color:red;'>". __('(Rejected! Click ', 'web-to-print-online-designer')."<a href='".$reup_link."' target='_blank'>". __('here ', 'web-to-print-online-designer'). "</a>". __(' to design again', 'web-to-print-online-designer')."!)</small>";
                }
                if(isset($approve_status[$index]) && $approve_status[$index] == "accept"){
                    $notice = __('<small> (Approved!)</small>', 'web-to-print-online-designer');
                }
                $html .= '<p>'.$notice.'</p>';                
                if(nbdesigner_get_option('allow_customer_redesign_after_order') == 'yes'){
                    $html .= '<br /><a class="button" href="'. $reup_link .'">'. __('Reupload design', 'web-to-print-online-designer') .'</a>';
                }                 
                $html .= '<div>';
            }
            if(  isset($item["item_meta"]["_nbd_extra_price"]) ){
                $html .= '<p>'. __('Extra price for design','web-to-print-online-designer').' + '.$item["item_meta"]["_nbd_extra_price"].'</p>';
            }           
            $link = get_permalink( $item['product_id']);   
            $item_name = sprintf( '<a href="%s">%s</a>&times;<strong class="product-quantity">%s</strong>%s', $link, $item['name'], $item['qty'], $html );
        }
        return $item_name;
    }
    public function nbdesigner_order_item_quantity_html($strong, $item){
        $show_design_in_order = nbdesigner_get_option('nbdesigner_show_in_order');
        if($show_design_in_order == 'yes'){
            if(isset($item["item_meta"]["_nbd"]) || isset($item["item_meta"]["_nbu"]))  return '';
        }
        return ' <strong class="product-quantity">' . sprintf( '&times; %s', $item['qty'] ) . '</strong>';
    }
    public function nbd_checkout_cart_item_quantity( $quantity_html, $cart_item, $cart_item_key ){
        $show_design_in_cart = nbdesigner_get_option('nbdesigner_show_in_cart');
        if($show_design_in_cart == 'yes'){
            if(WC()->session->__isset($cart_item_key . '_nbd') || WC()->session->__isset($cart_item_key . '_nbu'))  return '';
        }        
        return $quantity_html;
    }
    public function nbdesigner_hidden_custom_order_item_metada($order_items){
        $order_items[] = '_nbdesigner_has_design';
        $order_items[] = '_nbdesigner_folder_design';
        $order_items[] = '_nbdesigner_version_design';
        $order_items[] = '_nbdesign_order';
        $order_items[] = '_nbdesign_order_item_id';
        $order_items[] = '_nbd';
        $order_items[] = '_nbu';
        $order_items[] = '_nbd_extra_price';
        return $order_items;
    }
    public function nbd_upload_design_file(){
        if (!wp_verify_nonce($_POST['nonce'], 'save-design') || !isset($_FILES) ) {
            die('Security error');
        } 
        $result = array(
            'flag'  =>  0,
            'mes'   =>  '',
            'src'   =>  ''
        );
        $product_id = $_POST['product_id'];
        $variation_id = $_POST['variation_id'];
        $task = $_POST['task'];
        $first_time = $_POST['first_time'];
        $nbd_item_cart_key = ($variation_id > 0) ? $product_id . '_' . $variation_id : $product_id;          
        $upload_setting = unserialize(get_post_meta($product_id, '_nbdesigner_upload', true));
        if( $upload_setting['allow_type'] == '' ) $upload_setting['allow_type'] = nbdesigner_get_option('nbdesigner_allow_upload_file_type');
        if( $upload_setting['disallow_type'] == '' ) $upload_setting['disallow_type'] = nbdesigner_get_option('nbdesigner_disallow_upload_file_type');        
        $allow_ext = explode(',', preg_replace('/\s+/', '', strtolower( $upload_setting['allow_type']) ) );      
        $disallow_ext = explode(',', preg_replace('/\s+/', '', strtolower( $upload_setting['disallow_type']) ) );
        $ext = strtolower( $this->nbdesigner_get_extension( $_FILES['file']["name"] ) );
        $max_size = $upload_setting['maxsize'] * 1024 * 1024;
        $minsize = $upload_setting['minsize'] * 1024 * 1024;
        $checkSize = $checkExt = $checkDPI = false;
        if( $upload_setting['mindpi'] > 0 && ( $ext == 'jpg' || $ext == 'jpeg' ) ){
            $dpi = nbd_get_dpi($_FILES['file']["tmp_name"]);  
            if($dpi[0]['x'] < $upload_setting['mindpi']) $checkDPI = true;
        }
        if( (count($allow_ext) && $allow_ext[0] != '' && !in_array(strtolower($ext), $allow_ext)) 
                || (count($disallow_ext) && $disallow_ext[0] != '' && in_array(strtolower($ext), $disallow_ext)) ) {
            $checkExt = true;
        }
        if( $minsize > $_FILES['file']["size"] || $max_size < $_FILES['file']["size"] ){
            $checkSize = true;
        }
        if( $checkSize || $checkExt || $checkDPI ){
            if( $checkSize ) $result['mes'] = __('File size too small or large!', 'web-to-print-online-designer');     
            if( $checkExt ) $result['mes'] = __('Extension not allowed!', 'web-to-print-online-designer');     
            if( $checkDPI ) $result['mes'] = __('Min DPI required for JPG', 'web-to-print-online-designer') . ' ' . $upload_setting['mindpi'];    
        }else{ 
            if(isset($_POST['nbu_item_key']) && $_POST['nbu_item_key'] != ''){
                /* reup */
                $nbu_item_key = $_POST['nbu_item_key'];
            }else {   
                $nbu_item_session = WC()->session->get('nbu_item_key_'.$nbd_item_cart_key);  
                $nbu_item_key = isset($nbu_item_session) ? $nbu_item_session : substr(md5(uniqid()),0,10);
            }             
            $path_dir = NBDESIGNER_UPLOAD_DIR . '/' .$nbu_item_key; 
            $new_name = sanitize_file_name($_FILES['file']["name"]);
            $path = $path_dir . '/' .$new_name;
            if ( !file_exists($path_dir) ) wp_mkdir_p($path_dir);
            $image_exts = array(
                0   =>  'jpg',
                1   =>  'jpeg',
                2   =>  'png'
            );     
            if( $task == 'reup' && $first_time == 1 ){
                if(file_exists($path_dir.'_old')) Nbdesigner_IO::delete_folder($path_dir.'_old');
                if(file_exists($path_dir)){
                    rename($path_dir, $path_dir.'_old');          
                    wp_mkdir_p($path_dir);
                }
                //maybe implement other method
            }
            if(move_uploaded_file( $_FILES['file']["tmp_name"], $path )){
                $result['mes'] = __('Upload success !', 'web-to-print-online-designer');  
                /** Allow create preview for images **/
                if( nbdesigner_get_option('nbdesigner_create_preview_image_file_upload') == 'yes' ){
                    $path_preview = $path_dir . '_preview/';
                    $preview_file = Nbdesigner_IO::wp_convert_path_to_url( $path_preview.$new_name );
                    if(!file_exists($path_preview)){
                        wp_mkdir_p($path_preview);
                    }
                    if( $ext == 'png' ){
                        NBD_Image::nbdesigner_resize_imagepng($path, 200, 200, $path_preview.$new_name);
                    }else if( $ext == 'jpg' ){
                        NBD_Image::nbdesigner_resize_imagejpg($path, 200, 200, $path_preview.$new_name);
                    }else{
                        $preview_file = Nbdesigner_IO::get_thumb_file( $ext, $path );
                    }
                    $src = $preview_file;
                }else{
                    $src = Nbdesigner_IO::get_thumb_file( $ext, $path );
                }
                $result['src'] = $src;
                $result['name'] = $new_name;
                $result['flag'] = 1;
                if( $task == 'new' && $first_time == 1 ) WC()->session->set('nbu_item_key_'.$nbd_item_cart_key, $nbu_item_key);    
            }else{
                $result['mes'] = __('Error occurred with file upload!', 'web-to-print-online-designer');            
            }                           
        }  
        echo json_encode($result);
        wp_die();        
    }
    public function nbdesigner_customer_upload(){       
        if (!wp_verify_nonce($_POST['nonce'], 'save-design')) {
            die('Security error');
        } 
        $allow_extension = array('jpg','jpeg','png','gif');
        $max_size = nbdesigner_get_option('nbdesigner_maxsize_upload');
        $min_dpi = nbdesigner_get_option('nbdesigner_mindpi_upload');
        $allow_max_size = $max_size * 1024 * 1024;
        $result =   true;
        $res = array();
        $size   =   $_FILES['file']["size"];
        $name   =   $_FILES['file']["name"];    
        $ext = $this->nbdesigner_get_extension($name);
        $new_name = strtotime("now").substr(md5(rand(1111,9999)),0,8).'.'.$ext;        
        if(empty($name)) {
            $result = false;
            $res['mes'] = __('Error occurred with file upload!', 'web-to-print-online-designer');            
        }
        if($size > $allow_max_size){
            $result = false;
            $res['mes'] = __('Too large file !', 'web-to-print-online-designer');                
        }
        $check = Nbdesigner_IO::checkFileType($name, $allow_extension);
        if(!$check){
            $result = false;
            $res['mes'] = __('Invalid file format!', 'web-to-print-online-designer');
        }   
        if($min_dpi && $min_dpi > 0) {
            $dpi = nbd_get_dpi($_FILES['file']["tmp_name"]);   
            $dpi[0]['x'] = $dpi[0]['x'] ? $dpi[0]['x'] : 96;
            $dpi[0]['y'] = $dpi[0]['y'] ? $dpi[0]['y'] : 96;
            if($dpi[0]['x'] < $min_dpi) {
                $result = false;
                $res['mes'] = __('Image resolution too low!', 'web-to-print-online-designer');                
            }
        }          
        $path = Nbdesigner_IO::create_file_path(NBDESIGNER_TEMP_DIR, $new_name);
        if($result){
            if(move_uploaded_file($_FILES['file']["tmp_name"],$path['full_path'])){
                $res['mes'] = __('Upload success !', 'web-to-print-online-designer');                 
            }else{
                $result = false;
                $res['mes'] = __('Error occurred with file upload!', 'web-to-print-online-designer');            
            }                     
        }
        if($result){
            $res['src'] = NBDESIGNER_TEMP_URL.$path['date_path'];
            $res['flag'] = 1;
        }else{
            $res['flag'] = 0;
        }	        
        echo json_encode($res);
        wp_die();
    }
    public function nbdesigner_get_qrcode(){
        $result = array();
        $result['flag'] = 0;
        if (!wp_verify_nonce($_REQUEST['nonce'], 'save-design')) {
            die('Security error');
        } 
        if(isset($_REQUEST['data'])){
            $content = $_REQUEST['data'];
            include_once NBDESIGNER_PLUGIN_DIR.'includes/class-qrcode.php';
            $qr = new Nbdesigner_Qrcode();
            $qr->setText($content);
            $image = $qr->getImage(500);
            $file_name = strtotime("now") . '.png';
            $full_name = NBDESIGNER_DATA_DIR . '/temp/'. $file_name;
            if(Nbdesigner_IO::save_data_to_file($full_name, $image)){
                $result['flag'] = 1;
                $result['src'] =  content_url().'/uploads/nbdesigner/temp/'.$file_name;
            };          
        }
        echo json_encode($result);
        wp_die();
    }
    public function nbdesigner_get_facebook_photo(){
        if (!wp_verify_nonce($_POST['nonce'], 'save-design')) {
            die('Security error');
        }        
        $result = array();
        $_accessToken = $_POST['accessToken'];
        require_once NBDESIGNER_PLUGIN_DIR.'includes/class.nbdesigner.facebook.php';
        echo json_encode($result);
        wp_die();
    }
    public function _nbdesigner_get_art(){
        if (!wp_verify_nonce($_REQUEST['nonce'], 'nbdesigner-get-data')) {
            die('Security error');
        }   
        $result = array();
        $path = NBDESIGNER_DATA_DIR . '/cliparts';
        $cats = Nbdesigner_IO::get_list_folder($path, 1);
        foreach ($cats as $key => $cat){
            $result['cat'][] = array(
                'name'  => basename($cat),
                'id'    => $key                
            );
            $list = Nbdesigner_IO::get_list_files($path . '/' . basename($cat), 1);
            $arts = preg_grep('/\.(svg)(?:[\?\#].*)?$/i', $list);
            foreach($arts as $k => $art) {
                $result['arts'][] = array(
                    'name'  => basename($art),
                    'id'    => $k,
                    'cat'   => array($key),
                    'file'  => '',
                    'url'   => Nbdesigner_IO::wp_convert_path_to_url($art)
                );
            }               
        }       
        $result['flag'] = 1;
  
        echo json_encode($result);
        wp_die();         
    }
    public function nbdesigner_get_art(){
        if (!wp_verify_nonce($_REQUEST['nonce'], 'nbdesigner-get-data')) {
            die('Security error');
        }       
        $result = array();
        $path_cat = NBDESIGNER_DATA_DIR . '/art_cat.json';
        $path_art = NBDESIGNER_DATA_DIR . '/arts.json';
        $result['flag'] = 1;
        $result['cat'] = $this->nbdesigner_read_json_setting($path_cat);
        $result['arts'] = $this->nbdesigner_read_json_setting($path_art);	
        echo json_encode($result);
        wp_die();        
    }
    public function _nbdesigner_get_font(){
        if (!wp_verify_nonce($_REQUEST['nonce'], 'nbdesigner-get-data')) {
            die('Security error');
        }   
        $result = array();
        $path = NBDESIGNER_DATA_DIR . '/fonts';
        $cats = Nbdesigner_IO::get_list_folder($path, 1);
        foreach ($cats as $key => $cat){
            $result['cat'][] = array(
                'name'  => basename($cat),
                'id'    => $key                
            );
            $list = Nbdesigner_IO::get_list_files($path . '/' . basename($cat), 1);
            $arts = preg_grep('/\.(ttf|woff)(?:[\?\#].*)?$/i', $list);
            foreach($arts as $k => $art) {
                $result['fonts'][] = array(
                    'name'  => pathinfo($art, PATHINFO_FILENAME ),
                    'id'    => $k,
                    'cat'   => array($key),
                    'alias' => 'nbfont' . substr(md5(rand(0, 999999)), 0, 10),
                    'file'  => '',
                    'url'   => Nbdesigner_IO::wp_convert_path_to_url($art)
                );
            }               
        }      
        $path_google_font = NBDESIGNER_DATA_DIR . '/googlefonts.json';
        $result['google_font'] = $this->nbdesigner_read_json_setting($path_google_font);
        $result['flag'] = 1;  
        echo json_encode($result);
        wp_die();         
    }    
    public function nbdesigner_get_font(){ 	        
        if (!wp_verify_nonce($_REQUEST['nonce'], 'nbdesigner-get-data')) {
            die('Security error');
        }   
        $result = array();
        $path_cat = NBDESIGNER_DATA_DIR . '/font_cat.json';
        $path_font = NBDESIGNER_DATA_DIR . '/fonts.json';
        $path_google_font = NBDESIGNER_DATA_DIR . '/googlefonts.json';
        $result['flag'] = 1;
        $result['cat'] = $this->nbdesigner_read_json_setting($path_cat);
        $result['fonts'] = $this->nbdesigner_read_json_setting($path_font);	        
        $result['google_font'] = $this->nbdesigner_read_json_setting($path_google_font);	        
        echo json_encode($result);
        wp_die();        
    }
    public function nbdesigner_get_pattern(){ 	        
        if (!wp_verify_nonce($_REQUEST['nonce'], 'nbdesigner-get-data')) {
            die('Security error');
        }   
        $result = array();
        $path = NBDESIGNER_PLUGIN_DIR. 'data/pattern.json';
        $result['flag'] = 1;
        $result['data'] = $this->nbdesigner_read_json_setting($path);	        
        echo json_encode($result);
        wp_die();        
    }    
    private function zip_files_and_download($file_names, $archive_file_name, $nameZip){
        if(file_exists($archive_file_name)){
            unlink($archive_file_name);
        }        
        if (class_exists('ZipArchive')) {
            $zip = new ZipArchive();
            if ($zip->open($archive_file_name, ZIPARCHIVE::CREATE )!==TRUE) {
              exit("cannot open <$archive_file_name>\n");
            }
            foreach( $file_names as $file ) {
                $path_arr = explode('/', $file);
                $name = $path_arr[count($path_arr) - 2].'_'.$path_arr[count($path_arr) - 1]; 
                $zip->addFile($file, $name);
            }
            $zip->close();
        }else{         
            require_once(ABSPATH . 'wp-admin/includes/class-pclzip.php');
            $archive = new PclZip($archive_file_name);
            foreach($file_names as $file){
                $path_arr = explode('/', $file);
                $dir = dirname($file).'/';                
                $archive->add($file, PCLZIP_OPT_REMOVE_PATH, $dir, PCLZIP_OPT_ADD_PATH, $path_arr[count($path_arr) - 2]);               
            }            
        }
        if ( !is_file( $archive_file_name ) ){
            header($_SERVER['SERVER_PROTOCOL'].' 404 Not Found');
            exit;
        } elseif ( !is_readable( $archive_file_name ) ){
            header($_SERVER['SERVER_PROTOCOL'].' 403 Forbidden');
            exit;
        } else {
            header($_SERVER['SERVER_PROTOCOL'].' 200 OK');
            header("Pragma: public");
            header("Expires: 0");
            header("Accept-Ranges: bytes");
            header("Connection: keep-alive");
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("Cache-Control: public");
            header("Content-type: application/zip");
            header("Content-Description: File Transfer");
            header("Content-Disposition: attachment; filename=\"".$nameZip."\"");
            header('Content-Length: '.filesize($archive_file_name));
            header("Content-Transfer-Encoding: binary");
            ob_clean();
            @readfile($archive_file_name);
            exit;    
        }      
    }
    /**
     * 
     * Create pages: Re-design, Admin-design, Studio if they're not exist.
     * 
     * @global type $wpdb
     */
    public static function nbdesigner_add_custom_page(){
        /* Create Studio page */
        if ( nbd_get_page_id( 'studio' ) == -1 ){        
            $post = array(
                'post_name' => NBDESIGNER_PAGE_STUDIO,
                'post_status' => 'publish',
                'post_title' => __('Designer Studio', 'web-to-print-online-designer'),
                'post_type' => 'page',
                'post_author'    => 1,
                'comment_status' => 'closed',                
                'post_date' => date('Y-m-d H:i:s')
            );      
            $studio_page_id = wp_insert_post($post, false);
            update_option( 'nbdesigner_studio_page_id', $studio_page_id );
        }      
        
        /* Create design your own page */            
        if ( nbd_get_page_id( 'create_your_own' ) == -1 ){        
            $post = array(
                'post_name' => NBDESIGNER_PAGE_CREATE_YOUR_OWN,
                'post_status' => 'publish',
                'post_title' => __('Create your own', 'web-to-print-online-designer'),
                'post_type' => 'page',
                'post_author'    => 1,
                'comment_status' => 'closed',                
                'post_date' => date('Y-m-d H:i:s')
            );      
            $create_your_own_page_id = wp_insert_post($post, false);	
            update_option( 'nbdesigner_create_your_own_page_id', $create_your_own_page_id );    
        }      
        
        /* Create redirect login page */  
        if ( nbd_get_page_id( 'logged' ) == -1 ){        
            $post = array(
                'post_name' => 'nbd-logged',
                'post_status' => 'publish',
                'post_title' => __('Welcome to NBDesigner', 'web-to-print-online-designer'),
                'post_type' => 'page',
                'post_author'    => 1,
                'post_content'    => '[nbd_loggin_redirect]',
                'comment_status' => 'closed',                
                'post_date' => date('Y-m-d H:i:s')
            );      
            $nbd_redirect_logged_page_id = wp_insert_post($post, false);
            update_option( 'nbdesigner_logged_page_id', $nbd_redirect_logged_page_id ); 
        }  
        
        /* Create gallery page */    
        if ( nbd_get_page_id( 'gallery' ) == -1 ){        
            $post = array(
                'post_name' => 'templates',
                'post_status' => 'publish',
                'post_title' => __('Gallery', 'web-to-print-online-designer'),
                'post_type' => 'page',
                'post_author'    => 1,
                'post_content'    => '[nbdesigner_gallery row="3" pagination="true" per_row="3" ][/nbdesigner_gallery]',
                'comment_status' => 'closed',                
                'post_date' => date('Y-m-d H:i:s')
            );      
            $nbd_gallery_page_id = wp_insert_post($post, false);	
            update_option( 'nbdesigner_gallery_page_id', $nbd_gallery_page_id ); 
        }  
        
        /* Create designer page */  
        if ( nbd_get_page_id( 'designer' ) == -1 ){        
            $post = array(
                'post_name' => 'designer',
                'post_status' => 'publish',
                'post_title' => __('Designer', 'web-to-print-online-designer'),
                'post_type' => 'page',
                'post_author'    => 1,
                'post_content'    => '',
                'comment_status' => 'closed',                
                'post_date' => date('Y-m-d H:i:s')
            );      
            $nbd_redirect_designer_page_id = wp_insert_post($post, false);	
            update_option( 'nbdesigner_designer_page_id', $nbd_redirect_designer_page_id );         
        }  
    }
    public function add_display_post_states( $post_states, $post ){
        if ( nbd_get_page_id( 'gallery' ) === $post->ID ) {
            $post_states['nbd_gallery_page'] = __( 'NBD Gallery Page', 'woocommerce' );
        }
        if ( nbd_get_page_id( 'create_your_own' ) === $post->ID ) {
            $post_states['nbd_create_your_own_page'] = __( 'NBD Design Editor Page', 'woocommerce' );
        }
        if ( nbd_get_page_id( 'designer' ) === $post->ID ) {
            $post_states['nbd_designer_page'] = __( 'NBD Designer gallery Page', 'woocommerce' );
        }        
        return $post_states;        
    }
    public function nbdesigner_frontend_translate(){
        require_once ABSPATH . 'wp-admin/includes/translation-install.php';
        $languages = wp_get_available_translations();
        $path = NBDESIGNER_PLUGIN_DIR . 'data/language.json';  
        $path_data = NBDESIGNER_DATA_CONFIG_DIR . '/language.json';
        if(file_exists($path_data)) $path = $path_data;  
        $path_lang = NBDESIGNER_PLUGIN_DIR . 'data/language/en_US.json';
        $path_data_lang = NBDESIGNER_DATA_CONFIG_DIR . '/language/en_US.json';
        if(file_exists($path_data_lang)) $path_lang = $path_data_lang;  
        $list = json_decode(file_get_contents($path));     
        $lang = json_decode(file_get_contents($path_lang)); 
        if(is_array($lang)){
            $langs = (array)$lang[0];
            asort($langs);
        }
        require(NBDESIGNER_PLUGIN_DIR . 'views/nbdesigner-translate.php');
    }
    public function nbdesigner_save_language(){
        $data = array(
            'mes'   =>  __('You do not have permission to edit language!', 'web-to-print-online-designer'),
            'flag'  => 0
        );	        
        if (!wp_verify_nonce($_POST['nonce'], 'nbdesigner_add_cat') || !current_user_can('edit_nbd_language')) {
            echo json_encode($data);
            wp_die();
        }        
        if(isset($_POST['langs'])){
            $langs = array();
            $langs[0] = $_POST['langs'];
        }
        if(isset($_POST['code'])){
            $code = $_POST['code'];
        } 
        if(isset($langs) && isset($code)){
            $path_lang = NBDESIGNER_PLUGIN_DIR . 'data/language/'.$code.'.json';
            $path_data = NBDESIGNER_DATA_CONFIG_DIR . '/language/'.$code.'.json';
            if(file_exists($path_data)){
                $path_lang = $path_data;                   
            }else{
                if($code = "en_US") {
                    $path_lang = NBDESIGNER_DATA_CONFIG_DIR . '/language/en_US.json';
                }
            } 
            foreach ($langs[0] as $key => $lang){
                $lang = preg_replace('#\\\\{2,}#','\\', $lang);
                $lang = str_replace('\\\\','\\', $lang);
                $langs[0][$key] = strip_tags($lang);
            }   
            $res = json_encode($langs);
            file_put_contents($path_lang, $res);   
            $data['mes'] =  __('Update language success!', 'web-to-print-online-designer');
            $data['flag'] = 1;
        }else{
            $data['mes'] = __('Update language failed!', 'web-to-print-online-designer');
        }
        echo json_encode($data);
        wp_die();
    }
    public function nbdesigner_get_language($code){
        if (!(wp_verify_nonce($_POST['nonce'], 'nbdesigner_add_cat') || wp_verify_nonce($_POST['nonce'], 'save-design'))) {
            die('Security error');
        }         
        if(!isset($code)){
            $code = "en";
        }else if(isset($_POST['code'])) {
            $code = $_POST['code'];          
        }
        $data = nbd_get_language($code);
        echo json_encode($data);
        wp_die();
    }    
    public function nbdesigner_delete_language(){
        $data = array(
            'mes'   =>  __('You do not have permission to delete language!', 'web-to-print-online-designer'),
            'flag'  => 0
        );	        
        if (!wp_verify_nonce($_POST['nonce'], 'nbdesigner_add_cat') || !current_user_can('edit_nbd_language')) {
            echo json_encode($data);
            wp_die();
        } 
        $code = $_POST['code'];
        $index = $_POST['index'];
        $path_lang = NBDESIGNER_DATA_CONFIG_DIR . '/language/'.$code.'.json';
        $path_data_cat_lang = NBDESIGNER_DATA_CONFIG_DIR . '/language.json';         
        $cats = json_decode(file_get_contents($path_data_cat_lang)); 
        $primary_lang_code = $cats[0]->code;
        $path_primary_lang = NBDESIGNER_DATA_CONFIG_DIR . '/language/'.$primary_lang_code.'.json';
        if(!file_exists($path_primary_lang)){
            $path_primary_lang = NBDESIGNER_PLUGIN_DIR . 'data/language/'.$primary_lang_code.'.json';
        }
        if($index != 0){
            if(unlink($path_lang)) {
                $data['flag'] = 1;
                $this->nbdesigner_delete_json_setting($path_data_cat_lang, $index);
                $data['mes'] = __('Delete language success!', 'web-to-print-online-designer');
                $langs = json_decode(file_get_contents($path_primary_lang)); 
                $data['langs'] = (array)$langs[0];
            }            
        }else {
            $data['mes'] = __('Oops! Can not delete primary language!', 'web-to-print-online-designer');
        }
        echo json_encode($data);
        wp_die();
    }
    public function nbdesigner_create_language(){    
        $data = array(
            'mes'   =>  __('You do not have permission to create language!', 'web-to-print-online-designer'),
            'flag'  => 0
        );        
        if (!wp_verify_nonce($_POST['nbdesigner_newlang_hidden'], 'nbdesigner-new-lang') || !current_user_can('edit_nbd_language')) {
            echo json_encode($data);
            wp_die();
        } 
        if(isset($_POST['nbdesigner_codelang']) && isset($_POST['nbdesigner_namelang'])){           
            $code = sanitize_text_field($_POST['nbdesigner_codelang']);
            $path_lang = NBDESIGNER_DATA_CONFIG_DIR . '/language/'.$code.'.json';
            $path_original_lang = NBDESIGNER_PLUGIN_DIR . 'data/language/en_US.json';
            $path_original_data_lang = NBDESIGNER_DATA_CONFIG_DIR . '/language/en_US.json';
            if(file_exists($path_original_data_lang)) $path_original_lang = $path_original_data_lang;
            $path_cat_lang = NBDESIGNER_PLUGIN_DIR . 'data/language.json';
            $path_data_cat_lang = NBDESIGNER_DATA_CONFIG_DIR . '/language.json';
            if(file_exists($path_data_cat_lang)) $path_cat_lang = $path_data_cat_lang;            
            $cats = json_decode(file_get_contents($path_cat_lang)); 
            $lang = json_decode(file_get_contents($path_original_lang)); 
            $_cat = array();
            $_cat['id'] = 1;
            if(is_array($cats)){                 
                foreach($cats as $cat){                  
                    if($cat->code == $code){
                        $code .=  rand(1,100);
                    }
                    $_cat['id'] = $cat->id;
                }
                $_cat['id'] += 1;
            }else{
                $data['mes'] = 'error';
                echo json_encode($data);
                wp_die();                
            } 
            if(is_array($lang)){
                $data['langs'] = (array)$lang[0];
                $data['code'] = $code;
                $_cat['code'] = $code; 
                $data['name'] = sanitize_text_field($_POST['nbdesigner_namelang']);
                $_cat['name'] = $data['name'];
                if (!copy($path_original_lang, $path_lang)) {
                    $data['mes'] = 'error';
                }else{
                    array_push($cats, $_cat);                  
                    file_put_contents($path_cat_lang, json_encode($cats));   
                    file_put_contents($path_data_cat_lang, json_encode($cats));   
                }
                $data['mes'] = 'Your language has been created successfully!';
                $data['flag'] = 1;
            }else{
                $data['mes'] = 'error';
            }            
        }  
        echo json_encode($data);
        wp_die();
    }
    public function nbdesigner_editor_html(){
        if(is_nbd_design_page()){
            $path = NBDESIGNER_PLUGIN_DIR . 'views/nbdesigner-frontend-template.php';
            include($path);exit();              
        }else{
            if ( ( ! defined('DOING_AJAX') || ! DOING_AJAX ) && ( ! isset( $_REQUEST['action'] ) || $_REQUEST['action'] != 'nbdesigner_editor_html' ) ) return;
            $path = NBDESIGNER_PLUGIN_DIR . 'views/nbdesigner-frontend-template.php';
            include($path);exit();            
        }
    }
    public function nbdesigner_make_primary_design(){
        if (!wp_verify_nonce($_POST['nonce'], 'nbdesigner_template_nonce') || !current_user_can('administrator')) {
            die('Security error');
        }
        $result = array();
        if(isset($_POST['id']) && isset($_POST['folder']) && isset($_POST['task'])){
            $pid = $_POST['id'];
            $folder = $_POST['folder'];
            $task = $_POST['task'];
            $check = true;
            if($task == 'primary'){
                $path_primary = NBDESIGNER_DATA_DIR . '/admindesign/' . $pid . '/primary'; 
                $path_primary_old = NBDESIGNER_DATA_DIR . '/admindesign/' . $pid . '/primary_old'; 
                $path_primary_new = NBDESIGNER_DATA_DIR . '/admindesign/' . $pid . '/' .$folder; 
                if(!rename($path_primary, $path_primary_old)) $check = false; 
                if(!rename($path_primary_new, $path_primary)) $check = false; 
                if(!rename($path_primary_old, $path_primary_new)) $check = false;                 
            }
            if( $check ) $result['mes'] = 'success'; else $result['mes'] = 'error';             
        }else{
            $result['mes'] = 'Invalid data';
        }  
        echo json_encode($result);
        wp_die();
    }
    public function nbdesigner_load_admin_design(){       
        if (!wp_verify_nonce($_POST['nonce'], 'save-design')) {
            die('Security error');
        }  
        $result = array();
        if(isset($_POST['product_id'])){
            $product_id = absint($_POST['product_id']);
            $variation_id = absint($_POST['variation_id']);
            $list_design = array();
            $templates = nbd_get_templates($product_id, $variation_id);
            foreach ($templates as $tem){
                $path_preview = NBDESIGNER_CUSTOMER_DIR .'/'.$tem['folder']. '/preview';
                $listThumb = Nbdesigner_IO::get_list_images($path_preview);
                $image = '';
                if(count($listThumb)){
                    $image = Nbdesigner_IO::wp_convert_path_to_url(end($listThumb));
                    $list_design[] = array(
                        'id'    =>  $tem['folder'],  
                        'src'   =>  $image
                    );
                }                
            }
            $result['data'] = $list_design;
            $result['mes'] = 'success';
        }else{
            $result['mes'] = 'Invalid data';
        }
        echo json_encode($result);
        wp_die();        
    }
    public function nbdesigner_tools(){
        $custom_css = Nbdesigner_DebugTool::get_custom_css();
        if(isset($_REQUEST['action']) && wp_verify_nonce($_REQUEST['_wpnonce'], 'remove_log')){
            unlink(NBDESIGNER_LOG_DIR . '/debug.log');
            wp_safe_redirect( esc_url_raw( admin_url( 'admin.php?page=nbdesigner_tools' ) ) );
            exit();
        }
        include_once(NBDESIGNER_PLUGIN_DIR . 'views/nbdesigner-tools.php');
    }
    public function nbdesigner_variation_settings_fields($loop, $variation_data, $variation){
        $vid = $variation->ID;
        $enable = get_post_meta($vid, '_nbdesigner_variation_enable', true);
        $default =  nbd_default_product_setting();    
        $designer_setting = array();
        $designer_setting[0] = $default;
        $dpi = get_post_meta($vid, '_nbdesigner_dpi', true);
        if($dpi == "") $dpi = nbdesigner_get_option('nbdesigner_default_dpi');
        $unit = nbdesigner_get_option('nbdesigner_dimensions_unit');     
        $_designer_setting = unserialize(get_post_meta($vid, '_designer_variation_setting', true));
        if (isset($_designer_setting[0])){
            $designer_setting = $_designer_setting;
            if(! isset($designer_setting[0]['version']) || $_designer_setting[0]['version'] < 160) {
                $designer_setting = $this->update_config_product_160($designer_setting);
            }
            if(! isset($designer_setting[0]['version']) || $_designer_setting[0]['version'] < 180) {
                $designer_setting = NBD_Update_Data::nbd_update_media_v180($designer_setting);
            }            
        }
        $designer_setting = $this->update_config_default($designer_setting);
        include(NBDESIGNER_PLUGIN_DIR . 'views/nbdesigner-box-design-setting-variation.php');
    }
    public function nbdesigner_save_variation_settings_fields($post_id){
        if(!(current_user_can('administrator') || current_user_can('shop_manager')) || !isset($_POST['_nbdesigner_enable'.$post_id])){
            return $post_id;
        }
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return $post_id;
        }  
        $var = get_post($post_id);
        $enable = $_POST['_nbdesigner_enable'.$post_id]; 
        $setting = serialize($_POST['_designer_setting'.$post_id]);  
        if(!$this->nbdesigner_allow_create_product($var->post_parent)) return;
        update_post_meta($post_id, '_nbdesigner_variation_enable', $enable);
        update_post_meta($post_id, '_designer_variation_setting', $setting);
    }    
    public function nbdesigner_copy_image_from_url(){
        if (!wp_verify_nonce($_POST['nonce'], 'save-design')) {
            die('Security error');
        }  
        $url = $_POST['url'];
        $ext = $this->nbdesigner_get_extension($url);
        $allow_extension = array('jpg','jpeg','png','gif');
        if(!in_array(strtolower($ext), $allow_extension)) $ext = 'png';
        $new_name = strtotime("now").substr(md5(rand(1111,9999)),0,8).'.'.$ext;
        $path = NBDESIGNER_TEMP_DIR.'/'.$new_name;
        $res['flag'] = 0;
        $res['src'] = NBDESIGNER_TEMP_URL.'/'.$new_name;
        if( isset( $_POST['gapi'] ) && strpos($url, 'drive.google.com/file') ){     
            $param = $_POST['gapi'];
            $oAuthToken = $param['oAuthToken'];
            $fileId = $param['fileId'];
            $new_name = strtotime("now").substr(md5(rand(1111,9999)),0,8).'_'.$param['name']; 
            $path = Nbdesigner_IO::create_file_path(NBDESIGNER_TEMP_DIR, $new_name);
            $getUrl = 'https://www.googleapis.com/drive/v2/files/' . $fileId . '?alt=media';     
            $authHeader = 'Authorization: Bearer ' . $oAuthToken;
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_URL, $getUrl);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array($authHeader));
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
            $data = curl_exec($ch);
            $error = curl_error($ch);
            curl_close($ch);
            if( !$error ){
                file_put_contents($path['full_path'], $data);   
                $res['src'] = NBDESIGNER_TEMP_URL.$path['date_path'];
                $res['flag'] = 1;                
            }
        }else{
            if(@copy($url, $path)){
                $res['flag'] = 1;
            }            
        }
        echo json_encode($res);
        wp_die();
    }
    public function nbdesigner_add_tinymce_editor(){
        global $typenow;
        // check user permissions
        if (!current_user_can('edit_posts') && !current_user_can('edit_pages')) return;
        $post_types = get_post_types();
        if (!is_array($post_types)) $post_types = array('post', 'page');
        // verify the post type
        if (!in_array($typenow, $post_types)) return;
        // check if WYSIWYG is enabled
        if (get_user_option('rich_editing') == 'true') {
            add_filter('mce_external_plugins', array($this, 'nbdesigner_add_tinymce_shortcode_editor_plugin'));
            add_filter('mce_buttons', array($this, 'nbdesigner_add_tinymce_shortcode_editor_button'));
        }
        add_action('in_admin_footer', array($this, 'nbdesigner_add_tiny_mce_shortcode_dialog'));
    }   
    public function nbdesigner_add_tinymce_shortcode_editor_plugin($plugin_array){
        $plugin_array['nbdesigner_button'] = NBDESIGNER_JS_URL . 'nbdesigner-tinymce-shortcode.js';		
        return $plugin_array;        
    }
    public function nbdesigner_add_tinymce_shortcode_editor_button($buttons){   
        array_push($buttons, "nbdesigner_button");		
        return $buttons;         
    }    
    public function nbdesigner_add_tiny_mce_shortcode_dialog(){
        include (NBDESIGNER_PLUGIN_DIR . 'views/nbdesigner-shortcode-dialog.php');
    }
    public function nbdesigner_get_suggest_design(){
        if (!wp_verify_nonce($_POST['nonce'], 'save-design')) {
            die('Security error');
        }          
        $result = array(
            'mes'   =>  'success',
            'flag'  =>  1
        );          
        if(isset($_POST['product_id']) && isset($_POST['products']) && isset($_POST['variation_id'])){    
            $product_id = $_POST['product_id'];
            $products = $_POST['products'];
            $variation_id = $_POST['variation_id'];
            $nbd_item_cart_key = ($variation_id > 0) ? $product_id . '_' . $variation_id : $product_id; 
            $nbd_item_key = WC()->session->get('nbd_item_key_'.$nbd_item_cart_key); 
            $path_src = NBDESIGNER_CUSTOMER_DIR . '/' . $nbd_item_key;
            if( isset($nbd_item_key) && is_array($products) ){
                $result['nbd_item_key'] = $nbd_item_key;
                foreach ($products as $tg_product_id){
                    $tg_variation_id = nbd_get_default_variation_id( $tg_product_id );
                    if($tg_variation_id > 0){         
                        $product_config = unserialize(get_post_meta($tg_variation_id, '_designer_variation_setting', true));
                        $enable_variation = get_post_meta($tg_variation_id, '_nbdesigner_variation_enable', true);              
                        if ( !($enable_variation && isset($product_config[0]))){
                            $product_config = unserialize(get_post_meta($tg_product_id, '_designer_setting', true)); 
                        }                   
                    }else {
                        $product_config = unserialize(get_post_meta($tg_product_id, '_designer_setting', true)); 
                    } 
                    $ref_product_config = unserialize(file_get_contents($path_src . '/product.json'));
                    foreach ($product_config as $key => $_config){
                        if( isset($ref_product_config[$key]) ){
                            $ref_width = $ref_product_config[$key]['area_design_width'];
                            $ref_height = $ref_product_config[$key]['area_design_height'];
                            $_width = $product_config[$key]['area_design_width'];
                            $_height = $product_config[$key]['area_design_height'];
                            if($ref_width/$ref_height > $_width/$_height){
                                $product_config[$key]['area_design_height'] = round( $_width * $ref_height / $ref_width );
                                $product_config[$key]['area_design_top'] = round( 250 - $product_config[$key]['area_design_height'] / 2 );
                            }else {
                                $product_config[$key]['area_design_width'] = round( $_height * $ref_width / $ref_height );
                                $product_config[$key]['area_design_left'] = round( 250 - $product_config[$key]['area_design_width'] / 2 );                                
                            }
                        }
                    }
                    $path_dst = NBDESIGNER_SUGGEST_DESIGN_DIR . '/' . substr(md5(uniqid()),0,10);
                    $this->create_preview_design($path_src, $path_dst, $product_config, 300, 300, 1);
                    $list = Nbdesigner_IO::get_list_images( $path_dst, $level = 1 );
                    $result['images'][$tg_product_id][] = Nbdesigner_IO::wp_convert_path_to_url($list[0]);
                }
            }else{
                $result['mes'] = __('Missing product!', 'web-to-print-online-designer');
                $result['flag'] = 0;                    
            }
        }else{
            $result['mes'] = __('Missing information!', 'web-to-print-online-designer');
            $result['flag'] = 0;            
        }        
        echo json_encode($result);
        wp_die();
    }
    /**
     * Allow multi design.
     * Add Product To Cart Multiple Times But As Different items.
     * since 1.5.0
     * 
     */
    public function nbd_add_cart_item_data($cart_item_data, $product_id,  $variation_id) {
        /* Force individual cart item */
        $nbd_item_cart_key = ($variation_id > 0) ? $product_id . '_' . $variation_id : $product_id;
        $nbd_session = WC()->session->get('nbd_item_key_'.$nbd_item_cart_key);
        $nbu_session = WC()->session->get('nbu_item_key_'.$nbd_item_cart_key);
        if (isset( $nbd_session ) || ( !isset( $nbd_session ) && isset( $nbu_session ) )) {
            $unique_cart_item_key = md5(microtime() . rand());
            $cart_item_data['unique_key'] = $unique_cart_item_key;
        }
        /* Update list files upload */
        if( $nbu_session && isset($_POST['nbd-upload-files']) && $_POST['nbd-upload-files'] != '' ){
            $files = $_POST['nbd-upload-files'];
            $this->update_files_upload( $files, $nbu_session );
        }    
        return $cart_item_data;
    }
    public function update_files_upload( $files, $nbu_session = '' ){
        $files = explode('|', $files);
        $path = NBDESIGNER_UPLOAD_DIR . '/' . $nbu_session;
        $list_files = Nbdesigner_IO::get_list_files($path);
        foreach ($list_files as $file){
            $filename = basename( $file );
            if( !in_array( $filename, $files )){
                unlink($path. '/' .$filename);
            }
        }
    }
    public function nbd_update_customer_upload(){
        if (!wp_verify_nonce($_POST['nonce'], 'save-design') || !isset($_POST['nbd_file'])) {
            die('Security error');
        } 
        $cart_item_key = $_POST['cart_item_key'];
        $design_type = (isset($_POST['design_type']) && $_POST['design_type'] != '') ? $_POST['design_type'] : '';
        if( ($design_type == '') && ( !nbd_check_cart_item_exist($cart_item_key) || !WC()->session->__isset($cart_item_key.'_nbu') ) ) {
            echo 'Item not exist in cart';
            wp_die();
        }
        $this->update_files_upload( $_POST['nbd_file'], $_POST['nbu_item_key'] );
        echo 'success';
        wp_die();
    }
    /**
     * Update data admin templates in older version (before 1.5.0)
     * @since 1.5.0
     * 
     */
    public static function nbdesigner_update_data_150(){
        global $wpdb;
        $origin_path = NBDESIGNER_ADMINDESIGN_DIR . '/';
        $listTemplates = array();
        $args = array(
            'post_type' => 'product',
            'meta_key' => '_nbdesigner_admintemplate_primary',
            'orderby' => 'date',
            'order' => 'DESC',
            'posts_per_page'=>-1,
            'meta_query' => array(
                array(
                    'key' => '_nbdesigner_admintemplate_primary',
                    'value' => 1,
                )
            )
        );   
        $posts = get_posts($args); 
        foreach ($posts as $p){
            $pro = wc_get_product($p->ID);
            $list_folder = array();
            $path = $origin_path . $p->ID;
            if ($dir = @opendir($path)) {
                while (($file = readdir($dir) ) !== false) {
                    if (in_array($file, array('.', '..')))
                        continue;
                    if (is_dir($path . '/' . $file)) {
                        $list_folder[] =  $file;
                    }
                }
            }
            @closedir($dir);   
            if(is_array($list_folder)){
                foreach($list_folder as $folder){
                    $listTemplates[] = array('product_id' => $p->ID, 'folder' => $folder);
                }
            }           
        }   
        if(is_array($listTemplates)){
            foreach($listTemplates as $temp){
                $created_date = new DateTime();
                $user_id = wp_get_current_user()->ID;
                $table_name =  $wpdb->prefix . 'nbdesigner_templates';
                $priority = 0;
                if($temp['folder'] == 'primary') $priority = 1;
                $wpdb->insert($table_name, array(
                    'product_id' => $temp['product_id'],
                    'folder' => $temp['folder'],
                    'user_id' => $user_id,
                    'created_date' => $created_date->format('Y-m-d H:i:s'),
                    'publish' => 1,
                    'private' => 0,
                    'priority' => $priority
                ));  
            }                       
        }
    }
    public function nbdesigner_migrate_domain(){
        Nbdesigner_DebugTool::update_data_migrate_domain();
    }
    public function nbdesigner_restore_data_migrate_domain(){
        Nbdesigner_DebugTool::restore_data_migrate_domain();
    }
    public function nbdesigner_theme_check(){
        Nbdesigner_DebugTool::theme_check_hook();
    }
    public function nbdesigner_custom_css(){
        Nbdesigner_DebugTool::save_custom_css();
    }    
    public function nbdesigner_save_design_to_pdf(){       
        if (!wp_verify_nonce($_POST['_wpnonce'], 'nbdesigner_pdf_nonce')) {
            die('Security error');
        }    
        require_once(NBDESIGNER_PLUGIN_DIR.'includes/tcpdf/tcpdf.php');
        $pdfs = $_POST['pdf'];
        $force = $_POST['force_same_format'];
        $from_type = $_POST['from_type'];
        $order_id = $_POST['order_id'];
        $nbd_item_key = $_POST['nbd_item_key'];
        $dpi = $_POST['dpi'];
        
        /* Add custom font */
        $used_font_path = NBDESIGNER_CUSTOMER_DIR .'/'. $nbd_item_key. '/used_font.json';
        $used_font = json_decode( file_get_contents($used_font_path) );
        $google_font_path = NBDESIGNER_PLUGIN_DIR . '/data/google-fonts.json';
        $fonts = json_decode( file_get_contents($google_font_path) );    
        $has_custom_font = false;
        if( $from_type == 3 ){
            /* From svg */
            foreach( $used_font as $font ){
                if( $font->type == 'google' ){
                    $font_name = $font->name;
                    $variation = $fonts->$font_name->variants->normal;
                    $path_src = $variation->{'400'}->url->ttf;
                    $path_dst = NBDESIGNER_FONT_DIR . '/' . $font_name . '.ttf';
                    copy($path_src, $path_dst);
                    $path_font = $path_dst;
                }else{
                    $has_custom_font = true;
                    $path_font = NBDESIGNER_FONT_DIR . '/' . $font->file;
                }
                $fontname = TCPDF_FONTS::addTTFfont($path_font, 'TrueType', '', 32);             
            } 
            if($has_custom_font) {
                //todo something to change font-family
            }            
        }
        if(!is_array($pdfs)) die('Security error');
        $result = array();
        if($force){
            $mTop = $pdfs[0]["margin-top"];
            $mBottom = $pdfs[0]["margin-bottom"];
            $pdf_format = $pdfs[0]["format"];   
            $mLeft = $pdfs[0]["margin-left"];
            $mRight = $pdfs[0]["margin-right"];  
            $bgWidth = $pdfs[0]['product-width'];        
            $bgHeight = $pdfs[0]['product-height'];             
            if($pdf_format == '-1'){
                $pWidth = $bgWidth + $mLeft + $mRight;
                $pHeight = $bgHeight + $mTop + $mBottom;
                $pdf_format = array($pWidth, $pHeight);
                if($pWidth > $pHeight){
                    $orientation = "L";
                }else {
                    $orientation = "P";
                }
            }  
            $pdf = new TCPDF($orientation, 'mm', $pdf_format, true, 'UTF-8', false);
            $pdf->SetMargins($mLeft, $mTop, $mRight, true);     
            $pdf->SetCreator( get_site_url() );
            $pdf->SetTitle(get_bloginfo( 'name' ));
            $pdf->setPrintHeader(false);
            $pdf->setPrintFooter(false);       
            $pdf->SetAutoPageBreak(TRUE, 0);              
        }        
        foreach($pdfs as $key => $_pdf){         
            $customer_design = $_pdf['customer-design'];    
            $bTop = (float)$_pdf['bleed-top'];
            $bLeft = (float)$_pdf['bleed-left'];
            $bRight = (float)$_pdf['bleed-right'];
            $bBottom = (float)$_pdf['bleed-bottom'];        
            $bgWidth = (float)$_pdf['product-width'];        
            $bgHeight = (float)$_pdf['product-height'];   
            $showBleed = $_pdf['show-bleed-line'];   
            $orientation = $_pdf['orientation'];
            $mTop = (float)$_pdf["margin-top"];
            $mLeft = (float)$_pdf["margin-left"];
            $mRight = (float)$_pdf["margin-right"];
            $mBottom = (float)$_pdf["margin-bottom"];
            $cdTop = (float)$_pdf["cd-top"];
            $cdLeft = (float)$_pdf["cd-left"];
            $cdWidth = (float)$_pdf["cd-width"];
            $cdHeight = (float)$_pdf["cd-height"];    
            $background = $_pdf['background'];
            $pdf_format = $_pdf['format'];       
            $bg_type = $_pdf['bg_type'];       
            $bg_color_value = $_pdf['bg_color_value'];     
            if($bg_type == 'image'){
                $path_bg = Nbdesigner_IO::convert_url_to_path( $background );
            }
            if($customer_design != ''){
                $path_cd = Nbdesigner_IO::convert_url_to_path( $customer_design );
            }            
            if($pdf_format == '-1'){
                $pWidth = $bgWidth + $mLeft + $mRight;
                $pHeight = $bgHeight + $mTop + $mBottom;
                $pdf_format = array($pWidth, $pHeight);
                if($pWidth > $pHeight){
                    $orientation = "L";
                }else {
                    $orientation = "P";
                }
            }  
            if(!$force){
                $pdf = new TCPDF($orientation, 'mm', $pdf_format, true, 'UTF-8', false);
                $pdf->SetMargins($mLeft, $mTop, $mRight, true);     
                $pdf->SetCreator( get_site_url() );
                $pdf->SetTitle(get_bloginfo( 'name' ));
                $pdf->setPrintHeader(false);
                $pdf->setPrintFooter(false);       
                $pdf->SetAutoPageBreak(TRUE, 0);   
            }         
            $pdf->AddPage();
            if($showBleed == 'yes'){
                $pdf->Line(0, $mTop + $bTop, $mLeft + $bLeft, $mTop + $bTop, array('color' => array(0,0,0), 'width' => 0.05));
                $pdf->Line(0, $mTop + $bgHeight - $bBottom, $mLeft + $bLeft, $mTop + $bgHeight - $bBottom, array('color' => array(0,0,0), 'width' => 0.05));
                $pdf->Line($bgWidth + $mLeft - $bRight, $mTop + $bTop, $bgWidth + $mLeft + $mRight, $mTop + $bTop, array('color' => array(0,0,0), 'width' => 0.05));
                $pdf->Line($bgWidth + $mLeft - $bRight, $mTop + $bgHeight - $bBottom, $bgWidth + $mLeft + $mRight, $mTop + $bgHeight - $bBottom, array('color' => array(0,0,0), 'width' => 0.05));
                $pdf->Line($mLeft + $bLeft, 0, $mLeft + $bLeft, $mTop + $bTop, array('color' => array(0,0,0), 'width' => 0.05));
                $pdf->Line($mLeft + $bLeft, $mTop + $bgHeight - $bBottom, $mLeft + $bLeft, $mTop + $bgHeight + $mBottom, array('color' => array(0,0,0), 'width' => 0.05));
                $pdf->Line($mLeft + $bgWidth - $bRight, 0, $mLeft + $bgWidth - $bRight, $mTop + $bTop, array('color' => array(0,0,0), 'width' => 0.05));
                $pdf->Line($mLeft + $bgWidth - $bRight, $mTop + $bgHeight - $bBottom, $mLeft + $bgWidth - $bRight, $mTop + $bgHeight + $mBottom, array('color' => array(0,0,0), 'width' => 0.05));
            }             
            if($bg_type == 'image'){
                $img_ext = array('jpg','jpeg','png');
                $svg_ext = array('svg');
                $eps_ext = array('eps','ai');
                $check_img = Nbdesigner_IO::checkFileType(basename($path_bg), $img_ext);
                $check_svg = Nbdesigner_IO::checkFileType(basename($path_bg), $svg_ext);
                $check_eps = Nbdesigner_IO::checkFileType(basename($path_bg), $eps_ext);
                $ext = pathinfo($path_bg);
                if($check_img){
                    $pdf->Image($path_bg,$mLeft, $mTop, $bgWidth, $bgHeight, '', '', '', false, '');
                }
                if($check_svg){
                    $pdf->ImageSVG($path_bg, $mLeft,$mTop, $bgWidth, $bgHeight, '', '', '', 0, true);
                }     
                if($check_eps){
                   $pdf->ImageEps($path_bg, $mLeft,$mTop, $bgWidth, $bgHeight, '', true, '', '', 0, true);
                }                 
            }elseif($bg_type == 'color') {
                $pdf->Rect($mLeft, $mTop,  $bgWidth, $bgHeight, 'F', '', hex_code_to_rgb($bg_color_value));
            }
            if($customer_design != ''){
                if( $from_type != 3 ){
                    $_path_cd = $path_cd;
                    $image_name = pathinfo($path_cd, PATHINFO_FILENAME);
                    if( $from_type == 1 ) $_path_cd = NBDESIGNER_CUSTOMER_DIR .'/'. $nbd_item_key. '/jpg/' . $image_name .'.jpg';
                    if( $from_type == 2 ) $_path_cd = NBDESIGNER_CUSTOMER_DIR .'/'. $nbd_item_key. '/cmyk/' . $image_name .'.jpg';
                    $pdf->Image($_path_cd, $mLeft + $cdLeft, $mTop + $cdTop, $cdWidth,$cdHeight, '', '', '', false, '');  
                } else if( $from_type == 3 ){
                    /* Convert svg to pdf  */
                    $svg = NBDESIGNER_CUSTOMER_DIR .'/'. $nbd_item_key. '/frame_'. $key .'_svg.svg';
                    require_once(NBDESIGNER_PLUGIN_DIR . 'includes/svg-sanitizer/sanitizer.php');               
                    $sanitizer = new Sanitizer();       
                    $sanitizer->minify(true);
                    $dirtySVG = file_get_contents($svg);
                    $cleanSVG = $sanitizer->sanitize($dirtySVG);
                    file_put_contents($svg, $cleanSVG);
                    $pdf->ImageSVG($svg, $mLeft + $cdLeft, $mTop + $cdTop, $cdWidth,$cdHeight, '', '', '', 0, true);  
                }
            }  
            if(!$force){
                $folder = NBDESIGNER_CUSTOMER_DIR .'/'. $nbd_item_key. '/pdfs';
                if(!file_exists($folder)){
                    wp_mkdir_p($folder);
                }
                $output_file = $folder .'/' .$_pdf['name']. $key .'.pdf';
                $pdf->Output($output_file, 'F');              
                $result[] = array(
                    'link' => Nbdesigner_IO::wp_convert_path_to_url($output_file),
                    'title' => $_pdf['name']
                );
            }
        }
        if($force){
            $folder = NBDESIGNER_CUSTOMER_DIR .'/'. $nbd_item_key. '/pdfs';
            if(!file_exists($folder)){
                wp_mkdir_p($folder);
            }
            $output_file = $folder .'/'. $order_id .'_all' .'.pdf';
            $pdf->Output($output_file, 'F');              
            $result[] = array(
                'link' => Nbdesigner_IO::wp_convert_path_to_url($output_file),
                'title' => $order_id
            );                
        }        
        echo json_encode($result);
        wp_die();
    }
    public function nbd_frontend_download_pdf(){
        if (!wp_verify_nonce($_POST['nonce'], 'save-design')) {
            die('Security error');
        } 
        require_once(NBDESIGNER_PLUGIN_DIR.'includes/tcpdf/tcpdf.php');
        $nbd_item_key = $_POST['nbd_item_key'];
        $path = NBDESIGNER_CUSTOMER_DIR .'/'. $nbd_item_key;
        $datas = unserialize(file_get_contents($path .'/product.json'));
        $option = unserialize(file_get_contents($path .'/option.json'));
        $dpi = $option['dpi'];
        $pdfs = array();
        $unit = get_option('nbdesigner_dimensions_unit');
        if(!$unit) $unit = "cm";   
        $unitRatio = 10;
        $cm2Px = 37.795275591;
        $mm2Px = $cm2Px / 10;
        switch ($unit) {
            case 'mm':
                $unitRatio = 1;
                break;
            case 'in':
                $unitRatio = 25.4;
                break;
            default:
                $unitRatio = 10;
                break;
        }   
        $list_images = Nbdesigner_IO::get_list_images($path, 1);
        foreach ($list_images as $img){
            $name = basename($img);
            $arr = explode('.', $name);
            $_frame = explode('_', $arr[0]);
            $frame = $_frame[1];
            $list_design[$frame] = $img;
        }        
        foreach($datas as $key => $data){
            $contentImage = '';
            if(isset($list_design[$key])) $contentImage = $list_design[$key];                
            $proWidth = $data['product_width'];
            $proHeight = $data['product_height'];
            $bgTop = 0;
            $bgLeft = 0;
            if($proWidth > $proHeight){
                $bgRatio = 500 / $proWidth;
                $bgWidth = 500;
                $bgHeight = round($proHeight * $bgRatio);
                $offsetLeft = 0;
                $offsetTop = round((500 - $bgHeight) / 2);  
                $scale = round(500 / ($unitRatio * $proWidth * $mm2Px), 2);
            }else{
                $bgRatio = 500 / $proHeight;
                $bgHeight = 500;
                $bgWidth = round($proWidth * $bgRatio);
                $offsetTop = 0;
                $scale = round(500 / ($unitRatio * $proHeight * $mm2Px), 2);    
            }
            
            $pdfs[$key]['background'] = $data['img_src'];
            $pdfs[$key]['bg_type'] = $data['bg_type'];
            $pdfs[$key]['bg_color_value'] = $data['bg_color_value'];
            $pdfs[$key]['bg-top'] = $bgTop;
            $pdfs[$key]['bg-left'] = $bgLeft;
            $pdfs[$key]['bg-height'] = $bgHeight;
            $pdfs[$key]['bg-width'] = $bgWidth;
            $pdfs[$key]['cd-top'] = $data['real_top'] * $unitRatio;
            $pdfs[$key]['cd-left'] = $data['real_left'] * $unitRatio;
            $pdfs[$key]['cd-width'] = $data['real_width'] * $unitRatio;
            $pdfs[$key]['cd-height'] = $data['real_height'] * $unitRatio;
            $pdfs[$key]['customer-design'] = $contentImage;
            $pdfs[$key]['product-width'] = round($proWidth * $unitRatio, 2);
            $pdfs[$key]['product-height'] = round($proHeight * $unitRatio, 2);
            $pdfs[$key]['margin-top'] = $pdfs[$key]['margin-right'] = $pdfs[$key]['margin-bottom'] = $pdfs[$key]['margin-left'] = 0;
            $pdfs[$key]['bleed-top'] = $pdfs[$key]['bleed-bottom'] = $unitRatio * $data['bleed_top_bottom'];      
            $pdfs[$key]['bleed-left'] = $pdfs[$key]['bleed-right'] = $unitRatio * $data['bleed_left_right'];      
        }
        $mTop = $pdfs[0]["margin-top"];
        $mBottom = $pdfs[0]["margin-bottom"];
        $mLeft = $pdfs[0]["margin-left"];
        $mRight = $pdfs[0]["margin-right"];  
        $bgWidth = $pdfs[0]['product-width'];        
        $bgHeight = $pdfs[0]['product-height'];             
        $pWidth = $bgWidth + $mLeft + $mRight;
        $pHeight = $bgHeight + $mTop + $mBottom;
        $pdf_format = array($pWidth, $pHeight);
        if($pWidth > $pHeight){
            $orientation = "L";
        }else {
            $orientation = "P";
        }
        $pdf = new TCPDF($orientation, 'mm', $pdf_format, true, 'UTF-8', false);
        $pdf->SetMargins($mLeft, $mTop, $mRight, true);     
        $pdf->SetCreator( get_site_url() );
        $pdf->SetTitle(get_bloginfo( 'name' ));
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);       
        $pdf->SetAutoPageBreak(TRUE, 0);   
        
        foreach($pdfs as $key => $_pdf){         
            $customer_design = $_pdf['customer-design'];    
            $bTop = (float)$_pdf['bleed-top'];
            $bLeft = (float)$_pdf['bleed-left'];
            $bRight = (float)$_pdf['bleed-right'];
            $bBottom = (float)$_pdf['bleed-bottom'];    
            $showBleed = 'yes'; 
            $cdTop = (float)$_pdf["cd-top"];
            $cdLeft = (float)$_pdf["cd-left"];
            $cdWidth = (float)$_pdf["cd-width"];
            $cdHeight = (float)$_pdf["cd-height"];               
            $background = $_pdf['background'];     
            $bg_type = $_pdf['bg_type'];       
            $bg_color_value = $_pdf['bg_color_value'];     
            if($bg_type == 'image'){
                $path_bg = Nbdesigner_IO::convert_url_to_path( $background );
            }
            if($customer_design != ''){
                $path_cd = Nbdesigner_IO::convert_url_to_path( $customer_design );
            }        
            $pdf->AddPage();             
            if($bg_type == 'image'){
                $img_ext = array('jpg','jpeg','png');
                $svg_ext = array('svg');
                $eps_ext = array('eps','ai');
                $check_img = Nbdesigner_IO::checkFileType(basename($path_bg), $img_ext);
                $check_svg = Nbdesigner_IO::checkFileType(basename($path_bg), $svg_ext);
                $check_eps = Nbdesigner_IO::checkFileType(basename($path_bg), $eps_ext);
                $ext = pathinfo($path_bg);
                if($check_img){
                    $pdf->Image($path_bg,$mLeft, $mTop, $bgWidth, $bgHeight, '', '', '', false, '');
                }
                if($check_svg){
                    $pdf->ImageSVG($path_bg, $mLeft,$mTop, $bgWidth, $bgHeight, '', '', '', 0, true);
                }     
                if($check_eps){
                   $pdf->ImageEps($path_bg, $mLeft,$mTop, $bgWidth, $bgHeight, '', true, '', '', 0, true);
                }                 
            }elseif($bg_type == 'color') {
                $pdf->Rect($mLeft, $mTop,  $bgWidth, $bgHeight, 'F', '', hex_code_to_rgb($bg_color_value));
            }
            if($customer_design != ''){
                $_path_cd = $path_cd;
                //$image_name = pathinfo($path_cd, PATHINFO_FILENAME);
                //if( $from_type == 1 ) $_path_cd = NBDESIGNER_CUSTOMER_DIR .'/'. $nbd_item_key. '/jpg/' . $image_name .'.jpg';
                //if( $from_type == 2 ) $_path_cd = NBDESIGNER_CUSTOMER_DIR .'/'. $nbd_item_key. '/cmyk/' . $image_name .'.jpg';
                $pdf->Image($_path_cd, $mLeft + $cdLeft, $mTop + $cdTop, $cdWidth,$cdHeight, '', '', '', false, '');  
            }   
            if($showBleed == 'yes'){
                $pdf->Line(0, $mTop + $bTop, $mLeft + $bLeft, $mTop + $bTop, array('color' => array(0,0,0), 'width' => 0.05));
                $pdf->Line(0, $mTop + $bgHeight - $bBottom, $mLeft + $bLeft, $mTop + $bgHeight - $bBottom, array('color' => array(0,0,0), 'width' => 0.05));
                $pdf->Line($bgWidth + $mLeft - $bRight, $mTop + $bTop, $bgWidth + $mLeft + $mRight, $mTop + $bTop, array('color' => array(0,0,0), 'width' => 0.05));
                $pdf->Line($bgWidth + $mLeft - $bRight, $mTop + $bgHeight - $bBottom, $bgWidth + $mLeft + $mRight, $mTop + $bgHeight - $bBottom, array('color' => array(0,0,0), 'width' => 0.05));
                $pdf->Line($mLeft + $bLeft, 0, $mLeft + $bLeft, $mTop + $bTop, array('color' => array(0,0,0), 'width' => 0.05));
                $pdf->Line($mLeft + $bLeft, $mTop + $bgHeight - $bBottom, $mLeft + $bLeft, $mTop + $bgHeight + $mBottom, array('color' => array(0,0,0), 'width' => 0.05));
                $pdf->Line($mLeft + $bgWidth - $bRight, 0, $mLeft + $bgWidth - $bRight, $mTop + $bTop, array('color' => array(0,0,0), 'width' => 0.05));
                $pdf->Line($mLeft + $bgWidth - $bRight, $mTop + $bgHeight - $bBottom, $mLeft + $bgWidth - $bRight, $mTop + $bgHeight + $mBottom, array('color' => array(0,0,0), 'width' => 0.05));
            }            
        }        
        $folder = NBDESIGNER_CUSTOMER_DIR .'/'. $nbd_item_key. '/customer-pdfs';
        if(!file_exists($folder)){
            wp_mkdir_p($folder);
        }
        $output_file = $folder .'/'. $nbd_item_key .'.pdf';
        $pdf->Output($output_file, 'F');              
        $result[] = array(
            'link' => Nbdesigner_IO::wp_convert_path_to_url($output_file),
            'title' => $nbd_item_key
        );   
        echo json_encode($result);
        wp_die();        
    }
    public function convert_svg_embed( $path ){
        $svgs = Nbdesigner_IO::get_list_svgs($path, 1);
        $svg_path = $path . '/svg';
        if( !file_exists($svg_path) ) wp_mkdir_p($svg_path);
        foreach ( $svgs as $svg ){
            $svg_name = pathinfo($svg, PATHINFO_BASENAME);
            $new_svg_path = $svg_path.'/'.$svg_name;
            $xdoc = new DomDocument;
            $xdoc->Load($svg);
            /* Embed images */
            $images = $xdoc->getElementsByTagName('image');
            for ($i = 0; $i < $images->length; $i++) {
                $tagName = $xdoc->getElementsByTagName('image')->item($i);
                $attribNode = $tagName->getAttributeNode('xlink:href');
                $img_src = $attribNode->value;
                if(strpos($img_src, "data:image")!==FALSE)
                continue;
                $type = pathinfo($img_src, PATHINFO_EXTENSION);
                $type = ($type =='svg' ) ? 'svg+xml' : $type;
                $data = nbd_file_get_contents($img_src);
                $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                $tagName->setAttribute('xlink:href', $base64);
            }
            /* Embed fonts */
            $text_elements = $xdoc->getElementsByTagName('text');
            for ($i = 0; $i < $text_elements->length; $i++) {
                $tagName = $xdoc->getElementsByTagName('text')->item($i);
                $attribNode = $tagName->getAttributeNode('font-family');
                $font_family = $attribNode->value;
                $font = nbd_get_font_by_alias($font_family);
                if( $font ){
                    $tagName->setAttribute('font-family', $font->name);
                }
            }
            $new_svg = $xdoc->saveXML();
            file_put_contents($new_svg_path, $new_svg);            
        }
    }
    public function nbd_convert_files(){
        if (!wp_verify_nonce($_POST['_wpnonce'], 'nbd_jpg_nonce') && !wp_verify_nonce($_POST['_wpnonce'], 'nbd_cmyk_nonce')) {
            die('Security error');
        }   
        $type = $_POST['type'];
        $nbd_item = $_POST['nbd_item'];
        $result = array();
        $path = NBDESIGNER_CUSTOMER_DIR .'/'. $nbd_item;
        $path_jpg = $path . '/jpg/';
        if( $type == 'jpg'){
            $dpi = $_POST['jpg_dpi'];
            $path_png = $path . '/png/';
            if( !file_exists($path_png) ){
                Nbdesigner_IO::mkdir($path_png);            
            }else{
                Nbdesigner_IO::delete_folder($path_png);  
                Nbdesigner_IO::mkdir($path_png);     
            }
            if( !file_exists($path_jpg) ){
                Nbdesigner_IO::mkdir($path_jpg);            
            }else{
                Nbdesigner_IO::delete_folder($path_jpg);   
                Nbdesigner_IO::mkdir($path_jpg);  
            }     
            $list =  Nbdesigner_IO::get_list_images($path, 1);
            foreach ($list as $image){
                $image_name = pathinfo($image, PATHINFO_FILENAME);
                $png_with_white_bg = $path_png . $image_name .'.png';  
                $jpg = $path_jpg . $image_name .'.jpg';
                NBD_Image::imagick_add_white_bg($image, $png_with_white_bg);
                NBD_Image::imagick_convert_png2jpg_without_bg($png_with_white_bg, $jpg);
                NBD_Image::imagick_resample($jpg, $jpg, $dpi);                  
            }  
        }else if( $type == 'cmyk'){
            $path_cmyk = $path . '/cmyk/';
            if( !file_exists($path_cmyk) ){
                Nbdesigner_IO::mkdir($path_cmyk);            
            }else{
                Nbdesigner_IO::delete_folder($path_cmyk);   
                Nbdesigner_IO::mkdir($path_cmyk);  
            }             
            $icc_index = $_POST['icc'];
            $list_icc = nbd_get_icc_cmyk_list_file();
            $icc = $list_icc[$icc_index];
            $icc_file = NBDESIGNER_PLUGIN_DIR . 'data/icc/CMYK/' . $icc;
            $list =  Nbdesigner_IO::get_list_images($path_jpg, 1);
            foreach ($list as $image){
                $image_name = pathinfo($image, PATHINFO_FILENAME);
                $cmyk = $path_cmyk . $image_name .'.jpg';
                NBD_Image::imagick_convert_rgb_to_cymk($image, $cmyk);
                if($icc_index){
                    NBD_Image::imagick_change_icc_profile($cmyk, $cmyk, $icc_file);
                }                
            }
        }
        $result['flag'] = 1;
        echo json_encode( $result );
        wp_die();
    }
    public function add_nbdesinger_order_actions_button($actions, $the_order){
        $id = is_woo_v3() ?  $the_order->get_id() : $the_order->id ;      
        $has_design = get_post_meta($id, '_nbd', true);
        if($has_design){
            $actions['view_nbd'] = array(
                'url'       => admin_url( 'post.php?post='.$id.'&action=edit' ).'#nbdesigner_order',
                'name'      => __( 'Has Design', 'web-to-print-online-designer'),
                'action'    => "has-nbd"
            );            
        } 
        return $actions;
    }
    public function nbdesigner_update_variation_v180(){
        NBD_Update_Data::update_vatiation_config_v180();
    }
    public function nbd_clear_transients(){
        Nbdesigner_Helper::clear_transients();
    }
    public function nbd_create_pages(){
        if (!wp_verify_nonce($_POST['_nbdesigner_update_product'], 'nbd-create-pages') || !current_user_can('administrator')) {
            die('Security error');
        }         
        $this->nbdesigner_add_custom_page();
        wp_send_json(
            array(
                'flag'  =>  1
            )
        ); 
    }
}