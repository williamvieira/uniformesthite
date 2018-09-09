<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly  ?>
<div class="wrap">
    <?php  
        $link_manager_template = add_query_arg(array(
            'pid' => $pid, 
            'view' => 'templates'), 
             admin_url('admin.php?page=nbdesigner_manager_product'));      
        $link_add_template = add_query_arg(array(
                'product_id' => $pid,
                'task'  =>  'create',
                'rd'    => urlencode($link_manager_template)
            ), getUrlPageNBD('create'));           
    ?>  
    <div class="wrap">
        <h1 class="nbd-title">
            <?php _e('Templates for', 'web-to-print-online-designer'); ?>: <a class="nbd-product-url" href="<?php echo get_edit_post_link($pid); ?>"><?php echo $pro->get_title(); ?></a>
            <?php 
                $variations = get_nbd_variations( $pid );   
                if( count($variations) > 0 ):
            ?>   
            <?php add_thickbox(); ?>
            <a class="button thickbox" href="#TB_inline?width=300&height=160&inlineId=nbd-<?php echo $pid; ?>"><?php _e('Add Template'); ?></a>
            <?php else: ?>
            <a class="button" href="<?php echo $link_add_template; ?>"><?php _e('Add Template'); ?></a>
            <?php endif; ?>
            <a href="<?php echo admin_url('admin.php?page=nbdesigner_manager_product') ?>" class="button-primary nbdesigner-right"><?php _e('Back', 'web-to-print-online-designer'); ?></a>
        </h1>
        <?php 
            if( count($variations) > 0 ):           
        ?>
        <div id="nbd-<?php echo $pid; ?>" style="display:none;">
            <table class="form-table">
                <tr valign="top">
                    <th scope="row" class="titledesc"><?php echo __("Choose variation", 'web-to-print-online-designer'); ?></th>
                    <td class="forminp-text">
                        <select onchange="changeLink(this)">
                        <?php foreach ($variations as $variation): ?>
                            <option value="<?php echo $variation['id']; ?>"><?php echo $variation['name']; ?></option>
                        <?php endforeach; ?>
                        </select>    
                    </td>
                </tr>
            </table>
            <p style="text-align: center;"><a class="button button-primary nbd-create" href="<?php echo $link_add_template; ?><?php echo '&variation_id='.$variations[0]['id'];  ?>" data-href="<?php echo $link_add_template; ?>"><?php echo __("Create template", 'web-to-print-online-designer'); ?></a></p>
        </div>        
        <?php endif; ?>        
        <div id="poststuff">
            <div id="post-body" class="metabox-holder">
                <div id="post-body-content">
                    <div class="meta-box-sortables ui-sortable">
                        <form method="post">
                        <?php
                            $templates_obj->prepare_items();
                            $templates_obj->display();
                        ?>
                        </form>
                    </div>
                </div>
            </div>
            <br class="clear">
        </div>
    </div>  
</div>
<style>
    .column-folder {
        width: 50%;
    }
    .column-user_id {
        width: 10%;
    }
    .column-folder img{
        width: 60px;
        margin-right: 5px;
        border: 1px solid #ddd;
        border-radius: 2px;
    }   
    .column-priority span {
        font-size: 20px;
    }
    .column-priority span.primary {
        color: #0085ba;
    }
    .nbd-product-url {
        border: 1px solid #ddd;
        padding: 0 10px;
        line-height: 28px;
        height: 30px;
        display: inline-block;
        border-radius: 30px;
        margin-left: 15px;
        text-transform: uppercase;
        font-weight: bold;
        -webkit-transition: all 0.4s;
        -moz-transition: all 0.4s;
        -ms-transition: all 0.4s;
        transition: all 0.4s;
        text-decoration: none;        
    }
</style>
<script>
    changeLink = function(e){
        var vid = jQuery(e).val(),
        btn = jQuery(e).parents('table').siblings('p').find('a.nbd-create'),
        origin_fref = btn.data('href'),
        new_href = origin_fref + '&variation_id=' + vid;
        btn.attr('href', new_href);
    }
</script>