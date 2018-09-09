<?php
/**
 * The Template for displaying all single posts
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */

get_header(); ?>

	<div class="Lock">
    	<div class="blog-interna W670 Left">
			<?php
              $categoria = get_the_category();
              $nomeCategoria = $categoria[0]->cat_name;
            ?>
            <h1 class="simple-title"><?php echo $nomeCategoria; ?></h1>    
            <?php while ( have_posts() ) : the_post(); ?>
                <?php get_template_part( 'content', 'blog-interna', get_post_format() ); ?>
            <?php endwhile; // end of the loop. ?>
        </div>
        <?php get_sidebar('posts'); ?>   
    </div>
<?php get_footer(); ?>