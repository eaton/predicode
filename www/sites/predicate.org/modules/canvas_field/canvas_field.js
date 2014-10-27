(function ($) {

Drupal.behaviors.canvas_field = {
    attach: function(context, settings) {
      $('input.canvas_field:not(.canvas-field-processed)', context).each(function(context) {
        $(this).addClass('canvas-field-processed');
        
        //Hide the filefield.  This will probably be configurable in the future.
        $(this).parent().find('input[type=file]').hide();
        new CanvasField(this, settings.canvas_field);
      });
  },
  detach: function(context) {
	  $('div.canvas-wrapper', context).each(function(context) {
		 $(this).remove(); 
	  });
	  
  } 
}

CanvasField = function (selector, options) {
	this.settings = jQuery.extend({
		'style' : {
			'height'  : 150,
	        'width'   : 300
		},
        'default_tool' : 'Pen'
    }, options);
	
    var origin, tool, state, canvas, context;
    this.buttons = this.getButtons()
    var self = this;
    
    canvas = $(Drupal.theme('canvasFieldCanvas', this.settings))
    .mousedown(function (event) {
      self.resetOrigin();
      y = event.pageY - origin['top'];
      x = event.pageX - origin['left'];
      state = 'active';
      
      tool.start(x, y, context);
    })
    .mousemove(function(event) {
      if (state == 'active') {
        y = event.pageY - origin['top'];
        x = event.pageX - origin['left'];
      
        tool.move(x, y, context);
      }
    })
    .mouseout(function(event) {
      y = event.pageY - origin['top'];
      x = event.pageX - origin['left'];
      
      tool.pause(x, y, context);
    });

  $(document).mouseup(function(event) {
	if (state == 'active') {
	    y = event.pageY - origin['top'];
	    x = event.pageX - origin['left'];
	    state = 'inactive';
	    tool.stop(x, y, context);
	    self.save();
	}
  });
  
  //Save the canvas by converting it to a dataurl in the hidden field.
  this.save = function() {
    $(selector).val(canvas[0].toDataURL());
  };
  
  //Reset the canvas to blank.
  this.reset = function() {
	  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	  $(selector).val('');
  }
  this.getContext = function() {
	  return context;
  }
  
  //Recalibrate X/Y.
  this.resetOrigin = function() {
    origin = canvas.offset();
  };

  //Switch the active tool.
  this.switchTool = function(newTool) {
	  if (typeof newTool == 'string') {
		  if (typeof window["CanvasField"]["Tools"][newTool] == 'function') {
	        tool = new window["CanvasField"]["Tools"][newTool]();
		  }
		  else {
			tool = new CanvasField.tool();
			alert(Drupal.t('Failed to create ' + toolName + ' tool.'));
		  }
	  }
	  else if (typeof newTool == 'function') {
		  tool = new newTool();
	  }
	  this.resetOrigin();
  };
  
  context = canvas[0].getContext("2d");
  
  buttons = Drupal.theme('canvasButtonSet', this.buttons, this.settings);
  $(selector).parent().append(Drupal.theme('canvasWrapper', canvas, buttons));

  this.switchTool(this.settings.default_tool);  
}

CanvasField.prototype.getButtons = function() {
	var CF = this;
	var buttons = Array();
	
	for(key in CanvasField.Buttons) {
		buttons.push(new CanvasField.Buttons[key](CF));
	}
	
	return buttons;
}

/**
 * Theme canvasWrapper.
 */
Drupal.theme.prototype.canvasWrapper = function(canvas, buttons) {
	return $('<div class="canvas-wrapper"></div>')
		.append(buttons)
		.append(canvas);
};

/**
 * Theme canvasButton.
 * 
 * This function should be used for any additional buttons so we can 
 * override button sizes as needed.
 */
Drupal.theme.prototype.canvasButton = function(src, title) {
	return $('<img class="toolbar-icon" src="' + src + '" title="' + title + '" />')
		.hover(
			function() {$(this).addClass('selected'); },
			function() {$(this).removeClass('selected'); });
}

/**
 * Theme canvasButtonSet.
 * 
 * Wrapper for buttons.
 */
Drupal.theme.prototype.canvasButtonSet = function(buttons, settings) {
	var wrapper = $('<div class="tools-wrapper"></div>')
		.css('background-color', settings.style['border-color']);

	for (var i=0; i < buttons.length; i++) {
		wrapper.append(buttons[i]);
	}
	return wrapper;
}

/**
 * Theme canvasFieldCanvas
 * 
 * Styles the HTML canvas element.
 */
Drupal.theme.prototype.canvasFieldCanvas = function (settings) {
	//Use HTML attributes for height and width because using CSS
	//for size causes distortion.
	var w = settings.style.width;
	var h = settings.style.height;
	
	settings.style.width = settings.style.height = null;

	return $('<canvas></canvas>').css(settings.style).attr('height', h).attr('width', w);
};

CanvasField.Tools = {};
CanvasField.Buttons = {};

/**
 * Tools base object.  
 * 
 * All tools should extend CanvasField.Tools.baseTool(),
 * and use prototypes of the following functions to react
 * to canvas events.  The events are:
 * 
 * - start:  The tool is active, and the canvas has been clicked.
 * - move:   The tool is active, canvas has been clicked, and the 
 * 		     cursor is in motion.
 * - pause:  The tool is active and the canvas has been clicked, but 
 * 			 the tool has left the canvas.  For path-based tools,
 * 			 this is an opportunity to reset and wait for the cursor
 * 			 to re-enter the canvas. 
 * - stop:   The tool is active, but a mouseUp event has occurred,
 * 		     meaning that the tools should stop acting on the canvas.
 * - config: Currently not implemented, but will probably allow
 *           the tool to define a configuration form.
 * 
 */
CanvasField.baseTool = function() {};
CanvasField.baseTool.prototype.start = function() {};
CanvasField.baseTool.prototype.move = function() {};
CanvasField.baseTool.prototype.pause = function() {};
CanvasField.baseTool.prototype.stop =  function() {};
CanvasField.baseTool.prototype.config = function( wrapper ) {};

/**
 * Canvas Reset Button.
 * 
 * Buttons should use the canvasButton theme function wherever
 * possible.  The entire canvasField object is passed into the 
 * button constructor.  The button constructor is responsible 
 * for defining its own onclick action.
 */
CanvasField.Buttons.Reset = function(canvasField) {
	var icon = Drupal.settings.basePath + canvasField.settings.icon_path + 'delete.png';
	button = Drupal.theme('canvasButton', icon, 'Reset/Clear');
	button.click(function() {
		canvasField.reset();
	});
	return button;
}

/**
 * Canvas Pen Button
 */
CanvasField.Buttons.Pen = function(canvasField) {
	var icon = Drupal.settings.basePath + canvasField.settings.icon_path + 'pencil.png';
	button = Drupal.theme('canvasButton', icon, Drupal.t('Pen Tool'));
	button.bind('click', function() {
		canvasField.switchTool('Pen');
	});
	return button;
}

/**
 * Canvas Paint Tool Button
 */
CanvasField.Buttons.Paint = function(canvasField) {
	if (typeof CanvasField.Tools.Paint == 'function') {
		var icon =  Drupal.settings.basePath + canvasField.settings.icon_path + 'paintcan.png';
		button = Drupal.theme('canvasButton', icon, Drupal.t('Paint Tool'));
		button.bind('click', function() {
			canvasField.switchTool('Paint');
		});
		return button;
	}
}

/**
 * Canvas Configure Button
 */
CanvasField.Buttons.Color = function(canvasField) {
	if (typeof $.farbtastic == 'function') {
		var icon = Drupal.settings.basePath + canvasField.settings.icon_path + 'color_wheel.png';
		button = Drupal.theme('canvasButton', icon, Drupal.t('Configuration'));
		button.bind('click', function() {
			CanvasField.ConfigForm(canvasField.getContext());
		});
		return button;
	}
}

/**
 * Pen tool.
 * 
 * The pen tool is nothing more than a 1px stroke on the canvas.
 * It should be a good template for future tools.
 */
//Pen constructor
CanvasField.Tools.Pen = function() {
  this.lastX = 0;
  this.lastY = 0;
};

//Extends the baseTool object
CanvasField.Tools.Pen.prototype = new CanvasField.baseTool();

//Start prototype (get the start coords)
CanvasField.Tools.Pen.prototype.start = function(x, y, context) {
  this.lastX = x;
  this.lastY = y;
};

//Move prototype (create the path as we go).
CanvasField.Tools.Pen.prototype.move = function(x, y, context) {
  //If lastX is not set, we must be resuming from a pause.
  if (!this.lastX) {
    this.lastX = x;
    this.lastY = y;
  }
  
  context.beginPath();
  context.moveTo(x,y);
  context.lineTo(this.lastX,this.lastY);
  context.stroke();
  this.lastX = x;
  this.lastY = y;
};

//Pause prototype (temporarily stop drawing).
CanvasField.Tools.Pen.prototype.pause = function(x, y, context) {
  this.lastX = 0;
  this.lastY = 0;
};

/**
 * Canvas Paint Tool
 */
CanvasField.Tools.Paint = function() {};
CanvasField.Tools.Paint.prototype = new CanvasField.baseTool();
CanvasField.Tools.Paint.prototype.start = function(x, y, context) {
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);
}

/**
 * ConfigForm Callback for configure button callback.
 */
var cfConfigForm;
CanvasField.ConfigForm = function(context) {
	
	$('<div id="canvasfield-color" class="colorpicker"></div>').dialog({title: Drupal.t('Configure')})
		.before(Drupal.t('Stroke') + '<input type="radio" name="cfSet" value="stroke" checked="checked" />')
		.before(Drupal.t('Fill') + '<input type="radio" name="cfSet" value="fill" />')
		.farbtastic(function(color) {
			context[$('input[name=cfSet]:checked').val() + 'Style'] = color;
		});
};

})(jQuery);