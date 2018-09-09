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

	<li>
        <a href="<?php the_permalink(); ?>">
            <div class="date-img">
                <div class="date">
                    <div class="dd"><?php echo get_the_date('d'); ?></div>
                    <div class="mm"><?php echo get_the_date('M'); ?></div>
                </div>
                <figure><?php the_post_thumbnail('thumbnail'); ?></figure>
            </div>
            <h4><?php the_title(); ?></h4>
            <?php the_excerpt(); ?>
        </a>
    </li>
