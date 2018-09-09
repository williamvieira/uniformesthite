<?php
/**
 * The default template for displaying content
 *
 * Used for both single and index/archive/search.
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */
?>

	<figure><?php the_post_thumbnail('full'); ?></figure>
    <h2><?php the_title(); ?></h2>
    <?php the_content(); ?>