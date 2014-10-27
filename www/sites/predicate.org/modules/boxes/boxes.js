// $Id: boxes.js,v 1.2.2.4.2.2 2010/10/01 16:38:56 jmiccolis Exp $
(function ($) {
  Drupal.behaviors.boxes = { 
    attach: function(context, settings) {
      Drupal.ajax.prototype.commands['getBlock'] = function(ajax, response, status) {
        var box = $(this).parents('.boxes-box');
        data = response
        $.ajax({
          type: "GET",
          url: data.url,
          data: { 'boxes_delta': data.delta },
          global: true,
          success: function(response, status) {
            box.removeClass('boxes-box-editing').find('.box-editor').remove().end().find('.boxes-box-content').show();
            ajax.success(response, status);
          },
          error: Drupal.ajax.error,
          dataType: 'json'
        });
      };
      $('div.boxes-box-controls a:not(.boxes-processed)')
        .addClass('boxes-processed')
        .click(function() {
          var box = $(this).parents('.boxes-box');
          if (box.is('.boxes-box-editing')) {
            box.removeClass('boxes-box-editing').find('.box-editor').remove().end().find('.boxes-box-content').show();
          }
          else {
            // Show editing form - the form itself gets loaded via ajax..
            box.find('.boxes-box-content').hide().end().addClass('boxes-box-editing').prepend('<div class="box-editor"><div class="swirly"></div></div>');
          }
          return false;
        });
   
      Drupal.ajax.prototype.commands['preReplaceContextBlock'] = function(ajax, response, status) {
        data = response
        Drupal.settings.boxes = Drupal.settings.boxes || {};
        var e = $('#' + data.id + ' a.context-block:first').clone();
        Drupal.settings.boxes[data.id] =  e;
      };

      Drupal.ajax.prototype.commands['postReplaceContextBlock'] = function(ajax, response, status) {
        data = response
        $('#' + data.id).append(Drupal.settings.boxes[data.id]);
        $('form.context-editor.context-editing').each(function() {
          var id = $(this).attr('id');
          if (Drupal.contextBlockEditor[id]) {
            Drupal.contextBlockEditor[id].initBlocks($('#' + data.id));
          }
        });
      };
    }
  
  };
})(jQuery);
