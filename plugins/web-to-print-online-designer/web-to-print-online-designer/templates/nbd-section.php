<?php
if (!defined('ABSPATH')) exit;
$class = nbdesigner_get_option('nbdesigner_class_design_button_detail'); 
?>
<div class="nbdesigner_frontend_container">
    <p>
        <a class="button alt nbdesign-button nbdesigner-disable <?php echo $class; ?>" id="triggerDesign" >
            <img class="nbdesigner-img-loading" src="<?php echo NBDESIGNER_PLUGIN_URL.'assets/images/loading.gif' ?>"/>
            <?php _e('Start Design', 'web-to-print-online-designer'); ?>
        </a>
    </p>   
    <h4 id="nbdesigner-preview-title" style="display: none;"><?php _e('Custom design', 'web-to-print-online-designer'); ?></h4>
    <div id="nbd-actions" style="display: none;">
    <?php
        if( nbdesigner_get_option('nbdesigner_show_all_color') == 'yes' ):
    ?>
        <p>
            <a href="javascript:void(0)" onclick="NBDESIGNERPRODUCT.save_for_later()" class="button alt nbd-save-for-later" id="nbd-save-for-later">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                    <title>check2</title>
                    <path fill="#0085ba" d="M13.055 4.422c0 0.195-0.078 0.391-0.219 0.531l-6.719 6.719c-0.141 0.141-0.336 0.219-0.531 0.219s-0.391-0.078-0.531-0.219l-3.891-3.891c-0.141-0.141-0.219-0.336-0.219-0.531s0.078-0.391 0.219-0.531l1.062-1.062c0.141-0.141 0.336-0.219 0.531-0.219s0.391 0.078 0.531 0.219l2.297 2.305 5.125-5.133c0.141-0.141 0.336-0.219 0.531-0.219s0.391 0.078 0.531 0.219l1.062 1.062c0.141 0.141 0.219 0.336 0.219 0.531z"></path>
                </svg>
                <img class="nbd-save-loading hide" src="<?php echo NBDESIGNER_PLUGIN_URL.'assets/images/loading.gif' ?>"/> 
                <?php _e('Save for later', 'web-to-print-online-designer'); ?>
            </a>
            <?php
                $allow_donwload_pdf = false;
                if( $allow_donwload_pdf ):
            ?>
            <a href="javascript:void(0)" onclick="NBDESIGNERPRODUCT.download_pdf()" class="button alt">
                <img class="nbd-pdf-loading hide" src="<?php echo NBDESIGNER_PLUGIN_URL.'assets/images/loading.gif' ?>"/> 
                <?php _e('Download PDF', 'web-to-print-online-designer'); ?>
            </a>
            <?php endif; ?>
        </p>
    <?php endif; ?>
    <?php
        if( nbdesigner_get_option('nbdesigner_share_design') == 'yes' ):
    ?>  
        <p id="nbd-share-group">
            <?php _e('Share design', 'web-to-print-online-designer'); ?><br />
            <a href="#" data-href="https://facebook.com/sharer/sharer.php?u=" target="_blank" class="nbd-social" title="Facebook">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <title>facebook</title>
                    <path fill="#3b5998" d="M22.675 0h-21.351c-0.732 0-1.325 0.593-1.325 1.325v21.351c0 0.732 0.593 1.325 1.325 1.325h11.495v-9.294h-3.129v-3.621h3.129v-2.674c0-3.099 1.893-4.785 4.659-4.785 1.325 0 2.463 0.096 2.794 0.141v3.24h-1.92c-1.5 0-1.793 0.72-1.793 1.77v2.31h3.585l-0.465 3.63h-3.12v9.284h6.115c0.732 0 1.325-0.593 1.325-1.325v-21.351c0-0.732-0.593-1.325-1.325-1.325z"></path>
                </svg>           
            </a>
            <a href="#" data-href="https://plus.google.com/share?url=" target="_blank" class="nbd-social" title="Google">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <title>google</title>
                    <path fill="#dc4e41" d="M7.635 10.909v2.618h4.335c-0.174 1.125-1.309 3.295-4.331 3.295-2.606 0-4.732-2.16-4.732-4.822s2.123-4.822 4.728-4.822c1.485 0 2.478 0.633 3.045 1.179l2.073-1.995c-1.331-1.245-3.056-1.995-5.115-1.995-4.226-0.002-7.638 3.418-7.638 7.634s3.414 7.635 7.635 7.635c4.41 0 7.332-3.097 7.332-7.461 0-0.501-0.054-0.885-0.12-1.264h-7.212zM24 10.909h-2.183v-2.182h-2.183v2.182h-2.181v2.181h2.182v2.182h2.19v-2.182h2.174z"></path>
                </svg>            
            </a>
            <a href="#" data-href="https://twitter.com/share?url=" data-text="<?php _e('My design', 'web-to-print-online-designer'); ?>" target="_blank" class="nbd-social" title="Twitter">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <title>twitter</title>
                    <path fill="#1da1f2" d="M24 4.557c-0.885 0.39-1.83 0.655-2.828 0.776 1.015-0.611 1.797-1.575 2.165-2.724-0.951 0.555-2.006 0.96-3.128 1.185-0.897-0.96-2.175-1.56-3.594-1.56-2.718 0-4.923 2.205-4.923 4.92 0 0.39 0.045 0.765 0.127 1.125-4.092-0.195-7.72-2.16-10.149-5.13-0.426 0.721-0.666 1.561-0.666 2.476 0 1.71 0.87 3.214 2.19 4.098-0.807-0.026-1.567-0.248-2.231-0.615v0.060c0 2.385 1.695 4.377 3.95 4.83-0.414 0.111-0.849 0.171-1.298 0.171-0.315 0-0.615-0.030-0.915-0.087 0.63 1.956 2.445 3.379 4.605 3.42-1.68 1.32-3.81 2.106-6.105 2.106-0.39 0-0.78-0.023-1.17-0.067 2.19 1.395 4.77 2.211 7.56 2.211 9.060 0 14.010-7.5 14.010-13.995 0-0.21 0-0.42-0.015-0.63 0.96-0.69 1.8-1.56 2.46-2.55z"></path>
                </svg>            
            </a>   
            <a href="#" data-href="https://www.linkedin.com/shareArticle?mini=true&url=" target="_blank" class="nbd-social" title="Linkedin">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <title>linkedin</title>
                    <path fill="#0077b5" d="M20.448 20.453h-3.555v-5.569c0-1.329-0.027-3.037-1.851-3.037-1.852 0-2.136 1.446-2.136 2.94v5.667h-3.555v-11.453h3.414v1.56h0.045c0.477-0.9 1.638-1.85 3.37-1.85 3.6 0 4.267 2.37 4.267 5.456v6.282zM5.337 7.433c-1.143 0-2.064-0.926-2.064-2.065 0-1.137 0.921-2.063 2.064-2.063 1.14 0 2.064 0.925 2.064 2.063 0 1.14-0.926 2.065-2.064 2.065zM7.119 20.453h-3.564v-11.453h3.564v11.453zM22.224 0h-20.454c-0.978 0-1.77 0.774-1.77 1.73v20.541c0 0.956 0.792 1.729 1.77 1.729h20.453c0.978 0 1.777-0.774 1.777-1.73v-20.541c0-0.956-0.799-1.73-1.777-1.73z"></path>
                </svg>            
            </a>
            <a href="#" data-href="mailto:?subject=Check%20out%20my%20design!&body=" target="_blank" class="nbd-social" title="Mail">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <title>mail</title>
                    <path fill="#d14836" d="M24 4.5v15c0 0.851-0.649 1.5-1.5 1.5h-1.5v-13.612l-9 6.462-9-6.462v13.612h-1.5c-0.85 0-1.5-0.649-1.5-1.5v-15c0-0.425 0.162-0.8 0.43-1.068 0.27-0.272 0.646-0.432 1.070-0.432h0.499l10.001 7.25 10-7.25h0.5c0.424 0 0.799 0.162 1.069 0.432 0.269 0.268 0.431 0.644 0.431 1.068z"></path>
                </svg>            
            </a> 
            <a href="#" data-href="http://pinterest.com/pin/create/button/?url=" data-description="<?php _e('My design', 'web-to-print-online-designer'); ?>" target="_blank" class="nbd-social" id="nbd-pinterest" title="Pinterest">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <title>pinterest</title>
                    <path fill="#bd081c" d="M12 0c-6.627 0-12 5.373-12 12 0 5.085 3.162 9.428 7.626 11.175-0.105-0.949-0.2-2.406 0.042-3.442 0.219-0.938 1.407-5.965 1.407-5.965s-0.36-0.72-0.36-1.782c0-1.665 0.969-2.915 2.172-2.915 1.024 0 1.518 0.769 1.518 1.69 0 1.031-0.654 2.569-0.993 3.996-0.285 1.196 0.6 2.168 1.777 2.168 2.13 0 3.771-2.247 3.771-5.493 0-2.865-2.064-4.875-5.013-4.875-3.414 0-5.415 2.565-5.415 5.205 0 1.035 0.394 2.145 0.889 2.745 0.099 0.12 0.112 0.225 0.086 0.345-0.090 0.375-0.294 1.2-0.335 1.365-0.053 0.225-0.172 0.27-0.402 0.165-1.497-0.692-2.436-2.881-2.436-4.652 0-3.78 2.751-7.26 7.931-7.26 4.161 0 7.398 2.97 7.398 6.93 0 4.14-2.61 7.47-6.24 7.47-1.215 0-2.355-0.63-2.76-1.38l-0.75 2.85c-0.27 1.047-1.005 2.355-1.5 3.15 1.125 0.345 2.31 0.535 3.555 0.535 6.615 0 12-5.37 12-12s-5.385-12-12-12z"></path>
                </svg>        
            </a>
            <a href="#" data-href="https://web.skype.com/share?url=" target="_blank" class="nbd-social" title="Skype">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <title>skype</title>
                    <path fill="#00aff0" d="M12.053 18.9c-4.028 0-5.827-1.983-5.827-3.47 0-0.765 0.561-1.297 1.335-1.297 1.725 0 1.275 2.479 4.492 2.479 1.644 0 2.554-0.895 2.554-1.812 0-0.552-0.27-1.163-1.356-1.431l-3.581-0.896c-2.885-0.724-3.408-2.289-3.408-3.756 0-3.051 2.865-4.197 5.556-4.197 2.475 0 5.4 1.374 5.4 3.204 0 0.784-0.69 1.24-1.455 1.24-1.47 0-1.2-2.040-4.17-2.040-1.47 0-2.295 0.666-2.295 1.62s1.155 1.26 2.16 1.49l2.64 0.588c2.895 0.649 3.63 2.349 3.63 3.95 0 2.478-1.905 4.329-5.73 4.329zM23.098 14.011l-0.030 0.135-0.045-0.24c0.015 0.045 0.045 0.075 0.060 0.12 0.12-0.675 0.18-1.365 0.18-2.055 0-1.53-0.3-3.015-0.9-4.425-0.57-1.35-1.395-2.565-2.43-3.6-1.050-1.035-2.25-1.86-3.6-2.43-1.319-0.632-2.803-0.931-4.334-0.931-0.72 0-1.446 0.071-2.145 0.206l0.12 0.060-0.24-0.034 0.12-0.024c-0.964-0.518-2.047-0.792-3.147-0.792-1.791 0-3.476 0.699-4.743 1.97s-1.965 2.96-1.965 4.755c0 1.144 0.292 2.268 0.844 3.263l0.019-0.125 0.042 0.24-0.060-0.115c-0.114 0.645-0.172 1.3-0.172 1.957 0 1.533 0.3 3.021 0.885 4.422 0.57 1.365 1.38 2.58 2.43 3.615 1.035 1.050 2.25 1.86 3.6 2.445 1.395 0.6 2.88 0.9 4.41 0.9 0.66 0 1.335-0.060 1.98-0.18l-0.12-0.060 0.24 0.045-0.135 0.030c1.005 0.57 2.13 0.87 3.3 0.87 1.785 0 3.465-0.69 4.74-1.965 1.26-1.26 1.965-2.955 1.965-4.755 0-1.14-0.3-2.265-0.855-3.27z"></path>
                </svg>          
            </a>             
        </p>
    <?php endif; ?>
    </div>    
    <div id="nbdesigner_frontend_area"></div>
    <h4 id="nbdesigner-upload-title" style="display: none;"><?php _e('Upload file', 'web-to-print-online-designer'); ?></h4>
    <div id="nbdesigner_upload_preview" style="margin-bottom: 15px;"></div>
    <?php if($extra_price != ''): ?>
    <p><?php _e('Extra price for design', 'web-to-print-online-designer'); ?> + <?php echo $extra_price; ?></p>
    <?php endif; ?>
