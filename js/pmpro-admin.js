/**
 * Show a system prompt before redirecting to a URL.
 * Used for delete links/etc.
 * @param	text	The prompt, i.e. are you sure?
 * @param	url		The url to redirect to.
 */
 function pmpro_askfirst( text, url ) {
	var answer = window.confirm( text );

	if ( answer ) {
		window.location = url;
	}
}

/**
 * Deprecated in v2.1
 * In case add-ons/etc are expecting the non-prefixed version.
 */
if ( typeof askfirst !== 'function' ) {
    function askfirst( text, url ) {
        return pmpro_askfirst( text, url );
    }
}

/*
 * Toggle elements with a specific CSS class selector.
 * Used to hide/show sub settings when a main setting is enabled.
 * @since v2.1
 */
function pmpro_toggle_elements_by_selector( selector, checked ) {
	if( checked === undefined ) {
		jQuery( selector ).toggle();
	} else if ( checked ) {
		jQuery( selector ).show();
	} else {
		jQuery( selector ).hide();
	}
}

/*
 * Find inputs with a custom attribute pmpro_toggle_trigger_for,
 * and bind change to toggle the specified elements.
 * @since v2.1
 */
jQuery(document).ready(function() {
	jQuery( 'input[pmpro_toggle_trigger_for]' ).on( 'change', function() {
		pmpro_toggle_elements_by_selector( jQuery( this ).attr( 'pmpro_toggle_trigger_for' ), jQuery( this ).prop( 'checked' ) );
	});
});

/** JQuery to hide the notifications. */
jQuery(document).ready(function(){
	jQuery(document).on( 'click', '.pmpro-notice-button.notice-dismiss', function() {
		var notification_id = jQuery( this ).val();

		var postData = {
			action: 'pmpro_hide_notice',
			notification_id: notification_id
		}

		jQuery.ajax({
			type: "POST",
			data: postData,
			url: ajaxurl,
			success: function( response ) {
				///console.log( notification_id );
				jQuery('#'+notification_id).hide();
			}
		})
	
	});
});

/*
 * Create Webhook button for Stripe on the payment settings page.
 */
jQuery(document).ready(function() {
	// Check that we are on payment settings page.
	if ( ! jQuery( '#stripe_publishablekey' ).length || ! jQuery( '#stripe_secretkey' ).length || ! jQuery( '#pmpro_stripe_create_webhook' ).length ) {
		return;
	}

    // Disable the webhook buttons if the API keys aren't complete yet.
    jQuery('#stripe_publishablekey,#stripe_secretkey').on('change keyup', function() {
        pmpro_stripe_check_api_keys();
    });
	pmpro_stripe_check_api_keys();
    
    // AJAX call to create webhook.
	jQuery('#pmpro_stripe_create_webhook').on( 'click', function(event){
        event.preventDefault();
                
		var postData = {
			action: 'pmpro_stripe_create_webhook',
			secretkey: pmpro_stripe_get_secretkey(),
		}
		jQuery.ajax({
			type: "POST",
			data: postData,
			url: ajaxurl,
			success: function( response ) {
				response = jQuery.parseJSON( response );
                ///console.log( response );
                
                jQuery( '#pmpro_stripe_webhook_notice' ).parent('div').removeClass('error')
                jQuery( '#pmpro_stripe_webhook_notice' ).parent('div').removeClass('notice-success')
                
                if ( response.notice ) {
                    jQuery('#pmpro_stripe_webhook_notice').parent('div').addClass(response.notice);
                }
                if ( response.message ) {
                    jQuery('#pmpro_stripe_webhook_notice').html(response.message);
                }
                if ( response.success ) {
                    jQuery('#pmpro_stripe_create_webhook').hide();
                }
			}
		})
    });
    
    // AJAX call to delete webhook.
	jQuery('#pmpro_stripe_delete_webhook').on( 'click', function(event){
        event.preventDefault();
                
		var postData = {
			action: 'pmpro_stripe_delete_webhook',
			secretkey: pmpro_stripe_get_secretkey(),
		}

		jQuery.ajax({
			type: "POST",
			data: postData,
			url: ajaxurl,
			success: function( response ) {
				response = jQuery.parseJSON( response );
                ///console.log( response );
                
                jQuery( '#pmpro_stripe_webhook_notice' ).parent('div').removeClass('error')
                jQuery( '#pmpro_stripe_webhook_notice' ).parent('div').removeClass('notice-success')
                
                if ( response.notice ) {
                    jQuery('#pmpro_stripe_webhook_notice').parent('div').addClass(response.notice);
                }
                if ( response.message ) {
                    jQuery('#pmpro_stripe_webhook_notice').html(response.message);
                }
                if ( response.success ) {
                    jQuery('#pmpro_stripe_create_webhook').show();
                }				
			}
		})
	});

	// AJAX call to rebuild webhook.
	jQuery('#pmpro_stripe_rebuild_webhook').on( 'click', function(event){
        event.preventDefault();
                
		var postData = {
			action: 'pmpro_stripe_rebuild_webhook',
			secretkey: pmpro_stripe_get_secretkey(),
		}

		jQuery.ajax({
			type: "POST",
			data: postData,
			url: ajaxurl,
			success: function( response ) {
				response = jQuery.parseJSON( response );
                ///console.log( response );
                
                jQuery( '#pmpro_stripe_webhook_notice' ).parent('div').removeClass('error')
                jQuery( '#pmpro_stripe_webhook_notice' ).parent('div').removeClass('notice-success')
                
                if ( response.notice ) {
                    jQuery('#pmpro_stripe_webhook_notice').parent('div').addClass(response.notice);
                }
                if ( response.message ) {
                    jQuery('#pmpro_stripe_webhook_notice').html(response.message);
                }
                if ( response.success ) {
                    jQuery('#pmpro_stripe_create_webhook').hide();
                }				
			}
		})
    });
});

