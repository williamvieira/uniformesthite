<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
/**
 * Necessary I/O functions
 * 
 */
class Nbdesigner_IO {
    public function __construct() {
        //TODO
    }
    /**
     * Get all images in folder by level
     * 
     * @param string $path path folder
     * @param int $level level scan dir
     * @return array Array path images in folder
     */
    public static function get_list_images($path, $level = 100){
        $list = array();
        $_list = self::get_list_files($path, $level);
        $list = preg_grep('/\.(jpg|jpeg|png|gif)(?:[\?\#].*)?$/i', $_list);
        return $list;        
    }
    public static function get_list_svgs($path, $level = 100){
        $list = array();
        $_list = self::get_list_files($path, $level);
        $list = preg_grep('/\.(svg)(?:[\?\#].*)?$/i', $_list);
        return $list;        
    }    
    public static function get_list_files($folder = '', $levels = 100) {
        if (empty($folder))
            return false;
        if (!$levels)
            return false;        
        $files = array();
        if ($dir = @opendir($folder)) {
            while (($file = readdir($dir) ) !== false) {
                if (in_array($file, array('.', '..')))
                    continue;
                if (is_dir($folder . '/' . $file)) {
                    $files2 = self::get_list_files($folder . '/' . $file, $levels - 1);
                    if ($files2)
                        $files = array_merge($files, $files2);
                    else
                        $files[] = $folder . '/' . $file . '/';
                } else {
                    $files[] = $folder . '/' . $file;
                }
            }
        }
        @closedir($dir);
        return $files;
    }
    public static function get_list_folder($folder = '', $levels = 100){
        if (empty($folder)) return false;    
        if (!$levels) return false;          
        $folders = array();
        if ($dir = @opendir($folder)) {
            while (($file = readdir($dir) ) !== false) {
                if (in_array($file, array('.', '..')))
                    continue;
                if (is_dir($folder . '/' . $file)) {
                    $folders2 = self::get_list_folder($folder . '/' . $file, $levels - 1);
                    if ($folders2){
                        $folders = array_merge($folders, $folders2);
                    }else {
                        $folders[] = $folder . '/' . $file . '/';
                    }
                }    
            }
        }
        @closedir($dir);
        return $folders;        
    }
    public static function delete_folder($path) {
        if (is_dir($path) === true) {
            $files = array_diff(scandir($path), array('.', '..'));
            foreach ($files as $file) {
                self::delete_folder(realpath($path) . '/' . $file);
            }
            return rmdir($path);
        } else if (is_file($path) === true) {
            return unlink($path);
        }
        return false;
    } 
    public static function copy_dir($src, $dst) {
        if (file_exists($dst)) self::delete_folder($dst);
        if (is_dir($src)) {
            wp_mkdir_p($dst);
            $files = scandir($src);
            foreach ($files as $file){
                if ($file != "." && $file != "..") self::copy_dir("$src/$file", "$dst/$file");
            }
        } else if (file_exists($src)) copy($src, $dst);
    } 
    public static function mkdir( $dir ){
        if (!file_exists($dir)) {
            wp_mkdir_p($dir);
        }        
    }
    public static function clear_file($path){
        $f = @fopen($path, "r+");
        if ($f !== false) {
            ftruncate($f, 0);
            fclose($f);
        }        
    }
    public static function create_file_path($upload_path, $filename, $ext=''){
	$date_path = '';
        if (!file_exists($upload_path))
            mkdir($upload_path);
        $year = @date() === false ? gmdate('Y') : date('Y');
        $date_path .= '/' . $year . '/';
        if (!file_exists($upload_path . $date_path))
            mkdir($upload_path . $date_path);
        $month = @date() === false ? gmdate('m') : date('m');
        $date_path .= $month . '/';
        if (!file_exists($upload_path . $date_path))
            mkdir($upload_path . $date_path);
        $day = @date() === false ? gmdate('d') : date('d');
        $date_path .= $day . '/';
        if (!file_exists($upload_path . $date_path))
            mkdir($upload_path . $date_path);
        $file_path = $upload_path . $date_path . $filename;
        $file_counter = 1;
        $real_filename = $filename;
        while (file_exists($file_path . '.' . $ext)) {
            $real_filename = $file_counter . '-' . $filename;
            $file_path = $upload_path . $date_path . $real_filename;
            $file_counter++;
        }
        return array(
            'full_path' => $file_path,
            'date_path' => $date_path . $real_filename
        );
    }   
    public static function secret_image_url($file_path){
        $type = pathinfo($file_path, PATHINFO_EXTENSION);
        $data = file_get_contents($file_path);
        $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);   
        return $base64;        
    }   
    /**
     * @deprecated 1.7.0 <br />
     * From 1.7.0 alternate by function wp_convert_path_to_url( $path )
     * @param type $path
     * @return string url
     */
    public static function convert_path_to_url($path){
        $upload_dir = wp_upload_dir();
        $basedir = $upload_dir['basedir'];
        $arr = explode('/', $basedir);
        $upload = $arr[count($arr) - 1];
        if(is_multisite() && !is_main_site()) $upload = $arr[count($arr) - 3].'/'.$arr[count($arr) - 2].'/'.$arr[count($arr) - 1];
        return content_url( substr($path, strrpos($path, '/' . $upload . '/nbdesigner')) );
    }
    /**
     * @deprecated 1.7.0
     * From 1.7.0 alternate by WP function wp_make_link_relative( $url )
     * @param type $url
     * @return path
     */
    public static function convert_url_to_path($url){
        $upload_dir = wp_upload_dir();
        $basedir = $upload_dir['basedir'];
        $arr = explode('/', $basedir);
        $upload = $arr[count($arr) - 1];
        if(is_multisite() && !is_main_site()) $upload = $arr[count($arr) - 3].'/'.$arr[count($arr) - 2].'/'.$arr[count($arr) - 1];
        $arr_url = explode('/'.$upload, $url);
        return $basedir.$arr_url[1];
    }
    public static function wp_convert_path_to_url( $path = '' ){
        $url = str_replace(
            wp_normalize_path( untrailingslashit( ABSPATH ) ),
            site_url(),
            wp_normalize_path( $path )
        );
        return esc_url_raw( $url );
    }   
    public static function save_data_to_file($path, $data){
        if (!$fp = fopen($path, 'w')) {
            return FALSE;
        }
        flock($fp, LOCK_EX);
        fwrite($fp, $data);
        flock($fp, LOCK_UN);
        fclose($fp);
        return TRUE;        
    }
    public static function checkFileType($file_name, $arr_mime) {
        $check = false;
        $filetype = explode('.', $file_name);
        $file_exten = $filetype[count($filetype) - 1];
        if (in_array(strtolower($file_exten), $arr_mime)) $check = true;
        return $check;
    }   
    public static function get_thumb_file( $ext, $path = '' ){
        $thumb = '';
        switch ( $ext ) {
            case 'jpg': 
            case 'jpeg': 
                $thumb = NBDESIGNER_ASSETS_URL . 'images/file_type/jpg.png';
                break;
            case 'png': 
                $thumb = NBDESIGNER_ASSETS_URL . 'images/file_type/png.png';
                break;             
            case 'psd': 
                $thumb = NBDESIGNER_ASSETS_URL . 'images/file_type/psd.png';
                break;       
            case 'pdf': 
                $thumb = NBDESIGNER_ASSETS_URL . 'images/file_type/pdf.png';
                break;
            case 'ai': 
                $thumb = NBDESIGNER_ASSETS_URL . 'images/file_type/ai.png';
                break;       
            case 'eps': 
                $thumb = NBDESIGNER_ASSETS_URL . 'images/file_type/eps.png';
                break;     
            case 'zip': 
                $thumb = NBDESIGNER_ASSETS_URL . 'images/file_type/zip.png';
                break; 
            case 'svg': 
                $thumb = NBDESIGNER_ASSETS_URL . 'images/file_type/svg.png';
                break;             
            default: 
                $thumb = NBDESIGNER_ASSETS_URL . 'images/file_type/file.png';
                break;             
        }
        return $thumb;
    }    
}
class NBD_Image {
    public static function nbdesigner_resize_imagepng($file, $w, $h, $path = ''){
        list($width, $height) = getimagesize($file);
        if( $path != '' ) $h = round( $w / $width * $height );
        $src = imagecreatefrompng($file);
        $dst = imagecreatetruecolor($w, $h);
        imagesavealpha($dst, true);
        $color = imagecolorallocatealpha($dst, 255, 255, 255, 127);
        imagefill($dst, 0, 0, $color);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $w, $h, $width, $height);
        imagedestroy($src);
        if( $path == '' ){
            return $dst;   
        } else{
            imagepng($dst, $path );
            imagedestroy($dst);
        }
    }
    public static function nbdesigner_resize_imagejpg($file, $w, $h, $path = '') {
        list($width, $height) = getimagesize($file);
        if( $path != '' ) $h = round( $w / $width * $height );
        $src = imagecreatefromjpeg($file);
        $dst = imagecreatetruecolor($w, $h);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $w, $h, $width, $height);
        imagedestroy($src);
        if( $path == '' ){
            return $dst;   
        } else{
            imagejpeg($dst, $path );
            imagedestroy($dst);
        }
    }      
    public static function convert_png_to_jpg($input_file){
        $output_file = pathinfo($input_file) . '/'. basename($filename, '.png') . ".jpeg";
        $input = imagecreatefrompng($input_file);
        list($width, $height) = getimagesize($input_file);
        $output = imagecreatetruecolor($width, $height);
        $white = imagecolorallocate($output,  255, 255, 255);
        imagefilledrectangle($output, 0, 0, $width, $height, $white);
        imagecopy($output, $input, 0, 0, 0, 0, $width, $height);
        imagejpeg($output, $output_file);        
    }
    public function resample($image, $height, $width, $format = 'jpeg', $dpi = 300){
        if (!$image) {
            throw new \Exception('Attempting to resample an empty image');
        }
        if (gettype($image) !== 'resource') {
            throw new \Exception('Attempting to resample something which is not a resource');
        }
        //Use truecolour image to avoid any issues with colours changing
        $tmp_img = imagecreatetruecolor($width, $height);
        //Resample the image to be ready for print
        if (!imagecopyresampled($tmp_img, $image, 0, 0, 0, 0, $width, $height, imagesx($image), imagesy($image))) {
            throw new \Exception("Unable to resample image");
        }
        //Massive hack to get the image as a jpeg string but there is no php function which converts
        //a GD image resource to a JPEG string
        ob_start();
        imagejpeg($tmp_img, null, 100);
        $image = ob_get_contents();
        ob_end_clean();
        //change the JPEG header to 300 pixels per inch
        $image = substr_replace($image, pack("Cnn", 0x01, $dpi, $dpi), 13, 5);
        return $image;
    } 
    public static function gd_resample( $input_file, $ouput_file, $dpi ){
        $source = imagecreatefromjpeg($input_file);
        list($width, $height) = getimagesize($filename);
        $image = self::resample( $source, $height, $width, $dpi );
        file_put_contents( $ouput_file, $image );
    }
    public static function imagick_add_white_bg( $input_file, $ouput_file ){       
        try {
            $image = new Imagick( $input_file );
            $bg = new IMagick();
            $bg->newImage($image->getImageWidth(), $image->getImageHeight(), new ImagickPixel("white"));
            $bg->setImageBackgroundColor('#FFFFFF');
            $bg->compositeImage($image, IMagick::COMPOSITE_DEFAULT, 0, 0);     
            $bg->writeImage( $ouput_file );  
            $image->destroy(); 
            $bg->destroy(); 
        } catch (Exception $e) {
            die('Error when creating a thumbnail: ' . $e->getMessage());
        }
    }
    public static function imagick_convert_png_to_jpg( $input_file, $ouput_file ){
        try {
            $image = new Imagick( $input_file );
            $flattened = new IMagick();
            $flattened->newImage($image->getImageWidth(), $image->getImageHeight(), new ImagickPixel("white"));
            $flattened->compositeImage($image, IMagick::COMPOSITE_OVER, 0, 0);
            $flattened->setImageFormat("jpg");
            $flattened->writeImage( $ouput_file );  
            $image->destroy(); 
            $flattened->destroy(); 
        } catch( Exception $e ){
            die('Error when creating a thumbnail: ' . $e->getMessage());
        }  
    }    
    public static function imagick_convert_png2jpg_without_bg( $input_file, $ouput_file ){
        try {
            $image = new Imagick( $input_file );
            $image->setImageFormat("jpg");
            $image->writeImage( $ouput_file );  
            $image->destroy();             
        } catch (Exception $e) {
            die('Error when creating a thumbnail: ' . $e->getMessage());
        }
    }
    public static function imagick_convert_rgb_to_cymk( $input_file, $ouput_file ){
        try {
            $image = new Imagick( $input_file );
            $image->stripImage();
            $image->transformimagecolorspace(\Imagick::COLORSPACE_CMYK);
            $image->writeImage( $ouput_file );
            $image->destroy(); 
        } catch( Exception $e ){
            die('Error when creating a thumbnail: ' . $e->getMessage());
        }        
    }
    public static function imagick_resample( $input_file, $ouput_file, $dpi ){
        try {
            $image = new Imagick();
            $image->setResolution($dpi,$dpi);
            $image->readImage($input_file);
            $image->setImageUnits(imagick::RESOLUTION_PIXELSPERINCH);
            $image->writeImage($ouput_file);
            $image->destroy(); 
        } catch( Exception $e ){
            die('Error when creating a thumbnail: ' . $e->getMessage());
        }
    }
    public static function imagick_change_icc_profile( $input_file, $ouput_file, $icc  ){
        try {
            $image = new Imagick( $input_file );
            $image->stripImage ();
            $icc_profile = file_get_contents( $icc ); 
            $image->profileImage('icc', $icc_profile); 
            unset($icc_profile); 
            $image->writeImage( $ouput_file );
            $image->destroy();
        } catch( Exception $e ){
            die('Error when creating a thumbnail: ' . $e->getMessage());
        }            
    }   
}
function is_available_imagick(){
    if(!class_exists("Imagick")) return false;
    return true;
}
function nbd_get_icc_cmyk_list(){
    return array(
        0   =>  'Don\'t Color Manage',
        1   =>  'Coated FOGRA27',
        2   =>  'Coated FOGRA39',
        3   =>  'Coated GRACoL 2006',
        4   =>  'Japan Color 2001 Coated',
        5   =>  'Japan Color 2001 Uncoated',
        6   =>  'Japan Color 2002 Newspaper',
        7   =>  'Japan Color 2003 Web Coated',
        8   =>  'Japan Web Coated',
        9   =>  'Uncoated FOGRA29',
        10   =>  'US Web Coated SWOP',
        11   =>  'US Web Uncoated',
        12   =>  'Web Coated FOGRA28',
        13   =>  'Web Coated SWOP 2006 Grade 3',
        14   =>  'Web Coated SWOP 2006 Grade 5'
    );
}
function nbd_get_icc_cmyk_list_file(){
    return array(
        0   =>  '',
        1   =>  'CoatedFOGRA27.icc',
        2   =>  'CoatedFOGRA39.icc',
        3   =>  'CoatedGRACoL2006.icc',
        4   =>  'JapanColor2001Coated.icc',
        5   =>  'JapanColor2001Uncoated.icc',
        6   =>  'JapanColor2002Newspaper.icc',
        7   =>  'JapanColor2003WebCoated.icc',
        8   =>  'JapanWebCoated.icc',
        9   =>  'UncoatedFOGRA29.icc',
        10   =>  'USWebCoatedSWOP.icc',
        11   =>  'USWebUncoated.icc',
        12   =>  'WebCoatedFOGRA28.icc',
        13   =>  'WebCoatedSWOP2006Grade3.icc',
        14   =>  'WebCoatedSWOP2006Grade5.icc'
    );
}
function nbd_file_get_contents($url){
    if(ini_get('allow_url_fopen')){
        $checkPHP = version_compare(PHP_VERSION, '5.6.0', '>=');
        if (is_ssl() && $checkPHP) {
            $result = file_get_contents($url, false, stream_context_create(array('ssl' => 
                array('verify_peer' => false, 'verify_peer_name' => false)))); 
        }else{
            $result = file_get_contents($url);    
        }                       
    }else{
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSLVERSION, 3); 
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0); 
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);                        
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($ch);
        curl_close($ch);          
        if(false === $result){
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url); 
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
            $result = curl_exec($ch);
            curl_close($ch);          
        }
    }	
    return $result;    
}
function hex_code_to_rgb($code){        
    list($r, $g, $b) = sscanf($code, "#%02x%02x%02x");
    $rgb = array($r, $g, $b);
    return $rgb;
}
function is_nbdesigner_product($id){
    $id = get_wpml_original_id($id);    
    $check = get_post_meta($id, '_nbdesigner_enable', true);
    if($check) return true;
    return false;
}
function nbdesigner_get_option($key){
    $option = get_option($key, false);
    if(false === $option) return nbdesigner_get_default_setting($key);
    return $option;
}
function nbdesigner_get_all_setting(){
    $default = nbdesigner_get_default_setting();
    foreach ($default as $key => $val){
        $default[$key] = nbdesigner_get_option($key);
    }
    return $default;
}
function nbdesigner_get_all_frontend_setting(){
    $default = default_frontend_setting();
    foreach ($default as $key => $val){
        $default[$key] = nbdesigner_get_option($key);
    }
    return $default;
}
function nbdesigner_get_default_setting($key = false){
    $frontend = default_frontend_setting();
    $nbd_setting = apply_filters('nbdesigner_default_settings', array_merge(array(
        'nbdesigner_position_button_in_catalog' => 1,
        'nbdesigner_position_button_product_detail' => 1,
        'nbdesigner_thumbnail_width' => 300,
        'nbdesigner_default_dpi' => 150,
        'nbdesigner_show_in_cart' => 'yes',
        'nbdesigner_class_design_button_catalog' => '',
        'nbdesigner_class_design_button_detail' => '',
        'nbdesigner_show_in_order' => 'yes',  
        'nbdesigner_disable_on_smartphones' => 'no',        
        'nbdesigner_notifications' => 'yes',
        'nbdesigner_enable_send_mail_when_approve' => 'no',
        'nbdesigner_attachment_admin_email' => 'no',
        'nbdesigner_notifications_recurrence' => 'hourly',
        'nbdesigner_notifications_emails' => '',
        'nbdesigner_admin_emails' => '',
        'allow_customer_redesign_after_order' => 'yes',
        'nbdesigner_mindpi_upload' => 0,
        'nbdesigner_hide_button_cart_in_detail_page'    =>  'no',
        'nbdesigner_printful_key' => '',   
        'nbdesigner_google_api_key' => '',   
        'nbdesigner_google_client_id' => '',   
        'nbdesigner_enable_log' => 'no',
        'nbdesigner_page_design_tool' => 1,
        'nbdesigner_upload_term' => __('Your term', 'web-to-print-online-designer'),
        'nbdesigner_create_your_own_page_id'	=>	nbd_get_page_id( 'create_your_own' ),
        'nbdesigner_designer_page_id'	=>	nbd_get_page_id( 'designer' ),
        'nbdesigner_gallery_page_id'	=>	nbd_get_page_id( 'gallery' ),
        
        'nbdesigner_mindpi_upload_file' => 0,  
        'nbdesigner_allow_upload_file_type' => '',
        'nbdesigner_disallow_upload_file_type' => '',
        'nbdesigner_number_file_upload' => 1,
        'nbdesigner_maxsize_upload_file' => nbd_get_max_upload_default(),
        'nbdesigner_minsize_upload_file' => 0,        
        'nbdesigner_max_res_upload_file' => '',
        'nbdesigner_min_res_upload_file' => '',            
        'nbdesigner_allow_download_file_upload' => 'no',       
        'nbdesigner_create_preview_image_file_upload' => 'no'       
    ), $frontend));
    if(!$key) return $nbd_setting;
    return $nbd_setting[$key];
}
function default_frontend_setting(){
    $default = array(
        'nbdesigner_enable_text' => 'yes',
        'nbdesigner_text_change_font' => 1,
        'nbdesigner_text_italic' => 1,
        'nbdesigner_text_bold' => 1,
        'nbdesigner_text_underline' => 1,
        'nbdesigner_text_through' => 1,
        'nbdesigner_text_overline' => 1,
        'nbdesigner_text_case' => 1,
        'nbdesigner_text_align_left' => 1,
        'nbdesigner_text_align_right' => 1,
        'nbdesigner_text_align_center' => 1,
        'nbdesigner_text_color' => 1,
        'nbdesigner_text_background' => 1,
        'nbdesigner_text_shadow' => 1,
        'nbdesigner_text_line_height' => 1,
        'nbdesigner_text_font_size' => 1,
        'nbdesigner_text_opacity' => 1,
        'nbdesigner_text_outline' => 1,
        'nbdesigner_text_proportion' => 1,
        'nbdesigner_text_rotate' => 1,
        'nbdesigner_default_text' => __('Text here', 'web-to-print-online-designer'),
        'nbdesigner_enable_curvedtext' => 'yes',
        'nbdesigner_enable_textpattern' => 'yes',
        
        'nbdesigner_enable_clipart' => 'yes',
        'nbdesigner_clipart_change_path_color' => 1,           
        'nbdesigner_clipart_rotate' => 1,           
        'nbdesigner_clipart_opacity' => 1,   

        'nbdesigner_enable_image' => 'yes',
        'nbdesigner_image_unlock_proportion' => 1,           
        'nbdesigner_image_shadow' => 1,           
        'nbdesigner_image_opacity' => 1,           
        'nbdesigner_image_grayscale' => 1,           
        'nbdesigner_image_invert' => 1,           
        'nbdesigner_image_sepia' => 1,           
        'nbdesigner_image_sepia2' => 1,           
        'nbdesigner_image_remove_white' => 1,      
        'nbdesigner_image_transparency' => 1,           
        'nbdesigner_image_tint' => 1,           
        'nbdesigner_image_blend' => 1,           
        'nbdesigner_image_brightness' => 1,           
        'nbdesigner_image_noise' => 1,         
        'nbdesigner_image_pixelate' => 1,         
        'nbdesigner_image_multiply' => 1,     
        'nbdesigner_image_blur' => 1,           
        'nbdesigner_image_sharpen' => 1,         
        'nbdesigner_image_emboss' => 1,         
        'nbdesigner_image_edge_enhance' => 1,          
        'nbdesigner_image_rotate' => 1,          
        'nbdesigner_image_crop' => 1,          
        'nbdesigner_image_shapecrop' => 1,  
        'nbdesigner_facebook_app_id' => '',
        'nbdesigner_instagram_app_id' => '',
        'nbdesigner_dropbox_app_id' => '', 
        'nbdesigner_enable_upload_image' => 'yes',
        'nbdesigner_upload_designs_php_logged_in' => 'no',
        'nbdesigner_upload_multiple_images' => 'no',
        'nbdesigner_maxsize_upload' => nbd_get_max_upload_default(),
        'nbdesigner_minsize_upload' => 0,           
        'nbdesigner_enable_image_url' => 'yes',
        'nbdesigner_enable_image_webcam' => 'yes',
        'nbdesigner_enable_facebook_photo' => 'yes',
        'nbdesigner_enable_instagram_photo' => 'yes',
        'nbdesigner_enable_dropbox_photo' => 'yes',
        'nbdesigner_enable_google_drive' => 'yes',
        'nbdesigner_enable_svg_code' => 'no',
        'nbdesigner_upload_show_term' => 'no',                
        
        'nbdesigner_enable_draw' => 'yes',
        'nbdesigner_draw_brush' => 1,          
        'nbdesigner_draw_brush_pencil' => 1,          
        'nbdesigner_draw_brush_circle' => 1,          
        'nbdesigner_draw_brush_spray' => 1,          
        'nbdesigner_draw_brush_pattern' => 1,          
        'nbdesigner_draw_brush_hline' => 1,          
        'nbdesigner_draw_brush_vline' => 1,          
        'nbdesigner_draw_brush_square' => 1,          
        'nbdesigner_draw_brush_diamond' => 1,          
        'nbdesigner_draw_brush_texture' => 1,          
        'nbdesigner_draw_shape' => 1, 
        'nbdesigner_draw_shape_rectangle' => 1, 
        'nbdesigner_draw_shape_circle' => 1, 
        'nbdesigner_draw_shape_triangle' => 1, 
        'nbdesigner_draw_shape_line' => 1, 
        'nbdesigner_draw_shape_polygon' => 1, 
        'nbdesigner_draw_shape_hexagon' => 1, 
        
        'nbdesigner_enable_qrcode' => 'yes',
        'nbdesigner_default_qrcode' => __('example.com', 'web-to-print-online-designer'),
        
        'nbdesigner_dimensions_unit' => 'cm',
        'nbdesigner_show_all_color' => 'yes',
        'nbdesigner_default_color' => '#cc324b',
        'nbdesigner_hex_names' => '',        
        'nbdesigner_save_latest_design'  => 'yes',
        'nbdesigner_save_for_later'  => 'yes',
        'nbdesigner_share_design'  => 'yes',
        'nbdesigner_cache_uploaded_image'  => 'yes',
        
        'nbdesigner_upload_file_php_logged_in' => 'no'
    );
    return $default;
}
function nbd_get_value_from_serialize_data( $str, $key ){
    $arr = array();
    $value = 0;
    parse_str($str, $arr);   
    if( isset($arr[$key]) ) $value = $arr[$key];
    return $value;
}
function nbd_not_empty($value) {
    return $value == '0' || !empty($value);
}
function nbd_default_product_setting(){
    return apply_filters('nbdesigner_default_product_setting', array(
        'orientation_name' => 'Side 1',
        'img_src' => get_option('nbdesigner_default_background'),
        'img_overlay' => get_option('nbdesigner_default_overlay'),
        'real_width' => 8,
        'real_height' => 6,
        'real_left' => 1,
        'real_top' => 1,
        'area_design_top' => 100,
        'area_design_left' => 50,
        'area_design_width' => 400,
        'area_design_height' => 300,
        'img_src_top' => 50,
        'img_src_left' => 0,
        'img_src_width' => 500,
        'img_src_height' => 400,
        'product_width' => 10,    
        'product_height' => 8,
        'show_bleed' => 0,
        'bleed_top_bottom' => 0.3,
        'bleed_left_right' => 0.3,
        'show_safe_zone' => 0,
        'margin_top_bottom' => 0.3,
        'margin_left_right' => 0.3,
        'bg_type'   => 'image',
        'bg_color_value' => "#ffffff",
        'show_overlay' => 0,
        'include_overlay' => 1,
        'area_design_type' => 1,
        'version' => NBDESIGNER_NUMBER_VERSION
    )); 
}
function nbd_get_default_product_option(){
    return apply_filters('nbdesigner_default_product_option', array(
        'admindesign'   => 0,
        'dpi'   => nbdesigner_get_option('nbdesigner_default_dpi'),
        'request_quote' =>  0,
        'allow_specify_dimension'   =>  0,
        'min_width'   =>  0,
        'max_width'   =>  0,
        'min_height'   =>  0,
        'max_height'   =>  0,
        'extra_price'   => 0,
        'type_price'   => 1,
        'type_dimension'   => 1,
        'dynamic_side'   => 0,
        'defined_dimension' => array(array('width' => 10, 'height' => 8, 'price' => 0))
    ));
}
function nbd_get_default_upload_setting(){
    return apply_filters('nbdesigner_default_product_upload', array(
        'number'   => nbdesigner_get_option('nbdesigner_number_file_upload'),
        'allow_type'   => nbdesigner_get_option('nbdesigner_allow_upload_file_type'),
        'disallow_type'   => nbdesigner_get_option('nbdesigner_disallow_upload_file_type'),
        'maxsize'   => nbdesigner_get_option('nbdesigner_maxsize_upload_file'),
        'minsize'   => nbdesigner_get_option('nbdesigner_minsize_upload_file'),
        'mindpi'   => nbdesigner_get_option('nbdesigner_mindpi_upload_file')
    ));    
}
function getUrlPageNBD($page){
    global $wpdb;
    switch ($page) {
        case 'studio':
            $post = nbd_get_page_id( 'studio' );
            break;       
        case 'create':
            $post = nbd_get_page_id( 'create_your_own' );
            break;   
        case 'redirect':
            $post = nbd_get_page_id( 'logged' );
            break;   
        case 'designer':
            $post = nbd_get_page_id( 'designer' );
            break;   
        case 'gallery':
            $post = nbd_get_page_id( 'gallery' );
            break;         
    }
    return ($post) ? get_page_link($post) : '#';    
}
function nbd_update_hit_template( $template_id = false, $folder = '' ){
    global $wpdb;
    $table_name = $wpdb->prefix . 'nbdesigner_templates';
    if( $template_id ){
        $tem = $wpdb->get_row( "SELECT * FROM {$table_name} WHERE id = {$template_id}" );
    }else if($folder != '') {
        $tem = $wpdb->get_row( "SELECT * FROM {$table_name} WHERE folder = '{$folder}'" );
        if( $tem ){
            $template_id = $tem->id;
        }
    }
    if( $template_id ){
        $hit = $tem->hit ? $tem->hit + 1 : 1;
        $re = $wpdb->update($table_name, array(
            'hit' => $hit
        ), array( 'id' => $template_id));         
    }
}
function nbd_get_templates( $product_id, $variation_id, $template_id = '', $priority = false, $limit = false ){
    global $wpdb;
    $table_name = $wpdb->prefix . 'nbdesigner_templates';
    if( $template_id != '' ){
        $sql = "SELECT * FROM $table_name WHERE id = $template_id";
    }else {
        if($priority) {
            $sql = "SELECT * FROM $table_name WHERE product_id = '$product_id' AND ( variation_id = '$variation_id' || variation_id = 0 ) AND priority = 1";
        }else {
            if( $limit ){
                $sql = "SELECT * FROM $table_name WHERE product_id = '$product_id' AND ( variation_id = '$variation_id' || variation_id = 0 ) ORDER BY created_date DESC LIMIT $limit";
            }else{
                $sql = "SELECT * FROM $table_name WHERE product_id = '$product_id' AND ( variation_id = '$variation_id' || variation_id = 0 ) ORDER BY created_date DESC";                
            }           
        }
    }
    $results = $wpdb->get_results($sql, 'ARRAY_A');
    if( $priority && count( $results ) == 0 ) {
        $sql = "SELECT * FROM $table_name WHERE product_id = '$product_id' AND ( variation_id = '$variation_id' || variation_id = 0 ) ORDER BY created_date DESC LIMIT 1";
        $results = $wpdb->get_results($sql, ARRAY_A);
    }
    /* Case variation no template */
//    if( $variation_id != 0 && count( $results ) == 0 ) {
//        $sql = "SELECT * FROM $table_name WHERE product_id = '$product_id'  ORDER BY created_date DESC";
//        $results = $wpdb->get_results($sql, ARRAY_A);        
//    }
    return $results;
}
function nbd_get_template_by_folder( $folder ){
    $data = array();
    $path = NBDESIGNER_CUSTOMER_DIR .'/'.$folder;
    $data['fonts'] = nbd_get_data_from_json($path . '/used_font.json');
    $data['design'] = nbd_get_data_from_json($path . '/design.json'); 
    $data['config'] = nbd_get_data_from_json($path . '/config.json');
    return $data;
}
function nbd_get_product_info( $product_id, $variation_id, $nbd_item_key = '', $task, $task2 = '', $reference = '' ){
    $data = array();
    $nbd_item_cart_key = ($variation_id > 0) ? $product_id . '_' . $variation_id : $product_id; 
    $_nbd_item_key = WC()->session->get('nbd_item_key_'.$nbd_item_cart_key);  
    if( $_nbd_item_key && $task2 == '' && $nbd_item_key == '' ) $nbd_item_key = $_nbd_item_key;
    $path = NBDESIGNER_CUSTOMER_DIR . '/' . $nbd_item_key;
    /* Path not exist in case add to cart before design, session has been init */  
    if( $nbd_item_key == '' || !file_exists($path) ){
        $data['upload'] = unserialize(get_post_meta($product_id, '_nbdesigner_upload', true));
        $data['option'] = unserialize(get_post_meta($product_id, '_nbdesigner_option', true));  
        if($variation_id > 0){         
            $enable_variation = get_post_meta($variation_id, '_nbdesigner_variation_enable', true);
            $data['product'] = unserialize(get_post_meta($variation_id, '_designer_variation_setting', true)); 
            if ( !($enable_variation && isset($data['product'][0]))){
                $data['product'] = unserialize(get_post_meta($product_id, '_designer_setting', true)); 
            }    
        }else {
            $data['product'] = unserialize(get_post_meta($product_id, '_designer_setting', true)); 
        }
    }else {
        $data['product'] = unserialize(file_get_contents($path . '/product.json'));
        $data['option'] = unserialize(file_get_contents($path . '/option.json'));
        $data['upload'] = unserialize(file_get_contents($path . '/upload.json'));
        $data['fonts'] = nbd_get_data_from_json($path . '/used_font.json');
        $data['config'] = nbd_get_data_from_json($path . '/config.json');
        if(isset($data['config']->product)){
            $data['product'] = $data['config']->product;
        }
        $data['design'] = nbd_get_data_from_json($path . '/design.json'); //view admin
    }
    if( $data['option']['admindesign'] && $task == 'new' ) {
        /* Get primary template or latest template for new design */
        $template = nbd_get_templates( $product_id, $variation_id, '', 1 );
        if( isset($template[0]) ){
            $template_path = NBDESIGNER_CUSTOMER_DIR . '/' . $template[0]['folder'];
            $data['fonts'] = nbd_get_data_from_json($template_path . '/used_font.json');
            $data['design'] = nbd_get_data_from_json($template_path . '/design.json'); //view cliente
            $data['config'] = nbd_get_data_from_json($template_path . '/config.json');
        }       
    }    
    if(  $reference != '' ){
        /* Get reference design, font and reference product setting */
        $ref_path = NBDESIGNER_CUSTOMER_DIR . '/' . $reference;
       // $data['design'] = nbd_get_data_from_json($ref_path . '/design.json');
        $data['fonts'] = nbd_get_data_from_json($ref_path . '/used_font.json');
        $data['ref'] = unserialize(file_get_contents($ref_path . '/product.json'));
        $data['config_ref'] = nbd_get_data_from_json($ref_path . '/config.json');
        nbd_update_hit_template( false, $reference );
    } 
    if( $data['upload']['allow_type'] == '' ) $data['upload']['allow_type'] = nbdesigner_get_option('nbdesigner_allow_upload_file_type');
    if( $data['upload']['disallow_type'] == '' ) $data['upload']['disallow_type'] = nbdesigner_get_option('nbdesigner_disallow_upload_file_type');
    $data['upload']['allow_type'] = preg_replace('/\s+/', '', strtolower( $data['upload']['allow_type']) );
    $data['upload']['disallow_type'] = preg_replace('/\s+/', '', strtolower( $data['upload']['disallow_type']) );
    $data['product'] = nbd_get_media_for_data_product( $data['product'] );
    return $data;        
}
function nbd_get_media_for_data_product( $data_product ){
    foreach ( $data_product as $key => $data ){
        $data_product[$key] = $_data = (array) $data;
        $data_product[$key]['img_src'] = is_numeric( $_data['img_src'] ) ? wp_get_attachment_url( $_data['img_src'] ) : $_data['img_src'];
        $data_product[$key]['img_overlay'] = is_numeric( $_data['img_overlay'] ) ? wp_get_attachment_url( $_data['img_overlay'] ) : $_data['img_overlay'];
    }
    return $data_product;
}
function nbd_add_attachment( $file ){
    $filename = basename($file);
    $upload_file = wp_upload_bits($filename, null, file_get_contents($file));
    if (!$upload_file['error']) {
        $wp_filetype = wp_check_filetype($filename, null);
        $attachment = array(
            'post_mime_type' => $wp_filetype['type'],
            'post_title' => preg_replace('/\.[^.]+$/', '', $filename),
            'post_content' => '',
            'post_status' => 'inherit'
        );
        $attachment_id = wp_insert_attachment($attachment, $upload_file['file']);
        if (!is_wp_error($attachment_id)) {
            require_once(ABSPATH . "wp-admin" . '/includes/image.php');
            $attachment_data = wp_generate_attachment_metadata($attachment_id, $upload_file['file']);
            wp_update_attachment_metadata($attachment_id, $attachment_data);
            return $attachment_id;
        }
    }
}
function nbd_get_upload_files_from_session( $nbu_item_key ){
    $path = NBDESIGNER_UPLOAD_DIR . '/' . $nbu_item_key;
    $list_files = Nbdesigner_IO::get_list_files($path);
    $list_files = nbd_get_array_name_from_arry_path($list_files); 
    $files = array();
    foreach ($list_files as $file ){
        $ext = pathinfo($file, PATHINFO_EXTENSION);
        $files[] = array(
            'src' => Nbdesigner_IO::get_thumb_file($ext, '' ),
            'name'  =>  $file
        );
    }
    return $files;
}
function nbd_get_array_name_from_arry_path( $arr_path ){
    $arr_names = array();
    foreach ($arr_path as $path ){
        $arr_names[] = basename($path);
    }
    return $arr_names;
}
function nbd_get_data_from_json($path = ''){
    $content = file_exists($path) ? file_get_contents($path) : '';
    return json_decode($content) ;
}
function nbd_update_config_product_160($settings){
    return $settings;
}
function nbd_get_i18n_javascript(){
    $lang = array(
        'error' => __('Oops! Try again later!', 'web-to-print-online-designer'),
        'complete' => __('Complete!', 'web-to-print-online-designer'),
        'are_you_sure' => __('Are you sure?', 'web-to-print-online-designer'),
        'warning_mes_delete_file' => __('You will not be able to recover this file!', 'web-to-print-online-designer'),
        'warning_mes_delete_category' => __('You will not be able to recover this category!', 'web-to-print-online-designer'),
        'warning_mes_fill_category_name' => __('Please fill category name!', 'web-to-print-online-designer'),
        'warning_mes_backup_data' => __('Restore your last data!', 'web-to-print-online-designer'),
        'warning_mes_delete_lang' => __('You will not be able to recover this language!', 'web-to-print-online-designer')
    );
    return $lang;    
}
if ( ! function_exists( 'is_nbd_studio' ) ) {
    function is_nbd_studio(){
        return is_page( nbd_get_page_id( 'studio' ) );
    }    
}
if ( ! function_exists( 'is_nbd_design_page' ) ) {
    function is_nbd_design_page(){
        return is_page( nbd_get_page_id( 'create_your_own' ) );
    }    
}
if ( ! function_exists( 'is_nbd_gallery_page' ) ) {
    function is_nbd_gallery_page(){
        return is_page( nbd_get_page_id( 'gallery' ) );
    }    
}
if ( ! function_exists( 'is_nbd_designer_page' ) ) {
    function is_nbd_designer_page(){
        return is_page( nbd_get_page_id( 'designer' ) );
    }    
}
if( !function_exists('nbd_get_page_id')){
    function nbd_get_page_id($page){
        $page = apply_filters( 'nbdesigner_' . $page . '_page_id', get_option('nbdesigner_' . $page . '_page_id' ) );
        if ( class_exists('SitePress') ) {
            $page = icl_object_id($page,'page',false);
        }  
        return $page ? absint( $page ) : -1;
    }
}
function nbd_get_woo_version(){
    if ( ! function_exists( 'get_plugins' ) )
            require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
    $plugin_folder = get_plugins( '/' . 'woocommerce' );
    $plugin_file = 'woocommerce.php';     
    if ( isset( $plugin_folder[$plugin_file]['Version'] ) ) {
            return $plugin_folder[$plugin_file]['Version'];
    } else {
            return 0;
    }        
}
function is_woo_v3(){
    $woo_ver = nbd_get_woo_version(); 
    if( version_compare( $woo_ver, "3.0", "<" )) return false;
    return true;
}
function is_woo_v31(){
    $woo_ver = nbd_get_woo_version(); 
    if( version_compare( $woo_ver, "3.1", "<" )) return false;
    return true;
}
function nbd_get_dpi($filename){
    if(class_exists('Imagick')){
        $image = new Imagick($filename);
        $resolutions = $image->getImageResolution();
    }else{
        $a = fopen($filename,'r');
        $string = fread($a,20);
        fclose($a);

        $data = bin2hex(substr($string,14,4));
        $x = substr($data,0,4);
        $y = substr($data,4,4);  
        $resolutions = array('x' => hexdec($x), 'y' => hexdec($y));
    }
    return array($resolutions);
}
/**
 * Locate template.
 *
 * Locate the called template.
 * Search Order:
 * 1. /themes/theme/web-to-print-online-designer/$template_name
 * 2. /themes/theme/$template_name
 * 3. /plugins/web-to-print-online-designer/templates/$template_name.
 *
 * @since 1.3.1
 *
 * @param 	string 	$template_name			Template to load.
 * @param 	string 	$string $template_path	        Path to templates.
 * @param 	string	$default_path			Default path to template files.
 * @return 	string 					Path to the template file.
 */    
