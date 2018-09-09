<?php

/**

 * Twenty Twelve functions and definitions

 *

 * Sets up the theme and provides some helper functions, which are used

 * in the theme as custom template tags. Others are attached to action and

 * filter hooks in WordPress to change core functionality.

 *

 * When using a child theme (see https://codex.wordpress.org/Theme_Development and

 * https://codex.wordpress.org/Child_Themes), you can override certain functions

 * (those wrapped in a function_exists() call) by defining them first in your child theme's

 * functions.php file. The child theme's functions.php file is included before the parent

 * theme's file, so the child theme functions would be used.

 *

 * Functions that are not pluggable (not wrapped in function_exists()) are instead attached

 * to a filter or action hook.

 *

 * For more information on hooks, actions, and filters, @link https://codex.wordpress.org/Plugin_API

 *

 * @package WordPress

 * @subpackage Twenty_Twelve

 * @since Twenty Twelve 1.0

 */



// Set up the content width value based on the theme's design and stylesheet.

if ( ! isset( $content_width ) )

	$content_width = 625;



/**

 * Twenty Twelve setup.

 *

 * Sets up theme defaults and registers the various WordPress features that

 * Twenty Twelve supports.

 *

 * @uses load_theme_textdomain() For translation/localization support.

 * @uses add_editor_style() To add a Visual Editor stylesheet.

 * @uses add_theme_support() To add support for post thumbnails, automatic feed links,

 * 	custom background, and post formats.

 * @uses register_nav_menu() To add support for navigation menus.

 * @uses set_post_thumbnail_size() To set a custom post thumbnail size.

 *

 * @since Twenty Twelve 1.0

 */

function twentytwelve_setup() {

	/*

	 * Makes Twenty Twelve available for translation.

	 *

	 * Translations can be added to the /languages/ directory.

	 * If you're building a theme based on Twenty Twelve, use a find and replace

	 * to change 'twentytwelve' to the name of your theme in all the template files.

	 */

	load_theme_textdomain( 'twentytwelve', get_template_directory() . '/languages' );



	// This theme styles the visual editor with editor-style.css to match the theme style.

	add_editor_style();



	// Adds RSS feed links to <head> for posts and comments.

	add_theme_support( 'automatic-feed-links' );



	// This theme supports a variety of post formats.

	add_theme_support( 'post-formats', array( 'aside', 'image', 'link', 'quote', 'status' ) );



	// This theme uses wp_nav_menu() in one location.

	register_nav_menu( 'primary', __( 'Primary Menu', 'twentytwelve' ) );



	/*

	 * This theme supports custom background color and image,

	 * and here we also set up the default background color.

	 */

	add_theme_support( 'custom-background', array(

		'default-color' => 'e6e6e6',

	) );



	// This theme uses a custom image size for featured images, displayed on "standard" posts.

	add_theme_support( 'post-thumbnails' );

	set_post_thumbnail_size( 624, 9999 ); // Unlimited height, soft crop

}

add_action( 'after_setup_theme', 'twentytwelve_setup' );



/**

 * Add support for a custom header image.

 */

require( get_template_directory() . '/inc/custom-header.php' );



/**

 * Return the Google font stylesheet URL if available.

 *

 * The use of Open Sans by default is localized. For languages that use

 * characters not supported by the font, the font can be disabled.

 *

 * @since Twenty Twelve 1.2

 *

 * @return string Font stylesheet or empty string if disabled.

 */

function twentytwelve_get_font_url() {

	$font_url = '';



	/* translators: If there are characters in your language that are not supported

	 * by Open Sans, translate this to 'off'. Do not translate into your own language.

	 */

	if ( 'off' !== _x( 'on', 'Open Sans font: on or off', 'twentytwelve' ) ) {

		$subsets = 'latin,latin-ext';



		/* translators: To add an additional Open Sans character subset specific to your language,

		 * translate this to 'greek', 'cyrillic' or 'vietnamese'. Do not translate into your own language.

		 */

		$subset = _x( 'no-subset', 'Open Sans font: add new subset (greek, cyrillic, vietnamese)', 'twentytwelve' );



		if ( 'cyrillic' == $subset )

			$subsets .= ',cyrillic,cyrillic-ext';

		elseif ( 'greek' == $subset )

			$subsets .= ',greek,greek-ext';

		elseif ( 'vietnamese' == $subset )

			$subsets .= ',vietnamese';



		$query_args = array(

			'family' => 'Open+Sans:400italic,700italic,400,700',

			'subset' => $subsets,

		);

		$font_url = add_query_arg( $query_args, 'https://fonts.googleapis.com/css' );

	}



	return $font_url;

}



