<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
$_user_id = absint( get_query_var('artist-info') );
$user_id = get_current_user_id();
if( $_user_id != $user_id ): echo __( 'Opps! You do not have permission access this page!', 'web-to-print-online-designer' ); else:
$user_info = nbd_get_artist_info( $user_id );
wp_enqueue_media();
do_action( 'nbd_artist_info_before_form', $user_id, $user_info );
?>
<form method="post" id="nbd-artist-form"  action="" class="nbd-artist-form">
    <?php wp_nonce_field( 'nbd_artist_settings_nonce' ); ?>
    <input type="hidden" value="<?php echo $user_id  ?>" name="user_id"/>
    <div class="nbd-banner">
        <?php $banner = $user_info['nbd_artist_banner']; ?>
        <div class="image-wrap<?php echo $banner ? '' : ' nbd-hide'; ?>">
            <?php $banner_url = $banner ? wp_get_attachment_url( $banner ) : ''; ?>
            <input type="hidden" class="nbd-file-field" value="<?php echo $banner; ?>" name="nbd_artist_banner">
            <img class="nbd-banner-img" src="<?php echo esc_url( $banner_url ); ?>">
            <a class="close nbd-remove-banner-image">&times;</a>            
        </div>    
        <div class="button-area<?php echo $banner ? ' nbd-hide' : ''; ?>">
            <a href="#" class="nbd-banner-drag button button-primary"><?php _e( 'Upload banner', 'web-to-print-online-designer' ); ?></a>
            <p class="description"><?php _e( '(Upload a banner for your store. )', 'web-to-print-online-designer' ); ?></p>
        </div>        
    </div> 
    <div class="nbd-section" style="margin-top: 30px;">
        <label for="nbd_artist_name"><?php _e( 'Artist Name', 'web-to-print-online-designer' ); ?></label>
        <input class="regular-text" type="text" id="nbd_artist_name" name="nbd_artist_name"
            value="<?php echo esc_attr( $user_info['nbd_artist_name'] ); ?>"/>
        <a href="<?php echo add_query_arg(array('id' => $user_id), getUrlPageNBD('designer')); ?>">
            → <?php _e( 'View own gallery', 'web-to-print-online-designer' ); ?>
        </a>
    </div>  
    <div class="nbd-section">
        <label for="nbd_artist_description" style="margin-bottom: 15px;"><?php _e( 'About the artist', 'web-to-print-online-designer' ); ?></label>
        <textarea rows="5" cols="30" id="nbd_artist_name" name="nbd_artist_description" style="width: 100%;" ><?php echo esc_attr( $user_info['nbd_artist_description'] ); ?></textarea>
    </div>     
    <div class="nbd-section">
        <label for="nbd_artist_address"><?php _e( 'Address', 'web-to-print-online-designer' ); ?></label>
        <input class="regular-text" type="text" id="nbd_artist_name" name="nbd_artist_address"
            value="<?php echo esc_attr( $user_info['nbd_artist_address'] ); ?>"/>
    </div>   
    <div class="nbd-section">
        <label for="nbd_artist_phone"><?php _e( 'Phone Number', 'web-to-print-online-designer' ); ?></label>
        <input class="regular-text" type="text" id="nbd_artist_phone" name="nbd_artist_phone"
            value="<?php echo esc_attr( $user_info['nbd_artist_phone'] ); ?>"/>
    </div>   
    <div class="nbd-section">
        <label for="nbd_artist_facebook"><?php _e( 'Facebook', 'web-to-print-online-designer' ); ?></label>
        <input class="regular-text" type="text" id="nbd_artist_facebook" name="nbd_artist_facebook"
            value="<?php echo esc_attr( $user_info['nbd_artist_facebook'] ); ?>"/>
    </div>   
    <div class="nbd-section">
        <label for="nbd_artist_google"><?php _e( 'Google Plus', 'web-to-print-online-designer' ); ?></label>
        <input class="regular-text" type="text" id="nbd_artist_google" name="nbd_artist_google"
            value="<?php echo esc_attr( $user_info['nbd_artist_google'] ); ?>"/>
    </div> 
    <div class="nbd-section">
        <label for="nbd_artist_twitter"><?php _e( 'Twitter', 'web-to-print-online-designer' ); ?></label>
        <input class="regular-text" type="text" id="nbd_artist_twitter" name="nbd_artist_twitter"
            value="<?php echo esc_attr( $user_info['nbd_artist_twitter'] ); ?>"/>
    </div>   
    <div class="nbd-section">
        <label for="nbd_artist_linkedin"><?php _e( 'LinkedIn', 'web-to-print-online-designer' ); ?></label>
        <input class="regular-text" type="text" id="nbd_artist_linkedin" name="nbd_artist_linkedin"
            value="<?php echo esc_attr( $user_info['nbd_artist_linkedin'] ); ?>"/>
    </div>   
    <div class="nbd-section">
        <label for="nbd_artist_youtube"><?php _e( 'Youtube', 'web-to-print-online-designer' ); ?></label>
        <input class="regular-text" type="text" id="nbd_artist_youtube" name="nbd_artist_youtube"
            value="<?php echo esc_attr( $user_info['nbd_artist_youtube'] ); ?>"/>
    </div> 
    <div class="nbd-section">
        <label for="nbd_artist_instagram"><?php _e( 'Instagram', 'web-to-print-online-designer' ); ?></label>
        <input class="regular-text" type="text" id="nbd_artist_instagram" name="nbd_artist_instagram"
            value="<?php echo esc_attr( $user_info['nbd_artist_instagram'] ); ?>"/>
    </div>   
    <div class="nbd-section">
        <label for="nbd_artist_flickr"><?php _e( 'Flickr', 'web-to-print-online-designer' ); ?></label>
        <input class="regular-text" type="text" id="nbd_artist_flickr" name="nbd_artist_flickr"
            value="<?php echo esc_attr( $user_info['nbd_artist_flickr'] ); ?>"/>
    </div> 
    <div class="nbd-section">
        <input type="submit" value="<?php _e('Update informations', 'web-to-print-online-designer'); ?>" />
        <img class="nbd-loading loaded" src="<?php echo NBDESIGNER_PLUGIN_URL.'assets/images/loading.gif' ?>" />
    </div>
