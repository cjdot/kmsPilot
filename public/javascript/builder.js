/* This is a backup of the script that generates PDFs */
/* jshint undef:false, newcap: false, unused:false */

(function(API){
    API.textAlign = function(txt, options, x, y) {
        options = options ||{};

		// Get current font size
        var fontSize = this.internal.getFontSize();

        // Get page width
        var pageWidth = this.internal.pageSize.width;

        var txtWidth = this.getStringUnitWidth(txt)*fontSize/this.internal.scaleFactor;

        if( options.align === "center" ){

            // Calculate text's x coordinate
            x = ( pageWidth - txtWidth ) / 2;

        } else if( options.align === "centerAtX" ){ // center on X value

	        x = x - (txtWidth/2);

        } else if(options.align === "right") {

	        x = x - txtWidth;
        }

        // Draw text at x,y
        this.text(txt,x,y);
    };

    API.getLineHeight = function(txt) {
        return this.internal.getLineHeight();
    };

})(jsPDF.API);

(function() {
	"use strict";

	// some variables
	var agency_logo		 = {
			src : 'data:image/jpeg;base64,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',
		},

		footer           = 'KMS - www.kempmanagementsolutions.net',
		page_size        = 'a4',
		page_width       = 210, // mm
		page_margin      = 10,  // mm
		content_width    = page_width - (page_margin * 2), // available width for the content

		_y, _x, // drawing coord
		color_array, _string, lineHeight, y_correction, // some variables

		vspace = 10 // standard vertical space between elements

	;

	// some variables
	var can_display_preview    = true, // if true a preview of the PDF can be displayed in the iframe,
									   // this value is set to false if the browser can't display the preview
		preview_container      = $('#pdf_preview'),
		update_preview_button  = $('#flyer_preview_btn'),
		download_button        = $('#flyer_download_btn')
	;

	// preview can be displayed?
	if (navigator.msSaveBlob) { // older IE
		update_preview_button.prop('disabled', true);
		can_display_preview = false;
		preview_container.replaceWith(
			'<div class="no_iframe">'+
				'<div>'+
					"The preview can't be displayed"+
				'</div>'+
			'</div>'
		);
	}

	// utilities
	var hex2rgb = function ( hex_string ) {
		if( /^#/.test(hex_string)) {
			hex_string = hex_string.substr(1);
		}
		if(hex_string.length === 3 ) {
			hex_string = hex_string.replace(/\w/, function(match) {
		        return String(match) + String(match);
		    });
		}

		return {
			red      : parseInt(hex_string.substr(0, 2), 16),
			green    : parseInt(hex_string.substr(2, 2), 16),
			blue     : parseInt(hex_string.substr(4, 2), 16)
		};
	},

	px2mm = function (pixel) {
		// px to inches
		var inches = pixel / 72;
		return inches * 25.4;
	},

	mm2px = function (millimeters) {
		// mm to inches
		var inches = millimeters / 25.4;
		return inches * 72;
	},

	// function to calculate and check img sizes
	imgSizes = function (img_w, img_h, img_mm_w) {
		/*
			img_w and img_h represent the original image size, in pixel
			img_mm_w is the desidered rendered image size, in millimeters

		*/

		if( img_mm_w > content_width ) { // this should be never used...
			img_mm_w = content_width;
		}

		if(mm2px (img_mm_w) > img_w ) {
			throw 'The `img_mm_w` parameter is too big';
		}

		var img_mm_h = Math.round( (px2mm(img_h) * img_mm_w) / px2mm(img_w) );

		return {
			w            : img_mm_w,
			h            : img_mm_h,
			centered_x   : (page_width - img_mm_w) / 2
		};
	};

	try {

		//Client Logo Check
		var flyer_img = $('#flyer-image'),
			img_data = null
		;

		$('#flyer-image').change(function () {

			// temporary disabling buttons while parsing image
			update_preview_button.prop('disabled', true);
			download_button.prop('disabled', true);

			var user_file = flyer_img[0].files[0];

			img_data = {
				type: user_file.type === 'image/jpeg' ? 'JPEG' : 'PNG' // maybe you should add some controls to prevent loading of other file types
			};

			var reader = new FileReader();
			reader.onload = function(event){
				img_data.src = event.target.result;

				// we need this to get img dimensions
				var user_img = new Image();
				user_img.onload = function () {
					img_data.w = user_img.width;
					img_data.h = user_img.height;

					// restoring buttons
					download_button.prop('disabled', false);
					if(can_display_preview) { update_preview_button.prop('disabled', false); }
				};
				user_img.src = img_data.src;
			};

			//when the file is read it triggers the onload event above.
			reader.readAsDataURL(user_file);
		});

		//Quality Image 1 Check
        var q1_img = $('#flyer-quality1'),
            q1_data = null
        ;

        $('#flyer-quality1').change(function () {

            var q1_file = q1_img[0].files[0];

            q1_data = {
                type: q1_file.type === 'image/jpeg' ? 'JPEG' : 'PNG'
            };

            var q1_reader = new FileReader();
            q1_reader.onload = function(event){
            q1_data.src = event.target.result;
            };

            //when the file is read it triggers the onload event above.
            q1_reader.readAsDataURL(q1_file);
    	});

		//Quality Image 2 Check
        var q2_img = $('#flyer-quality2'),
            q2_data = null
        ;

        $('#flyer-quality2').change(function () {

            var q2_file = q2_img[0].files[0];

            q2_data = {
                type: q2_file.type === 'image/jpeg' ? 'JPEG' : 'PNG'
            };

            var q2_reader = new FileReader();
            q2_reader.onload = function(event){
            q2_data.src = event.target.result;
            };

            //when the file is read it triggers the onload event above.
            q2_reader.readAsDataURL(q2_file);
        });

		//Quality Image 3 Check
        var q3_img = $('#flyer-quality3'),
            q3_data = null
        ;

        $('#flyer-quality3').change(function () {

            var q3_file = q3_img[0].files[0];

            q3_data = {
                type: q3_file.type === 'image/jpeg' ? 'JPEG' : 'PNG'
            };

            var q3_reader = new FileReader();
            q3_reader.onload = function(event){
            q3_data.src = event.target.result;
            };

            //when the file is read it triggers the onload event above.
            q3_reader.readAsDataURL(q3_file);
        });

		//Quality Image 4 Check
        var q4_img = $('#flyer-quality4'),
            q4_data = null
        ;

        $('#flyer-quality4').change(function () {

            var q4_file = q4_img[0].files[0];

            q4_data = {
                type: q4_file.type === 'image/jpeg' ? 'JPEG' : 'PNG'
            };

            var q4_reader = new FileReader();
            q4_reader.onload = function(event){
            q4_data.src = event.target.result;
            };

            //when the file is read it triggers the onload event above.
            q4_reader.readAsDataURL(q4_file);
        });

		//Quality Image 5 Check
        var q5_img = $('#flyer-quality5'),
            q5_data = null
        ;

        $('#flyer-quality5').change(function () {

            var q5_file = q5_img[0].files[0];

            q5_data = {
                type: q5_file.type === 'image/jpeg' ? 'JPEG' : 'PNG'
            };

            var q5_reader = new FileReader();
            q5_reader.onload = function(event){
            q5_data.src = event.target.result;
            };

            //when the file is read it triggers the onload event above.
            q5_reader.readAsDataURL(q5_file);
        });

        //Quality Image 6 Check
        var q6_img = $('#flyer-quality6'),
            q6_data = null
        ;

        $('#flyer-quality6').change(function () {

            var q6_file = q6_img[0].files[0];

            q6_data = {
                type: q6_file.type === 'image/jpeg' ? 'JPEG' : 'PNG'
            };

            var q6_reader = new FileReader();
            q6_reader.onload = function(event){
            q6_data.src = event.target.result;
            };

            //when the file is read it triggers the onload event above.
            q6_reader.readAsDataURL(q6_file);
        });

        //Quality Image 7 Check
        var q7_img = $('#flyer-quality7'),
            q7_data = null
        ;

        $('#flyer-quality7').change(function () {

            var q7_file = q7_img[0].files[0];

            q7_data = {
                type: q7_file.type === 'image/jpeg' ? 'JPEG' : 'PNG'
            };

            var q7_reader = new FileReader();
            q7_reader.onload = function(event){
            q7_data.src = event.target.result;
            };

            //when the file is read it triggers the onload event above.
            q7_reader.readAsDataURL(q7_file);
        });

        //Quality Image 8 Check
        var q8_img = $('#flyer-quality8'),
            q8_data = null
        ;

        $('#flyer-quality8').change(function () {

            var q8_file = q8_img[0].files[0];

            q8_data = {
                type: q8_file.type === 'image/jpeg' ? 'JPEG' : 'PNG'
            };

            var q8_reader = new FileReader();
            q8_reader.onload = function(event){
            q8_data.src = event.target.result;
            };

            //when the file is read it triggers the onload event above.
            q8_reader.readAsDataURL(q8_file);
        });


		//!pdf builder
		var createPDF = function (update_preview) {

			_y = page_margin; // vertical starting point

			// form data
			var flyer_title             = 'Client Report',
				flyer_title_size        = 20,
				flyer_description       = $('#flyer-description').val(),
				flyer_price_color       = '#8fe9ea',

				//Our variables
				//flyer_projectid			=$('#flyer-projectid').val(),
				flyer_quality			=$('#flyer-quality').val(),
				flyer_quality1			=$('#flyer-quality1').val(),
				flyer_quality2			=$('#flyer-quality2').val(),
				flyer_quality3			=$('#flyer-quality3').val(),
				flyer_quality4			=$('#flyer-quality4').val(),
				flyer_quality5			=$('#flyer-quality5').val(),
				flyer_quality6			=$('#flyer-quality6').val(),
				flyer_quality7			=$('#flyer-quality7').val(),
				flyer_quality8			=$('#flyer-quality8').val(),
				q1_caption				=$('#Q1_c').val(),
				q2_caption				=$('#Q2_c').val(),
				q3_caption				=$('#Q3_c').val(),
				q4_caption				=$('#Q4_c').val(),
				q5_caption				=$('#Q5_c').val(),
				q6_caption				=$('#Q6_c').val(),
				q7_caption				=$('#Q7_c').val(),
				q8_caption				=$('#Q8_c').val(),
				flyer_quality_notes		=$('#flyer-quality-notes').val(),

				test_table				=$("#table")[0],
				logo_data 				= {w : 15, h : 25, x : 185, y : 10};
			;

			var pdf = new jsPDF('p', 'mm', page_size),
				text_baseline,

				// some colors:
				light_grey = 237,
				grey       = 128,
				black      = 0,
				white 	   = 255
			;

			function makeHeader(text) {
				_y = 0;
				pdf.setTextColor(black);
				pdf.setFontSize(flyer_title_size);
				pdf.setFontType("bold");

				lineHeight = px2mm(pdf.getLineHeight(flyer_title));
				_y += (vspace + lineHeight) + page_margin;

				pdf.textAlign(text, {align: "center"}, 0, _y);
				pdf.addImage(agency_logo.src, 'JPG', logo_data.x, logo_data.y, logo_data.w, logo_data.h);
			};

			function makeFooter() {
				pdf.setFontSize(9);
				pdf.setFontType("normal");
				pdf.setTextColor(black);
				pdf.textAlign(footer, {align: "center"}, 0, 287);
			};

			function makeCaption(text, xpos, ypos) {
				pdf.setFontSize(10);
				pdf.setFont("helvetica");
				pdf.setFontType("normal");
				pdf.setTextColor(black);

				var lineWidth = 95;

				var line_height = 3; // mm

				var caption_lines = pdf.splitTextToSize(text, lineWidth);

				for (var i = 0 ; i < caption_lines.length ; i++ ) {
					pdf.text(xpos, ypos, caption_lines[i]);
					ypos += line_height;
				}

				pdf.setFontSize(12);
			};

			function makeQualityNotes(ypos) {
				pdf.setFontSize(12);
				pdf.setFont("helvetica");
				pdf.setFontType("normal");
				pdf.setTextColor(black);

				var lineWidth = 190;

				var line_height = 7; // mm

				var qnote_lines = pdf.splitTextToSize('     ' + flyer_quality_notes, lineWidth);

				for (var i = 0 ; i < qnote_lines.length ; i++ ) {
					pdf.text(page_margin, ypos, qnote_lines[i]);
					ypos += line_height;
				}
			};

			// Optional - set properties of the document
			pdf.setProperties({
				title   : flyer_title,
				subject : footer,
				author  : 'me',
				creator : 'jsPDF'
			});

			// !kmslogo
			pdf.addImage(agency_logo.src, 'JPG', logo_data.x, logo_data.y, logo_data.w, logo_data.h);

			// !clientlogo
			if(img_data) {
				var img_sizes = imgSizes (img_data.w, img_data.h, content_width);
				pdf.addImage(img_data.src, img_data.type, 10, 10, 50, 15);

			} else {
				pdf.setFillColor(light_grey);
				pdf.roundedRect(10, 10, 50, 15, 1, 1, 'F');
				
				_string = 'No Logo';

				pdf.setFontSize(20);
				pdf.setFont("helvetica");
				pdf.setFontType("bold");

				lineHeight = px2mm(pdf.getLineHeight(_string));
				y_correction = lineHeight/3;

				pdf.setTextColor(white);
				pdf.textAlign(_string, {align: "centerAtX"}, 35, 17 + y_correction );
			}

			// fonts initializing
			pdf.setFont("helvetica");
			pdf.setFontType("bold");

			// Get radio  and time values
			var frequency = document.querySelector('input[name="freq"]:checked').value;
			var date = new Date();
			var gen_date = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

			// !Header
			pdf.setTextColor(black);
			pdf.setFontSize(15);
			pdf.textAlign('Client Company', {align: "center"}, 0, _y += 5);
			pdf.textAlign(frequency + ' Project Summary Report', {align: "center"}, 0, _y += 5);
			pdf.textAlign(gen_date, {align: "center"}, 0, _y += 5);

			// !Execuve Summary Header
			pdf.setTextColor(black);
			pdf.setFontSize(flyer_title_size);
			pdf.setFont("helvetica");
			pdf.setFontType("bold");

			lineHeight = px2mm(pdf.getLineHeight(flyer_title));
			_y = 45;

			pdf.textAlign('Executive Summary', {align: "center"}, 0, _y);

			// !description / executive summary
			if(flyer_description) {
				pdf.setFontSize(12);
				pdf.setFont("helvetica");
				pdf.setFontType("normal");
				pdf.setTextColor(black);

				var lineWidth = 190;
				_y += page_margin;

				var line_height = 7; // mm

				var description_lines = pdf.splitTextToSize('     ' + flyer_description, lineWidth);

				for (var i = 0 ; i < description_lines.length ; i++ ) {
					pdf.text(page_margin, _y, description_lines[i]);
					_y += line_height;
				}
			}

			// !Schedule Recap Header
			_y = _y - line_height;
			pdf.setFontSize(flyer_title_size);
			pdf.setFontType("bold");

			lineHeight = px2mm(pdf.getLineHeight(flyer_title));
			_y += (vspace + lineHeight);

			pdf.textAlign('Schedule Recap', {align: "center"}, 0, _y);

			makeFooter();
			pdf.addPage(); //Page 2

			// !Quality
			makeHeader('Quality');

			if (flyer_quality) {
				pdf.setFontSize(12);
				pdf.setFont("helvetica");
				pdf.setFontType("normal");
				pdf.setTextColor(black);

				lineWidth = 190;
				_y = 45;
				line_height = 7; // mm
				var quality_lines = pdf.splitTextToSize('     ' + flyer_quality, lineWidth);

				for (var i = 0 ; i < quality_lines.length ; i++ ) {
					pdf.text(page_margin, _y, quality_lines[i]);
					_y += line_height;
				}
			}

			// !Universal content image sizes
			var content_img_w = 95;
			var content_img_h = 65;

			if(_y > 287 - content_img_h) {
				pdf.addPage();
				_y = 0;
				pdf.setFontSize(flyer_title_size);
				pdf.setFontType("bold");
				lineHeight = px2mm(pdf.getLineHeight(flyer_title));
				_y += (vspace + lineHeight);
				pdf.textAlign('Quality (Continued)', {align: "center"}, 0, _y);
				y += page_margin;
			}

			pdf.setFontSize(10);

			// !Quality Images
			if(q1_data) {
				pdf.addImage(q1_data.src, q1_data.type, 10, _y, content_img_w, content_img_h);
				makeCaption(q1_caption, 10, _y + content_img_h + 3);
			}

			if(q2_data) {
				pdf.addImage(q2_data.src, q2_data.type, 200 - content_img_w, _y, content_img_w, content_img_h);
				makeCaption(q2_caption, 200 - content_img_w, _y + content_img_h + 3);
			}

			if(flyer_quality.length > 970) {
				makeFooter();
				pdf.addPage();
				makeHeader('Quality Continued');
				_y += 10;
			}

			if(q3_data == null) {
				makeQualityNotes(_y + content_img_h + 23);
			}

			if(q3_data) {
                pdf.addImage(q3_data.src, q3_data.type, 10, _y + content_img_h + 20, content_img_w, content_img_h);
				makeCaption(q3_caption, 10, _y + (content_img_h * 2) + 23);
            }

			if(q4_data) {
                pdf.addImage(q4_data.src, q4_data.type, 200 - content_img_w, _y + content_img_h + 20, content_img_w, content_img_h);
				makeCaption(q4_caption, 200 - content_img_w, _y + (content_img_h * 2) + 23);
            }

			if((q3_data) && (q5_data == null) && (flyer_quality.length <= 970)) {
				makeFooter();
				pdf.addPage();
				makeHeader('Quality Continued');
				_y += 10;

				makeQualityNotes(_y);
			}

			if((q3_data) && (q5_data == null) && (flyer_quality.length > 970)) {
				makeQualityNotes(_y + (content_img_h * 2) + 43);
			}

			if(q5_data) {

				if(flyer_quality.length <= 970)
				{
					makeFooter();
					pdf.addPage();
					makeHeader('Quality Continued');
					_y += 10;
				}

				if(q5_data) {
                	pdf.addImage(q5_data.src, q5_data.type, 10, _y, content_img_w, content_img_h);
					makeCaption(q5_caption, 10, _y + content_img_h + 3);
            	}

				if(q6_data) {
                	pdf.addImage(q6_data.src, q6_data.type, 200 - content_img_w, _y, content_img_w, content_img_h);
					makeCaption(q6_caption, 200 - content_img_w, _y + content_img_h + 3);
            	}

				if(q7_data) {
                	pdf.addImage(q7_data.src, q7_data.type, 10, _y + content_img_h + 20, content_img_w, content_img_h);
					makeCaption(q7_caption, 10, _y + (content_img_h * 2) + 23);
            	}

         		if(q8_data) {
                	pdf.addImage(q8_data.src, q8_data.type, 200 - content_img_w, _y + content_img_h + 20, content_img_w, content_img_h);
					makeCaption(q8_caption, 200 - content_img_w, _y + (content_img_h * 2) + 23);
            	}

				if((q5_data) && (q7_data == null))
				{
					_y = _y + content_img_h + 23;
				}

				if(q7_data) {
					_y = _y + (content_img_h * 2) + 43;
				}

				if(flyer_quality_notes) {
					makeQualityNotes(_y)
				}
			}

			makeFooter();
			pdf.addPage(); //Page 3

			// !Test Area
			makeHeader('Test Table');

			var table_margins = {top: 35, bottom: 10, left: 10, width: 600};
			pdf.fromHTML(test_table, table_margins.left, table_margins.top, {'width' : table_margins.width}, table_margins);

			makeFooter();
			pdf.addPage(); //Page 4

			// !Payment Summary
			makeHeader('Payment Summary');

			//Table here
			
			makeFooter();

			// ****************************
			// output
			if(update_preview) {
				preview_container.attr('src', pdf.output('datauristring') );
			} else {
				pdf.save(frequency + ' ' + flyer_title + '.pdf');
			}

		}; // end createPDF

		// !buttons
		$('#flyer_quality_btn').click(function () {
			var new_row = document.getElementById('QIMG_extra').style;
			new_row.display = 'inherit';
			document.getElementById("flyer_quality_btn").disabled = true;
		});

		$('#flyer_progress_btn').click(function () {
			//var new_row = document.getElementById('QIMG_extra').style;
			//new_row.display = 'inherit';
			document.getElementById("flyer_progress_btn").disabled = true;
		});

		update_preview_button.click(function () {
			createPDF(true);
		});

		$('#flyer_download_btn').click(function () {
			createPDF(false);
		});

	} catch (e) {
		console.log(e);
	}

})();