/**

 * Enqueue scripts and styles for front-end.

 *

 * @since Twenty Twelve 1.0

 */

function twentytwelve_scripts_styles() {

	global $wp_styles;



	/*

	 * Adds JavaScript to pages with the comment form to support

	 * sites with threaded comments (when in use).

	 */

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) )

		wp_enqueue_script( 'comment-reply' );



	// Adds JavaScript for handling the navigation menu hide-and-show behavior.

	wp_enqueue_script( 'twentytwelve-navigation', get_template_directory_uri() . '/js/navigation.js', array( 'jquery' ), '20140711', true );



	$font_url = twentytwelve_get_font_url();

	if ( ! empty( $font_url ) )

		wp_enqueue_style( 'twentytwelve-fonts', esc_url_raw( $font_url ), array(), null );



	// Loads our main stylesheet.

	wp_enqueue_style( 'twentytwelve-style', get_stylesheet_uri() );



	// Loads the Internet Explorer specific stylesheet.

	wp_enqueue_style( 'twentytwelve-ie', get_template_directory_uri() . '/css/ie.css', array( 'twentytwelve-style' ), '20121010' );

	$wp_styles->add_data( 'twentytwelve-ie', 'conditional', 'lt IE 9' );

}

add_action( 'wp_enqueue_scripts', 'twentytwelve_scripts_styles' );



/**

 * Filter TinyMCE CSS path to include Google Fonts.

 *

 * Adds additional stylesheets to the TinyMCE editor if needed.

 *

 * @uses twentytwelve_get_font_url() To get the Google Font stylesheet URL.

 *

 * @since Twenty Twelve 1.2

 *

 * @param string $mce_css CSS path to load in TinyMCE.

 * @return string Filtered CSS path.

 */

function twentytwelve_mce_css( $mce_css ) {

	$font_url = twentytwelve_get_font_url();



	if ( empty( $font_url ) )

		return $mce_css;



	if ( ! empty( $mce_css ) )

		$mce_css .= ',';



	$mce_css .= esc_url_raw( str_replace( ',', '%2C', $font_url ) );



	return $mce_css;

}

add_filter( 'mce_css', 'twentytwelve_mce_css' );



/**

 * Filter the page title.

 *

 * Creates a nicely formatted and more specific title element text

 * for output in head of document, based on current view.

 *

 * @since Twenty Twelve 1.0

 *

 * @param string $title Default title text for current view.

 * @param string $sep Optional separator.

 * @return string Filtered title.

 */

function twentytwelve_wp_title( $title, $sep ) {

	global $paged, $page;



	if ( is_feed() )

		return $title;



	// Add the site name.

	$title .= get_bloginfo( 'name', 'display' );



	// Add the site description for the home/front page.

	$site_description = get_bloginfo( 'description', 'display' );

	if ( $site_description && ( is_home() || is_front_page() ) )

		$title = "$title $sep $site_description";



	// Add a page number if necessary.

	if ( ( $paged >= 2 || $page >= 2 ) && ! is_404() )

		$title = "$title $sep " . sprintf( __( 'Page %s', 'twentytwelve' ), max( $paged, $page ) );



	return $title;

}

add_filter( 'wp_title', 'twentytwelve_wp_title', 10, 2 );



/**

 * Filter the page menu arguments.

 *

 * Makes our wp_nav_menu() fallback -- wp_page_menu() -- show a home link.

 *

 * @since Twenty Twelve 1.0

 */

function twentytwelve_page_menu_args( $args ) {

	if ( ! isset( $args['show_home'] ) )

		$args['show_home'] = true;

	return $args;

}

add_filter( 'wp_page_menu_args', 'twentytwelve_page_menu_args' );



/**

 * Register sidebars.

 *

 * Registers our main widget area and the front page widget areas.

 *

 * @since Twenty Twelve 1.0

 */

