<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly  ?>
<?php
if ( ! class_exists( 'WP_List_Table' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}
class Product_Template_List_Table extends WP_List_Table {
    public function __construct() {
        parent::__construct(array(
            'singular' => __('Template', 'web-to-print-online-designer'), 
            'plural' => __('Templates', 'web-to-print-online-designer'), 
            'ajax' => false 
        ));
    }
    /**
     * Retrieve template's data from the database
     *
     * @param int $per_page
     * @param int $page_number
     *
     * @return mixed
     */
    public static function get_templates($per_page = 5, $page_number = 1) {
        global $wpdb;
        $sql = "SELECT * FROM {$wpdb->prefix}nbdesigner_templates";
        if (!empty($_REQUEST['pid'])) {
            $sql .= " WHERE product_id = " . esc_sql($_REQUEST['pid']);
        }   
        if (!empty($_REQUEST['nbdesigner_filter']) && -1 != $_REQUEST['nbdesigner_filter']) {
            if($_REQUEST['nbdesigner_filter'] == 'unpublish'){
                $sql .= " AND publish = 0";
            }else {
                $sql .= " AND ".esc_sql($_REQUEST['nbdesigner_filter'])." = 1";
            }            
        }  
        if (!empty($_REQUEST['nbd_variation_filter']) && -1 != $_REQUEST['nbd_variation_filter']) {
            $sql .= " AND variation_id = " . esc_sql($_REQUEST['nbd_variation_filter']);
        }
        if (!empty($_REQUEST['orderby'])) {
            $sql .= ' ORDER BY ' . esc_sql($_REQUEST['orderby']);
            $sql .=!empty($_REQUEST['order']) ? ' ' . esc_sql($_REQUEST['order']) : ' ASC';
        } else {
            $sql .= ' ORDER BY created_date DESC';
        }       
        $sql .= " LIMIT $per_page";
        $sql .= ' OFFSET ' . ( $page_number - 1 ) * $per_page;
        $result = $wpdb->get_results($sql, 'ARRAY_A');    
        return $result;
    }
    /**
     * Delete a template record.
     *
     * @param int $id template ID
     */
    public static function delete_template($id) {
        if(current_user_can('delete_nbd_template')){
            global $wpdb;
            $item = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}nbdesigner_templates WHERE id = $id");
            if($item->priority == 1) return;
            $path = NBDESIGNER_CUSTOMER_DIR. '/' .$item->folder;
            if (Nbdesigner_IO::delete_folder($path) || !file_exists($path)) {
                $wpdb->delete("{$wpdb->prefix}nbdesigner_templates", array('id' => $id), array('%d'));
            }            
        }
    }
    public static function make_primary_template($id, $pid){
        global $wpdb;
        $item = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}nbdesigner_templates WHERE id = $id");
        $item_primary = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}nbdesigner_templates WHERE product_id = $pid AND priority = 1");   
        self::update_template($id, array('priority' => 1));
        if($item_primary){
            self::update_template($item_primary->id, array('priority' => 0));
        }
    }
    public static function make_duplicate_template( $id ){
        global $wpdb;
        $item = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}nbdesigner_templates WHERE id = $id");
        $folder = substr(md5(uniqid()), 0, 10);
        $src_path = NBDESIGNER_CUSTOMER_DIR . '/' . $item->folder;
        $dist_path = NBDESIGNER_CUSTOMER_DIR . '/' . $folder;
        Nbdesigner_IO::copy_dir($src_path, $dist_path);       
        $created_date = new DateTime();
        $wpdb->insert("{$wpdb->prefix}nbdesigner_templates", array(
            'product_id' => $item->product_id,
            'variation_id' => $item->variation_id,
            'folder' => $folder,
            'user_id' => $item->user_id,
            'created_date' => $created_date->format('Y-m-d H:i:s'),
            'publish' => $item->publish,
            'private' => $item->private,
            'priority' => 0
        ));
    }
    public static function update_template($id, $arr){
        global $wpdb;
        $wpdb->update("{$wpdb->prefix}nbdesigner_templates", $arr, array( 'id' => $id) );
    }  
    /**
     * Returns the count of records in the database.
     *
     * @return null|string
     */
    public static function record_count() {
        global $wpdb;
        $sql = "SELECT COUNT(*) FROM {$wpdb->prefix}nbdesigner_templates";
        if (!empty($_REQUEST['pid'])) {
            $sql .= " WHERE product_id = " . esc_sql($_REQUEST['pid']);
        }      
        if (!empty($_REQUEST['nbdesigner_filter']) && -1 != $_REQUEST['nbdesigner_filter']) {
            if($_REQUEST['nbdesigner_filter'] == 'unpublish'){
                $sql .= " AND publish = 0";
            }else {
                $sql .= " AND ".esc_sql($_REQUEST['nbdesigner_filter'])." = 1";
            }            
        }         
        return $wpdb->get_var($sql);
    }
    public static function count_product_template( $pid ){
        global $wpdb;
        $sql = "SELECT COUNT(*) FROM {$wpdb->prefix}nbdesigner_templates";
        $sql .= " WHERE product_id = " . $pid;          
        return $wpdb->get_var($sql);        
    }
    /** Text displayed when no template data is available */
    public function no_items() {
        _e( 'No templates avaliable.', 'web-to-print-online-designer');
    }
    /**
     * Method for name column
     *
     * @param array $item an array of DB data
     *
     * @return string
     */
    function column_product_id($item) {
        $variation_name = '';
        if( $item['variation_id'] > 0 ){
            
            $variations = get_nbd_variations( $item['product_id'] );
            foreach ( $variations as $var ) {
                if( $var['id'] == $item['variation_id'] ) {
                    $variation_name = $var['name'];
                    break;
                }
            }
        }else {
            $product = get_post($item['product_id']);
            $variation_name = $product->post_title;
        }
        $priority = $item['folder'] == 'primary' ? 'primary' : 'extra';
        $link_manager_template = add_query_arg(array(
            'pid' => $item['product_id'], 
            'view' => 'templates'), 
             admin_url('admin.php?page=nbdesigner_manager_product'));          
        $link_edit_template = add_query_arg(array(
                'product_id' => $item['product_id'],
                'nbd_item_key'  =>  $item['folder'],
                'rd'    => urlencode($link_manager_template),
                'design_type'  =>  'template',
                'task'  =>  'edit'
            ), getUrlPageNBD('create')); 
        if( $item['variation_id'] > 0 ){
            $link_edit_template .= '&variation_id=' . $item['variation_id'];
        }
        $_nonce = wp_create_nonce('nbdesigner_template_nonce');
        $title = '<strong>' . $variation_name . '</strong>';     
        $actions = array(
            'delete' => sprintf('<a href="?page=%s&action=%s&template=%s&_wpnonce=%s&pid=%s&paged=%s&view=templates">'.__('Delete', 'web-to-print-online-designer').'</a>', esc_attr($_REQUEST['page']), 'delete', absint($item['id']), $_nonce, esc_attr($_REQUEST['pid']), $this->get_pagenum()),
            'primary' => sprintf('<a href="?page=%s&action=%s&template=%s&pid=%s&_wpnonce=%s&paged=%s&view=templates">'.__('Primary', 'web-to-print-online-designer').'</a>', esc_attr($_REQUEST['page']), 'primary', absint($item['id']), esc_attr($_REQUEST['pid']), $_nonce, $this->get_pagenum()),
            'duplicate' => sprintf('<a href="?page=%s&action=%s&template=%s&pid=%s&_wpnonce=%s&paged=%s&view=templates">'.__('Duplicate', 'web-to-print-online-designer').'</a>', esc_attr($_REQUEST['page']), 'duplicate', absint($item['id']), esc_attr($_REQUEST['pid']), $_nonce, $this->get_pagenum()),
            'edit' => sprintf('<a href="%s">'.__('Edit', 'web-to-print-online-designer').'</a>', $link_edit_template)
        );     
        if($item['priority']){
            unset($actions['delete']);
            unset($actions['primary']);
        }
        return $title . $this->row_actions($actions);
    }
    function column_priority($item){
        if($item['priority']){
            return '<span class="primary">&#9733;</span>';
        }else{
            return '<span>&#9734;</span>';
        }     
    }
    function column_default($item, $column_name){
        return $item[$column_name];
    }    
    /**
     * Render the bulk edit checkbox
     *
     * @param array $item
     *
     * @return string
     */
    function column_cb($item) {
        return sprintf( '<input type="checkbox" name="bulk-delete[]" value="%s" />', $item['id'] );
    }
    function column_folder($item){
        $html = '';
        $list_design = array(); 
        $mid_path = $item['product_id']. '/' .$item['folder']. '/preview/'; 
        $listThumb = Nbdesigner_IO::get_list_images(NBDESIGNER_CUSTOMER_DIR. '/' .$item['folder']. '/preview/', 1);
        if(count($listThumb)){
            foreach ($listThumb as $img){
                $name = basename($img);
                $url = Nbdesigner_IO::wp_convert_path_to_url($img) . '?&t=' . round(microtime(true) * 1000);
                $list_design[] = $url;
            }	                            
        } 
        foreach ($list_design as $src){
            $html .= '<img style="width: 60px; margin-right: 5px;" src="'.$src.'"/>';
        }
        return $html;
    }
    function column_user_id($item){
        $user = get_user_by( 'id', $item['user_id'] );
        return $user->display_name;
    }
    /**
     *  Associative array of columns
     *
     * @return array
     */
    function get_columns() {
        $columns = array(
            'cb' => '<input type="checkbox" />',            
            'folder' => __('Preview', 'web-to-print-online-designer'),
            'priority' => __('Primary', 'web-to-print-online-designer'),
            'product_id' => __('Variation', 'web-to-print-online-designer'),
            'user_id' => __('Created By', 'web-to-print-online-designer'),
            'created_date' => __('Created', 'web-to-print-online-designer')
        );
        return $columns;
    }
    function extra_tablenav( $which ) {
        global $wpdb;        
        if ($which == 'top') {
            ?>
            <select id="nbdesigner-admin-template-filter" name="nbdesigner_filter">
                <option value="-1"><?php _e('Show all design', 'web-to-print-online-designer'); ?></option>
                <option value="publish"><?php _e('Publish design', 'web-to-print-online-designer'); ?></option>
                <option value="unpublish"><?php _e('Unpublish design', 'web-to-print-online-designer'); ?></option>
                <option value="private"><?php _e('Private design', 'web-to-print-online-designer'); ?></option>
                <option value="priority"><?php _e('Primary design', 'web-to-print-online-designer'); ?></option>
            </select>
        <?php 
            $product = wc_get_product($_GET['pid']);
            if( $product->is_type( 'variable' ) ):
            $variations = get_nbd_variations( $_GET['pid'] );               
        ?>
            <select name="nbd_variation_filter">
                <option value="-1"><?php _e('Show all variation', 'web-to-print-online-designer'); ?></option>
            <?php foreach ($variations as $variation): ?>
                <option value="<?php echo $variation['id']; ?>"><?php echo $variation['name']; ?></option>
            <?php endforeach; ?>                
            </select>
        <?php endif; ?>    
            <?php wp_nonce_field($this->plugin_id, $this->plugin_id . '_hidden'); ?>	
            <button class="button-primary" type="submit"><?php _e('Filter', 'web-to-print-online-designer'); ?></button>
            <?php
        }
    }    
    /**
     * Columns to make sortable.
     *
     * @return array
     */
    public function get_sortable_columns() {
        $sortable_columns = array(
            'user_id' => array('user_id', true),
            'created_date' => array('created_date', true)
        );
        return $sortable_columns;
    }
    /**
     * Returns an associative array containing the bulk action
     *
     * @return array
     */
    public function get_bulk_actions() {
        $actions = array(            
            'bulk-publish' => 'Publish',
            'bulk-unpublish' => 'Unpublish',
            'bulk-private' => 'Private',
            'bulk-delete' => 'Delete'
        );
        return $actions;
    }
    /**
     * Handles data query and filter, sorting, and pagination.
     */
    public function prepare_items() {
        $columns = $this->get_columns();
        $hidden = array();
        $sortable = $this->get_sortable_columns();
        $this->_column_headers = array($columns, $hidden, $sortable);
        /** Process bulk action */
        $this->process_bulk_action();
        $per_page = $this->get_items_per_page('templates_per_page', 10);
        $current_page = $this->get_pagenum();
        $total_items = self::record_count();
        $this->set_pagination_args(array(
            'total_items' => $total_items, //WE have to calculate the total number of items
            'per_page' => $per_page //WE have to determine how many items to show on a page
        ));
        $this->items = self::get_templates($per_page, $current_page);
    }
    public function process_bulk_action() {
        if ('delete' === $this->current_action()) {    
            $nonce = esc_attr($_REQUEST['_wpnonce']);
            if (!wp_verify_nonce($nonce, 'nbdesigner_template_nonce')) {
                die('Go get a life script kiddies');
            }            
            self::delete_template(absint($_GET['template']));
            wp_redirect(esc_url_raw(add_query_arg(array('pid' => $_REQUEST['pid'], 'paged' => $this->get_pagenum(), 'view'  => 'templates'), admin_url('admin.php?page=nbdesigner_manager_product'))));
            exit;
        }      
        if ('primary' === $this->current_action()) {    
            $nonce = esc_attr($_REQUEST['_wpnonce']);
            if (!wp_verify_nonce($nonce, 'nbdesigner_template_nonce')) {
                die('Go get a life script kiddies');
            }            
            self::make_primary_template(absint($_GET['template']), absint($_GET['pid']));
            wp_redirect(esc_url_raw(add_query_arg(array('pid' => $_REQUEST['pid'], 'paged' => $this->get_pagenum(), 'view'  => 'templates'), admin_url('admin.php?page=nbdesigner_manager_product'))));
            exit;
        }     
        if ('duplicate' === $this->current_action()) {    
            $nonce = esc_attr($_REQUEST['_wpnonce']);
            if (!wp_verify_nonce($nonce, 'nbdesigner_template_nonce')) {
                die('Go get a life script kiddies');
            }            
            self::make_duplicate_template(absint($_GET['template']));
            wp_redirect(esc_url_raw(add_query_arg(array('pid' => $_REQUEST['pid'], 'paged' => 1, 'view'  => 'templates'), admin_url('admin.php?page=nbdesigner_manager_product'))));
            exit;
        }         
        if (( isset($_POST['action']) && $_POST['action'] == 'bulk-delete' ) || ( isset($_POST['action2']) && $_POST['action2'] == 'bulk-delete' )) {
            if( isset( $_POST['bulk-delete'] ) ){
                $delete_ids = esc_sql($_POST['bulk-delete']);
                foreach ($delete_ids as $id) {
                    self::delete_template($id);
                }
            }
            wp_redirect(esc_url_raw(add_query_arg('','')));
            exit;
        }
        if (( isset($_POST['action']) && $_POST['action'] == 'bulk-publish' ) || ( isset($_POST['action2']) && $_POST['action2'] == 'bulk-publish' )) {
            if( isset( $_POST['bulk-delete'] ) ){
                $delete_ids = esc_sql($_POST['bulk-delete']);
                foreach ($delete_ids as $id) {
                    self::update_template($id, array('publish' => 1));
                }
            }
            wp_redirect(esc_url_raw(add_query_arg('','')));
            exit;
        }        
        if (( isset($_POST['action']) && $_POST['action'] == 'bulk-unpublish' ) || ( isset($_POST['action2']) && $_POST['action2'] == 'bulk-unpublish' )) {
            if( isset( $_POST['bulk-delete'] ) ){
                $delete_ids = esc_sql($_POST['bulk-delete']);
                foreach ($delete_ids as $id) {
                    self::update_template($id, array('publish' => 0));
                }
            }
            wp_redirect(esc_url_raw(add_query_arg('','')));
            exit;
        } 
        if (( isset($_POST['action']) && $_POST['action'] == 'bulk-private' ) || ( isset($_POST['action2']) && $_POST['action2'] == 'bulk-private' )) {
            if( isset( $_POST['bulk-delete'] ) ){
                $delete_ids = esc_sql($_POST['bulk-delete']);
                foreach ($delete_ids as $id) {
                    self::update_template($id, array('private' => 1, 'publish' => 0));
                }
            }
            wp_redirect(esc_url_raw(add_query_arg('','')));
            exit;
        }         
    }

}