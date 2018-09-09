<?php
/**
 * The sidebar containing the main widget area
 *
 * If no active widgets are in the sidebar, hide it completely.
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */
?>

	<div class="sidebar-ultimos-posts">
    	<h2><strong>Últimos</strong> Posts</h2>
		<ul>
		<?php
            query_posts("posts_per_page=5");
            while(have_posts()) : the_post();
        ?>
            <li>
                <a href="<?php the_permalink(); ?>">
                    <figure><?php the_post_thumbnail('thumbnail'); ?></figure>
                    <div class="date-title">
                        <div class="dd"><?php echo get_the_date('d'); ?> <?php echo get_the_date('F'); ?></div>
                        <h3><?php the_title(); ?></h3>
                    </div>
                </a>
            </li>
        <?php endwhile;
            wp_reset_query();
        ?>
        </ul>
    </div><!-- #secondary -->