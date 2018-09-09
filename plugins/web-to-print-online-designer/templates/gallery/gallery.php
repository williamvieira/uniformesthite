<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly  ?>
<?php 
$limit = $row * $per_row;
$k = 0;
$current_user_id = get_current_user_id();
if(count($templates)):  ?>
<?php
    foreach ($templates as $key => $temp): 
    $link_template = add_query_arg(array(
        'product_id' => $temp['product_id'],
        'variation_id' => $temp['variation_id'],
        'reference'  =>  $temp['folder']
    ), getUrlPageNBD('create'));       
    $gallery_type = 1;
?>
    <div class="nbdesigner-item" <?php echo 'data-index='.$key; ?>>
        <div class="nbd-gallery-item">
            <div class="nbd-gallery-item-inner">
                <a href="javacript:void(0)" href="<?php echo $link_template; ?>" onclick="previewTempalte(<?php echo $temp['tid']; ?>)">
                    <img src="<?php echo $temp['image']; ?>" class="nbdesigner-img"/>
                </a>
            </div>
            <div class="nbd-gallery-item-acction">
                <span class="nbd-gallery-item-name"><?php echo $temp['title']; ?></span>
                <div class="nbd-like-icons">
                    <span class="nbd-like-icon like <?php if(in_array($temp['tid'], $favourite_templates)) echo 'active'; ?>" onclick="updateFavouriteTemplate(this, 'unlike', <?php echo $temp['tid']; ?>)">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                            <title>Vote</title>
                            <path fill="#db133b" d="M17.19 4.155c-1.672-1.534-4.383-1.534-6.055 0l-1.135 1.042-1.136-1.042c-1.672-1.534-4.382-1.534-6.054 0-1.881 1.727-1.881 4.52 0 6.246l7.19 6.599 7.19-6.599c1.88-1.726 1.88-4.52 0-6.246z"></path>
                        </svg>                        
                    </span>
                    <span class="nbd-like-icon unlike <?php if(!in_array($temp['tid'], $favourite_templates)) echo 'active'; ?>" onclick="updateFavouriteTemplate(this, 'like', <?php echo $temp['tid']; ?>)">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                            <title>Voted</title>
                            <path fill="#db133b" d="M17.19 4.156c-1.672-1.535-4.383-1.535-6.055 0l-1.135 1.041-1.136-1.041c-1.672-1.535-4.382-1.535-6.054 0-1.881 1.726-1.881 4.519 0 6.245l7.19 6.599 7.19-6.599c1.88-1.726 1.88-4.52 0-6.245zM16.124 9.375l-6.124 5.715-6.125-5.715c-0.617-0.567-0.856-1.307-0.856-2.094s0.138-1.433 0.756-1.999c0.545-0.501 1.278-0.777 2.063-0.777s1.517 0.476 2.062 0.978l2.1 1.825 2.099-1.826c0.546-0.502 1.278-0.978 2.063-0.978s1.518 0.276 2.063 0.777c0.618 0.566 0.755 1.212 0.755 1.999s-0.238 1.528-0.856 2.095z"></path>
                        </svg>                       
                    </span>
                    <span class="nbd-like-icon loading">
                        <img src="<?php echo NBDESIGNER_PLUGIN_URL.'assets/images/loading.gif' ?>" />
                    </span>
                </div>
            </div>
            <?php 
                if( $temp['user_id'] == $current_user_id ): 
                $link_edit_design = add_query_arg(array('id' => $temp['user_id'], 'template_id' => $temp['tid']), getUrlPageNBD('designer'));
            ?>
            <a class="nbd-edit-template" href="<?php echo $link_edit_design; ?>" title="<?php _e('Edit template', 'web-to-print-online-designer'); ?>">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14">
                    <title>Edit template</title>
                    <path fill="#757575" d="M2.836 12l0.711-0.711-1.836-1.836-0.711 0.711v0.836h1v1h0.836zM6.922 4.75c0-0.102-0.070-0.172-0.172-0.172-0.047 0-0.094 0.016-0.133 0.055l-4.234 4.234c-0.039 0.039-0.055 0.086-0.055 0.133 0 0.102 0.070 0.172 0.172 0.172 0.047 0 0.094-0.016 0.133-0.055l4.234-4.234c0.039-0.039 0.055-0.086 0.055-0.133zM6.5 3.25l3.25 3.25-6.5 6.5h-3.25v-3.25zM11.836 4c0 0.266-0.109 0.523-0.289 0.703l-1.297 1.297-3.25-3.25 1.297-1.289c0.18-0.187 0.438-0.297 0.703-0.297s0.523 0.109 0.711 0.297l1.836 1.828c0.18 0.187 0.289 0.445 0.289 0.711z"></path>
                </svg>            
            </a>    
            <?php endif; ?>
        </div>
    </div>
    <?php 
    $k ++;
    endforeach; ?> 
