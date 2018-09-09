<div class="nbd-category nbd-sidebar-con">
    <p class="nbd-sidebar-h3"><?php _e('Design Category', 'web-to-print-online-designer'); ?></p>
    <div class="nbd-sidebar-con-inner">
    <?php
        $walker = new NBD_Category();
        echo "<ul>";
        echo call_user_func_array( array(&$walker, 'walk'), array($categories, 0, array()) );
        echo "</ul>";
    ?>
    </div>    
</div>    
<div class="nbd-designers nbd-sidebar-con">
    <p class="nbd-sidebar-h3"><?php _e('Designer', 'web-to-print-online-designer'); ?></p>
    <div class="nbd-sidebar-con-inner">
        <?php foreach( $designers as $designer ): 
            $link_designer = add_query_arg(array('id' => $designer['art_id']), getUrlPageNBD('designer'));
        ?>
        <a href="<?php echo $link_designer; ?>" class="nbd-tag"><span><?php echo $designer['art_name']; ?></span></a>        
        <?php endforeach; ?>
    </div>
</div>  
<div class="nbd-designers nbd-sidebar-con">
    <p class="nbd-sidebar-h3"><?php _e('Products', 'web-to-print-online-designer'); ?></p>
    <div class="nbd-sidebar-con-inner">
        <div class="nbd-tem-list-product-wrap">
            <ul>
            <?php        
            foreach( $products as $key => $product ): 
                $link_prodcut_templates = add_query_arg(array('pid' => $product['product_id']), getUrlPageNBD('gallery'));
            ?>
                <li class="nbd-tem-list-product <?php if($key > 14) echo 'nbd-hide'; ?>"><a class="<?php if($pid == $product['product_id']) echo 'active'; ?>" href="<?php echo $link_prodcut_templates; ?>"><span><?php echo $product['name']; ?></span></a></li>        
            <?php endforeach; ?>  
            </ul>
            <?php if(count($products) > 15): ?>
            <a class="nbd-see-all" href="javascript:void(0)" onclick="showAllProduct( this )"><?php _e('See All', 'web-to-print-online-designer'); ?></a>
            <?php endif; ?>
        </div>   
    </div>
</div>
<script>
    var showAllProduct = function(e){
        jQuery(e).hide();
        jQuery('.nbd-tem-list-product-wrap').addClass('see-all');
        jQuery('.nbd-tem-list-product-wrap ul li').removeClass('nbd-hide');
    }
</script>