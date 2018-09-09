<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly  ?>
<h2 class="woocommerce-order-details__title">Design detail</h2>
<?php
    $pid = get_wpml_original_id( $design->product_id );
    $vid = get_wpml_original_id( $design->variation_id );
    $product = wc_get_product( $pid );
    $variations = get_nbd_variations( $pid );
    $is_artist = current_user_can('edit_nbd_template') ? 1 : 0;
    $create_permission = get_the_author_meta( 'nbd_create_design', $user_id );
    if($create_permission) $is_artist = 1;
    $product_name = $product->get_name();
    $link_add_design = add_query_arg(array(
            'product_id' => $pid,
            'variation_id' =>$vid,
            'task'  =>  'create',
            'design_type'  =>  'art',
            'rd'    => urlencode(wc_get_endpoint_url( 'my-designs', 1, wc_get_page_permalink( 'myaccount' ) ))
        ), getUrlPageNBD('create'));  
    $link_edit_design = add_query_arg(array(
            'product_id' => $pid,
            'variation_id' => $vid,
            'task'  =>  'edit',
            'design_type'  =>  'art',
            'nbd_item_key'  =>  $design->folder,
            'rd'    => urlencode(wc_get_endpoint_url( 'view-design', $design->id, wc_get_page_permalink( 'myaccount' ) ))
        ), getUrlPageNBD('create'));      
    $pathDesign = NBDESIGNER_CUSTOMER_DIR . '/' . $design->folder .'/preview';
    $listThumb = Nbdesigner_IO::get_list_images($pathDesign);    
    if( count($variations) ){
        $var = null;
        foreach ($variations as $variation){
            if( $variation['id'] == $vid ) {
                $var = $variation;
                break;
            }
        }
        $product_name = $var['name'];
    }
?>
<div class="nbd-section">
    <span>
        <span><?php _e('Product', 'web-to-print-online-designer') ?></span>&nbsp;
        <a href="<?php echo get_permalink( $pid ); ?>"><?php echo $product_name; ?></a>
    </span>
    <span class="nbd-design-action">
        <a class="button" href="<?php echo $link_edit_design; ?>"><?php _e('Edit design', 'web-to-print-online-designer'); ?></a>
        <?php if($is_artist): ?>
        <a class="button" href="<?php echo $link_add_design; ?>"><?php _e('Add design', 'web-to-print-online-designer'); ?></a>
        <?php endif; ?>
    </span>   
</div>
<div class="nbd-section">
    <div id="nbd-form-template">
        <p class="form-row form-row-first" id="billing_first_name_field">
            <label for="nbd-design-price" class=""><?php _e('Price', 'web-to-print-online-designer'); ?></label>
            <input type="number" min="0" class="input-text" name="nbd-design-price" id="nbd-design-price" value="<?php echo $design->price; ?>">
        </p>
        <p class="form-row form-row-last" id="billing_first_name_field">
            <label for="nbd-design-status" class=""><?php _e('Status', 'web-to-print-online-designer'); ?></label>
            <select name="nbd-design-status" class="nbd-design-status">
                <option value="1" <?php selected( $design->publish, 1 ); ?>><?php _e('Publish', 'web-to-print-online-designer'); ?></option>
                <option value="0" <?php selected( $design->publish, 0 ); ?>><?php _e('Unpublish', 'web-to-print-online-designer'); ?></option>
            </select>     
        </p>
        <p style="width: 100%; clear: both;" >
            <a class="button" id="bd-form-submit" href="javascript: void(0);" onclick="updateDesign()" /><?php _e('Update', 'web-to-print-online-designer'); ?></a>
        </p>
        <?php wp_nonce_field( 'nbd_artist_update', 'nbd_nonce' ); ?>
        <input type="hidden" value="<?php echo $design->id; ?>" name="nbd-design-id" />
    </div>
    <p class="form-row form-row-first" id="billing_first_name_field">
        <span class="nbd-title"><?php _e('Vote', 'web-to-print-online-designer'); ?></span>&nbsp;<span><?php echo $design->vote; ?></span>
    </p>
    <p class="form-row form-row-first" id="billing_first_name_field">
        <span class="nbd-title"><?php _e('Hits', 'web-to-print-online-designer'); ?></span>&nbsp;<span><?php echo $design->hit; ?></span>
    </p>    
</div>
<div class="nbd-section">
    <p style="font-weight: bold;"><?php _e('Preview', 'web-to-print-online-designer'); ?></p>
    <?php foreach ($listThumb as $image ): ?>
    <img style="display: inline-block; border: 1px solid #ddd;" src="<?php echo Nbdesigner_IO::convert_path_to_url($image); ?>?t=<?php echo time(); ?>" />
    <?php endforeach; ?>
</div>
<?php
    /* For Artist */
    if($is_artist):
?>
    
<?php endif; ?>
<div>
    
</div>
<style>
    .nbd-title {
        font-weight: bold;
        margin-right: 15px;
    }
    .nbd-section {
        clear: both;
        overflow: hidden;
        margin-bottom: 15px;
    }
    .nbd-design-action {
        float: right;  
    }
    .nbd-add-design {
        padding: 5px;
        border: 1px solid #ddd;  
    }
    .nbd-add-design:hover {
        color: #fff;
        background: #1e73be;
    }
    .nbd-design-status {
        width: auto !important;
        height: 45px;
    }
</style>
<script>
var nbd_ajax = "<?php echo admin_url('admin-ajax.php'); ?>";       
function updateDesign(){
    var formdata = jQuery('#nbd-form-template').find('textarea, select, input').serialize();
    formdata = formdata + '&action=nbd_update_art';
    jQuery.post(nbd_ajax, formdata, function(data){
        data = JSON.parse(data);
        if(data.flag && data.flag == 1){
            console.log(data);
        } 
    });
}    
</script>