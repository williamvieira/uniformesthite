<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
get_header(); ?>
<?php 
    do_action( 'nbd_before_designer_page_content' ); 
    $user_id = intval( $_GET['id'] );
    $user_infos = nbd_get_artist_info($user_id);
    $banner_url = wp_get_attachment_url( $user_infos['nbd_artist_banner'] );
    $current_user_id = get_current_user_id();
    $link_designer = add_query_arg(array('id' => $current_user_id), getUrlPageNBD('designer'));
?>
<div class="nbd-user-infos">
    <div class="nbd-user-banner">
        <?php if($user_infos['nbd_artist_banner'] != ''): ?>
        <img style="border-radius: 0;" src="<?php echo $banner_url; ?>" alt="<?php echo $user_infos['nbd_artist_name']; ?>" />
        <?php endif; ?>
        <?php if( $current_user_id == $user_id ): ?>
        <a class="nbd-edit-profile" href="<?php echo wc_get_endpoint_url( 'artist-info', $user_id, wc_get_page_permalink( 'myaccount' ) ); ?>" title="<?php _e('Edit profile', 'web-to-print-online-designer'); ?>">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <title>Edit profile</title>
                <path fill="#6d6d6d" d="M20.719 7.031l-1.828 1.828-3.75-3.75 1.828-1.828c0.375-0.375 1.031-0.375 1.406 0l2.344 2.344c0.375 0.375 0.375 1.031 0 1.406zM3 17.25l11.063-11.063 3.75 3.75-11.063 11.063h-3.75v-3.75z"></path>
            </svg>          
        </a>
        <?php endif; ?>
    </div>   
    <div class="nbd-user-info">
        <img class="nbd-avatar" src="<?php echo get_avatar_url($user_id); ?>" />
        <div class="nbd-designer-info">
            <h1 class="nbd-artist-name"><?php echo $user_infos['nbd_artist_name']; ?></h1>
            <?php if( $user_infos['nbd_artist_address'] != '' ): ?>
            <p class="nbd-artist-add">
                <span>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                        <title>location</title>
                        <path fill="#0c8ea7" d="M7.969 16c0 0-4.969-7.031-4.969-10.031 0-5.907 4.969-5.969 4.969-5.969s5.031 0.063 5.031 5.938c0 3.093-5.031 10.063-5.031 10.063zM8 3c-1.104 0-2 0.896-2 2s0.896 2 2 2 2-0.896 2-2-0.896-2-2-2z"></path>
                    </svg>
                </span><?php echo $user_infos['nbd_artist_address']; ?>
            </p><br />
            <?php endif; ?>
            <?php if( $user_infos['nbd_artist_phone'] != '' ): ?>
            <p class="nbd-artist-phone">
                <span>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                        <title>mobile</title>
                        <path fill="#0c8ea7" d="M11 0h-6c-1.104 0-2 0.895-2 2v12c0 1.104 0.896 2 2 2h6c1.104 0 2-0.896 2-2v-12c0-1.105-0.896-2-2-2zM8.25 1.5h1.5c0.137 0 0.25 0.112 0.25 0.25s-0.113 0.25-0.25 0.25h-1.5c-0.138 0-0.25-0.112-0.25-0.25s0.112-0.25 0.25-0.25zM6.5 1c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5-0.5-0.224-0.5-0.5 0.224-0.5 0.5-0.5zM9 14.5c0 0.277-0.223 0.5-0.5 0.5h-1c-0.276 0-0.5-0.223-0.5-0.5v-1c0-0.277 0.224-0.5 0.5-0.5h1c0.277 0 0.5 0.223 0.5 0.5v1zM12 11.5c0 0.277-0.223 0.5-0.5 0.5h-7c-0.276 0-0.5-0.223-0.5-0.5v-8c0-0.276 0.224-0.5 0.5-0.5h7c0.277 0 0.5 0.224 0.5 0.5v8z"></path>
                    </svg>                     
                </span><?php echo $user_infos['nbd_artist_phone']; ?>
            </p>
            <?php endif; ?>
            <p class="nbd-social-list">
                <?php  if( $user_infos['nbd_artist_facebook'] != '' ): ?>
                <a class="nbd-social" href="<?php echo $user_infos['nbd_artist_facebook']; ?>" title="<?php _e('Facebook', 'web-to-print-online-designer'); ?>">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <title>facebook</title>
                        <path fill="#3b5998" d="M13 10h3v3h-3v7h-3v-7h-3v-3h3v-1.255c0-1.189 0.374-2.691 1.118-3.512 0.744-0.823 1.673-1.233 2.786-1.233h2.096v3h-2.1c-0.498 0-0.9 0.402-0.9 0.899v2.101z"></path>
                    </svg>
                </a>    
                <?php  endif; ?>
                <?php  if( $user_infos['nbd_artist_google'] != '' ): ?>
                <a class="nbd-social" href="<?php echo $user_infos['nbd_artist_google']; ?>" title="<?php _e('Google', 'web-to-print-online-designer'); ?>">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <title>google</title>
                        <path fill="#dc4e41" d="M7.635 10.909v2.618h4.335c-0.174 1.125-1.309 3.295-4.331 3.295-2.606 0-4.732-2.16-4.732-4.822s2.123-4.822 4.728-4.822c1.485 0 2.478 0.633 3.045 1.179l2.073-1.995c-1.331-1.245-3.056-1.995-5.115-1.995-4.226-0.002-7.638 3.418-7.638 7.634s3.414 7.635 7.635 7.635c4.41 0 7.332-3.097 7.332-7.461 0-0.501-0.054-0.885-0.12-1.264h-7.212zM24 10.909h-2.183v-2.182h-2.183v2.182h-2.181v2.181h2.182v2.182h2.19v-2.182h2.174z"></path>
                    </svg>
                </a>    
                <?php  endif; ?>       
                <?php  if( $user_infos['nbd_artist_twitter'] != '' ): ?>
                <a class="nbd-social" href="<?php echo $user_infos['nbd_artist_twitter']; ?>" title="<?php _e('Twitter', 'web-to-print-online-designer'); ?>">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <title>twitter</title>
                        <path fill="#1da1f2" d="M18.89 7.012c0.808-0.496 1.343-1.173 1.605-2.034-0.786 0.417-1.569 0.703-2.351 0.861-0.703-0.756-1.593-1.14-2.66-1.14-1.043 0-1.924 0.366-2.643 1.078-0.715 0.717-1.076 1.588-1.076 2.605 0 0.309 0.039 0.585 0.117 0.819-3.076-0.105-5.622-1.381-7.628-3.837-0.34 0.601-0.51 1.213-0.51 1.846 0 1.301 0.549 2.332 1.645 3.089-0.625-0.053-1.176-0.211-1.645-0.47 0 0.929 0.273 1.705 0.82 2.388 0.549 0.676 1.254 1.107 2.115 1.291-0.312 0.080-0.641 0.118-0.979 0.118-0.312 0-0.533-0.026-0.664-0.083 0.23 0.757 0.664 1.371 1.291 1.841 0.625 0.472 1.344 0.721 2.152 0.743-1.332 1.045-2.855 1.562-4.578 1.562-0.422 0-0.721-0.006-0.902-0.038 1.697 1.102 3.586 1.649 5.676 1.649 2.139 0 4.029-0.542 5.674-1.626 1.645-1.078 2.859-2.408 3.639-3.974 0.784-1.564 1.172-3.192 1.172-4.892v-0.468c0.758-0.57 1.371-1.212 1.84-1.921-0.68 0.293-1.383 0.492-2.11 0.593z"></path>
                    </svg>                    
                </a>    
                <?php  endif; ?>
                <?php  if( $user_infos['nbd_artist_linkedin'] != '' ): ?>
                <a class="nbd-social" href="<?php echo $user_infos['nbd_artist_linkedin']; ?>" title="<?php _e('Google', 'web-to-print-online-designer'); ?>">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <title>linkedin</title>
                        <path fill="#0077b5" d="M8 19h-3v-10h3v10zM19 19h-3v-5.342c0-1.392-0.496-2.085-1.479-2.085-0.779 0-1.273 0.388-1.521 1.165 0 1.262 0 6.262 0 6.262h-3c0 0 0.040-9 0-10h2.368l0.183 2h0.062c0.615-1 1.598-1.678 2.946-1.678 1.025 0 1.854 0.285 2.487 1.001 0.637 0.717 0.954 1.679 0.954 3.030v5.647z"></path>
                        <path fill="#0077b5" d="M8.050 6.5c0 0.828-0.694 1.5-1.55 1.5s-1.55-0.672-1.55-1.5c0-0.828 0.694-1.5 1.55-1.5s1.55 0.672 1.55 1.5z"></path>
                    </svg>                    
                </a>    
                <?php  endif; ?>  
                <?php  if( $user_infos['nbd_artist_youtube'] != '' ): ?>
                <a class="nbd-social" href="<?php echo $user_infos['nbd_artist_youtube']; ?>" title="<?php _e('Youtube', 'web-to-print-online-designer'); ?>">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 21 24">
                        <title>youtube</title>
                        <path fill="#cd201f" d="M12.308 17.451v-2.103c0-0.442-0.134-0.67-0.388-0.67-0.147 0-0.295 0.067-0.442 0.214v3c0.147 0.147 0.295 0.214 0.442 0.214 0.254 0 0.388-0.214 0.388-0.656zM14.772 15.817h0.884v-0.455c0-0.455-0.147-0.683-0.442-0.683s-0.442 0.228-0.442 0.683v0.455zM7.125 12.254v0.938h-1.071v5.665h-0.991v-5.665h-1.045v-0.938h3.107zM9.817 13.942v4.915h-0.897v-0.536c-0.348 0.402-0.683 0.603-1.018 0.603-0.281 0-0.482-0.121-0.563-0.375-0.054-0.147-0.080-0.375-0.080-0.723v-3.884h0.884v3.616c0 0.201 0 0.321 0.013 0.348 0.013 0.134 0.080 0.201 0.201 0.201 0.188 0 0.362-0.134 0.563-0.415v-3.75h0.897zM13.192 15.429v1.955c0 0.442-0.027 0.777-0.094 0.978-0.107 0.375-0.348 0.563-0.71 0.563-0.308 0-0.616-0.188-0.911-0.549v0.482h-0.897v-6.603h0.897v2.156c0.281-0.348 0.589-0.536 0.911-0.536 0.362 0 0.603 0.188 0.71 0.563 0.067 0.201 0.094 0.522 0.094 0.991zM16.554 17.156v0.121c0 0.295-0.013 0.482-0.027 0.576-0.027 0.201-0.094 0.375-0.201 0.536-0.241 0.362-0.616 0.536-1.071 0.536-0.469 0-0.83-0.174-1.085-0.509-0.188-0.241-0.281-0.629-0.281-1.152v-1.728c0-0.522 0.080-0.897 0.268-1.152 0.254-0.335 0.616-0.509 1.071-0.509 0.442 0 0.804 0.174 1.045 0.509 0.188 0.254 0.281 0.629 0.281 1.152v1.018h-1.781v0.871c0 0.455 0.147 0.683 0.455 0.683 0.214 0 0.348-0.121 0.402-0.348 0-0.054 0.013-0.254 0.013-0.603h0.911zM10.513 6.121v2.089c0 0.455-0.147 0.683-0.429 0.683-0.295 0-0.429-0.228-0.429-0.683v-2.089c0-0.455 0.134-0.696 0.429-0.696 0.281 0 0.429 0.241 0.429 0.696zM17.652 15.67v0c0-1.152 0-2.371-0.254-3.482-0.188-0.79-0.83-1.366-1.594-1.446-1.821-0.201-3.67-0.201-5.518-0.201-1.835 0-3.683 0-5.504 0.201-0.777 0.080-1.42 0.656-1.594 1.446-0.254 1.112-0.268 2.33-0.268 3.482v0c0 1.138 0 2.357 0.268 3.482 0.174 0.777 0.817 1.353 1.58 1.446 1.835 0.201 3.683 0.201 5.518 0.201s3.683 0 5.518-0.201c0.763-0.094 1.406-0.67 1.58-1.446 0.268-1.125 0.268-2.344 0.268-3.482zM7.54 6.951l1.205-3.964h-1.004l-0.683 2.612-0.71-2.612h-1.045c0.201 0.616 0.429 1.232 0.629 1.848 0.321 0.938 0.522 1.634 0.616 2.116v2.692h0.991v-2.692zM11.411 8.036v-1.741c0-0.522-0.094-0.911-0.281-1.165-0.254-0.335-0.603-0.509-1.045-0.509-0.455 0-0.804 0.174-1.045 0.509-0.188 0.254-0.281 0.643-0.281 1.165v1.741c0 0.522 0.094 0.911 0.281 1.165 0.241 0.335 0.589 0.509 1.045 0.509 0.442 0 0.79-0.174 1.045-0.509 0.188-0.241 0.281-0.643 0.281-1.165zM13.835 9.643h0.897v-4.955h-0.897v3.79c-0.201 0.281-0.388 0.415-0.563 0.415-0.121 0-0.201-0.067-0.214-0.214-0.013-0.027-0.013-0.134-0.013-0.348v-3.643h-0.897v3.924c0 0.348 0.027 0.576 0.080 0.737 0.094 0.241 0.295 0.362 0.576 0.362 0.335 0 0.67-0.201 1.031-0.603v0.536zM20.571 5.571v12.857c0 2.129-1.728 3.857-3.857 3.857h-12.857c-2.129 0-3.857-1.728-3.857-3.857v-12.857c0-2.129 1.728-3.857 3.857-3.857h12.857c2.129 0 3.857 1.728 3.857 3.857z"></path>
                    </svg>                    
                </a>    
                <?php  endif; ?>
                <?php  if( $user_infos['nbd_artist_instagram'] != '' ): ?>
                <a class="nbd-social" href="<?php echo $user_infos['nbd_artist_instagram']; ?>" title="<?php _e('Instagram', 'web-to-print-online-designer'); ?>">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <title>instagram</title>
                        <path fill="#e4405f" d="M17 1h-10c-3.3 0-6 2.7-6 6v10c0 3.3 2.7 6 6 6h10c3.3 0 6-2.7 6-6v-10c0-3.3-2.7-6-6-6zM21 17c0 2.2-1.8 4-4 4h-10c-2.2 0-4-1.8-4-4v-10c0-2.2 1.8-4 4-4h10c2.2 0 4 1.8 4 4v10z"></path>
                        <path fill="#e4405f" d="M12.8 7c-0.5-0.1-1-0.1-1.5 0-2.7 0.4-4.6 3-4.2 5.7 0.2 1.3 0.9 2.5 2 3.3 0.9 0.6 1.9 1 3 1 0.2 0 0.5 0 0.7-0.1 1.3-0.2 2.5-0.9 3.3-2s1.1-2.4 0.9-3.7c-0.3-2.2-2-3.9-4.2-4.2zM14.5 13.7c-0.5 0.6-1.2 1.1-2 1.2-1.6 0.2-3.2-0.9-3.4-2.5-0.3-1.6 0.9-3.2 2.5-3.4 0.1 0 0.3 0 0.4 0s0.3 0 0.4 0c1.3 0.2 2.3 1.2 2.5 2.5 0.2 0.8 0 1.6-0.4 2.2z"></path>
                        <path fill="#e4405f" d="M16.8 5.8c-0.2 0.2-0.3 0.4-0.3 0.7s0.1 0.5 0.3 0.7c0.2 0.2 0.5 0.3 0.7 0.3 0.3 0 0.5-0.1 0.7-0.3s0.3-0.5 0.3-0.7c0-0.3-0.1-0.5-0.3-0.7-0.4-0.4-1-0.4-1.4 0z"></path>
                    </svg>                
                </a>    
                <?php  endif; ?>         
                <?php  if( $user_infos['nbd_artist_flickr'] != '' ): ?>
                <a class="nbd-social" href="<?php echo $user_infos['nbd_artist_flickr']; ?>" title="<?php _e('Flickr', 'web-to-print-online-designer'); ?>">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <title>flickr</title>
                        <path fill="#0063dc" d="M7.5 16c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zM7.5 10c-1.103 0-2 0.897-2 2s0.897 2 2 2 2-0.897 2-2-0.897-2-2-2z"></path>
                        <path fill="#0063dc" d="M16.5 8c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4z"></path>
                    </svg>            
                </a>    
                <?php  endif; ?>                   
            </p>
        </div>
    </div>
    <div class="nbd-description">
        <p class="nbd-about-title"><?php _e('About', 'web-to-print-online-designer'); ?> <?php echo $user_infos['nbd_artist_name']; ?></p>
        <p><?php echo $user_infos['nbd_artist_description']; ?></p>
    </div>
