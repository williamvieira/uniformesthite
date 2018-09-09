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
	
    <div class="Lock contato">
    	<h1 class="simple-title"><?php the_title(); ?></h1>
        <div class="W520 Left">
        	<?php the_content(); ?>
        </div>
        <div class="W460 Right">
        	<ul>
                <li><i class="fa fa-phone" aria-hidden="true"></i> <?php the_field(telefone_1, 15); ?> | <?php the_field(telefone_2, 15); ?></li>
                <li><i class="fa fa-whatsapp" aria-hidden="true"></i> <?php the_field(whats, 15); ?></li>
                <li><i class="fa fa-envelope" aria-hidden="true"></i> <?php the_field(email, 15); ?></li>
                <li><i class="fa fa-home" aria-hidden="true"></i> <?php the_field(endereço, 15); ?></li>
            </ul>
        </div>
    </div>