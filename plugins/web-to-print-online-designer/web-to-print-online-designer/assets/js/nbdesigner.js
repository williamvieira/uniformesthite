jQuery(document).ready(function () {
    if( jQuery('#triggerDesign').length > 0 && nbds_frontend.hide_cart_button == 'yes'){
        jQuery('button[type="submit"].single_add_to_cart_button').hide();
    };
    var width = jQuery(window).innerWidth();
    var height = jQuery(window).height();
    var w = -width;
    var h = -height;
    var showDesignFrame = function(){
        jQuery('#container-online-designer').addClass('show');
        jQuery('#container-online-designer').stop().animate({
            top: 0,
            opacity: 1,
            bottom: 0
        }, 500);        
    };
    jQuery('#container-online-designer').css({'width': width, 'height': height, 'top': h, 'opacity': 0, 'bottom': 0});
    jQuery('#triggerDesign').on('click', function () {
        showDesignFrame();
    });
    jQuery('#closeFrameDesign').on('click', function () {
        hideDesignFrame();
    });
    hideDesignFrame = function (mes) {
        var _h = -jQuery(window).height();
        jQuery('#container-online-designer').stop().animate({
            top: _h,
            opacity: 0
        }, 500);
        if (mes != null) {
            setTimeout(function () {
                alert(mes);
            }, 700);
        }
    };
    show_upload_thumb = function( arr ){
        jQuery('#nbdesigner-upload-title').show();     
        var html = '';
        var d = new Date();
        jQuery.each(arr, function (key, val) {
            html += '<div class="img-con" style=\"display: inline-block; margin-right: 15px;\"><img src="' + val.src + '?t=' + d.getTime() +'" style=\"width: 100px;\"/><p class="nbd-file-title">'+val.name+'</p></div>'
        });
        jQuery('#nbdesigner_upload_preview').html('').append(html);         
    }
    jQuery('#nbdesign-new-template').on('click', function(){
        showDesignFrame();
    });
    jQuery(window).on('resize', function () {
        var width = jQuery(window).width(),
                height = jQuery(window).height();
        jQuery('#container-online-designer').css({'width': width, 'height': height});
    });    
});
var share_image_url = '';
var NBDESIGNERPRODUCT = {
    save_for_later: function(){
        jQuery('img.nbd-save-loading').removeClass('hide');
        jQuery.ajax({
            url: nbds_frontend.url,
            method: "POST",
            data: {
                action   :    'nbd_save_for_later',
                product_id :   NBDESIGNERPRODUCT.product_id,
                variation_id :   NBDESIGNERPRODUCT.variation_id,
                folder: NBDESIGNERPRODUCT.folder,
                nonce: nbds_frontend.nonce
            }            
        }).done(function(data){
            if( data.flag == 1 ){
                jQuery('img.nbd-save-loading').addClass('hide');
                jQuery('a.nbd-save-for-later').addClass('saved');
                jQuery('a.nbd-save-for-later svg').show();
                
                jQuery.each( jQuery('#nbd-share-group a'), function(){
                    var d = new Date();
                    var href = jQuery(this).attr('data-href');
                    var share_url =nbd_create_own_page + '?product_id=' + NBDESIGNERPRODUCT.product_id + '&variation_id=' + NBDESIGNERPRODUCT.variation_id + '&reference=' + data.folder + '&nbd_share_id=' + data.folder + '&t=' + d.getTime();
                    var _href = href + encodeURIComponent(share_url);
                    if( jQuery(this).attr('id') == 'nbd-pinterest' ) _href += '&media=' + encodeURIComponent(share_image_url) + '&description=' + jQuery(this).attr('data-description');
                    if( jQuery(this).attr('data-text') != undefined ) _href += '&text=' + jQuery(this).attr('data-text');
                    jQuery(this).attr('href', _href);
                });	                
            }else{
                alert('Opps! Error while save design!');
            };
        });        
    },
    download_pdf: function(){
        jQuery('img.nbd-pdf-loading').removeClass('hide');
        jQuery.ajax({
            url: nbds_frontend.url,
            method: "POST",
            data: {
                action   :    'nbd_frontend_download_pdf',
                nbd_item_key :   NBDESIGNERPRODUCT.folder,
                nonce: nbds_frontend.nonce
            }            
        }).done(function(data){
            jQuery('img.nbd-pdf-loading').addClass('hide');
            var data = JSON.parse(data);
            var filename = 'design.pdf',
            a = document.createElement('a');
            a.setAttribute('href', data[0].link);
            a.setAttribute('download', filename);
            a.click()             
        });         
    },
    insert_customer_design: function (data) {

    },
    hide_iframe_design: function () {
        var height = -jQuery(window).height();
        jQuery('#container-online-designer').removeClass('show');
        jQuery('#container-online-designer').stop().animate({
            top: height,
            opacity: 0
        }, 500);
    },
    show_design_thumbnail: function (arr, task) {
        if( jQuery('#triggerDesign').length > 0 ){
            jQuery('button[type="submit"].single_add_to_cart_button').show();
        };
        jQuery('#nbdesigner-preview-title').show();
        jQuery('#nbd-actions').show();
        jQuery('#nbdesign-new-template').show();
        if(task == 'create_template' || task == 'edit_template'){
            jQuery('#triggerDesign').text('Edit Template');
        }
        var html = '';
        var d = new Date();
        var count = 1;
        jQuery.each(arr, function (key, val) {
            if(count == 1) share_image_url = val;
            count++;
            html += '<div class="img-con"><img src="' + val + '?t=' + d.getTime() +'" /></div>'
        });
        jQuery.each( jQuery('#nbd-share-group a'), function(){
            var d = new Date();
            var href = jQuery(this).attr('data-href');
            var share_url =nbd_create_own_page + '?product_id=' + NBDESIGNERPRODUCT.product_id + '&variation_id=' + NBDESIGNERPRODUCT.variation_id + '&reference=' + NBDESIGNERPRODUCT.folder + '&nbd_share_id=' + NBDESIGNERPRODUCT.folder + '&t=' + d.getTime();
            var _href = href + encodeURIComponent(share_url);
            if( jQuery(this).attr('id') == 'nbd-pinterest' ) _href += '&media=' + encodeURIComponent(share_image_url) + '&description=' + jQuery(this).attr('data-description');
            if( jQuery(this).attr('data-text') != undefined ) _href += '&text=' + jQuery(this).attr('data-text');
            jQuery(this).attr('href', _href);
        });
        jQuery('#nbdesigner_frontend_area').html('');
        jQuery('#nbdesigner_frontend_area').append(html);
        hideDesignFrame();

        var flipbook = jQuery("[class*=real3dflipbook]:first");
        /* Integate with real3dflipbook */
        if( flipbook.length > 0 ){
            var _class = flipbook.attr('class'),
                obj = 'real3dflipbook_' + _class.substring(_class.length - 1);  
            var options = window[obj];
            var json_str = options.replace(/&quot;/g, '"');
            json_str = json_str.replace(/“/g, '"');
            json_str = json_str.replace(/”/g, '"');
            json_str = json_str.replace(/″/g, '"');
            json_str = json_str.replace(/„/g, '"');

            json_str = json_str.replace(/«&nbsp;/g, '"');
            json_str = json_str.replace(/&nbsp;»/g, '"');


            options = jQuery.parseJSON(json_str);
            options.assets = {
                preloader: options.rootFolder + "images/preloader.jpg",
                left: options.rootFolder + "images/left.png",
                overlay: options.rootFolder + "images/overlay.jpg",
                flipMp3: options.rootFolder + "mp3/turnPage.mp3",
                shadowPng: options.rootFolder + "images/shadow.png"
            };
            var pages = [];    
            jQuery.each(arr, function (key, val) {
                pages.push({
                    htmlContent: '',
                    src: val,
                    thumb: val,
                    title: key
                });
            });
            options.pages = pages;
            options.pdfjsworkerSrc = options.rootFolder + 'js/pdf.worker.min.js'
            function convertStrings(obj) {
                jQuery.each(obj, function (key, value) {
                    if (typeof (value) == 'object' || typeof (value) == 'array') {
                        convertStrings(value)
                    } else if (!isNaN(value)) {
                        if (obj[key] === "")
                            delete obj[key]
                        else
                            obj[key] = Number(value)
                    } else if (value == "true") {
                        obj[key] = true
                    } else if (value == "false") {
                        obj[key] = false
                    }
                });

            }
            convertStrings(options);
            for (var i = 0; i < options.pages.length; i++) {
                if (typeof (options.pages[i].htmlContent) != 'undefined' && options.pages[i].htmlContent != "" && options.pages[i].htmlContent != "undefined")
                    options.pages[i].htmlContent = unescape(options.pages[i].htmlContent)
                else
                    delete options.pages[i].htmlContent
            }
            options.social = [];
            if (options.facebook == "")
                delete options.facebook
            if (options.twitter == "")
                delete options.twitter
            if (options.google_plus == "")
                delete options.google_plus
            if (options.pinterest == "")
                delete options.pinterest
            if (options.email == "")
                delete options.email
            if (options.pageWidth == "")
                delete options.pageWidth
            if (options.pageHeight == "")
                delete options.pageHeight

            if (typeof (options.btnShare) == 'undefined' || !options.btnShare)
                options.btnShare = {enabled: false}
            if (typeof (options.btnNext) == 'undefined' || !options.btnNext)
                options.btnNext = {enabled: false}
            if (typeof (options.btnPrev) == 'undefined' || !options.btnPrev)
                options.btnPrev = {enabled: false}
            if (typeof (options.btnZoomIn) == 'undefined' || !options.btnZoomIn)
                options.btnZoomIn = {enabled: false}
            if (typeof (options.btnZoomOut) == 'undefined' || !options.btnZoomOut)
                options.btnZoomOut = {enabled: false}
            if (typeof (options.btnToc) == 'undefined' || !options.btnToc)
                options.btnToc = {enabled: false}
            if (typeof (options.btnThumbs) == 'undefined' || !options.btnThumbs)
                options.btnThumbs = {enabled: false}
            if (typeof (options.btnDownloadPages) == 'undefined' || !options.btnDownloadPages)
                options.btnDownloadPages = {enabled: false}
            if (typeof (options.btnDownloadPdf) == 'undefined' || !options.btnDownloadPdf)
                options.btnDownloadPdf = {enabled: false}
            if (typeof (options.btnExpand) == 'undefined' || !options.btnExpand)
                options.btnExpand = {enabled: false}
            if (typeof (options.btnExpandLightbox) == 'undefined' || !options.btnExpandLightbox)
                options.btnExpandLightbox = {enabled: false}
            if (typeof (options.btnSound) == 'undefined' || !options.btnSound)
                options.btnSound = {enabled: false}
            if (typeof (options.btnShare.icon) == 'undefined' || options.btnShare.icon == '')
                options.btnShare.icon = "fa-share";
            if (typeof (options.btnShare.title) == 'undefined' || options.btnShare.title == '')
                options.btnShare.title = "Share";

            if (typeof (options.btnNext.icon) == 'undefined' || options.btnNext.icon == '')
                options.btnNext.icon = "fa-chevron-right";
            if (typeof (options.btnNext.title) == 'undefined' || options.btnNext.title == '')
                options.btnNext.title = "Next page";

            if (typeof (options.btnPrev.icon) == 'undefined' || options.btnPrev.icon == '')
                options.btnPrev.icon = "fa-chevron-left";
            if (typeof (options.btnPrev.title) == 'undefined' || options.btnPrev.title == '')
                options.btnPrev.title = "Previous page";

            if (typeof (options.btnZoomIn.icon) == 'undefined' || options.btnZoomIn.icon == '')
                options.btnZoomIn.icon = "fa-plus";
            if (typeof (options.btnZoomIn.title) == 'undefined' || options.btnZoomIn.title == '')
                options.btnZoomIn.title = "Zoom in";

            if (typeof (options.btnZoomOut.icon) == 'undefined' || options.btnZoomOut.icon == '')
                options.btnZoomOut.icon = "fa-minus";
            if (typeof (options.btnZoomOut.title) == 'undefined' || options.btnZoomOut.title == '')
                options.btnZoomOut.title = "Zoom out";

            if (typeof (options.btnToc.icon) == 'undefined' || options.btnToc.icon == '')
                options.btnToc.icon = "fa-list-ol";
            if (typeof (options.btnToc.title) == 'undefined' || options.btnToc.title == '')
                options.btnToc.title = "Table of content";

            if (typeof (options.btnThumbs.icon) == 'undefined' || options.btnThumbs.icon == '')
                options.btnThumbs.icon = "fa-th-large";
            if (typeof (options.btnThumbs.title) == 'undefined' || options.btnThumbs.title == '')
                options.btnThumbs.title = "Pages";

            if (typeof (options.btnDownloadPages.icon) == 'undefined' || options.btnDownloadPages.icon == '')
                options.btnDownloadPages.icon = "fa-download";
            if (typeof (options.btnDownloadPages.title) == 'undefined' || options.btnDownloadPages.title == '')
                options.btnDownloadPages.title = "Download pages";
            // if(options.downloadPagesUrl)
            // options.btnDownloadPages.url = options.downloadPagesUrl;

            if (typeof (options.btnDownloadPdf.icon) == 'undefined' || options.btnDownloadPdf.icon == '')
                options.btnDownloadPdf.icon = "fa-file";
            if (typeof (options.btnDownloadPdf.title) == 'undefined' || options.btnDownloadPdf.title == '')
                options.btnDownloadPdf.title = "Download PDF";
            // if(options.downloadPdfUrl)
            // options.btnDownloadPdf.url = options.downloadPdfUrl;

            if (typeof (options.btnExpand.icon) == 'undefined' || options.btnExpand.icon == '')
                options.btnExpand.icon = "fa-expand";
            if (typeof (options.btnExpand.iconAlt) == 'undefined' || options.btnExpand.iconAlt == '')
                options.btnExpand.iconAlt = "fa-compress";
            if (typeof (options.btnExpand.title) == 'undefined' || options.btnExpand.title == '')
                options.btnExpand.title = "Toggle fullscreen";

            if (typeof (options.btnExpandLightbox.icon) == 'undefined' || options.btnExpandLightbox.icon == '')
                options.btnExpandLightbox.icon = "fa-expand";
            if (typeof (options.btnExpandLightbox.iconAlt) == 'undefined' || options.btnExpandLightbox.iconAlt == '')
                options.btnExpandLightbox.iconAlt = "fa-compress";
            if (typeof (options.btnExpandLightbox.title) == 'undefined' || options.btnExpandLightbox.title == '')
                options.btnExpandLightbox.title = "Toggle fullscreen";

            if (typeof (options.btnSound.icon) == 'undefined' || options.btnSound.icon == '')
                options.btnSound.icon = "fa-volume-up";
            if (typeof (options.btnSound.title) == 'undefined' || options.btnSound.title == '')
                options.btnSound.title = "Sound";

            if (typeof (options.viewMode) == 'undefined')
                options.viewMode = "webgl"

            if (options.btnDownloadPages.url) {
                options.btnDownloadPages.url = options.btnDownloadPages.url.replace(/\\/g, '/')
                options.btnDownloadPages.enabled = true
            } else
                options.btnDownloadPages.enabled = false

            if (options.btnDownloadPdf.url) {
                options.btnDownloadPdf.url = options.btnDownloadPdf.url.replace(/\\/g, '/')
                options.btnDownloadPdf.enabled = true
            } else
                options.btnDownloadPdf.enabled = false;


            var flipcon = jQuery('.real3dflipbook-1');
            flipcon.flipBook(options);
        }
        
    },
    nbdesigner_ready: function(){ 
        if(jQuery('input[name="variation_id"]').length > 0){
            var vid = jQuery('input[name="variation_id"]').val();
            if(vid != '' &&  parseInt(vid) > 0) {
                jQuery('#triggerDesign').removeClass('nbdesigner-disable');
            }
        }else{
            jQuery('#triggerDesign').removeClass('nbdesigner-disable');
        }
        jQuery('.nbdesigner-img-loading').hide();
    },
    nbdesigner_unready: function(){
        jQuery('#triggerDesign').addClass('nbdesigner-disable');
        jQuery('.nbdesigner-img-loading').show();
    },
    get_sugget_design: function(product_id, variation_id){
        if(!jQuery('.nbdesigner-related-product-image').length) return;
        var products = [];
        jQuery.each(jQuery('.nbdesigner-related-product-image'), function(){
            products.push(jQuery(this).attr('data-id'));
            jQuery(this).parent('.nbdesigner-related-product-item').find('.nbdesigner-overlay').addClass('open');
        });
        if( !products.length ) return;
        jQuery.ajax({
            url: nbds_frontend.url,
            method: "POST",
            data: {
                "action": "nbdesigner_get_suggest_design",
                "products": products,
                "product_id" : product_id,
                "variation_id" : variation_id,
                "nonce": nbds_frontend.nonce
            }            
        }).done(function(data){
            data = JSON.parse(data);
            jQuery.each(jQuery('.nbdesigner-related-product-image'), function(){
                if(data['flag']){
                    var href = jQuery(this).attr('href'),
                    data_id = jQuery(this).attr('data-id');
                    jQuery(this).attr('href', addParameter(href, 'nbds-ref', data['nbd_item_key'], false));       
                    jQuery(this).find('img').attr({'src' : data['images'][data_id], 'srcset' : ''});
                }
                jQuery(this).parent('.nbdesigner-related-product-item').find('.nbdesigner-overlay').removeClass('open');
            });
        });
    },
    update_nbu_value: function( arr ){
        var files = '';
        jQuery.each(arr, function (key, val) {
            files += key == 0 ? val.name : '|' + val.name;
        });
        if( jQuery('#triggerDesign').length > 0 ){
            jQuery('button[type="submit"].single_add_to_cart_button').show();
        };          
        jQuery('input[name="nbd-upload-files"]').val( files );
    },
    remove_design: function(type, cart_item_key){
        jQuery('form.woocommerce-cart-form').addClass( 'processing' ).block( {
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            }
        } );
        jQuery.ajax({
            url: nbds_frontend.url,
            method: "POST",
            data: {
                "action": "nbd_remove_cart_design",
                "type": type,
                "cart_item_key": cart_item_key,
                "nonce": nbds_frontend.nonce
            }            
        }).done(function(data){
            jQuery('form.woocommerce-cart-form').removeClass( 'processing' ).unblock();
            if(data == 'success'){
                var designSection = jQuery('#nbd' + cart_item_key),
                    uploadSection = jQuery('#nbu' + cart_item_key),
                    extraPrice = jQuery('#nbx' + cart_item_key);
                var sections =  designSection.length + uploadSection.length;
                if( type == 'custom' ) {
                    designSection.remove();
                }else {
                    uploadSection.remove();
                }
                if( sections < 2 ) {
                    extraPrice.remove();
                    /* Update cart after remove design and upload files */
                    jQuery( '.woocommerce-cart-form input[name="update_cart"]' ).prop( 'disabled', false ).trigger( 'click' );
                }
            }
        });
    },
    delete_my_design: function( e ){
        var con = confirm('Are you sure you want to delete this design?');
        if( con ){
            var sefl = jQuery(e),
            design_id = sefl.attr('data-design'),
            tr_con = sefl.parents('tr.order');
            jQuery('.container-design').addClass( 'processing' ).block( {
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.6
                }
            } );        
            jQuery.ajax({
                url: nbds_frontend.url,
                method: "POST",
                data: {
                    action   :    'nbd_delete_my_design',
                    design_id :   design_id,
                    nonce: nbds_frontend.nonce
                }            
            }).done(function(data){
                jQuery('.container-design').removeClass( 'processing' ).unblock();
                if(data.flag == 1){
                    tr_con.remove();
                    alert('Delete successfully!')
                }
            })   
        }
    },
    add_design_to_cart: function(e){
        var sefl = jQuery(e),
        design_id = sefl.attr('data-design');
        jQuery('.container-design').addClass( 'processing' ).block( {
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            }
        } );        
        jQuery.ajax({
            url: nbds_frontend.url,
            method: "POST",
            data: {
                action   :    'nbd_add_design_to_cart',
                design_id :   design_id,
                nonce: nbds_frontend.nonce
            }            
        }).done(function(data){
            jQuery('.container-design').removeClass( 'processing' ).unblock();
            if(data.flag == 1){
                window.location = nbds_frontend.cart_url;
            }else{
                alert('Opp! Try again later')
            }
        })         
    }
};
function addParameter(url, parameterName, parameterValue, atStart/*Add param before others*/) {
    var replaceDuplicates = true;
    var urlhash = '';
    if (url.indexOf('#') > 0) {
        var cl = url.indexOf('#');
        urlhash = url.substring(url.indexOf('#'), url.length);
    } else {
        urlhash = '';
        cl = url.length;
    }
    var sourceUrl = url.substring(0, cl);
    var urlParts = sourceUrl.split("?");
    var newQueryString = "";
    if (urlParts.length > 1){
        var parameters = urlParts[1].split("&");
        for (var i = 0; (i < parameters.length); i++)
        {
            var parameterParts = parameters[i].split("=");
            if (!(replaceDuplicates && parameterParts[0] == parameterName))
            {
                if (newQueryString == "")
                    newQueryString = "?";
                else
                    newQueryString += "&";
                newQueryString += parameterParts[0] + "=" + (parameterParts[1] ? parameterParts[1] : '');
            }
        }
    }
    if (newQueryString == "") newQueryString = "?";
    if (atStart) {
        newQueryString = '?' + parameterName + "=" + parameterValue + (newQueryString.length > 1 ? '&' + newQueryString.substring(1) : '');
    } else {
        if (newQueryString !== "" && newQueryString != '?')
            newQueryString += "&";
        newQueryString += parameterName + "=" + (parameterValue ? parameterValue : '');
    }
    return urlParts[0] + newQueryString + urlhash;
};

