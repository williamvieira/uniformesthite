<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
if( !class_exists('Nbdesigner_Settings_Upload') ) {
    class Nbdesigner_Settings_Upload {
        public static function get_options() {
            return apply_filters('nbdesigner_upload_settings', array(
                'upload-settings' => array(    
                    array(
                        'title' => __('Login Required', 'web-to-print-online-designer'),
                        'description' => __('Users must create an account in your Wordpress site and need to be logged-in to upload files.', 'web-to-print-online-designer'),
                        'id' => 'nbdesigner_upload_file_php_logged_in',
                        'default' => 'no',
                        'type' => 'checkbox'
                    ),                      
                    array(
                        'title' => __( 'Allowed file types', 'web-to-print-online-designer'),
                        'description' 		=> __( 'Extensions seperated by a comma. Don not use dots or spaces. Example: <code>jpg,bmp,pdf,ps,ai,iddd</code>... Set empty input to allow all extensions except disallowed extensions.', 'web-to-print-online-designer'),
                        'id' 		=> 'nbdesigner_allow_upload_file_type',
                        'class'         => 'regular-text',
                        'default'	=> '',
                        'type' 		=> 'text',
                        'placeholder'   => 'jpg,bmp,pdf,ps'
                    ),  
                    array(
                        'title' => __( 'Disallowed file types', 'web-to-print-online-designer'),
                        'description' 		=> __( 'Extensions seperated by a comma. Don not use dots or spaces. Example: <code>png,gif,... </code>', 'web-to-print-online-designer'),
                        'id' 		=> 'nbdesigner_disallow_upload_file_type',
                        'class'         => 'regular-text',
                        'default'	=> '',
                        'type' 		=> 'text',
                        'placeholder'   => 'png,gif'
                    ),                     
                    array(
                        'title' => __('Number of uploads', 'web-to-print-online-designer'),
                        'id' => 'nbdesigner_number_file_upload',
                        'css'         => 'width: 65px',
                        'default'	=> '1',
                        'description' => __( 'Number of files allow user upload.', 'web-to-print-online-designer'),
                        'type' 		=> 'number'
                    ),
                    array(
                        'title' => __( 'Max upload size', 'web-to-print-online-designer'),
                        'id' 		=> 'nbdesigner_maxsize_upload_file',
                        'css'         => 'width: 65px',
                        'default'	=> nbd_get_max_upload_default(),
                        'subfix'        => ' MB',
                        'type' 		=> 'number'
                    ), 
                    array(
                        'title' => __( 'Min upload size', 'web-to-print-online-designer'),
                        'id' 		=> 'nbdesigner_minsize_upload_file',
                        'css'         => 'width: 65px',
                        'default'	=> '0',
                        'subfix'        => ' MB',
                        'type' 		=> 'number'
                    ),
                    array(
                        'title' => __('Customer download', 'web-to-print-online-designer'),
                        'id' => 'nbdesigner_allow_download_file_upload',
                        'default'	=> 'no',
                        'description' => __( 'Let customers download their own files.', 'web-to-print-online-designer'),
                        'type' 		=> 'radio',
                        'options'   => array(
                            'yes' => __('Yes', 'web-to-print-online-designer'),
                            'no' => __('No', 'web-to-print-online-designer')
                        ) 
                    ),   
                    array(
                        'title' => __('Create Preview for image', 'web-to-print-online-designer'),
                        'id' => 'nbdesigner_create_preview_image_file_upload',
                        'default'	=> 'no',
                        'description' => __( 'Be careful, it may be slow down your server if uploaded image is very large.', 'web-to-print-online-designer'),
                        'type' 		=> 'radio',
                        'options'   => array(
                            'yes' => __('Yes', 'web-to-print-online-designer'),
                            'no' => __('No', 'web-to-print-online-designer')
                        ) 
                    ),                      
                    array(
                        'title' => __( 'Min. resolution DPI for JPG/JPEG image', 'web-to-print-online-designer'),
                        'id' 		=> 'nbdesigner_mindpi_upload_file',
                        'css'         => 'width: 65px',
                        'default'	=> '0',
                        'type' 		=> 'number'
                    )                      
                ),
                'images-settings' => array(    
                    array(
                        'title' => __( 'Max. resolution (px)', 'web-to-print-online-designer'),
                        'id' 		=> 'nbdesigner_max_res_upload_file',
                        'description' => __( 'Set empty input to allow any resolution', 'web-to-print-online-designer'),
                        'css'         => 'width: 65px',
                        'default'	=> '',
                        'type' 		=> 'multivalues',
                        'options'   => array(
                            'width' => 0,
                            'height' => 0
                        )  
                    ),  
                    array(
                        'title' => __( 'Min. resolution (px)', 'web-to-print-online-designer'),
                        'id' 		=> 'nbdesigner_min_res_upload_file',
                        'css'         => 'width: 65px',
                        'default'	=> '',
                        'type' 		=> 'multivalues',
                        'options'   => array(
                            'width' => 0,
                            'height' => 0
                        )                         
                    )                   
                )
            ));
        }
    }
}