// Disable the webhook buttons if the API keys aren't complete yet.
function pmpro_stripe_check_api_keys() {  
    if( ( jQuery('#stripe_publishablekey').val().length > 0 && jQuery('#stripe_secretkey').val().length > 0 ) || jQuery('#live_stripe_connect_secretkey').val().length > 0 ) {
        jQuery('#pmpro_stripe_create_webhook').removeClass('disabled');
        jQuery('#pmpro_stripe_create_webhook').addClass('button-secondary');
    } else {            
        jQuery('#pmpro_stripe_create_webhook').removeClass('button-secondary');
        jQuery('#pmpro_stripe_create_webhook').addClass('disabled');
    }
}

// User Fields Code.
jQuery(document).ready(function() {
    pmpro_userfields_prep_click_events();
});

function pmpro_userfields_prep_click_events() {
    // Add group button.
	jQuery('#pmpro_userfields_add_group').unbind('click').on( 'click', function(event){
        event.preventDefault();
                
		let postData = {
			action: 'pmpro_userfields_get_group',
            group_id: '',         
		}

		jQuery.ajax({
			type: "GET",
			data: postData,
			url: ajaxurl,
			success: function( response ) {
                ///console.log( response );
				jQuery('#pmpro_userfields_add_group').parent('p').before( response );
                pmpro_userfields_prep_click_events();
			}
		})
    });
    
    // Add field button.
	jQuery('button[name="pmpro_userfields_add_field"]').unbind('click').on( 'click', function(event){
        event.preventDefault();

		let postData = {
			action: 'pmpro_userfields_get_field',
            field_id: '',
		}

		jQuery.ajax({
			type: "GET",
			data: postData,
			url: ajaxurl,
			success: function( response ) {
				jQuery(event.target).closest('div.pmpro_userfield-group-actions').siblings('div.pmpro_userfield-group-fields').append( response );
                pmpro_userfields_prep_click_events();
			}
		});
    });
    
    // Expand/Hide Groups
    jQuery('button.pmpro_userfield-group-buttons-button-toggle-group').unbind('click').on( 'click', function(event){
        event.preventDefault();
        let thebutton = jQuery(event.target).closest('button.pmpro_userfield-group-buttons-button-toggle-group');
        let buttonicon = thebutton.children('.dashicons');
        let groupheader = thebutton.closest('.pmpro_userfield-group-header');
        let groupinside = groupheader.siblings('.pmpro_userfield-inside');
            
        if ( buttonicon.hasClass('dashicons-arrow-up') ) {
            // closing
            buttonicon.removeClass('dashicons-arrow-up');
            buttonicon.addClass('dashicons-arrow-down');
            groupinside.hide();
        } else {
            // opening
            buttonicon.removeClass('dashicons-arrow-down');
            buttonicon.addClass('dashicons-arrow-up');
            groupinside.show();
        }
    });
    
    // Close field.
    jQuery('button.pmpro_userfields_close_field').unbind('click').on('click', function(event){
        event.preventDefault();
        let thebutton = jQuery(event.target).closest('button.pmpro_userfields_close_field');
        let thefield = thebutton.closest('.pmpro_userfield-group-field');        
        
        thefield.hide();
    });
    
    // Save User Field Settings
	jQuery('#pmpro_userfields_savesettings').unbind('click').on( 'click', function(event){
        ///event.preventDefault();

        let field_groups = [];

		jQuery('.pmpro_userfield-group').each(function(index, value) {
            let group_name = jQuery(this).find('input[name=pmpro_userfields_group_name]').val();
            let group_checkout = jQuery(this).find('select[name=pmpro_userfields_group_checkout]').val();
            let group_profile = jQuery(this).find('select[name=pmpro_userfields_group_profile]').val();
            let group_description = jQuery(this).find('textarea[name=pmpro_userfields_group_description]').val();

            // Get level ids.            
            let group_levels = [];
            jQuery('input[name="pmpro_userfields_group_membership[]"]:checked').each(function(){
                group_levels.push(parseInt(jQuery(this).attr('id').replace('pmpro_userfields_group_membership_', '')));
            });
            
            // Get fields.
            let group_fields = [];            
            jQuery('div.pmpro_userfield-group-fields div.pmpro_userfield-field-settings').each(function(){
                let field_label = jQuery(this).find('input[name=pmpro_userfields-field-label]').val();
                let field_name = jQuery(this).find('input[name=pmpro_userfields-field-name]').val();
                let field_type = jQuery(this).find('select[name=pmpro_userfields-field-type]').val();
                let field_required = jQuery(this).find('select[name=pmpro_userfields_field-required]').val();
                let field_readonly = jQuery(this).find('select[name=pmpro_userfields_field-readonly]').val();
                let field_membership = jQuery(this).find('select[name=pmpro_userfields_field-membership]').val();
                let field_profile = jQuery(this).find('select[name=pmpro_userfields_field-profile]').val();
                let field_wrapper_class = jQuery(this).find('input[name=pmpro_userfields-field-class]').val();
                let field_element_class = jQuery(this).find('input[name=pmpro_userfields-field-divclass]').val();
                let field_hint = jQuery(this).find('textarea[name=pmpro_userfields-field-hint]').val();
                
                let field = {
                    'label': field_label,
                    'name': field_name,
                    'type': field_type,
                    'required': field_required,
                    'readonly': field_readonly,
                    'membership': field_membership,
                    'profile': field_profile,
                    'wrapper_class': field_wrapper_class,
                    'element_class': field_element_class,
                    'hint': field_hint
                }

                // Add to array. (Only if it has a label or name.)
                if ( field.label.length > 0 || field.name.length > 0 ) {
                    group_fields.push( field );
                }                
            });
            
            // Set up the field group object.
            let field_group = {
                'name': group_name,
                'checkout': group_checkout,
                'profile': group_profile,
                'description': group_description,
                'levels': group_levels,
                'fields': group_fields
            };

            // Add to array.
            field_groups.push( field_group );            
        });
        
        console.log( field_groups );
        jQuery('#pmpro_user_fields_settings').val( JSON.stringify( field_groups ) );
        
        return true;
    });
}