<?php else: ?>    
    <?php _e('No template', 'web-to-print-online-designer'); ?>
<?php endif; ?>
<?php if(($total > $limit) && $pagination): ?>
<?php  
    require_once NBDESIGNER_PLUGIN_DIR . 'includes/class.nbdesigner.pagination.php';
    $paging = new Nbdesigner_Pagination();
    $config = array(
        'current_page'  => isset($page) ? $page : 1, 
        'total_record'  => $total,
        'limit'         => $limit,
        'link_full'     => add_query_arg(array('paged' => '{p}'), $url),
        'link_first'    => $url              
    );	
    $paging->init($config); 
?>
    <div class="tablenav top nbdesigner-pagination-con">
        <div class="tablenav-pages">
            <span class="displaying-num"><?php printf( _n( '%s Template', '%s Templates', $total, 'web-to-print-online-designer'), number_format_i18n( $total ) ); ?>
            <?php echo $paging->html();  ?>
        </div>
    </div>  
<?php endif; ?>  
<div class="nbd-backdrop nbd-popup hide" id="nbd-popup">
    <div class="nbd-popup-content-wrap">
        <span class="nbd-popup-close" onclick="NBDPopup.hidePopup()">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <title>close</title>
                <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path>
            </svg>                
        </span>
        <div class="nbd-popup-content">           
            <div class="loading hide" id="nbd-popup-loading">
                <div class="atom-loading">
                    <div class="loading__ring">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve"><path d="M85.5,42c-0.2-0.8-0.5-1.7-0.8-2.5c-0.3-0.9-0.7-1.6-1-2.3c-0.3-0.7-0.6-1.3-1-1.9c0.3,0.5,0.5,1.1,0.8,1.7  c0.2,0.7,0.6,1.5,0.8,2.3s0.5,1.7,0.8,2.5c0.8,3.5,1.3,7.5,0.8,12c-0.4,4.3-1.8,9-4.2,13.4c-2.4,4.2-5.9,8.2-10.5,11.2  c-1.1,0.7-2.2,1.5-3.4,2c-0.5,0.2-1.2,0.6-1.8,0.8s-1.3,0.5-1.9,0.8c-2.6,1-5.3,1.7-8.1,1.8l-1.1,0.1L53.8,84c-0.7,0-1.4,0-2.1,0  c-1.4-0.1-2.9-0.1-4.2-0.5c-1.4-0.1-2.8-0.6-4.1-0.8c-1.4-0.5-2.7-0.9-3.9-1.5c-1.2-0.6-2.4-1.2-3.7-1.9c-0.6-0.3-1.2-0.7-1.7-1.1  l-0.8-0.6c-0.3-0.1-0.6-0.4-0.8-0.6l-0.8-0.6L31.3,76l-0.2-0.2L31,75.7l-0.1-0.1l0,0l-1.5-1.5c-1.2-1-1.9-2.1-2.7-3.1  c-0.4-0.4-0.7-1.1-1.1-1.7l-1.1-1.7c-0.3-0.6-0.6-1.2-0.9-1.8c-0.2-0.5-0.6-1.2-0.8-1.8c-0.4-1.2-1-2.4-1.2-3.7  c-0.2-0.6-0.4-1.2-0.5-1.9c-0.1-0.6-0.2-1.2-0.3-1.8c-0.3-1.2-0.3-2.4-0.4-3.7c-0.1-1.2,0-2.5,0.1-3.7c0.2-1.2,0.3-2.4,0.6-3.5  c0.1-0.6,0.3-1.1,0.4-1.7l0.1-0.8l0.3-0.8c1.5-4.3,3.8-8,6.5-11c0.8-0.8,1.4-1.5,2.1-2.1c0.9-0.9,1.4-1.3,2.2-1.8  c1.4-1.2,2.9-2,4.3-2.8c2.8-1.5,5.5-2.3,7.7-2.8s4-0.7,5.2-0.6c0.6-0.1,1.1,0,1.4,0s0.4,0,0.4,0h0.1c2.7,0.1,5-2.2,5-5  c0.1-2.7-2.2-5-5-5c-0.2,0-0.2,0-0.3,0c0,0-0.2,0.1-0.6,0.1c-0.4,0-1,0-1.8,0.1c-1.6,0.1-4,0.4-6.9,1.2c-2.9,0.8-6.4,2-9.9,4.1  c-1.8,1-3.6,2.3-5.4,3.8C26,21.4,25,22.2,24.4,23c-0.2,0.2-0.4,0.4-0.6,0.6c-0.2,0.2-0.5,0.4-0.6,0.7c-0.5,0.4-0.8,0.9-1.3,1.4  c-3.2,3.9-5.9,8.8-7.5,14.3l-0.3,1l-0.2,1.1c-0.1,0.7-0.3,1.4-0.4,2.1c-0.3,1.5-0.4,2.9-0.5,4.5c0,1.5-0.1,3,0.1,4.5  c0.2,1.5,0.2,3,0.6,4.6c0.1,0.7,0.3,1.5,0.4,2.3c0.2,0.8,0.5,1.5,0.7,2.3c0.4,1.6,1.1,3,1.7,4.4c0.3,0.7,0.7,1.4,1.1,2.1  c0.4,0.8,0.8,1.4,1.2,2.1c0.5,0.7,0.9,1.4,1.4,2s0.9,1.3,1.5,1.9c1.1,1.3,2.2,2.7,3.3,3.5l1.7,1.6c0,0,0.1,0.1,0.1,0.1c0,0,0,0,0,0  c0,0,0,0,0,0l0.1,0.1l0.1,0.1h0.2l0.5,0.4l1,0.7c0.4,0.2,0.6,0.5,1,0.7l1.1,0.6c0.8,0.4,1.4,0.9,2.1,1.2c1.4,0.7,2.9,1.5,4.4,2  c1.5,0.7,3.1,1,4.6,1.5c1.5,0.3,3.1,0.7,4.7,0.8c1.6,0.2,3.1,0.2,4.7,0.2c0.8,0,1.6-0.1,2.4-0.1l1.2-0.1l1.1-0.1  c3.1-0.4,6.1-1.3,8.9-2.4c0.8-0.3,1.4-0.6,2.1-0.9s1.3-0.7,2-1.1c1.3-0.7,2.6-1.7,3.7-2.5c0.5-0.4,1-0.9,1.6-1.3l0.8-0.6l0.2-0.2  c0,0,0.1-0.1,0.1-0.1c0.1-0.1,0,0,0,0v0.1l0.1-0.1l0.4-0.4c0.5-0.5,1-1,1.5-1.5c0.3-0.3,0.5-0.5,0.8-0.8l0.7-0.8  c0.9-1.1,1.8-2.2,2.5-3.3c0.4-0.6,0.7-1.1,1.1-1.7c0.3-0.7,0.6-1.2,0.9-1.8c2.4-4.9,3.5-9.8,3.7-14.4C87.3,49.7,86.6,45.5,85.5,42z"></path></svg>
                    </div>
                    <div class="loading__ring">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve"><path d="M85.5,42c-0.2-0.8-0.5-1.7-0.8-2.5c-0.3-0.9-0.7-1.6-1-2.3c-0.3-0.7-0.6-1.3-1-1.9c0.3,0.5,0.5,1.1,0.8,1.7  c0.2,0.7,0.6,1.5,0.8,2.3s0.5,1.7,0.8,2.5c0.8,3.5,1.3,7.5,0.8,12c-0.4,4.3-1.8,9-4.2,13.4c-2.4,4.2-5.9,8.2-10.5,11.2  c-1.1,0.7-2.2,1.5-3.4,2c-0.5,0.2-1.2,0.6-1.8,0.8s-1.3,0.5-1.9,0.8c-2.6,1-5.3,1.7-8.1,1.8l-1.1,0.1L53.8,84c-0.7,0-1.4,0-2.1,0  c-1.4-0.1-2.9-0.1-4.2-0.5c-1.4-0.1-2.8-0.6-4.1-0.8c-1.4-0.5-2.7-0.9-3.9-1.5c-1.2-0.6-2.4-1.2-3.7-1.9c-0.6-0.3-1.2-0.7-1.7-1.1  l-0.8-0.6c-0.3-0.1-0.6-0.4-0.8-0.6l-0.8-0.6L31.3,76l-0.2-0.2L31,75.7l-0.1-0.1l0,0l-1.5-1.5c-1.2-1-1.9-2.1-2.7-3.1  c-0.4-0.4-0.7-1.1-1.1-1.7l-1.1-1.7c-0.3-0.6-0.6-1.2-0.9-1.8c-0.2-0.5-0.6-1.2-0.8-1.8c-0.4-1.2-1-2.4-1.2-3.7  c-0.2-0.6-0.4-1.2-0.5-1.9c-0.1-0.6-0.2-1.2-0.3-1.8c-0.3-1.2-0.3-2.4-0.4-3.7c-0.1-1.2,0-2.5,0.1-3.7c0.2-1.2,0.3-2.4,0.6-3.5  c0.1-0.6,0.3-1.1,0.4-1.7l0.1-0.8l0.3-0.8c1.5-4.3,3.8-8,6.5-11c0.8-0.8,1.4-1.5,2.1-2.1c0.9-0.9,1.4-1.3,2.2-1.8  c1.4-1.2,2.9-2,4.3-2.8c2.8-1.5,5.5-2.3,7.7-2.8s4-0.7,5.2-0.6c0.6-0.1,1.1,0,1.4,0s0.4,0,0.4,0h0.1c2.7,0.1,5-2.2,5-5  c0.1-2.7-2.2-5-5-5c-0.2,0-0.2,0-0.3,0c0,0-0.2,0.1-0.6,0.1c-0.4,0-1,0-1.8,0.1c-1.6,0.1-4,0.4-6.9,1.2c-2.9,0.8-6.4,2-9.9,4.1  c-1.8,1-3.6,2.3-5.4,3.8C26,21.4,25,22.2,24.4,23c-0.2,0.2-0.4,0.4-0.6,0.6c-0.2,0.2-0.5,0.4-0.6,0.7c-0.5,0.4-0.8,0.9-1.3,1.4  c-3.2,3.9-5.9,8.8-7.5,14.3l-0.3,1l-0.2,1.1c-0.1,0.7-0.3,1.4-0.4,2.1c-0.3,1.5-0.4,2.9-0.5,4.5c0,1.5-0.1,3,0.1,4.5  c0.2,1.5,0.2,3,0.6,4.6c0.1,0.7,0.3,1.5,0.4,2.3c0.2,0.8,0.5,1.5,0.7,2.3c0.4,1.6,1.1,3,1.7,4.4c0.3,0.7,0.7,1.4,1.1,2.1  c0.4,0.8,0.8,1.4,1.2,2.1c0.5,0.7,0.9,1.4,1.4,2s0.9,1.3,1.5,1.9c1.1,1.3,2.2,2.7,3.3,3.5l1.7,1.6c0,0,0.1,0.1,0.1,0.1c0,0,0,0,0,0  c0,0,0,0,0,0l0.1,0.1l0.1,0.1h0.2l0.5,0.4l1,0.7c0.4,0.2,0.6,0.5,1,0.7l1.1,0.6c0.8,0.4,1.4,0.9,2.1,1.2c1.4,0.7,2.9,1.5,4.4,2  c1.5,0.7,3.1,1,4.6,1.5c1.5,0.3,3.1,0.7,4.7,0.8c1.6,0.2,3.1,0.2,4.7,0.2c0.8,0,1.6-0.1,2.4-0.1l1.2-0.1l1.1-0.1  c3.1-0.4,6.1-1.3,8.9-2.4c0.8-0.3,1.4-0.6,2.1-0.9s1.3-0.7,2-1.1c1.3-0.7,2.6-1.7,3.7-2.5c0.5-0.4,1-0.9,1.6-1.3l0.8-0.6l0.2-0.2  c0,0,0.1-0.1,0.1-0.1c0.1-0.1,0,0,0,0v0.1l0.1-0.1l0.4-0.4c0.5-0.5,1-1,1.5-1.5c0.3-0.3,0.5-0.5,0.8-0.8l0.7-0.8  c0.9-1.1,1.8-2.2,2.5-3.3c0.4-0.6,0.7-1.1,1.1-1.7c0.3-0.7,0.6-1.2,0.9-1.8c2.4-4.9,3.5-9.8,3.7-14.4C87.3,49.7,86.6,45.5,85.5,42z"></path></svg>
                    </div>
                </div>   
            </div>
            <div class="nbd-popup-content-inner">

            </div>                
        </div>
    </div>
