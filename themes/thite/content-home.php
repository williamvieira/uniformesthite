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

	<div class="banner"><?php putRevSlider('home') ?></div>
    <section class="content-home Lock">
    	<div class="categorias-em-detaque Mt30">
            <ul>
            <?php
                $get_featured_cats = array(
                    'taxonomy'     => 'product_cat',
                    'orderby'      => 'name',
                    'hide_empty'   => '0',
                    'parent' 	=> 0
                );
                $all_categories = get_categories( $get_featured_cats );
    
                foreach ($all_categories as $cat):
                    
                    //recupera o valor do campo personalizado e armazena na variavel $featured
                    $featured = get_field('destaque', $cat);
					$title = get_field('title_style', $cat);
                    
                    //verifica se o valor é verdadeiro
                    if($featured):	
                        $link = get_category_link( $cat->term_id );
                        $thumbnail_id = get_woocommerce_term_meta( $cat->term_id, 'thumbnail_id', true );
                        $image = wp_get_attachment_url( $thumbnail_id );
                    ?>
                      <li>
                        <a href="<?php echo esc_url( $link ); ?>">
                            <figure><img src="<?php echo $image; ?>"></figure>
                            <div class="hover">
                            	<h2><?php echo $title; ?></h2>
                                <div class="botao-veja-mais">veja mais</div>
                            </div>
                        </a>
                      </li> 
                    <?php endif; ?>
                <?php endforeach;?>
            </ul>
        </div>
        
        <div class="produtos-em-detaque Mt40 DIB">
        	<h2><?php the_field('titulo_destaque'); ?></h2>
            <h3><?php the_field('subtitulo_destaque'); ?></h3>
			<?php
            $post_objects = get_field( 'produtos_em_destaque' );
            if( $post_objects ): ?>
                <ul>
                    <?php foreach( $post_objects as $post ): ?>
                        <?php setup_postdata( $post ); ?>
                        <li>
                            <a href="<?php the_permalink(); ?>">
                                <figure><?php the_post_thumbnail('shop_catalog'); ?></figure>
                                <h4><?php the_title(); ?></h4>
                            </a>
                            <?php $cats = wp_get_post_terms( $post->ID, 'product_cat' );?>
							<span>
                                <a href="<?php echo get_category_link( $cats[0]->term_id )?>">
                                    <?php echo $cats[0]->name ?>
                                </a>
                            </span>
                        </li>
                    <?php endforeach; ?>
                </ul>
                <?php wp_reset_postdata(); ?>
            <?php endif;?>
        </div>
	</section>
    
    <section class="banner-simulador">
    	<div class="Lock">
        	<div class="Left">
            	<h2>Personalize <span>seu uniforme</span></h2>
                <div class="botao-simulador-online"><a href="<?php bloginfo('url'); ?>/categoria-produto/simulador-online/">simulador online</a></div>
            </div>
        </div>
    </section>
    
    <section class="blog home Lock Mt40">
    	<h2><?php the_field('titulo_blog'); ?></h2>
		<h3><?php the_field('subtitulo_blog'); ?></h3>
    	<ul>
		<?php
            query_posts("posts_per_page=3");
            while(have_posts()) : the_post();
        ?>
            <li>
                <a href="<?php the_permalink(); ?>">
                    <div class="date-img">
                        <div class="date">
                            <div class="dd"><?php echo get_the_date('d'); ?></div>
                            <div class="mm"><?php echo get_the_date('M'); ?></div>
                        </div>
                        <figure><?php the_post_thumbnail('medium'); ?></figure>
                    </div>
                    <h4><?php the_title(); ?></h4>
                    <?php the_excerpt(); ?>
                </a>
            </li>
        <?php endwhile;
            wp_reset_query();
        ?>
        </ul>
    </section>
        
        