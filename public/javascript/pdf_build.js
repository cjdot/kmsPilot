/* This has not been edited at all, so what it produces will not fit what we need right now. */

/* jshint undef:false, newcap: false, unused:false */

(function(API) {
    API.textAlign = function(txt, options, x, y) {
            options = options || {};
            // Use the options align property to specify desired text alignment
            // Param x will be ignored if desired text alignment is 'center'.
            // Usage of options can easily extend the function to apply different text
            // styles and sizes

            // Get current font size
            var fontSize = this.internal.getFontSize();

            // Get page width
            var pageWidth = this.internal.pageSize.width;

            // Get the actual text's width
            // You multiply the unit width of your string by your font size and divide
            // by the internal scale factor. The division is necessary
            // for the case where you use units other than 'pt' in the constructor
            // of jsPDF.

            var txtWidth = this.getStringUnitWidth(txt) * fontSize / this.internal.scaleFactor;

            if (options.align === "center") {

                    // Calculate text's x coordinate
                    x = (pageWidth - txtWidth) / 2;

            } else if (options.align === "centerAtX") { // center on X value

                    x = x - (txtWidth / 2);

            } else if (options.align === "right") {

                    x = x - txtWidth;
            }

            // Draw text at x,y
            this.text(txt, x, y);
    };
    /*
        API.textWidth = function(txt) {
            var fontSize = this.internal.getFontSize();
            return this.getStringUnitWidth(txt)*fontSize / this.internal.scaleFactor;
        };
    */

    API.getLineHeight = function(txt) {
            return this.internal.getLineHeight();
    };

})(jsPDF.API);

