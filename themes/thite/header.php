<?php
/**
 * The Header template for our theme
 *
 * Displays all of the <head> section and everything up till <div id="main">
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */
?><!DOCTYPE html>
<!--[if IE 7]>
<html class="ie ie7" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 8]>
<html class="ie ie8" <?php language_attributes(); ?>>
<![endif]-->
<!--[if !(IE 7) & !(IE 8)]><!-->
<html <?php language_attributes(); ?>>
<!--<![endif]-->
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<meta name="viewport" content="width=device-width" />
<title><?php wp_title( '|', true, 'right' ); ?></title>
<link rel="profile" href="http://gmpg.org/xfn/11" />
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
<link rel="stylesheet" type="text/css" href="<?php bloginfo('template_url'); ?>/css/print.css" media="print" />
<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
<link href="<?php bloginfo('template_url'); ?>/css/jquery.fancybox.css" rel="stylesheet" type="text/css" media="all">
<script src="https://code.jquery.com/jquery-1.8.0.min.js"></script>
<script src="<?php bloginfo('template_url'); ?>/js/jquery.fancybox.js" type="text/javascript"></script>
<?php // Loads HTML5 JavaScript file to add support for HTML5 elements in older IE versions. ?>
<!--[if lt IE 9]>
<script src="<?php echo get_template_directory_uri(); ?>/js/html5.js" type="text/javascript"></script>
<![endif]-->
<?php wp_head(); ?>
<script type="text/javascript">
	$(document).ready(function(e) {
		$(".fancybox").fancybox();
    });
</script>
</head>

<body <?php body_class(); ?>>
<div id="page">
	<header>
		<div class="Left W340 fone-social-header">
        	<ul>
            	<li><i class="fa fa-phone" aria-hidden="true"></i> <?php the_field(telefone_1, 15); ?></li>
                <li><i class="fa fa-whatsapp" aria-hidden="true"></i> <?php the_field(whats, 15); ?></li>
                <li><a href="<?php the_field(facebook, 15); ?>"><i class="fa fa-facebook" aria-hidden="true"></i></a></li>
            </ul>
        </div>
        <div class="W340 DIB TxtCenter logo">
        	<a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home">
				<img src="<?php bloginfo('template_url'); ?>/images/thite-uniformes.png" />
            </a>
        </div>
        <div class="Right W340 menu-institucional">
        	<?php wp_nav_menu( array( 'theme_location' => 'institucional') ); ?>
        </div>
		<nav id="site-navigation" class="main-navigation">
			<button class="menu-toggle"><i class="fa fa-bars"></i> <?php _e( 'Menu Produtos', 'twentytwelve' ); ?></button>
			<?php wp_nav_menu( array( 'theme_location' => 'primary', 'menu_class' => 'nav-menu' ) ); ?>
		</nav>
	</header>
	<a href="https://api.whatsapp.com/send?phone=5511991334161&amp;text=sua%20mensagem" target="_blank" class="tel-header">
        <img src="<?php bloginfo('template_url'); ?>/images/botao-orcamento-rapido.gif" alt="" class="ligue">
        <span class="tel-header-hover">19 99704-9097</span>
    </a>

	<div id="main">