<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly  ?>
<div>
    <p style="font-weight: bold; font-size: 20px;">
        <a href="javascript:void(0)" onclick="showPopupCreateTemplate()" class="nbd-back-to-list-pp-products" title="<?php _e('Back to list', 'web-to-print-online-designer'); ?>">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <title><?php _e('Back to list', 'web-to-print-online-designer'); ?></title>
                <path fill="#6d6d6d" d="M21 11.016v1.969h-14.156l3.563 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.563 3.609h14.156z"></path>
            </svg>            
        </a>&nbsp;&nbsp;<?php echo $name; ?>
    </p>
    <img style="max-width: 300px; margin: 0 auto;" src="<?php echo $image; ?>"/>
</div>
<?php if($type == 'variable'): ?>
<div class="nbd-preview-product-variation">
    <label><?php _e('Choose variation', 'web-to-print-online-designer'); ?></label>
    <select class="nbd-select" onchange="switchNBDProductVariation(this)">
        <?php foreach( $variations as $variation ): ?>
        <option value="<?php echo $variation['id']; ?>"><?php echo $variation['name']; ?></option>
        <?php endforeach; ?>
    </select>
</div>
<?php endif; ?>
<div style="margin-top: 15px;">
    <a style="float: none;" class="nbd-popup-start-design" id="nbd-popup-link-create-template" href="<?php echo $link_create_template; ?><?php if($type == 'variable') echo '&variation_id='.$variations[0]['id']; ?>" data-href="<?php echo $link_create_template; ?>"><?php _e('Create template', 'web-to-print-online-designer'); ?></a>
</div>