<?php
/**
 * The template for displaying the footer
 *
 * Contains footer content and the closing of the #main and #page div elements.
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */
?>
	</div><!-- #main -->
	<footer>
		<div class="Lock">
        	<div class="info-footer Left">
            	<img src="<?php bloginfo('template_url'); ?>/images/thite-uniformes-footer.png">
                <ul>
                	<li><i class="fa fa-phone" aria-hidden="true"></i> <?php the_field(telefone_1, 15); ?> | <?php the_field(telefone_2, 15); ?></li>
                    <li><i class="fa fa-whatsapp" aria-hidden="true"></i> <?php the_field(whats, 15); ?></li>
                    <li><i class="fa fa-envelope" aria-hidden="true"></i> <?php the_field(email, 15); ?></li>
                    <li><i class="fa fa-home" aria-hidden="true"></i> <?php the_field(endereço, 15); ?></li>
                </ul>
            </div>
            <div class="menu-footer Right">
            	<div class="col2 Left">
                	<h3>Institucional</h3>
                    <?php wp_nav_menu( array( 'theme_location' => 'institucional') ); ?>
                </div>
                <div class="col2 Right">
                	<h3>Produtos</h3>
                    <?php wp_nav_menu( array( 'theme_location' => 'produtos') ); ?>
                </div>
            </div>
        </div>
        <div class="copy-assinatura">
        	<div class="Lock">
            	<div class="col2 Left">© <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. Todos os direitos reservados.</div>
                <div class="col2 Right TxtRight">Desenvolvido por <a href="http://www.multlinks.com.br" target="_blank">Multlinks</a></div>
            </div>
        </div>
	</footer>
</div><!-- #page -->

<script>
    jQuery(document).ready(function( $ ) {


           $("#pa_tamanhos").val($("#pa_tamanhos option:nth-child(2)").val());
    
            
       
        
    });
</script>

<?php wp_footer(); ?>
<link href="<?php bloginfo('template_url'); ?>/css/mobile.css" rel="stylesheet" type="text/css" media="all">
</body>
</html>