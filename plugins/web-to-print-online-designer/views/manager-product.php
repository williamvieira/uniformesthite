<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly  ?>
<div class="nbd-header-with-form">
    <h2 class="nbd-title-page"><?php echo __('Manager NBDesigner Products', 'web-to-print-online-designer'); ?></h2>
    <form action="#" method="POST" class="nbd-header-form">
        <input type="search" name="q" value="<?php echo $q; ?>"/>
        <input type="submit" value="<?php _e('Search products', 'web-to-print-online-designer'); ?>" class="button" />
    </form>
</div>
<?php add_thickbox(); ?>
<div class="wrap postbox nbdesigner-manager-product">
    <div>
	<?php 
            global $wpdb;
            foreach($pro as $key => $val): 
            $id = $val["id"];    
            $priority = 'extra';
            $primary = get_post_meta($id, '_nbdesigner_admintemplate_primary', true);
            if(!$primary) $priority = 'primary';
            $link_manager_template = add_query_arg(array(
                'pid' => $id, 
                'view' => 'templates'), 
                 admin_url('admin.php?page=nbdesigner_manager_product'));              
            $link_create_template = add_query_arg(array(
                    'product_id' => $id,
                    'task'  =>  'create',
                    'rd'    => urlencode($link_manager_template)
                ), getUrlPageNBD('create'));             
            $link_manager_template = add_query_arg(array('pid' => $id, 'view' => 'templates'), admin_url('admin.php?page=nbdesigner_manager_product'));
        ?>
		<div class="nbdesigner-product">
                    <a class="nbdesigner-product-title"><span><?php echo $val['name']; ?></span></a>
                    <div class="nbdesigner-product-inner">
                        <a href="<?php echo $val['url']; ?>" class="nbdesigner-product-link"><?php echo $val['img']; ?></a> 
                    </div>
                    <p class="nbdesigner-product-link">
                        <a href="<?php echo $val['url'].'#nbdesigner_setting'; ?>" title="<?php _e('Edit product', 'web-to-print-online-designer'); ?>"><span class="dashicons dashicons-edit"></span></a>
                        <a href="<?php echo get_permalink($val['id']); ?>" title="<?php _e('View product', 'web-to-print-online-designer'); ?>"><span class="dashicons dashicons-visibility"></span></a>
                        <?php 
                            $product = wc_get_product($id);
                            $variations = get_nbd_variations( $id );
                            if( count($variations) == 0 ):
                        ?>
                        <a href="<?php echo $link_create_template; ?>" target="_blank" title="<?php _e('Create template', 'web-to-print-online-designer'); ?>"><span class="dashicons dashicons-admin-customizer"></span></a>
                        <?php  
                            else: 
                        ?>
                        <a href="#TB_inline?width=300&height=160&inlineId=nbd-<?php echo $id; ?>" class="thickbox"><span class="dashicons dashicons-admin-customizer"></span></a>
                        <?php endif; ?>
                        <a href="<?php echo $link_manager_template; ?>" title="<?php _e('Manage template', 'web-to-print-online-designer'); ?>">
                            <span class="dashicons dashicons-images-alt"></span>
                            <span class="count"><?php echo $val['number_template']; ?></span>
                        </a>
                    </p> 
                    <?php 
                        if( count($variations) > 0 ):
                    ?>
                    <div id="nbd-<?php echo $id; ?>" style="display:none;">
                        <table class="form-table">
                            <tr valign="top">
                                <th scope="row" class="titledesc"><?php echo __("Choose variation", 'web-to-print-online-designer'); ?></th>
                                <td class="forminp-text">
                                    <select onchange="changeLink(this)" style="padding: 0;">
                                    <?php foreach ($variations as $variation): ?>
                                        <option value="<?php echo $variation['id']; ?>"><?php echo $variation['name']; ?></option>
                                    <?php endforeach; ?>
                                    </select>    
                                </td>
                            </tr>
                        </table>
                        <p style="text-align: center;"><a class="button button-primary nbd-create" href="<?php echo $link_create_template; ?><?php echo '&variation_id='.$variations[0]['id'];  ?>" data-href="<?php echo $link_create_template; ?>"><?php echo __("Create template", 'web-to-print-online-designer'); ?></a></p>
                    </div>
                    <?php endif; ?>
		</div>		
	<?php endforeach;?>
    </div>
    <div class="tablenav top">
        <div class="tablenav-pages">
            <span class="displaying-num"><?php echo $number_pro.' '. __('Products', 'web-to-print-online-designer'); ?></span>
            <?php echo $paging->html();  ?>
        </div>
    </div>    
</div>
<script>
    changeLink = function(e){
        var vid = jQuery(e).val(),
        btn = jQuery(e).parents('table').siblings('p').find('a.nbd-create'),
        origin_fref = btn.data('href'),
        new_href = origin_fref + '&variation_id=' + vid;
        btn.attr('href', new_href);
    }
</script>
<style type="text/css">
    .nbd-header-with-form {
        position: relative;
    }
    .nbd-header-form {
        position: absolute;
        display: inline-block;
        top: 10px;
        right: 25px;
    }
</style>