function twentytwelve_widgets_init() {

	register_sidebar( array(

		'name' => __( 'Main Sidebar', 'twentytwelve' ),

		'id' => 'sidebar-1',

		'description' => __( 'Appears on posts and pages except the optional Front Page template, which has its own widgets', 'twentytwelve' ),

		'before_widget' => '<aside id="%1$s" class="widget %2$s">',

		'after_widget' => '</aside>',

		'before_title' => '<h3 class="widget-title">',

		'after_title' => '</h3>',

	) );



	register_sidebar( array(

		'name' => __( 'First Front Page Widget Area', 'twentytwelve' ),

		'id' => 'sidebar-2',

		'description' => __( 'Appears when using the optional Front Page template with a page set as Static Front Page', 'twentytwelve' ),

		'before_widget' => '<aside id="%1$s" class="widget %2$s">',

		'after_widget' => '</aside>',

		'before_title' => '<h3 class="widget-title">',

		'after_title' => '</h3>',

	) );



	register_sidebar( array(

		'name' => __( 'Second Front Page Widget Area', 'twentytwelve' ),

		'id' => 'sidebar-3',

		'description' => __( 'Appears when using the optional Front Page template with a page set as Static Front Page', 'twentytwelve' ),

		'before_widget' => '<aside id="%1$s" class="widget %2$s">',

		'after_widget' => '</aside>',

		'before_title' => '<h3 class="widget-title">',

		'after_title' => '</h3>',

	) );

}

add_action( 'widgets_init', 'twentytwelve_widgets_init' );



if ( ! function_exists( 'twentytwelve_content_nav' ) ) :

/**

 * Displays navigation to next/previous pages when applicable.

 *

 * @since Twenty Twelve 1.0

 */

function twentytwelve_content_nav( $html_id ) {

	global $wp_query;



	if ( $wp_query->max_num_pages > 1 ) : ?>

		<nav id="<?php echo esc_attr( $html_id ); ?>" class="navigation" role="navigation">

			<h3 class="assistive-text"><?php _e( 'Post navigation', 'twentytwelve' ); ?></h3>

			<div class="nav-previous"><?php next_posts_link( __( '<span class="meta-nav">&larr;</span> Older posts', 'twentytwelve' ) ); ?></div>

			<div class="nav-next"><?php previous_posts_link( __( 'Newer posts <span class="meta-nav">&rarr;</span>', 'twentytwelve' ) ); ?></div>

		</nav><!-- .navigation -->

	<?php endif;

}

endif;



if ( ! function_exists( 'twentytwelve_comment' ) ) :

/**

 * Template for comments and pingbacks.

 *

 * To override this walker in a child theme without modifying the comments template

 * simply create your own twentytwelve_comment(), and that function will be used instead.

 *

 * Used as a callback by wp_list_comments() for displaying the comments.

 *

 * @since Twenty Twelve 1.0

 */

function twentytwelve_comment( $comment, $args, $depth ) {

	$GLOBALS['comment'] = $comment;

	switch ( $comment->comment_type ) :

		case 'pingback' :

		case 'trackback' :

		// Display trackbacks differently than normal comments.

	?>

	<li <?php comment_class(); ?> id="comment-<?php comment_ID(); ?>">

		<p><?php _e( 'Pingback:', 'twentytwelve' ); ?> <?php comment_author_link(); ?> <?php edit_comment_link( __( '(Edit)', 'twentytwelve' ), '<span class="edit-link">', '</span>' ); ?></p>

	<?php

			break;

		default :

		// Proceed with normal comments.

		global $post;

	?>

	<li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>">

		<article id="comment-<?php comment_ID(); ?>" class="comment">

			<header class="comment-meta comment-author vcard">

				<?php

					echo get_avatar( $comment, 44 );

					printf( '<cite><b class="fn">%1$s</b> %2$s</cite>',

						get_comment_author_link(),

						// If current post author is also comment author, make it known visually.

						( $comment->user_id === $post->post_author ) ? '<span>' . __( 'Post author', 'twentytwelve' ) . '</span>' : ''

					);

					printf( '<a href="%1$s"><time datetime="%2$s">%3$s</time></a>',

						esc_url( get_comment_link( $comment->comment_ID ) ),

						get_comment_time( 'c' ),

						/* translators: 1: date, 2: time */

						sprintf( __( '%1$s at %2$s', 'twentytwelve' ), get_comment_date(), get_comment_time() )

					);

				?>

			</header><!-- .comment-meta -->



			<?php if ( '0' == $comment->comment_approved ) : ?>

				<p class="comment-awaiting-moderation"><?php _e( 'Your comment is awaiting moderation.', 'twentytwelve' ); ?></p>

			<?php endif; ?>



			<section class="comment-content comment">

				<?php comment_text(); ?>

				<?php edit_comment_link( __( 'Edit', 'twentytwelve' ), '<p class="edit-link">', '</p>' ); ?>

			</section><!-- .comment-content -->



			<div class="reply">

				<?php comment_reply_link( array_merge( $args, array( 'reply_text' => __( 'Reply', 'twentytwelve' ), 'after' => ' <span>&darr;</span>', 'depth' => $depth, 'max_depth' => $args['max_depth'] ) ) ); ?>

			</div><!-- .reply -->

		</article><!-- #comment-## -->

	<?php

		break;

	endswitch; // end comment_type check

}

