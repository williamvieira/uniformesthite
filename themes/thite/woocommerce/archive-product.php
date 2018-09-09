<?php
/**
 * The Template for displaying product archives, including the main shop page which is a post type archive
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/archive-product.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     2.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

get_header(); ?>

	<div class="content-interna Lock">
    	<?php get_sidebar(); ?>
        <div class="grid-produtos">
        	<div class="title">
				<?php
                    $taxonomy_id = get_queried_object_id();
                    $taxonomy = get_term_by('id', $taxonomy_id, 'product_cat');
                ?>
                <?php if(!$taxonomy->parent):?>
                <h1><?php the_field( 'title_style', 'product_cat_'.$taxonomy_id ); ?></h1>
                <?php else:?>
                <h1><?php the_field( 'title_style', 'product_cat_'.$taxonomy->parent ); ?></h1>
                <h2><?php woocommerce_page_title(); ?></h2>
                <?php endif;?>
			</div>
            
            <?php if ( have_posts() ) : ?>

				<?php woocommerce_product_loop_start(); ?>
    
                    <?php woocommerce_product_subcategories(); ?>
    
                    <?php while ( have_posts() ) : the_post(); ?>
    
                        <?php
                            /**
                             * woocommerce_shop_loop hook.
                             *
                             * @hooked WC_Structured_Data::generate_product_data() - 10
                             */
                            do_action( 'woocommerce_shop_loop' );
                        ?>
    
                        <?php wc_get_template_part( 'content', 'product' ); ?>
    
                    <?php endwhile; // end of the loop. ?>
    
                <?php woocommerce_product_loop_end(); ?>
    
                <?php
                    /**
                     * woocommerce_after_shop_loop hook.
                     *
                     * @hooked woocommerce_pagination - 10
                     */
                    do_action( 'woocommerce_after_shop_loop' );
                ?>
    
				<?php elseif ( ! woocommerce_product_subcategories( array( 'before' => woocommerce_product_loop_start( false ), 'after' => woocommerce_product_loop_end( false ) ) ) ) : ?>
        
                    <?php
                        /**
                         * woocommerce_no_products_found hook.
                         *
                         * @hooked wc_no_products_found - 10
                         */
                        do_action( 'woocommerce_no_products_found' );
                    ?>
        
                <?php endif; ?>
    
				<?php
                    /**
                     * woocommerce_after_main_content hook.
                     *
                     * @hooked woocommerce_output_content_wrapper_end - 10 (outputs closing divs for the content)
                     */
                    do_action( 'woocommerce_after_main_content' );
                ?>
        </div>
    </div>

<?php get_footer(); ?>