</div>
<?php if( isset($_GET['template_id']) && $_GET['template_id'] != '' ): ?>
<?php    
    $template_id = $_GET['template_id'];
    $design = My_Design_Endpoint::get_template($user_id, $template_id);
    $product = wc_get_product( $design->variation_id ? $design->variation_id : $design->product_id );
    $path = NBDESIGNER_CUSTOMER_DIR .'/'.$design->folder. '/preview';
    $thumbnail = $design->thumbnail ? wp_get_attachment_url( $design->thumbnail ) : '';
    $list = Nbdesigner_IO::get_list_images($path, 1);
    $resources = (array)json_decode( file_get_contents( NBDESIGNER_CUSTOMER_DIR .'/'.$design->folder. '/design.json' ) );
    $fonts = (array)json_decode( file_get_contents( NBDESIGNER_DATA_DIR . '/fonts.json' ) );
    if( $thumbnail == '' ){  
        $thumbnail = Nbdesigner_IO::wp_convert_path_to_url(reset($list));
    }
    $link_create_template = add_query_arg(array(
        'product_id' => $design->product_id,
        'task'  =>  'create',
        'rd'    => urlencode($link_designer)
    ), getUrlPageNBD('create'));   
    $link_edit_template = add_query_arg(array(
        'product_id' => $design->product_id,
        'nbd_item_key'  =>  $design->folder,
        'rd'    => urlencode($link_designer.'&template_id='.$template_id),
        'design_type'  =>  'template',
        'task'  =>  'edit'
    ), getUrlPageNBD('create')); 
    $product_name = $product->get_title();
    wp_enqueue_media();
