<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly  ?>
<h2><?php _e('Designs store', 'web-to-print-online-designer'); ?></h2>
<?php
    $is_artist = is_nbd_designer($user->ID) ? 1 : 0;
    if($is_artist):
?>
<p id="nbd-artist-form">
    <a href="<?php echo add_query_arg(array('id' => $user->ID), getUrlPageNBD('designer')); ?>">
        → <?php _e( 'View own gallery', 'web-to-print-online-designer' ); ?>
    </a>    
</p>
<?php endif; ?>
<?php if( count($designs) ): ?>
<div class="container-design">
    <table class="shop_table shop_table_responsive my_account_orders">
        <thead>
            <tr>
                <th><?php _e('Preview', 'web-to-print-online-designer'); ?></th>
                <!--<th><?php _e('Price', 'web-to-print-online-designer'); ?></th>-->
                <th><?php _e('Created', 'web-to-print-online-designer'); ?></th>
                <th><?php _e('Action ', 'web-to-print-online-designer'); ?></th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($designs as $design): 
                $pathDesign = NBDESIGNER_CUSTOMER_DIR . '/' . $design->folder .'/preview';
                $listThumb = Nbdesigner_IO::get_list_images($pathDesign);
                $link_edit_design = add_query_arg(array(
                        'product_id' => $design->product_id,
                        'variation_id' => $design->variation_id,
                        'task'  =>  'edit',
                        'design_type'  =>  'art',
                        'nbd_item_key'  =>  $design->folder,
                        'rd'    => urlencode(wc_get_endpoint_url( 'my-designs', $current_page, wc_get_page_permalink( 'myaccount' ) ))
                    ), getUrlPageNBD('create'));                  
            ?>
            <tr class="order">
                <td data-title="<?php _e('Preview', 'web-to-print-online-designer'); ?>">
                    <?php foreach ($listThumb as $image ): ?>
                    <img style="max-width: 100px; display: inline-block; border: 1px solid #ddd;" src="<?php echo Nbdesigner_IO::convert_path_to_url($image); ?>" />
                    <?php endforeach; ?>
                </td>
                <!--<td data-title="<?php _e('Price', 'web-to-print-online-designer'); ?>"><?php echo wc_price($design->price) ?></td>-->
                <td data-title="<?php _e('Date', 'web-to-print-online-designer'); ?>"><?php echo $design->created_date; ?></td>
                <td data-title="<?php _e('Action ', 'web-to-print-online-designer'); ?>">
                    <!-- <a href="<?php echo wc_get_endpoint_url( 'view-design', $design->id, wc_get_page_permalink( 'myaccount' ) ); ?>"><?php _e('Edit', 'web-to-print-online-designer'); ?></a> -->
                    <a href="<?php echo $link_edit_design; ?>"><?php _e('Edit', 'web-to-print-online-designer'); ?></a><br />
                    <a href="javascript:void(0)" data-design="<?php echo $design->id;  ?>" onclick="NBDESIGNERPRODUCT.delete_my_design( this )"><?php _e('Delete', 'web-to-print-online-designer'); ?></a><br />
                    <a href="javascript:void(0)" data-design="<?php echo $design->id;  ?>" onclick="NBDESIGNERPRODUCT.add_design_to_cart( this )"><?php _e('Add to cart', 'web-to-print-online-designer'); ?></a>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    <?php 
        $max_page = ceil($total/$item_per_page);
        if( $max_page > 1 ): 
    ?>
    <div class="nbd-nav">
        <?php if ( 1 !== $current_page ) : ?>
        <a class="woocommerce-button woocommerce-button--previous woocommerce-Button woocommerce-Button--previous button" href="<?php echo wc_get_endpoint_url( 'my-designs', $current_page - 1, wc_get_page_permalink( 'myaccount' ) ); ?>" ><?php _e( 'Previous', 'web-to-print-online-designer' ); ?></a>
        <?php endif;?>
        <?php if( $max_page != $current_page ): ?>
        <a class="woocommerce-button woocommerce-button--next woocommerce-Button woocommerce-Button--next button" href="<?php echo wc_get_endpoint_url( 'my-designs', $current_page + 1, wc_get_page_permalink( 'myaccount' ) ); ?>"><?php _e( 'Next', 'web-to-print-online-designer' ); ?></a>
        <?php endif;?>
    </div>
    <?php endif;?>
</div>
<?php else: ?>
<div class="woocommerce-message woocommerce-message--info woocommerce-Message woocommerce-Message--info woocommerce-info">
    <?php _e( 'No design has been made yet.', 'web-to-print-online-designer' ); ?>
</div>
<?php endif;?>