endif;



if ( ! function_exists( 'twentytwelve_entry_meta' ) ) :

/**

 * Set up post entry meta.

 *

 * Prints HTML with meta information for current post: categories, tags, permalink, author, and date.

 *

 * Create your own twentytwelve_entry_meta() to override in a child theme.

 *

 * @since Twenty Twelve 1.0

 */

function twentytwelve_entry_meta() {

	// Translators: used between list items, there is a space after the comma.

	$categories_list = get_the_category_list( __( ', ', 'twentytwelve' ) );



	// Translators: used between list items, there is a space after the comma.

	$tag_list = get_the_tag_list( '', __( ', ', 'twentytwelve' ) );



	$date = sprintf( '<a href="%1$s" title="%2$s" rel="bookmark"><time class="entry-date" datetime="%3$s">%4$s</time></a>',

		esc_url( get_permalink() ),

		esc_attr( get_the_time() ),

		esc_attr( get_the_date( 'c' ) ),

		esc_html( get_the_date() )

	);



	$author = sprintf( '<span class="author vcard"><a class="url fn n" href="%1$s" title="%2$s" rel="author">%3$s</a></span>',

		esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ),

		esc_attr( sprintf( __( 'View all posts by %s', 'twentytwelve' ), get_the_author() ) ),

		get_the_author()

	);



	// Translators: 1 is category, 2 is tag, 3 is the date and 4 is the author's name.

	if ( $tag_list ) {

		$utility_text = __( 'This entry was posted in %1$s and tagged %2$s on %3$s<span class="by-author"> by %4$s</span>.', 'twentytwelve' );

	} elseif ( $categories_list ) {

		$utility_text = __( 'This entry was posted in %1$s on %3$s<span class="by-author"> by %4$s</span>.', 'twentytwelve' );

	} else {

		$utility_text = __( 'This entry was posted on %3$s<span class="by-author"> by %4$s</span>.', 'twentytwelve' );

	}



	printf(

		$utility_text,

		$categories_list,

		$tag_list,

		$date,

		$author

	);

}

endif;



/**

 * Extend the default WordPress body classes.

 *

 * Extends the default WordPress body class to denote:

 * 1. Using a full-width layout, when no active widgets in the sidebar

 *    or full-width template.

 * 2. Front Page template: thumbnail in use and number of sidebars for

 *    widget areas.

 * 3. White or empty background color to change the layout and spacing.

 * 4. Custom fonts enabled.

 * 5. Single or multiple authors.

 *

 * @since Twenty Twelve 1.0

 *

 * @param array $classes Existing class values.

 * @return array Filtered class values.

 */

function twentytwelve_body_class( $classes ) {

	$background_color = get_background_color();

	$background_image = get_background_image();



	if ( ! is_active_sidebar( 'sidebar-1' ) || is_page_template( 'page-templates/full-width.php' ) )

		$classes[] = 'full-width';



	if ( is_page_template( 'page-templates/front-page.php' ) ) {

		$classes[] = 'template-front-page';

		if ( has_post_thumbnail() )

			$classes[] = 'has-post-thumbnail';

		if ( is_active_sidebar( 'sidebar-2' ) && is_active_sidebar( 'sidebar-3' ) )

			$classes[] = 'two-sidebars';

	}



	if ( empty( $background_image ) ) {

		if ( empty( $background_color ) )

			$classes[] = 'custom-background-empty';

		elseif ( in_array( $background_color, array( 'fff', 'ffffff' ) ) )

			$classes[] = 'custom-background-white';

	}



	// Enable custom font class only if the font CSS is queued to load.

	if ( wp_style_is( 'twentytwelve-fonts', 'queue' ) )

		$classes[] = 'custom-font-enabled';



	if ( ! is_multi_author() )

		$classes[] = 'single-author';



	return $classes;

}

