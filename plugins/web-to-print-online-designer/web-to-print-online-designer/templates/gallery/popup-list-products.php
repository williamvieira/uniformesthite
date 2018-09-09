<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly  ?>
<div class="nbd-sidebar-con-inner nbd-popup-list-product <?php if( count($products > 10) ) echo 'has-scroll'; ?>">
    <ul>
    <?php foreach($products as $product): ?>
        <li class="nbd-tem-list-product"><a href="javascript:void(0)" onclick="previewNBDProduct(<?php echo $product['product_id']; ?>)" ><span><?php echo $product['name']; ?></span></a></li>
    <?php endforeach; ?>
    </ul>
</div>    

