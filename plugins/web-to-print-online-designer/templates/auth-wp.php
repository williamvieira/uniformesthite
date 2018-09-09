<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly  ?>
Welcome
<script type="text/javascript">
    <?php if( is_user_logged_in() ): ?>
        window.location.hash = '#logged';
    <?php endif; ?>
</script>