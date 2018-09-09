<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly  ?>
<p class="nbd-popup-design-name"><?php echo $name; ?></p>
<div class="nbd-popup-large-img">
    <img src="<?php echo $large_image; ?>" id="nbd-popup-large-preview"/>
</div>
<div class="nbd-popup-actions">
    <a style="color: #0c8ea7;" href="<?php echo $link_detail_design; ?>"><?php _e('More about this design', 'web-to-print-online-designer'); ?></a>
    <a class="nbd-popup-start-design" href="<?php echo $link_start_design; ?>"><?php _e('Use this design', 'web-to-print-online-designer'); ?></a>
</div>
<div class="nbd-popup-list-preview">
    <?php foreach ($images as $image): ?>
    <img class="nbd-popup-list-preview-img" src="<?php echo $image ?>" onclick="changePreviewImage(this)"/>
    <?php endforeach; ?>
</div>