</form>
<?php  do_action( 'nbd_artist_info_after_form', $user_id, $user_info ); ?>
<style type="text/css" >
    .nbd-banner {
        border: 4px dashed #d8d8d8;
        height: 255px;
        margin: 0;
        overflow: hidden;
        position: relative;
        text-align: center;
        width: 100%;
        display: inline-block;
    } 
    .nbd-hide { display: none; }
    .button-area { padding-top: 100px; }
    .nbd-banner {
        border: 4px dashed #d8d8d8;
        height: 255px;
        margin: 0;
        overflow: hidden;
        position: relative;
        text-align: center;
        max-width: 700px;
    }
    .nbd-banner img { max-width:100%; }
    .nbd-banner .nbd-remove-banner-image {
        position:absolute;
        width:100%;
        height:270px;
        background:#000;
        top:0;
        left:0;
        opacity:.7;
        font-size:100px;
        color:#f00;
        padding-top:70px;
        display:none
    }
    .nbd-banner:hover .nbd-remove-banner-image {
        display:block;
        cursor: pointer;
    }  
    .nbd-section {
        margin-bottom: 15px;
    }  
    .nbd-section label {
        min-width: 200px;
        display: inline-block;
        font-weight: bold; 
    }
    .nbd-section textarea {
        max-width: 100%;
    }
    .nbd-loading {
        display: inline-block;
    }
    .nbd-loading.loaded {
        display: none;
    }
    .nbd-artist-form.loading {
        pointer-events: none;
        opacity: 0.5;
    }
</style>
<script type="text/javascript">
    jQuery(function($){
        var NBD_Settings = {

            init: function() {
                $('a.nbd-banner-drag').on('click', this.imageUpload);
                $('a.nbd-remove-banner-image').on('click', this.removeBanner);
            },

            imageUpload: function(e) {
                e.preventDefault();

                var file_frame,
                    self = $(this);

                if ( file_frame ) {
                    file_frame.open();
                    return;
                }

                // Create the media frame.
                file_frame = wp.media.frames.file_frame = wp.media({
                    title: jQuery( this ).data( 'uploader_title' ),
                    button: {
                        text: jQuery( this ).data( 'uploader_button_text' )
                    },
                    multiple: false
                });

                file_frame.on( 'select', function() {
                    var attachment = file_frame.state().get('selection').first().toJSON();

                    var wrap = self.closest('.nbd-banner');
                    wrap.find('input.nbd-file-field').val(attachment.id);
                    wrap.find('img.nbd-banner-img').attr('src', attachment.url);
                    $('.image-wrap', wrap).removeClass('nbd-hide');

                    $('.button-area').addClass('nbd-hide');
                });

                file_frame.open();

            },

            removeBanner: function(e) {
                e.preventDefault();

                var self = $(this);
                var wrap = self.closest('.image-wrap');
                var instruction = wrap.siblings('.button-area');

                wrap.find('input.nbd-file-field').val('0');
                wrap.addClass('nbd-hide');
                instruction.removeClass('nbd-hide');
            },
        };

        NBD_Settings.init(); 
        jQuery('#nbd-artist-form').submit(function(ev) {
            ev.preventDefault(); 
            var formdata = $('#nbd-artist-form').find('input, textarea, select').serialize();
            formdata = formdata + '&action=nbd_update_artist_info';
            jQuery('img.nbd-loading').removeClass('loaded');
            jQuery('#nbd-artist-form').addClass('loading');
            $.post(nbds_frontend.url, formdata, function(res) {
                jQuery('img.nbd-loading').addClass('loaded');
                jQuery('#nbd-artist-form').removeClass('loading');
                if(res['result'] == 1) alert('Update successful!'); else alert('Oop! try again later!');
            }, 'json');            
        });                
    });
</script>
<?php endif;