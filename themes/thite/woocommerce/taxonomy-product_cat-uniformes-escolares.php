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
			
			<?php echo category_description(); ?>
            
            <?php if ( have_posts() ) : ?>
				<?php woocommerce_product_loop_start(); ?>
                    <?php while ( have_posts() ) : the_post(); ?>
                        <?php do_action( 'woocommerce_shop_loop' ); ?>
						<?php wc_get_template_part( 'content', 'product-galeria' ); ?>
                    <?php endwhile; // end of the loop. ?>
				<?php woocommerce_product_loop_end(); ?>
			<?php endif; ?>
        </div>
    </div>

<?php get_footer(); ?>