</div>
<div style="position: fixed; top: 0; left: 0; z-index: 999999; opacity: 0; width: 100%; height: 100%;" id="container-online-designer">
    <iframe id="onlinedesigner-designer"  width="100%" height="100%" scrolling="no" frameborder="0" noresize="noresize" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" src="<?php echo $src; ?>"></iframe>
    <span id="closeFrameDesign"  class="nbdesigner_pp_close">&times;</span>
</div>
<style>
    .nbd-save-for-later {
        border: 1px solid #ddd !important;
        background: #fff !important;
        color: #333333 !important;
        padding: 1em 2em;
        font-weight: bold;
        font-size: 0.875rem;
        line-height: 1em;  
        border-radius: 2em;
    }
    a.nbd-save-for-later svg {
        display: none;
        margin-right: 10px;
    }
    a.nbd-save-for-later:focus {
        outline: none;
    }
    a.nbd-save-for-later.saved {
        pointer-events: none;
    }
    .nbd-social {
        width: 36px;
        height: 36px;
        display: inline-block;
        padding: 5px;
        border: 1px solid #ddd;
        margin: 0px;
        opacity: 0.8;
        -webkit-transition: all 0.4s;
        -moz-transition: all 0.4s;
        transition: all 0.4s;
        background: #fff;
        cursor: pointer;
    }    
    .nbd-save-loading, .nbd-pdf-loading {
        display: inline-block;
        margin-right: 10px;
        vertical-align: middle;
    }
    .nbd-save-loading.hide, .nbd-pdf-loading.hide {
        display: none;
    }
    #nbdesigner-preview-title {
        margin-top: 15px;
    }
</style>
<script>
    var nbd_create_own_page = "<?php echo getUrlPageNBD('create') ?>";    
</script>