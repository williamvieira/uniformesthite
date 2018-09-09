<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly  ?>
<?php
    $user_info = nbd_get_artist_info($user->ID);
?>
<div class="nbd-user-settings">
    <h2 id="nbd-user-setting"><?php printf( __( '%1$s settings', 'web-to-print-online-designer' ), 'NBDesigner' ); ?></h2> 
    <div class="nbd-section">
        <label><?php _e( 'Banner', 'web-to-print-online-designer' ); ?></label>
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
    </div>
    <div class="nbd-section">
        <label for="nbd_artist_name"><?php _e( 'Artist Name', 'web-to-print-online-designer' ); ?></label>
        <input class="regular-text" type="text" id="nbd_artist_name" name="nbd_artist_name"
            value="<?php echo esc_attr( $user_info['nbd_artist_name'] ); ?>"/>
    </div>  
    <div class="nbd-section">
        <label for="nbd_artist_description"><?php _e( 'About the artist', 'web-to-print-online-designer' ); ?></label>
        <textarea rows="5" cols="30" id="nbd_artist_name" name="nbd_artist_description" style="width: 500px;" ><?php echo esc_attr( $user_info['nbd_artist_description'] ); ?></textarea>
    </div>     
    <div class="nbd-section">
        <label for="nbd_create_permission"><?php _e( 'Create designs', 'web-to-print-online-designer' ); ?></label>
        <input class="regular-text" type="checkbox" id="nbd_create_permission" name="nbd_create_design"
            value="on" <?php echo ( $user_info['nbd_create_design'] === 'on' ) ? 'checked' : ''; ?> />  
        <p style="display: inline-block; "><?php _e('Allow user create designs', 'web-to-print-online-designer'); ?></p>
    </div>   
    <div class="nbd-section">
        <label for="nbd_sell_permission"><?php _e( 'Sell designs', 'web-to-print-online-designer' ); ?></label>
        <input class="regular-text" type="checkbox" id="nbd_sell_permission" name="nbd_sell_design"
            value="on" <?php echo ( $user_info['nbd_sell_design'] === 'on' ) ? 'checked' : ''; ?> />  
        <p style="display: inline-block; "><?php _e('Allow user sell his/her designs', 'web-to-print-online-designer'); ?></p>   
    </div> 
    <div class="nbd-section">
        <label for="nbd_artist_commission"><?php _e( 'Artist Commission %', 'web-to-print-online-designer' ); ?></label>
        <div style="display: inline-block; ">
            <input class="small-text" type="number" id="nbd_artist_commission" name="nbd_artist_commission"
                value="<?php echo esc_attr( $user_info['nbd_artist_commission'] ); ?>"/> <br />
            <p><?php _e(' % artist gets from each design', 'web-to-print-online-designer'); ?></p>     
        </div>
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
</div>
<style type="text/css" >
    .nbd-banner {
        border: 4px dashed #d8d8d8;
        height: 255px;
        margin: 0;
        overflow: hidden;
        position: relative;
        text-align: center;
        width: 700px;
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
    });
</script>