add_filter( 'body_class', 'twentytwelve_body_class' );



/**

 * Adjust content width in certain contexts.

 *

 * Adjusts content_width value for full-width and single image attachment

 * templates, and when there are no active widgets in the sidebar.

 *

 * @since Twenty Twelve 1.0

 */

function twentytwelve_content_width() {

	if ( is_page_template( 'page-templates/full-width.php' ) || is_attachment() || ! is_active_sidebar( 'sidebar-1' ) ) {

		global $content_width;

		$content_width = 960;

	}

}

add_action( 'template_redirect', 'twentytwelve_content_width' );



/**

 * Register postMessage support.

 *

 * Add postMessage support for site title and description for the Customizer.

 *

 * @since Twenty Twelve 1.0

 *

 * @param WP_Customize_Manager $wp_customize Customizer object.

 */

function twentytwelve_customize_register( $wp_customize ) {

	$wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';

	$wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';

	$wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';

}

add_action( 'customize_register', 'twentytwelve_customize_register' );



/**

 * Enqueue Javascript postMessage handlers for the Customizer.

 *

 * Binds JS handlers to make the Customizer preview reload changes asynchronously.

 *

 * @since Twenty Twelve 1.0

 */

function twentytwelve_customize_preview_js() {

	wp_enqueue_script( 'twentytwelve-customizer', get_template_directory_uri() . '/js/theme-customizer.js', array( 'customize-preview' ), '20141120', true );

}

add_action( 'customize_preview_init', 'twentytwelve_customize_preview_js' );



register_nav_menu( 'institucional', __( 'Menu Institucional', 'twentytwelve' ) );

register_nav_menu( 'produtos', __( 'Menu Produtos Footer', 'twentytwelve' ) );



// Removendo todo CSS Woocommerce

add_filter( 'woocommerce_enqueue_styles', '__return_false' );

add_theme_support( 'woocommerce' );

function wpdocs_custom_excerpt_length( $length ) {

    return 25;

}

add_filter( 'excerpt_length', 'wpdocs_custom_excerpt_length', 999 );

function wpdocs_excerpt_more( $more ) {

    return ' ...';

}

add_filter( 'excerpt_more', 'wpdocs_excerpt_more' );





// Adicionando <figure> na imagem do grid de produtos (categorias)

remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10);

add_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10);



if ( ! function_exists( 'woocommerce_template_loop_product_thumbnail' ) ) {

    function woocommerce_template_loop_product_thumbnail() {

        echo woocommerce_get_product_thumbnail();

    } 

}

if ( ! function_exists( 'woocommerce_get_product_thumbnail' ) ) {   

    function woocommerce_get_product_thumbnail( $size = 'shop_catalog', $placeholder_width = 0, $placeholder_height = 0  ) {

        global $post, $woocommerce;

        $output = '<figure>';



        if ( has_post_thumbnail() ) {               

            $output .= get_the_post_thumbnail( $post->ID, $size );              

        }                       

        $output .= '</figure>';

        return $output;

    }

}



//Removendo campos da página de produto

remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart' );

remove_action( 'woocommerce_after_single_product_summary', 'woocommerce_output_related_products', 20 );

remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_meta', 40 );

add_filter( 'woocommerce_product_tabs', 'wcs_woo_remove_reviews_tab', 98 );

    function wcs_woo_remove_reviews_tab($tabs) {

    unset($tabs['reviews']);

    return $tabs;

}

add_filter( 'woocommerce_product_tabs', 'bbloomer_remove_product_tabs', 98 );

 	function bbloomer_remove_product_tabs( $tabs ) {

    unset( $tabs['additional_information'] ); 

    return $tabs;

}

add_filter('woocommerce_is_purchasable', '__return_TRUE'); 

remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_excerpt', 20);



function wp_default_price($price){

	if(empty($price) || $price == null || $price = ""){

		$price = 1;	

	}

}

add_filter('woocommerce_get_price', 'wp_default_price');

add_filter('woocommerce_product_variation_get_price', 'wp_default_price', 99);



