<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly  ?>
<div class="wrap nbdesigner ">
    <h2><?php echo __('Frontend Translate', 'web-to-print-online-designer'); ?></h2>
    <p><b><?php _e('Allow customer change language without reload page.', 'web-to-print-online-designer'); ?></b></p>
    <p><small><?php _e('(Click the phrase to edit)') ?></small></p>
    <div>
        <b><?php echo __('Choose language', 'web-to-print-online-designer'); ?></b>
        <?php if(is_array($list) && count($list) > 0): ?>
        <select id="nbdesigner-translate-code" onchange="NBDESIGNADMIN.changeLang()">
            <?php foreach ($list as $key => $l): ?>
            <option value="<?php echo $l->code; ?>" data-index="<?php echo $key; ?>"><?php echo $l->name; ?></option>
            <?php endforeach; ?>
        </select>
        <?php endif; ?>
        <a class="button nbutton-primary" onclick="NBDESIGNADMIN.saveLang(this)" data-code="en_BR" id="nbdesigner-trans-code"><?php echo __('Save Language', 'web-to-print-online-designer'); ?></a>
        <a class="button btn-primary nbdesigner-delete" onclick="NBDESIGNADMIN.deleteLang(this)" ><?php echo __('Delete Language', 'web-to-print-online-designer'); ?></a>       
        <?php add_thickbox(); ?>
        <div id="nbdesigner-new-lang" style="display:none;">
            <div id="nbdesigner-new-lang-con" class="nbdesigner-align-center">
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row" class="titledesc"><?php echo __("Choose language", 'web-to-print-online-designer'); ?></th>
                        <td class="forminp-text">
                            <select id="nbdesign-language-option" name="nbdesigner_codelang" style="padding: 0; width: auto;">
                            <?php foreach ($languages as $language): ?>
                                <option value="<?php echo $language['language']; ?>"><?php echo $language['native_name']; ?></option>
                            <?php endforeach; ?>
                            </select>    
                        </td>
                    </tr>
                    <?php wp_nonce_field($this->plugin_id.'-new-lang', $this->plugin_id . '_newlang_hidden'); ?>
                </table>
                <p>
                    <a class="button button-primary" onclick="NBDESIGNADMIN.createLang()"><?php esc_attr_e('Save') ?></a>
                    <img class="nbdesigner_loaded" id="nbdesigner_new_translate_loading" src="<?php echo NBDESIGNER_PLUGIN_URL . 'assets/images/loading.gif' ?>" />
                </p>                
            </div>
        </div>        
        <a name="<?php _e('Create new language', 'web-to-print-online-designer'); ?>" href="#TB_inline?width=300&height=160&inlineId=nbdesigner-new-lang" class="thickbox button button-primary" onclick=""><?php echo __('Add New Language', 'web-to-print-online-designer'); ?></a>   
        <img class="nbdesigner_loaded" id="nbdesigner_translate_loading" src="<?php echo NBDESIGNER_PLUGIN_URL . 'assets/images/loading.gif' ?>" />
        <input id="nbd-lang-search" class="nbd-input" placeholder="<?php _e('Search', 'web-to-print-online-designer'); ?>" />
    </div>
    <div>
        <?php if(isset($langs) && is_array($langs) && count($langs) > 0): ?>
        <ul class="nbdesigner-translate">
            <?php foreach ($langs as $key => $val): ?>
            <li><p class="click_edit" data-label="<?php echo $key;?>"><?php echo stripslashes($val);?></p></li>
            <?php endforeach; ?>            
        </ul>
        <?php endif; ?>
    </div>
</div>
<script type="text/javascript">
    jQuery('.click_edit').editable(function(value, settings) {
        return(value);
    },{ 
        submit : 'OK',
        tooltip : 'Click to edit...'
    });
    function langOk(ok){
        jQuery(ok).parent('form').parent('p').css('color', '#cc324b');
        return true;
    }    
</script>