function nbdesigner_locate_template($template_name, $template_path = '', $default_path = '') {
    // Set variable to search in web-to-print-online-designer folder of theme.
    if (!$template_path) :
        $template_path = 'web-to-print-online-designer/';
    endif;
    // Set default plugin templates path.
    if (!$default_path) :
        $default_path = NBDESIGNER_PLUGIN_DIR . 'templates/'; // Path to the template folder
    endif;
    // Search template file in theme folder.
    $template = locate_template(array(
        $template_path . $template_name,
        $template_name
    ));
    // Get plugins template file.
    if (!$template) :
        $template = $default_path . $template_name;
    endif;
    return apply_filters('nbdesigner_locate_template', $template, $template_name, $template_path, $default_path);
}
/**
 * Get template.
 *
 * Search for the template and include the file.
 *
 * @since 1.3.1
 *
 * @see wcpt_locate_template()
 *
 * @param string 	$template_name			Template to load.
 * @param array 	$args				Args passed for the template file.
 * @param string 	$string $template_path	        Path to templates.
 * @param string	$default_path			Default path to template files.
 */
function nbdesigner_get_template($template_name, $args = array(), $tempate_path = '', $default_path = '') {
    if (is_array($args) && isset($args)) :
        extract($args);
    endif;
    $template_file = nbdesigner_locate_template($template_name, $tempate_path, $default_path);
    if (!file_exists($template_file)) :
        _doing_it_wrong(__FUNCTION__, sprintf('<code>%s</code> does not exist.', $template_file), '1.3.1');
        return;
    endif;
    include $template_file;
}
function nbd_get_language($code){
    $data = array();
    $data['mes'] = 'success';    
    $path = NBDESIGNER_PLUGIN_DIR . 'data/language.json';
    $path_data = NBDESIGNER_DATA_DIR . '/data/language.json';
    if(file_exists($path_data)) $path = $path_data;
    $list = json_decode(file_get_contents($path)); 
    $path_lang = NBDESIGNER_PLUGIN_DIR . 'data/language/'.$code.'.json';
    $path_data_lang = NBDESIGNER_DATA_DIR . '/data/language/'.$code.'.json';
    if(file_exists($path_data_lang)) $path_lang = $path_data_lang;
    $path_original_lang = NBDESIGNER_PLUGIN_DIR . 'data/language/en_US.json';
    if(!file_exists($path_lang)) $path_lang = $path_original_lang;
    $lang_original = json_decode(file_get_contents($path_original_lang)); 
    $lang = json_decode(file_get_contents($path_lang));
    if(is_array($lang)){
        $data_langs = (array)$lang[0];
        if(is_array($lang_original)){
            $data_langs_origin = (array)$lang_original[0];
            $data_langs = array_merge($data_langs_origin, $data_langs);
        }
        $data['langs'] = $data_langs;
        if(is_array( $data['langs'] )){
            asort($data['langs']);
        }
        $data['code'] = $code;
    }else{
        $data['mes'] = 'error';
    }
    if(is_array($list)){
        $data['cat'] = $list;
    }else{
        $data['mes'] = 'error';
    }    
    return $data;
}
function nbd_is_product( $id ){
    $product = wc_get_product($id);
    if( $product ) return true;
    return false;
}
function nbd_get_default_variation_id( $product_id ){
    $variation_id = 0;
    if( !$product_id ) return $variation_id;
    $product = wc_get_product($product_id);
    if($product->is_type( 'variable' )){
        $available_variations = $product->get_available_variations();   
        if(is_woo_v3()){
            $default_attributes = $product->get_default_attributes();  
        }else{
            $default_attributes = $product->get_variation_default_attributes();  
        } 
        foreach ($default_attributes as $key => $value) {
            if (strpos($key, 'attribute_') === 0) {
                continue;
            }
            unset($default_attributes[$key]);
            $default_attributes[sprintf('attribute_%s', $key)] = $value;
        }
        if (class_exists('WC_Data_Store')) {
            $data_store = WC_Data_Store::load('product');
            return $data_store->find_matching_product_variation($product, $default_attributes);
        } else {          
            return $product->get_matching_variation($default_attributes);
        }
    }
    return $variation_id;
}
function nbd_check_permission(){
    if( isset($_GET['cik']) ){
        if( !(isset($_GET['task2']) && $_GET['task2'] != '') && !WC()->session->get($_GET['cik'] . '_nbd') && !WC()->session->get($_GET['cik'] . '_nbu')) return false;
    }
    if( isset($_GET['oid']) ){
        $order = wc_get_order(absint($_GET['oid']) ); 
        $uid = get_current_user_id();
        if ($order->get_user_id() != $uid) return false;
    }
    if( isset($_GET['task']) && $_GET['task'] == "create" ){
        if( !current_user_can('edit_nbd_template') ) return false;
    }    
    return true;
}
function get_nbd_variations( $product_id ){
    $product = wc_get_product( $product_id );
    $variations = array();
    if( $product->is_type( 'variable' ) ) {
        $available_variations = $product->get_available_variations();   
        foreach ($available_variations as $variation){
            $enable = get_post_meta($variation['variation_id'], '_nbdesigner_variation_enable', true);
            if($enable){
                if( is_array( $variation['attributes'] ) ){
                    $new_name = '';
                    foreach ( $variation['attributes'] AS $name => $value ) {
                        if ( !empty( $value ) ) $new_name .= ucfirst($value).', ';
                    }                    
                    $new_name = substr($new_name, 0, -2);
                }          
                $variations[] = array(
                    'id'    =>  $variation['variation_id'],
                    'name'  =>  $new_name
                );                    
            }
        }   
    }
    return $variations;
}
function nbd_get_max_upload_default(){
    if( function_exists ( 'wp_max_upload_size' ) ){
        return round(wp_max_upload_size() / 1024 / 1024);
    }else{
        return abs( intval( ini_get( 'post_max_size' ) ) );
    }
}
function nbd_check_cart_item_exist( $cart_item_key ){
    global $woocommerce;
    $check = false;
    foreach($woocommerce->cart->get_cart() as $key => $val ) {
        if( $cart_item_key ==  $key) return true;
    }
    return $check;
}
function nbd_die( $result ){
    echo json_encode($result);
    wp_die();
}
function nbd_exec($cmd) {
    $output = array();
    exec("$cmd 2>&1", $output);
    return $output;
}
function get_wpml_original_id( $id, $type = 'post' ){
    if (class_exists('SitePress')) {
        global $sitepress;
        $langcode = $sitepress->get_default_language();
        $id = icl_object_id($id, $type, true, $langcode);
    }
    return $id;
}
function get_wpml_current_id( $id, $type = 'post' ){
    if ( class_exists('SitePress') ) {
        return icl_object_id($id,'post',false);
    } 
    return $id;
}
function nbd_get_artist_info( $user_id ){
    $infos = array();
    $infos['nbd_artist_name'] = get_the_author_meta( 'nbd_artist_name', $user_id );
    $infos['nbd_artist_phone'] = get_the_author_meta( 'nbd_artist_phone', $user_id );
    $infos['nbd_sell_design'] = get_the_author_meta( 'nbd_sell_design', $user_id );
    $infos['nbd_create_design'] = get_the_author_meta( 'nbd_create_design', $user_id );
    $infos['nbd_artist_banner'] = get_the_author_meta( 'nbd_artist_banner', $user_id );
    $infos['nbd_artist_address'] = get_the_author_meta( 'nbd_artist_address', $user_id );
    $infos['nbd_artist_facebook'] = get_the_author_meta( 'nbd_artist_facebook', $user_id );
    $infos['nbd_artist_google'] = get_the_author_meta( 'nbd_artist_google', $user_id );
    $infos['nbd_artist_twitter'] = get_the_author_meta( 'nbd_artist_twitter', $user_id );
    $infos['nbd_artist_linkedin'] = get_the_author_meta( 'nbd_artist_linkedin', $user_id );
    $infos['nbd_artist_youtube'] = get_the_author_meta( 'nbd_artist_youtube', $user_id );
    $infos['nbd_artist_instagram'] = get_the_author_meta( 'nbd_artist_instagram', $user_id );
    $infos['nbd_artist_flickr'] = get_the_author_meta( 'nbd_artist_flickr', $user_id );
    $infos['nbd_artist_commission'] = get_the_author_meta( 'nbd_artist_commission', $user_id );
    $infos['nbd_artist_description'] = get_the_author_meta( 'nbd_artist_description', $user_id );
    return $infos;
}
function nbd_user_logged_in(){
    return is_user_logged_in() ? 1 : 0; 
}
function nbd_get_pages(){
    $pages = get_pages();
    $_pages = array(
        '0' =>  'Default'
    );
    foreach($pages as $page) { 
        $id = $page->ID;
        $_pages[$id] = $page->post_title;
    }
    return $_pages;
}
function is_nbd_designer( $user_id ){
    $can_edit_template = get_user_meta( $user_id, 'nbd_create_design');
    return ( $can_edit_template[0] == 'on' ) ? true : false;
}
function user_can_edit_template( $user_id, $template_id = 0 ){
    $current_user_id = get_current_user_id();
    return ( ($user_id == $current_user_id) && is_nbd_designer($user_id) ) ? true : false;
}
function nbd_get_font_by_alias( $alias ){
    $fonts = array();
    if(file_exists( NBDESIGNER_DATA_DIR . '/fonts.json') ){
        $fonts = (array)json_decode( file_get_contents( NBDESIGNER_DATA_DIR . '/fonts.json' ) );        
    }  
    foreach ($fonts as $font) {
        if ($font->alias == $alias) {
            return $font;
        }
    }
    return false;
}
function nbd_get_products_has_design(){
    $nbd_products = get_transient('nbd_frontend_products');
    if( false === $nbd_products ){
        $products = nbd_get_all_product_has_design();
        foreach ($products as $pro){
            $product = wc_get_product($pro->ID);
            $type = $product->get_type();
            $image = get_the_post_thumbnail_url($pro->ID, 'post-thumbnail');
            if( !$image ) $image = wc_placeholder_img_src();            
            $result[] = array(
                'product_id'    =>  $pro->ID,
                'name'  => $pro->post_title,
                'src'   =>  $image,
                'type'  =>  $type,
                'url'   => get_permalink($pro->ID)
            );
        }
        set_transient( 'nbd_frontend_products' , $result ); 
    }else{
        $result = $nbd_products;
    }     
    return $result;
}
function nbd_get_all_product_has_design(){
    $args_query = array(
        'post_type' => 'product',
        'post_status' => 'publish',
        'meta_key' => '_nbdesigner_enable',
        'orderby' => 'date',
        'order' => 'DESC',
        'posts_per_page'=> -1,
        'meta_query' => array(
            array(
                'key' => '_nbdesigner_enable',
                'value' => 1,
            )
        )
    ); 
    $posts = get_posts($args_query);  
    return $posts;    
}