function pmpro_stripe_get_secretkey() {
    // We can't do the webhook calls with the Connect keys anyway,
    // so we just look for the legacy key here.
    if ( jQuery('#stripe_secretkey').val().length > 0 ) {
		return jQuery('#stripe_secretkey').val();
	} else {
		return '';
	}
}

// EMAIL TEMPLATES.
jQuery(document).ready(function($) {
    
	/* Variables */
	var template, disabled, $subject, $editor, $testemail;
	$subject = $("#pmpro_email_template_subject").closest("tr");
	$editor = $("#wp-email_template_body-wrap");
	$testemail = $("#test_email_address").closest("tr");
	
    $(".hide-while-loading").hide();
    $(".controls").hide();

    /* PMPro Email Template Switcher */
    $("#pmpro_email_template_switcher").change(function() {
        
        $(".status_message").hide();
        template = $(this).val();
        
        //get template data
        if (template)
            pmpro_get_template(template);
        else {
            $(".hide-while-loading").hide();
            $(".controls").hide();
        }
    });

    $("#pmpro_submit_template_data").click(function() {
        pmpro_save_template()
    });

    $("#pmpro_reset_template_data").click(function() {
        pmpro_reset_template();
    });

    $("#pmpro_email_template_disable").click(function(e) {
        pmpro_disable_template();
    });

    $("#send_test_email").click(function(e) {       
		pmpro_save_template().done(setTimeout(function(){pmpro_send_test_email();}, '1000'));
    });

    /* Functions */
    function pmpro_get_template(template) {        
				
		//hide stuff and show ajax spinner
        $(".hide-while-loading").hide();
        $("#pmproet-spinner").show();

        //get template data
        $data = {
            template: template,
            action: 'pmpro_email_templates_get_template_data',
            security: $('input[name=security]').val()
        };

        //console.log( $data );

        $.post(ajaxurl, $data, function(response) {
            var template_data = JSON.parse(response);

            //show/hide stuff
			$("#pmproet-spinner").hide();
            $(".controls").show();
            $(".hide-while-loading").show();
            $(".status").hide();

            //change disable text
            if (template == 'header' || template === 'footer') {

                $subject.hide();
				$testemail.hide();
				
                if(template == 'header')
                    $("#disable_label").text("Disable email header for all PMPro emails?");
                else
                    $("#disable_label").text("Disable email footer for all PMPro emails?");

                //hide description
                $("#disable_description").hide();
            }
            else {
                $testemail.show();
				$("#disable_label").text("Disable this email?");
                $("#disable_description").show().text("PMPro emails with this template will not be sent.");
            }

            // populate help text, subject, and body
            $('#pmpro_email_template_help_text').text(template_data['help_text']);
			$('#pmpro_email_template_subject').val(template_data['subject']);
			$('#pmpro_email_template_body').val(template_data['body']);

            // disable form
            disabled = template_data['disabled'];
            pmpro_toggle_form_disabled(disabled);
        });
    }

    function pmpro_save_template() {

        $("#submit_template_data").attr("disabled", true);
        $(".status").hide();
        // console.log(template);

        $data = {
            template: template,
            subject: $("#pmpro_email_template_subject").val(),
            body: $("#pmpro_email_template_body").val(),
            action: 'pmpro_email_templates_save_template_data',
            security: $('input[name=security]').val()
        };
        $.post(ajaxurl, $data, function(response) {
            if(response != 0) {
                $(".status_message_wrapper").addClass('updated');
            }
            else {
                $(".status_message_wrapper").addClass("error");
            }
            $("#submit_template_data").attr("disabled", false);
            $(".status_message").html(response);
            $(".status").show();
            $(".status_message").show();
        });

		return $.Deferred().resolve();
    }

    function pmpro_reset_template() {

        var r = confirm('Are you sure? Your current template settings will be deleted permanently.');

        if(!r) return false;

        $data = {
            template: template,
            action: 'pmpro_email_templates_reset_template_data',
            security: $('input[name=security]').val()
        };
        $.post(ajaxurl, $data, function(response) {
            var template_data = $.parseJSON(response);
            $('#pmpro_email_template_subject').val(template_data['subject']);
            $('#pmpro_email_template_body').val(template_data['body']);
        });

        return true;
    }

    function pmpro_disable_template() {

        //update wp_options
        data = {
            template: template,
            action: 'pmpro_email_templates_disable_template',
            disabled: $("#pmpro_email_template_disable").is(":checked"),
            security: $('input[name=security]').val()
        };

        $.post(ajaxurl, data, function(response) {

            response = JSON.parse(response);

            //failure
            if(response['result'] == false) {
                $(".status_message_wrapper").addClass("error");
                $(".status_message").show().text("There was an error updating your template settings.");
            }
            else {
                if(response['status'] == 'true') {
                    $(".status_message_wrapper").addClass("updated");
                    $(".status_message").show().text("Template Disabled");
                }
                else {
                    $(".status_message_wrapper").addClass("updated");
                    $(".status_message").show().text("Template Enabled");
                }
            }

            $(".hide-while-loading").show();

            disabled = response['status'];

            pmpro_toggle_form_disabled(disabled);
        });
    }

    function pmpro_send_test_email() {

        //hide stuff and show ajax spinner
        $(".hide-while-loading").hide();
        $("#pmproet-spinner").show();

        data = {
            template: template,
            email: $("#test_email_address").val(),			
            action: 'pmpro_email_templates_send_test',
            security: $('input[name=security]').val()
        };

        $.post(ajaxurl, data, function(success) {
            //show/hide stuff
            $("#pmproet-spinner").hide();
            $(".controls").show();
            $(".hide-while-loading").show();

            if(success) {
                $(".status_message_wrapper").addClass("updated").removeClass("error");
                $(".status_message").show().text("Test email sent successfully.");
            }
            else {
                $(".status_message_wrapper").addClass("error").removeClass("updated");
                $(".status_message").show().text("Test email failed.");
            }

        })
    }

    function pmpro_toggle_form_disabled(disabled) {
        if(disabled == 'true') {
            $("#pmpro_email_template_disable").prop('checked', true);
            $("#pmpro_email_template_body").attr('readonly', 'readonly').attr('disabled', 'disabled');
            $("#pmpro_email_template_subject").attr('readonly', 'readonly').attr('disabled', 'disabled');
            $(".controls").hide();
        }
        else {
            $("#pmpro_email_template_disable").prop('checked', false);
            $("#pmpro_email_template_body").removeAttr('readonly','readonly').removeAttr('disabled', 'disabled');
            $("#pmpro_email_template_subject").removeAttr('readonly','readonly').removeAttr('disabled', 'disabled');
            $(".controls").show();
        }

    }

});
