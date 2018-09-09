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

	<div class="categorias-em-detaque sidebar Mt30 Lock">
    	<div class="DIB">
            <h2><?php the_field('titulo_sidebar', 15); ?></h2>
            <h3><?php the_field('subtitulo_sidebar', 15); ?></h3>
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
                                <h4><?php echo $title; ?></h4>
                                <div class="botao-veja-mais">veja mais</div>
                            </div>
                        </a>
                      </li> 
                    <?php endif; ?>
                <?php endforeach;?>
            </ul>
        </div>
    </div>