?>
<div class="nbd-edit-tem-wraper">
    <div class="nbd-edit-tem-wrap">
        <div>
            <?php wp_nonce_field( 'nbd_edit_template_nonce' ); ?>
            <input value="<?php echo $design->id; ?>" name="id" id="name" type="hidden"/>
            <input value="<?php echo $user_id; ?>" name="user_id" id="user_id" type="hidden"/>
            <p class="nbd-template-title">
                <a class="nbd-back-to-gallery" href="<?php echo $link_designer; ?>" title="<?php _e('Back to list', 'web-to-print-online-designer'); ?>">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <title>back</title>
                        <path fill="#6d6d6d" d="M21 11.016v1.969h-14.156l3.563 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.563 3.609h14.156z"></path>
                    </svg>
                </a>&nbsp;&nbsp;&nbsp;<b style="vertical-align: middle;"><?php _e('Edit template for', 'web-to-print-online-designer'); ?> </b>
                <a class="nbd-product-template-title" href="<?php echo get_permalink( $product->get_id() ); ?>"><?php echo $product_name; ?></a>
                <span class="statistic">
                <span class="nbd-vote-count" title="<?php _e('Vote', 'web-to-print-online-designer'); ?>" >
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <title>favorite</title>
                        <path fill="#6d6d6d" d="M12 21.328l-1.453-1.313c-5.156-4.688-8.531-7.734-8.531-11.531 0-3.094 2.391-5.484 5.484-5.484 1.734 0 3.422 0.844 4.5 2.109 1.078-1.266 2.766-2.109 4.5-2.109 3.094 0 5.484 2.391 5.484 5.484 0 3.797-3.375 6.891-8.531 11.578z"></path>
                    </svg>                    
                </span>&nbsp;&nbsp;<?php echo $design->vote ? $design->vote : '0';  ?>&nbsp;&nbsp;&nbsp;
                <span class="nbd-vote-count" title="<?php _e('View', 'web-to-print-online-designer'); ?>" >
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <title>view</title>
                        <path fill="#6d6d6d" d="M3.516 18.469l-1.5-1.5 7.5-7.5 3.984 4.031 7.078-7.969 1.406 1.406-8.484 9.563-3.984-4.031z"></path>
                    </svg>
                </span>&nbsp;&nbsp;<?php echo $design->hit ? $design->hit : '0';  ?></span>
            </p>
        </div>
        <div class="nbd-template-form">
            <p class="nbd-form-title">
                <label for="name"><?php _e('Name', 'web-to-print-online-designer'); ?></label>
                <input value="<?php echo $design->name; ?>" name="name" id="name" placeholder="<?php echo $product_name; ?>" <?php  if( $current_user_id !=  $user_id ) echo 'disabled'; ?> />
            </p>
            <?php  if( $current_user_id ==  $user_id ): ?>
            <p class="nbd-form-title"><?php _e('Thumbnail', 'web-to-print-online-designer'); ?></p>
            <div class="nbd-thumbnail">
                <div class="image-wrap<?php echo $design->thumbnail ? '' : ' nbd-hide'; ?>">
                    <input type="hidden" class="nbd-file-field" value="<?php echo $design->thumbnail; ?>" name="thumbnail">
                    <img class="nbd-thumbnail-img" src="<?php echo $thumbnail; ?>" alt="<?php echo $design->name; ?>" />
                    <a class="close nbd-remove-banner-image">&times;</a>
                </div>
                <div class="button-area<?php echo $design->thumbnail ? ' nbd-hide' : ''; ?>">
                    <a href="#" class="nbd-thumbnail-drag"><?php _e( 'Upload thumbnail', 'web-to-print-online-designer' ); ?></a>
                    <p class="description"><?php _e( 'Upload a thumbnail image to show in template page. If omit thumbnail image, use a preview design by default.', 'web-to-print-online-designer' ); ?></p>
                </div>  
            </div>    
            <?php endif; ?>
            <p class="nbd-form-title" style="margin-top: 15px;"><?php _e('Preview', 'web-to-print-online-designer'); ?></p>
            <div>
                <?php 
                    foreach ( $list as $image ): 
                    $image_url =  Nbdesigner_IO::wp_convert_path_to_url($image);   
                ?>
                <div class="nbd-preview-wrap">
                    <img class="nbd-preview" src="<?php echo $image_url; ?>" alt="<?php echo $design->name; ?>" />
                </div>
                <?php endforeach; ?>
            </div>
            <p class="nbd-form-title" style="margin-top: 15px;"><?php _e('Resource', 'web-to-print-online-designer'); ?></p>
            <div>
                <div>
                <?php foreach( $resources as $resource ): ?>
                    <?php 
                        foreach( $resource->objects as $layer ): 
                        if( $layer->type == 'image' || $layer->type == 'custom-image' ){   
                            $src = $layer->type == 'image' ? $layer->src : $layer->origin_src;
                    ?>
                    <div class="image-resource">
                        <div><a href="<?php echo $src; ?>" download><img src="<?php echo $src; ?>" /></a></div>   
                        <div class="image-resource-hover-wrap">
                            <div class="image-resource-hover">
                                <a class="image-resource-action" href="<?php echo $src; ?>" download title="<?php _e('Download', 'web-to-print-online-designer'); ?>">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <title>downward</title>
                                        <path fill="#6d6d6d" d="M20.016 12l-8.016 8.016-8.016-8.016 1.453-1.406 5.578 5.578v-12.188h1.969v12.188l5.625-5.578z"></path>
                                    </svg>                             
                                </a>
                                <a class="image-resource-action" href="javascript:void(0)" data-href="<?php echo $src; ?>" onclick="NBDEditTemplate.copyUrl( this )" title="<?php _e('Copy Url', 'web-to-print-online-designer'); ?>">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <title>link</title>
                                        <path fill="#6d6d6d" d="M17.016 6.984c2.766 0 4.969 2.25 4.969 5.016s-2.203 5.016-4.969 5.016h-4.031v-1.922h4.031c1.688 0 3.094-1.406 3.094-3.094s-1.406-3.094-3.094-3.094h-4.031v-1.922h4.031zM8.016 12.984v-1.969h7.969v1.969h-7.969zM3.891 12c0 1.688 1.406 3.094 3.094 3.094h4.031v1.922h-4.031c-2.766 0-4.969-2.25-4.969-5.016s2.203-5.016 4.969-5.016h4.031v1.922h-4.031c-1.688 0-3.094 1.406-3.094 3.094z"></path>
                                    </svg>                             
                                </a>
                            </div>    
                        </div>
                    </div>
                    <?php } endforeach; ?>
                <?php endforeach; ?>
                </div>
                <div class="nbd-tabbe-wrap">
                    <table class="nbd-resource-text">
                        <thead>
                            <tr>
                                <th>Content</th>
                                <th>Color</th>
                                <th>Font</th>
                            </tr>
                        </thead>
                        <tbody>
                        <?php foreach( $resources as $resource ): ?>
                            <?php 
                                foreach( $resource->objects as $layer ): 
                                if( $layer->type == 'text' || $layer->type == 'i-text' || $layer->type == 'curvedText' ){ 
                                    $alias = $fontname = $layer->fontFamily;
                                    $fonturl = 'https://fonts.google.com/specimen/'.$fontname;
                                    $is_google_font = true;
                                    foreach ( $fonts as $font ){
                                        if( $font->alias == $fontname ) {
                                            $fontname = $font->name;
                                            $fonturl = ( strpos($font->url, 'http') !== false ) ? $font->url : NBDESIGNER_FONT_URL . $font->url;
                                            $is_google_font = false;
                                            break;
                                        }
                                    }
                            ?>
                            <tr>
                                <style type='text/css'>
                                    <?php if( !$is_google_font ): ?>
                                    @font-face {font-family: <?php echo $alias; ?>;src: local('☺'), url('<?php echo $fonturl; ?>')}
                                    <?php else: ?>
                                    @import url(https://fonts.googleapis.com/css?family=<?php echo str_replace(' ', '+', $alias) ?>);
                                    <?php endif; ?>
                                </style>                                   
                                <td style="font-family: <?php echo $alias; ?>;"><?php echo $layer->text; ?></td>
                                <td>
                                    <span class="nbd-color-wrap"><span class="nbd-color" style="background: <?php echo $layer->fill; ?>"></span><span class="nbd-color-value"><?php echo $layer->fill; ?></span></span>
                                </td>
                                <td><a href="<?php echo $fonturl; ?>" <?php if( $is_google_font ) echo 'target="_blank"'; else echo 'download'; ?> title="<?php _e('Download', 'web-to-print-online-designer'); ?>"><?php echo $fontname; ?></a></td>
                            </tr>
                            <?php } endforeach; ?>
                        <?php endforeach; ?> 
                        </tbody>    
                    </table>
                </div>
            </div>
        </div>
        <?php  if( $current_user_id ==  $user_id ): ?>
        <div class="nbd-template-action-wrap">
            <a class="nbd-template-action-btn update" href="javascript:void(0)" onclick="NBDEditTemplate.updateTemplate()"><?php _e('Update info', 'web-to-print-online-designer'); ?></a>
            <a class="nbd-template-action-btn" href="<?php echo $link_edit_template; ?>"><?php _e('Edit template', 'web-to-print-online-designer'); ?></a>
            <a class="nbd-template-action-btn" href="<?php echo $link_create_template; ?>"><?php _e('Add template', 'web-to-print-online-designer'); ?></a>
            <a class="nbd-template-action-btn warning" href="javascript:void(0)" onclick="NBDEditTemplate.deleteTemplate()"><?php _e('Delete template', 'web-to-print-online-designer'); ?></a>
        </div> 
        <?php endif; ?>
    </div>
</div>        
<?php else: ?>
    <div class="nbd-list-designer-template" id="nbd-list-designer-template">
        <span onclick="showPopupCreateTemplate()" class="nbd-add-template-btn">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <title>Add template</title>
                <path fill="#fff" d="M8 7v2h6v-2h-6zM8 11h9v-1h-9v1zM17 12h-8v1h8v-1zM17 15v-1h-7v1h7zM8 14h-3v3h-3v3h3v3h3v-3h3v-3h-3v-3zM4 2v10h2v-8h13v17h-6.643l-1 2h9.643v-21h-17z"></path>
            </svg>            
        </span>        
    <?php 
        $row = apply_filters('nbd_artist_designs_row', 5);
        $per_row = intval( apply_filters('nbd_artist_designs_per_row', 6) );
        $des = '';
        $pagination = true;
        $url = add_query_arg(array('id' => $user_id), getUrlPageNBD('designer'));
        $page = (get_query_var('paged')) ? get_query_var('paged') : 1; 
        $templates = My_Design_Endpoint::nbdesigner_get_templates_by_page($page, $row, $per_row, false, false, $user_id);
        $favourite_templates = My_Design_Endpoint::get_favourite_templates();
        $total = My_Design_Endpoint::count_total_template( false, $user_id );        
    ?>
    <div class="nbd-gallery-processing" id="nbdesigner-gallery">
        <?php include_once('gallery.php'); ?>
    </div>  
    </div>    
<?php endif; ?>   
<script>
    var is_nbd_gallery = 0;
    var redirect_url = "<?php  echo  $link_designer;  ?>";
    var NBDEditTemplate = {
        init: function() {
            jQuery('a.nbd-thumbnail-drag').on('click', this.imageUpload);
            jQuery('a.nbd-remove-banner-image').on('click', this.removeBanner);
        },
        imageUpload: function(e) {
            e.preventDefault();

            var file_frame,
                self = jQuery(this);
            if ( file_frame ) {
                file_frame.open();
                return;
            }
            file_frame = wp.media.frames.file_frame = wp.media({
                title: jQuery( this ).data( 'uploader_title' ),
                button: {
                    text: jQuery( this ).data( 'uploader_button_text' )
                },
                multiple: false
            });
            file_frame.on( 'select', function() {
                var attachment = file_frame.state().get('selection').first().toJSON();

                var wrap = self.closest('.nbd-thumbnail');
                wrap.find('input.nbd-file-field').val(attachment.id);
                wrap.find('img.nbd-thumbnail-img').attr('src', attachment.url);
                jQuery('.image-wrap', wrap).removeClass('nbd-hide');

                jQuery('.button-area').addClass('nbd-hide');
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
        updateTemplate: function(){
            jQuery('.nbd-edit-tem-wraper').addClass( 'processing' ).block( {
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.6
                }
            } );            
            var formdata =  jQuery('.nbd-edit-tem-wraper').find('input, select').serialize();
            formdata = formdata + '&action=nbd_update_my_template';
            jQuery.ajax({
                url: nbds_frontend.url,
                method: "POST",
                data: formdata           
            }).done(function(data){
                if( data.flag == 1 ){
                    alert('Success!');
                }
                jQuery('.nbd-edit-tem-wraper').removeClass( 'processing' ).unblock();
            });  
        },
        deleteTemplate: function(){
            jQuery('.nbd-edit-tem-wraper').addClass( 'processing' ).block( {
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.6
                }
            } ); 
            var formdata =  jQuery('.nbd-edit-tem-wraper').find('input, select').serialize();
            formdata = formdata + '&action=nbd_delete_my_template';
            jQuery.ajax({
                url: nbds_frontend.url,
                method: "POST",
                data: formdata           
            }).done(function(data){
                if( data.flag == 1 ){
                    window.location = redirect_url;
                }
                jQuery('.nbd-edit-tem-wraper').removeClass( 'processing' ).unblock();
            });            
        },
        copyUrl: function( e ){
            var url = jQuery(e).attr('data-href');
            var $temp = jQuery("<input>");
            jQuery("body").append($temp);
            $temp.val( url ).select();
            document.execCommand("copy");
            $temp.remove();           
        }
    };
    NBDEditTemplate.init();
</script>
<?php 
    do_action( 'nbd_after_designer_page_content' ); 
    get_footer();