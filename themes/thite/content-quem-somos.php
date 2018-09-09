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
	
    <div class="Lock quem-somos">
    	<div class="title"><h1><?php the_title(); ?></h1></div>
        <div class="W500 Left">
        	<h2><?php the_field('subtitulo'); ?></h2>
			<?php the_content(); ?>
        </div>
        <div class="W490 Right">
        	<?php 
			$images = get_field('galeria_de_imagens');
			if( $images ): ?>
				<ul>
					<?php foreach( $images as $image ): ?>
						<li>
							<a href="<?php echo $image['url']; ?>" class="fancybox" rel="group">
								 <img src="<?php echo $image['sizes']['thumbnail']; ?>" alt="<?php echo $image['alt']; ?>" />
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
			<?php endif; ?>
        </div>
    </div>