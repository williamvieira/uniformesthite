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
	
    <div class="Lock clientes">
    	<h1 class="simple-title"><?php the_title(); ?></h1>
        <?php the_content(); ?>
        <?php 
		$images = get_field('galeria_de_imagens');
		if( $images ): ?>
			<ul>
				<?php foreach( $images as $image ): ?>
					<li><img src="<?php echo $image['sizes']['thumbnail']; ?>" alt="<?php echo $image['alt']; ?>" /></li>
				<?php endforeach; ?>
			</ul>
		<?php endif; ?>
    </div>