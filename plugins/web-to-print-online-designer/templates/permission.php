<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly  ?>
<div style="font-size: 40px;text-align: center;">
    <p><img src="<?php echo NBDESIGNER_PLUGIN_URL . 'assets/images/dinosaur.png'; ?>" /></p>
    <p><?php _e('You do not have permission to access this page!', 'web-to-print-online-designer'); ?> </p>
    <p><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php _e('Back', 'web-to-print-online-designer') ?></a></p>
</div>