(function() {
    "use strict";

    // some variables
    var agency_logo = {
                src: 'public/images/kms.jpg',
                w: 800,
                h: 285
            },
            agency_name = 'KMS',
            agency_site_url = 'www.kempmanagementsolutions.net',
            footer = agency_name + ' - ' + agency_site_url,

            page_size = 'a4',
            page_width = 210, // mm
            page_margin = 10, // mm
            content_width = page_width - (page_margin * 2), // available width for the content

            _y, _x, // drawing coord
            color_array, _string, lineHeight, y_correction, // some variables

            vspace = 10 // standard vertical space between elements

    ;

    // some variables
    var can_display_preview = true, // if true a preview of the PDF can be displayed in the iframe,
            // this value is set to false if the browser can't display the preview
            preview_container = $('#pdf_preview'),
            update_preview_button = $('#flyer_preview_btn'),
            download_button = $('#flyer_download_btn');

    // preview can be displayed?
    if (navigator.msSaveBlob) { // older IE
            update_preview_button.prop('disabled', true);
            can_display_preview = false;
            preview_container.replaceWith(
                    '<div class="no_iframe">' +
                    '<div>' +
                    "The preview can't be displayed" +
                    '</div>' +
                    '</div>'
            );
    }

    // utilities
    var hex2rgb = function(hex_string) {
                    if (/^#/.test(hex_string)) {
                            hex_string = hex_string.substr(1);
                    }
                    if (hex_string.length === 3) {
                            hex_string = hex_string.replace(/\w/, function(match) {
                                    return String(match) + String(match);
                            });
                    }

                    return {
                            red: parseInt(hex_string.substr(0, 2), 16),
                            green: parseInt(hex_string.substr(2, 2), 16),
                            blue: parseInt(hex_string.substr(4, 2), 16)
                    };
            },

            px2mm = function(pixel) {
                    // px to inches
                    var inches = pixel / 72;
                    return inches * 25.4;
            },

            mm2px = function(millimeters) {
                    // mm to inches
                    var inches = millimeters / 25.4;
                    return inches * 72;
            },

            // function to calculate and check img sizes
            imgSizes = function(img_w, img_h, img_mm_w) {
                    /*
        img_w and img_h represent the original image size, in pixel
        img_mm_w is the desidered rendered image size, in millimeters
    */

                    if (img_mm_w > content_width) { // this should be never used...
                            img_mm_w = content_width;
                    }

                    if (mm2px(img_mm_w) > img_w) {
                            throw 'The `img_mm_w` parameter is too big';
                    }

                    var img_mm_h = Math.round((px2mm(img_h) * img_mm_w) / px2mm(img_w));

                    return {
                            w: img_mm_w,
                            h: img_mm_h,
                            centered_x: (page_width - img_mm_w) / 2
                    };
            };

    try {

            var flyer_img = $('#flyer-image'),
                    img_data = null;

            $('#flyer-image').change(function() {

                    // temporary disabling buttons while parsing image
                    update_preview_button.prop('disabled', true);
                    download_button.prop('disabled', true);

                    /*
            getting the file
            flyer_img[0] : transforms the jQuery reference to a DOM object
            files[0]     : refers to the file the the user has chosen
            use `console.log(user_file);` to show some info about the file
        */

                    var user_file = flyer_img[0].files[0];

                    img_data = {
                            type: user_file.type === 'image/jpeg' ? 'JPEG' : 'PNG' // maybe you should add some controls to prevent loading of other file types
                    };

                    var reader = new FileReader();
                    reader.onload = function(event) {
                            img_data.src = event.target.result;

                            // we need this to get img dimensions
                            var user_img = new Image();
                            user_img.onload = function() {
                                    img_data.w = user_img.width;
                                    img_data.h = user_img.height;

                                    // restoring buttons
                                    download_button.prop('disabled', false);
                                    if (can_display_preview) {
                                            update_preview_button.prop('disabled', false);
                                    }
                            };
                            user_img.src = img_data.src;
                    };

                    //when the file is read it triggers the onload event above.
                    reader.readAsDataURL(user_file);
            });

            //!pdf builder
            var createPDF = function(update_preview) {
                    /*
            update_preview:
                ==> true: shows pdf online
                ==> false: downloads the pdf
        */

                    _y = page_margin; // vertical starting point

                    // form data
                    var flyer_title = $('#flyer-title').val(),
                            flyer_title_size = $('#flyer-title-size').val(),
                            flyer_title_color = $('#flyer-title-color').val(),
                            flyer_description = $('#flyer-description').val(),
                            flyer_price = $('#flyer-price').val(),
                            flyer_price_currency = $('#flyer-price-currency').val(),
                            flyer_price_color = $('#flyer-price-color').val();

                    var pdf = new jsPDF('p', 'mm', page_size),
                            text_baseline,

                            // some colors:
                            light_grey = 237,
                            grey = 128,
                            black = 0,
                            white = 255;

                    // Optional - set properties of the document
                    pdf.setProperties({
                            title: flyer_title,
                            subject: footer,
                            author: 'me',
                            creator: 'Flyer Builder & jsPDF'
                    });

                    // !logo
                    var logo_sizes = imgSizes(agency_logo.w, agency_logo.h, 60);
                    pdf.addImage(agency_logo.src, 'PNG', logo_sizes.centered_x, _y, logo_sizes.w, logo_sizes.h);

                    // fonts initializing
                    pdf.setFont("helvetica");
                    pdf.setFontType("bold");

                    // !main title
                    color_array = hex2rgb(flyer_title_color);
                    pdf.setTextColor(color_array.red, color_array.green, color_array.blue);

                    pdf.setFontSize(flyer_title_size);

                    lineHeight = px2mm(pdf.getLineHeight(flyer_title));

                    _y += (logo_sizes.h + vspace + lineHeight);

                    pdf.textAlign(flyer_title, {
                            align: "center"
                    }, 0, _y);

                    _y += vspace;

                    // !user image
                    if (img_data) {
                            var img_sizes = imgSizes(img_data.w, img_data.h, content_width);
                            pdf.addImage(img_data.src, img_data.type, img_sizes.centered_x, _y, img_sizes.w, img_sizes.h);
                            _y += img_sizes.h;

                    } else {
                            // if we haven't an image, a grey box with a text is added

                            var box_height = 80;

                            pdf.setFillColor(light_grey);
                            pdf.roundedRect(page_margin, _y, content_width, box_height, 5, 5, 'F');
                            pdf.setFontSize(60);
                            pdf.setTextColor(white);
                            _string = 'SPECIAL OFFER';
                            lineHeight = px2mm(pdf.getLineHeight(_string));

                            // y_correction: value to be added to y coord of the grey box to have text vertically centered
                            // it is empirically calculated adding 1/3 of text line height to half box height
                            y_correction = box_height / 2 + lineHeight / 3;

                            pdf.textAlign(_string, {
                                    align: "center"
                            }, 0, _y + y_correction);

                            _y += box_height;
                    }

                    // !price
                    // first: creating a circle that overlaps the bottom side of the image
                    var circle_radius = 30;
                    color_array = hex2rgb(flyer_price_color);
                    pdf.setFillColor(color_array.red, color_array.green, color_array.blue);

                    // _x and _y refer to center of the circle
                    _x = content_width - circle_radius; // circle ends at `page_margin` millimeters from the image right side

                    pdf.circle(_x, _y, circle_radius, 'F'); // circle overlaps image for 1/2 of its height

                    pdf.setFontSize(60);
                    pdf.setFont("times");
                    pdf.setFontType("bold");

                    _string = flyer_price_currency + parseInt(flyer_price); // decimals are removed

                    lineHeight = px2mm(pdf.getLineHeight(_string));
                    y_correction = lineHeight / 3;

                    pdf.setTextColor(white);
                    pdf.textAlign(_string, {
                            align: "centerAtX"
                    }, _x, _y + y_correction);

                    // !description
                    if (flyer_description) {
                            pdf.setFontSize(20);
                            pdf.setFont("helvetica");
                            pdf.setFontType("italic");
                            pdf.setTextColor(grey);

                            var lineWidth = content_width - (circle_radius * 2) - (page_margin * 2);
                            _y += page_margin;

                            var line_height = 12; // mm

                            var description_lines = pdf.splitTextToSize(flyer_description, lineWidth);
                            //pdf.text(page_margin, _y, description_lines); // doesn't allows to change line spacing

                            for (var i = 0; i < description_lines.length; i++) {
                                    pdf.text(page_margin, _y, description_lines[i]);
                                    _y += line_height;
                            }

                    }

                    // !footer
                    _y = 287;
                    pdf.setFontSize(9);
                    pdf.setFontType("normal");
                    pdf.setTextColor(black);
                    pdf.textAlign(footer, {
                            align: "center"
                    }, 0, _y);

                    // ****************************
                    // output
                    if (update_preview) {
                            preview_container.attr('src', pdf.output('datauristring'));
                    } else {
                            pdf.save('flyer ' + flyer_title + '.pdf');
                    }

            }; // end createPDF

            // !buttons
            update_preview_button.click(function() {
                    createPDF(true);
            });

            $('#flyer_download_btn').click(function() {
                    createPDF(false);
            });

    } catch (e) {
            console.log(e);
    }

})();