(function($, document, window) {
    var pluginName = "drystone",
        defaults = {
            item: '.grid-item',
            gutter: 10,
            xs: [576, 1],
            sm: [768, 2],
            md: [992, 2],
            lg: [1200, 3],
            xl: 3,
            onComplete: function() {}
        };
    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            this.buildCache();
            this.registerHandlers();
            this.getValues();
            this.build();
            this.options.onComplete();
        },
        buildCache: function() {
            this.$grid = $(this.element);
            this.$gridItems = this.$grid.children(this.options.item);
        },
        getValues: function() {
            this.gridWidth = this.$grid.width();
            this.numOfColumns = this.getNumOfColumns();
            this.columnWidth = this.getColumnWidth();
        },
        getNumOfColumns: function() {
            this.columns = [];
            var num = 0;
            var width = $(window).width();
            if (width < this.options.xs[0]) {
                num = this.options.xs[1];
            } else if (width < this.options.sm[0]) {
                num = this.options.sm;
            } else if (width < this.options.md[0]) {
                num = this.options.md[1];
            } else if (width < this.options.lg[0]) {
                num = this.options.lg[1];
            } else {
                num = this.options.xl;
            }
            for (let i = 0; i < num; i++) {
                this.columns.push([i, 0]);
            }

            return num;
        },
        getColumnWidth: function() {
            return parseInt((this.gridWidth - this.options.gutter * (this.numOfColumns - 1)) / this.numOfColumns);
        },
        registerHandlers: function() {
            var self = this;
            $(window).resize(function() {
                self.getValues();
                self.build();
            });
        },
        build: function() {
            var self = this;
            var currentColumn;
            self.$gridItems.each(function() {
                var item = $(this);
                item.css('position', 'absolute');
                self.$grid.css('position', 'relative');
                item.css('width', self.columnWidth);
                for (let i = 0; i < self.columns.length; i++) {
                    if (currentColumn == undefined || currentColumn[1] > self.columns[i][1]) {
                        currentColumn = self.columns[i];
                    }
                }
                if (currentColumn[0] == 0) {
                    item.css('left', currentColumn[0] * self.columnWidth);
                } else {
                    item.css('left', currentColumn[0] * self.columnWidth + self.options.gutter * currentColumn[0]);
                }
                item.css('top', currentColumn[1]);
                currentColumn[1] += item.height() + self.options.gutter;
            });
            for (let i = 0; i < self.columns.length; i++) {
                if (currentColumn[1] < self.columns[i][1]) {
                    currentColumn = self.columns[i];
                }
            }
            self.$grid.css('height', currentColumn[1] - this.options.gutter);
            self.$gridItems.css('visibility', 'visible');
        }
    };
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})(jQuery, document, window);