</div>
<script>
    var art_id = "<?php echo $current_user_id; ?>";
    var nonce = "<?php echo wp_create_nonce('nbd_update_favourite_template') ?>"; 
    var updateFavouriteTemplate = function(e, type, template_id){
        var self = jQuery(e),
        parent = self.parent('.nbd-like-icons'),
        tempaltes = localStorage.getItem("nbd_favourite_templates");
        if( tempaltes.indexOf(template_id) > -1 && type == 'like') {
            alert('Template has been added into favourite list!');  
            parent.find('.nbd-like-icon').removeClass('active');
            parent.find('.nbd-like-icon.like').addClass('active'); 
            return;
        }
        var _data = {
            action: 'nbd_update_favorite_template',
            template_id: template_id,
            type: type,
            nonce: nonce
        };
        parent.find('.nbd-like-icon').removeClass('active');
        parent.find('.nbd-like-icon.loading').addClass('active');        
        jQuery.post(woocommerce_params.ajax_url , _data, function(data){
            localStorage.setItem("nbd_favourite_templates", JSON.stringify(data.templates));
            parent.find('.nbd-like-icon.loading').removeClass('active');
            parent.find('.nbd-like-icon.'+type).addClass('active');    
        });
    };
    var nbd_preview_html = [];
    var previewTempalte = function(tid){
        NBDPopup.initPopup();
        if( nbd_preview_html[tid] != undefined ){
            jQuery('.nbd-popup-content-inner').html(nbd_preview_html[tid]);
        }else{
            jQuery('#nbd-popup-loading').removeClass('hide');
            jQuery('.nbd-popup-content-inner').addClass('hide');
            jQuery.ajax({
                url: nbds_frontend.url,
                method: "POST",
                data: 'action=nbd_get_template_preview&template_id='  +  tid  + '&nonce=' + nonce     
            }).done(function(data){
                if( data.flag == 1 ){
                    jQuery('.nbd-popup-content-inner').html(data.html);
                    nbd_preview_html[tid] = data.html;
                }
                jQuery('#nbd-popup-loading').addClass('hide');
                jQuery('.nbd-popup-content-inner').removeClass('hide');
            });               
        }       
    };
    var nbd_list_product_html = '';
    var showPopupCreateTemplate = function(){
        NBDPopup.initPopup();
        if( nbd_list_product_html != '' ){
            jQuery('.nbd-popup-content-inner').html( nbd_list_product_html );
        }else{
            jQuery('#nbd-popup-loading').removeClass('hide');
            jQuery('.nbd-popup-content-inner').addClass('hide');
            jQuery.ajax({
                url: nbds_frontend.url,
                method: "POST",
                data: 'action=nbd_get_list_product_ready_to_create_template'  + '&nonce=' + nonce     
            }).done(function(data){
                if( data.flag == 1 ){
                    jQuery('.nbd-popup-content-inner').html(data.html);
                    nbd_list_product_html = data.html;
                }
                jQuery('#nbd-popup-loading').addClass('hide');
                jQuery('.nbd-popup-content-inner').removeClass('hide');
            });              
        }
    };  
    var nbd_preview_product_html = [];
    var previewNBDProduct = function(pid){
        if( nbd_preview_product_html[pid] != undefined ){
            jQuery('.nbd-popup-content-inner').html(nbd_preview_product_html[pid]);
        }else{
            jQuery('#nbd-popup-loading').removeClass('hide');
            jQuery('.nbd-popup-content-inner').addClass('hide');
            jQuery.ajax({
                url: nbds_frontend.url,
                method: "POST",
                data: 'action=nbd_get_preview_product_before_create_template&product_id='  +  pid  + '&nonce=' + nonce + '&art_id=' + art_id    
            }).done(function(data){
                if( data.flag == 1 ){
                    jQuery('.nbd-popup-content-inner').html(data.html);
                    nbd_preview_product_html[pid] = data.html;
                }
                jQuery('#nbd-popup-loading').addClass('hide');
                jQuery('.nbd-popup-content-inner').removeClass('hide');
            });               
        }       
    };    
    var changePreviewImage = function(e){
        var src = jQuery(e).attr('src');
        jQuery('.nbd-popup-list-preview img').removeClass('active');
        jQuery(e).addClass('active');
        jQuery('#nbd-popup-large-preview').attr('src', src);
    };
    var switchNBDProductVariation = function(e){
        var vid = jQuery(e).val(),
        btn = jQuery('#nbd-popup-link-create-template'),
        origin_fref = btn.data('href'),
        new_href = origin_fref + '&variation_id=' + vid;
        btn.attr('href', new_href);        
    }
    jQuery( document ).ready(function(){
        var templates = '<?php echo json_encode($favourite_templates); ?>';
        localStorage.setItem("nbd_favourite_templates", templates);  
        var xl = is_nbd_gallery == 1 ? 3 : 4;
        jQuery('#nbdesigner-gallery').drystone({
            gutter: 15,
            item: '.nbdesigner-item',
            xs: [576, 1],
            sm: [768, 2],
            md: [992, 2],
            lg: [1200, 3],
            xl: xl,
            onComplete: function() {
                jQuery('#nbdesigner-gallery').removeClass('nbd-gallery-processing');
            }
        });
        NBDPopup.calcWidth();
    }); 
    jQuery("body").click(function(e) {
        if(e.target.id == 'nbd-popup'){
            NBDPopup.hidePopup();
        }
    });
    jQuery(window).on('resize', function () {
        NBDPopup.calcWidth();
    });  
    var NBDPopup = {
        initPopup: function(){
            jQuery('.nbd-popup').addClass('active');
            jQuery('.nbd-popup').removeClass('hide');
            jQuery('body').addClass('open-nbd-popup');
        },
        calcWidth: function(){
            var width = jQuery(window).width(),
            height = jQuery(window).height(),
            popupWidth = 600,
            minHeight = 500,
            popupTop = 100;
            if( width < 600 ) {
                popupWidth = width - 30;
            }
            if( height < 700 ) {
                minHeight = height - 200;
            }            
            jQuery('.nbd-popup-content-wrap').css({
                'width': popupWidth + 'px',
                'margin': popupTop + 'px auto',
                'min-height': minHeight + 'px'
            });     
            jQuery('.nbd-popup-content').css({
                'min-height': minHeight + 'px'
            });
        },
        hidePopup: function(){
            jQuery('.nbd-popup').removeClass('active');
            jQuery('body').removeClass('open-nbd-popup');
            setTimeout(function(){ 
                jQuery('.nbd-popup').addClass('hide');
            }, 500);
        }
    };    
</script>