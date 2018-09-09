<?php
/**
 * The template for displaying Category pages
 *
 * Used to display archive-type pages for posts in a category.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */

get_header(); ?>

	
    <div class="Lock blog">
    	<h1 class="simple-title"><?php single_cat_title(); ?></h1>
        <ul>
        <?php
			while ( have_posts() ) : the_post();
				get_template_part( 'content', 'blog', get_post_format() );
			endwhile;
		?>
        </ul>
    </div>
<?php get_footer(); ?>
