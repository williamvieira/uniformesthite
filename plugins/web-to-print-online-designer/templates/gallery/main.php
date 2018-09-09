<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly  ?>
<div class="nbd-gallery-con">
    <?php 
        if( $pid || $cat ):
            if( $cat ){
                $product_cat = get_term( $cat, 'product_cat' );
                $title = $product_cat->name; 
            }else{
                $title = get_the_title($pid);
            }
    ?>
    <h2><?php echo $title; ?> <?php _e('designs', 'web-to-print-online-designer'); ?></h2>
    <?php endif; ?>
    <div class="nbd-sidebar">
        <?php include_once('sidebar.php'); ?>
    </div>
    <div class="nbd-list-designs">
        <div class="nbd-design-filter"></div>
        <div class="nbdesigner-gallery nbd-gallery-processing" id="nbdesigner-gallery">
        <?php 
            if( $pid ):
            $link_start_design = add_query_arg(array('product_id'    =>  $pid),  getUrlPageNBD('create'));
        ?>
            <div class="nbdesigner-item">
                <div class="nbd-gallery-item nbd-gallery-item-upload">
                    <div class="nbd-gallery-item-upload-inner">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
                            <title>plus-circle</title>
                            <path fill="#ddd" d="M40 3.333c-20.333 0-36.667 16.333-36.667 36.667s16.333 36.667 36.667 36.667 36.667-16.333 36.667-36.667-16.333-36.667-36.667-36.667zM40 70c-16.667 0-30-13.333-30-30s13.333-30 30-30c16.667 0 30 13.333 30 30s-13.333 30-30 30z"></path>
                            <path fill="#ddd" d="M53.333 36.667h-10v-10c0-2-1.333-3.333-3.333-3.333s-3.333 1.333-3.333 3.333v10h-10c-2 0-3.333 1.333-3.333 3.333s1.333 3.333 3.333 3.333h10v10c0 2 1.333 3.333 3.333 3.333s3.333-1.333 3.333-3.333v-10h10c2 0 3.333-1.333 3.333-3.333s-1.333-3.333-3.333-3.333z"></path>
                        </svg>                        
                    </div>
                    <div class="nbd-gallery-item-upload-inner">
                        <a href="<?php echo $link_start_design; ?>" class="" target="_blank" title="<?php _e('Start design', 'web-to-print-online-designer'); ?>">
                        <?php _e('Design or', 'web-to-print-online-designer'); ?><br />
                        <?php _e('Upload file', 'web-to-print-online-designer'); ?>   
                        </a>                        
                    </div>
                </div>
            </div>    
        <?php endif; ?>
        <?php include_once('gallery.php'); ?>
        </div>           
    </div>  <!-- End. list designs -->    
</div> 
<script>
    var is_nbd_gallery = 1;
</script> 
<style>       
    .nbd-gallery header h1{
        background-image: url('<?php echo NBDESIGNER_ASSETS_URL . 'images/gallery.jpg' ?>');
    }  
</style>