remove_action('woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10);





add_filter( 'woocommerce_variable_sale_price_html', 'businessbloomer_remove_prices', 10, 2 );

add_filter( 'woocommerce_variable_price_html', 'businessbloomer_remove_prices', 10, 2 );

add_filter( 'woocommerce_get_price_html', 'businessbloomer_remove_prices', 10, 2 );

 

function businessbloomer_remove_prices( $price, $product ) {

$price = '';

return $price;

}



add_filter( 'woocommerce_checkout_fields' , 'custom_override_checkout_fields' );

function custom_override_checkout_fields( $fields ) {

    unset($fields['billing']['billing_country']);

	unset($fields['billing']['billing_state']);

	return $fields;

}

add_filter( 'woocommerce_cart_needs_shipping_address', '__return_false');



remove_action('wp_head', 'wp_generator');




// Você pode tecnicamente adicionar essa entrada em qualquer lugar, mas como é um gancho central do WooCommerce, 
// woocommerce_before_add_to_cart_button tem cerca de 99% de probabilidade de funcionar com qualquer tema. 
// Nada muito especial acontecendo aqui. Estamos apenas adicionando uma entrada de texto. Preste atenção 
// no nome da entrada. Nós vamos usar muito isso.
function kia_custom_option(){

	global $product;
	if ( !isset($product) ) return;
	if ( !method_exists( $product, 'get_attributes' ) ) return; // Doesn't support attributes, won't have a dropdown

	$countName = 0;
	$attributes = $product->get_attributes();
	foreach( $attributes as $attribute ) {
	    if ( empty( $attribute['is_visible'] ) || ( $attribute['is_taxonomy'] && ! taxonomy_exists( $attribute['name'] ) ) ) {
	        continue;
	    }
	    
	    $title = wc_attribute_label( $attribute['name'] );
	    $name = $attribute['name'];
	    
	    if ( $attribute['is_taxonomy'] ) {
	        $values = wc_get_product_terms( $product->id, $attribute['name'], array( 'fields' => 'names' ) );
	    } else {
	        $values = array_map( 'trim', explode( WC_DELIMITER, $attribute['value'] ) );
	    }
	    
	    natsort($values);
	    echo $htmlTitle = '<div class="body-c"><div class="c-left-title"><p>Tamanhos:</p></div><div class="c-right-title"><p>Quantidade:</p></div></div>';
	 	$inputId = isset( $_POST['idProduto'] ) ? sanitize_text_field( $_POST['idProduto'] ) : '';
		$htmlBody .= '<input type="hidden" name="idProduto" value="'.$product->id.'"/>'; 
		 foreach ( $values as $value ){
	    	$input = isset( $_POST[$nameInput] ) ? sanitize_text_field( $_POST[$nameInput] ) : '';
	        $nameInput = "inputQtT$countName";
	        $htmlBody .= '<div class="body-c-itens"><div class="c-left"><p for="'.$nameInput.'" value="'.esc_attr( $value ).'" '.selected( $selected_value, $value, false ).'>'.apply_filters( 'woocommerce_variation_option_name', $value ).'</p></div><div class="c-right">'. __( '', 'kia-plugin-textdomain' ).'<input type="number" id="'.$nameInput.'" name="'.$nameInput.'" value="0"/></div></div>';
	        $countName++;
	     }
	 }
	        echo $htmlBody;
	       

}
add_action( 'woocommerce_before_add_to_cart_button', 'kia_custom_option', 9 );



// Se o seu campo é opcional, você pode excluir esta função completamente. 
// Ou você pode modificá-lo para validar, no entanto, você gostaria. Para simplificar, 
// eu causei um erro se o cliente tentar adicionar o item ao carrinho sem preencher nenhum texto personalizado.
// function kia_add_to_cart_validation($passed, $product_id, $qty){
 
//     if( isset( $_POST['_custom_option'] ) && sanitize_text_field( $_POST['_custom_option'] ) == '' ){
//         $product = wc_get_product( $product_id );
//         wc_add_notice( sprintf( __( '%s cannot be added to the cart until you enter some custom text.', 'kia-plugin-textdomain' ), $product->get_title() ), 'error' );
//         return false;
//     }
 
//     return $passed;
 
// }
// add_filter( 'woocommerce_add_to_cart_validation', 'kia_add_to_cart_validation', 10, 3 );


// No começo, há muito mistério acontecendo com o carrinho. Onde diabos esses dados vêm de qualquer maneira?
// Todos os produtos são armazenados em uma matriz nos dados _ $ SESSION. Na maior parte, o Woo salva o ID do produto,
//  a quantidade e um punhado de outras coisas, mas, convenientemente,
// possui um filtro que nos permitirá passar alguns de nossos próprios dados para o item do carrinho.
function kia_add_cart_item_data( $cart_item, $product_id ){
	global $woocommerce;
	global $product;

	$product = wc_get_product($product_id);
	$available_variations = $product->get_available_variations();
 
	$countItemName = 0;
    $countName = 0;

    foreach( $product->get_variation_attributes() as $taxonomy => $terms_slug ){
	    // To get the attribute label (in WooCommerce 3+)
	    $taxonomy_label = wc_attribute_label( $taxonomy, $product );

	    // Setting some data in an array
	    $variations_attributes_and_values[$taxonomy] = array('label' => $taxonomy_label);

	    foreach($terms_slug as $term){

	        // Getting the term object from the slug
	        $term_obj  = get_term_by('slug', $term, $taxonomy);

	        $term_id   = $term_obj->term_id; // The ID  <==  <==  <==  <==  <==  <==  HERE
	        $term_name = $term_obj->name; // The Name
	        $term_slug = $term_obj->slug; // The Slug
	        // $term_description = $term_obj->description; // The Description

	        if (is_numeric($term_name)) {
	        	$nameItemName = "Tamanho n $term_name";
	        } else {
	        	$nameItemName = "Tamanho letra $term_name";
	        }

	       
		    $nameInput = "inputQtT$countName";
		    if( isset( $_POST[$nameInput] ) ) {
		        $cart_item[$nameItemName] = sanitize_text_field( $_POST[$nameInput] );
		    }
		    if( isset($_POST['idProduto'] ) ) {
		        $cart_item['idProduto'] = sanitize_text_field( $_POST['idProduto'] );
		    }
		    $countItemName++;
	        $countName++;

	        // Setting the terms ID and values in the array
	        $variations_attributes_and_values[$taxonomy]['terms'][$term_id] = array(
	            'name'        => $term_name,
	            'slug'        => $term_slug
	        );
	    }
	}

 
    return $cart_item;
 
}
add_filter( 'woocommerce_add_cart_item_data', 'kia_add_cart_item_data', 10, 2 );

function kia_get_cart_item_from_session( $cart_item, $values ) {
	global $woocommerce;
	global $product;

	foreach ($values as $key => $value) {
		if ($key == 'product_id') {
			$id = $value;
		}
	}

	$productId = $id;
	$product = wc_get_product($productId);
	$available_variations = $product->get_available_variations();
 
	$countItemName = 0;
    $countName = 0;

    foreach( $product->get_variation_attributes() as $taxonomy => $terms_slug ){
	    // To get the attribute label (in WooCommerce 3+)
	    $taxonomy_label = wc_attribute_label( $taxonomy, $product );

	    // Setting some data in an array
	    $variations_attributes_and_values[$taxonomy] = array('label' => $taxonomy_label);

	    foreach($terms_slug as $term){

	        // Getting the term object from the slug
	        $term_obj  = get_term_by('slug', $term, $taxonomy);

	        $term_id   = $term_obj->term_id; // The ID  <==  <==  <==  <==  <==  <==  HERE
	        $term_name = $term_obj->name; // The Name
	        $term_slug = $term_obj->slug; // The Slug
	        // $term_description = $term_obj->description; // The Description

	        if (is_numeric($term_name)) {
	        	$nameItemName = "Tamanho n $term_name";
	        } else {
	        	$nameItemName = "Tamanho letra $term_name";
	        }

	       
		    $nameInput = "inputQtT$countName";
		    if ( isset( $values[$nameItemName] ) ){
		        $cart_item[$nameItemName] = $values[$nameItemName];
		    }
	        $countItemName++;
	        $countName++;

	        // Setting the terms ID and values in the array
	        $variations_attributes_and_values[$taxonomy]['terms'][$term_id] = array(
	            'name'        => $term_name,
	            'slug'        => $term_slug
	        );
	    }
	}

    return $cart_item;
 
}
add_filter( 'woocommerce_get_cart_item_from_session', 'kia_get_cart_item_from_session', 20, 2 );

function kia_add_order_item_meta( $item_id, $values ) {

	global $woocommerce;
	global $product;

	foreach ($values as $key => $value) {
		if ($key == 'product_id') {
			$id = $value;
		}
	}

	$productId = $id;
	$product = wc_get_product($productId);
	$available_variations = $product->get_available_variations();
 
	$countItemName = 0;
    $countName = 0;

    foreach( $product->get_variation_attributes() as $taxonomy => $terms_slug ){
	    // To get the attribute label (in WooCommerce 3+)
	    $taxonomy_label = wc_attribute_label( $taxonomy, $product );

	    // Setting some data in an array
	    $variations_attributes_and_values[$taxonomy] = array('label' => $taxonomy_label);

	    foreach($terms_slug as $term){

	        // Getting the term object from the slug
	        $term_obj  = get_term_by('slug', $term, $taxonomy);

	        $term_id   = $term_obj->term_id; // The ID  <==  <==  <==  <==  <==  <==  HERE
	        $term_name = $term_obj->name; // The Name
	        $term_slug = $term_obj->slug; // The Slug
	        // $term_description = $term_obj->description; // The Description

	        if (is_numeric($term_name)) {
	        	$nameItemName = "Tamanho n $term_name";
	        } else {
	        	$nameItemName = "Tamanho letra $term_name";
	        }

		   
		    $nameInput = "inputQtT$countName";
		    if ( ! empty( $values[$nameItemName] ) ) {
		        woocommerce_add_order_item_meta( $item_id, $nameItemName, $values[$nameItemName] );           
		    }
	        $countItemName++;
	        $countName++;

	        // Setting the terms ID and values in the array
	        $variations_attributes_and_values[$taxonomy]['terms'][$term_id] = array(
	            'name'        => $term_name,
	            'slug'        => $term_slug
	        );
	    }
	}

}
add_action( 'woocommerce_add_order_item_meta', 'kia_add_order_item_meta', 10, 2 );


function kia_get_item_data( $other_data, $cart_item ) {

	global $woocommerce;
	global $product;

	foreach ($cart_item as $key => $value) {
		if ($key == 'product_id') {
			$id = $value;
		}
	}	

	$productId = $id;
	$product = wc_get_product($productId);
	$available_variations = $product->get_available_variations();
 
	$countItemName = 0;
    $countName = 0;

    foreach( $product->get_variation_attributes() as $taxonomy => $terms_slug ){
	    // To get the attribute label (in WooCommerce 3+)
	    $taxonomy_label = wc_attribute_label( $taxonomy, $product );

	    // Setting some data in an array
	    $variations_attributes_and_values[$taxonomy] = array('label' => $taxonomy_label);

	    foreach($terms_slug as $term){

	        // Getting the term object from the slug
	        $term_obj  = get_term_by('slug', $term, $taxonomy);

	        $term_id   = $term_obj->term_id; // The ID  <==  <==  <==  <==  <==  <==  HERE
	        $term_name = $term_obj->name; // The Name
	        $term_slug = $term_obj->slug; // The Slug
	        // $term_description = $term_obj->description; // The Description
	  
	        if (is_numeric($term_name)) {
	        	$nameItemName = "Tamanho n $term_name";
	        } else {
	        	$nameItemName = "Tamanho letra $term_name";
	        }

		   
		    $nameInput = "inputQtT$countName";
		    if ( isset( $cart_item[$nameItemName] ) ){
 
		        $other_data[] = array(
		            'name' => __( "Tamanho $term_obj->name" , 'kia-plugin-textdomain' ),
		            'value' => sanitize_text_field( $cart_item[$nameItemName] )
		        );
		 
		    }
	        $countItemName++;
	        $countName++;

	        // Setting the terms ID and values in the array
	        $variations_attributes_and_values[$taxonomy]['terms'][$term_id] = array(
	            'name'        => $term_name,
	            'slug'        => $term_slug
	        );
	    }
	}

    return $other_data;
 
}
add_filter( 'woocommerce_get_item_data', 'kia_get_item_data', 10, 2 );

add_filter( 'wc_add_to_cart_message_html', 'bbloomer_custom_add_to_cart_message' );
 
function bbloomer_custom_add_to_cart_message() {
 
global $woocommerce;
$return_to  = get_permalink(woocommerce_get_page_id('shop'));
$message    = sprintf('Seu orçamento foi adicionado com sucesso! Continue com outros <a href="%s" class="button wc-forwards">%s</a>', $return_to, __('orçamentos.', 'woocommerce'));
return $message;
}

add_action('admin_head', 'my_custom_fonts');

function my_custom_fonts() {
  echo '<style>
   .display_meta tr:nth-child(1) {
            display: none!important;
   }
  </style>';
}


