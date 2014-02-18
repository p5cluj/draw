$(function(){
	var objects = [];
    /**
	*  Draw user created objects on svg element
	*  @param svg - svg root element
    */
	function drawIntro(svg){
		for (var i = 0; i < objects.length; i++) {
			var obj = objects[i];
			switch(obj.type){
				case "circle":
					svg.circle(obj.x1+100, obj.y1+100, obj.radius, {fill : obj.color});
				break;
				case "line":
					svg.line(obj.x1+100,obj.y1+100,obj.x2+100,obj.y2+100, {stroke : obj.color});
				break;
				default:
				break;
			}
		};
	}
    /**
	*  Format serialized form to compatible object
    */
	function getDTO(formObject){
		var dto = {};		
		for (var i = 0; i < formObject.length; i++) {
				var data = formObject[i];
				var name = formObject[i].name;
				var value = formObject[i].value;
				dto[name] = value;
		};
		return dto;
	}
    /**
	*  Iframe hack for ajax to download file
    */
	function sendRequestIframe(url){
        var iframe;
        iframe = document.getElementById("download-container");
        if (iframe === null)
        {
            iframe = document.createElement('iframe');  
            iframe.id = "download-container";
            iframe.style.visibility = 'hidden';
            document.body.appendChild(iframe);
        }
        iframe.src = url;   
    }
    /**
	*  Temporary form submit hack to send data and support file download
    */
    function sendDataForm(data){
		//create temporary form to send data
		var form = $("<form></form>",{
			method:"POST",
			id:"tempForm",
			action:"draw/save.php",
			target : "_blank"
			//action:"javascript:;"
		});
		
		var hiddenInput = $("<input></input", {
			name : "objects",
			type : "hidden",
			value : jQuery.param(data),
		});

		$(form).append(hiddenInput);
		$("body").append(form);
		$(form).submit();
		$(form).remove();
    }
    /**
	*  Format serialized shape object to {type,x1,y1,x2,y2,radius,color}
    */
	function getShapeDTO(formObject, type){
		var dto = {};
		dto['type'] = type;
		switch(type){
			case "circle":
				dto['x1'] = parseInt(formObject[0].value);
				dto['y1'] = parseInt(formObject[1].value);
				dto['x2'] = '';
				dto['y2'] = '';
				dto['radius'] = parseInt(formObject[2].value);
				dto['color'] = formObject[3].value;
			break;
			case "line":
				dto['x1'] = parseInt(formObject[0].value);
				dto['y1'] = parseInt(formObject[1].value);
				dto['x2'] = parseInt(formObject[2].value);
				dto['y2'] = parseInt(formObject[3].value);
				dto['radius'] = '';
				dto['color'] = formObject[4].value;
			break;
		}
		return dto;
	}

	var $newButton = $('#new-shape');
	var $openButton = $('#open-shape');
	$newButton.on('click', function(e){		
		var drawing = {};
		//hide main buttons
		$newButton.hide();
		$openButton.hide();

		var mainForm = _.template($("script.new-form").html());
		$("#drawing-form").html(mainForm);
		var $drawingForm = $("#new-drawing-form");
		var $shapeForm = $("#new-shape-form");


		$drawingForm .find("button.cancel").on('click',function(){			
			$newButton.show();
			$openButton.show();
			$drawingForm.remove();
			$shapeForm.remove();
			objects = [];
		});

		$drawingForm .find("button.preview").on('click',function(){
			drawing = getDTO($("#new-drawing-form").serializeArray());
			var width = drawing.width?drawing.width:500;
			var height = drawing.height?drawing.height:500;
			$("body").append('<div id="preview-drawing"></div>');
			
			var $prevDrawing = $("#preview-drawing");
			$prevDrawing.dialog({
				modal: true,
				width: width,
				height: height,
				buttons: {
			        Close: function() {
			          $( this ).dialog( "close" );
			          $prevDrawing.remove();
			        }
		      	}
			});

			//create svg
			$prevDrawing.svg({
				onLoad: drawIntro, 
				width: width, 
				height: height
			});
		});	

		$drawingForm .find("button.save").on('click',function(e){			
			if($drawingForm[0].checkValidity()){//use HTML5 validation
				//prevent submit for new-drawing form whitout processing the data first
				e.preventDefault();
				drawing = getDTO($("#new-drawing-form").serializeArray());
				drawing['objects'] = objects;
				delete drawing.objectSelector;

				sendDataForm(drawing);
			}			
		});			

		$drawingForm.find("select.objectSelector").change(function(e){						
			$("#new-shape-form").remove();
			var shape = $(this).val();
			//generate form for new shape
			switch(shape){
				case "circle":
					var circleForm = _.template($("script.circle-form-template").html());
					$drawingForm.append(circleForm);
				break;
				case "line":
					var lineForm = _.template($("script.line-form-template").html());
					$drawingForm.append(lineForm);
				break;
				default:
				break;
			}
			var $newShapeForm = $("#new-shape-form");
			$newShapeForm.find("button.addObject").on('click', function(e){	
				if($newShapeForm[0].checkValidity()){
					e.preventDefault();
					var dto = getShapeDTO($newShapeForm.serializeArray(), shape);				
					objects.push(dto);
					$drawingForm.find("select.objects").append('<option value="'+dto.type+'">'+dto.type+'</option>');
				}						
			});	
		});			
	});

	$openButton.on('click', function(e){
		$newButton.hide();
		$openButton.hide();
		var mainForm = _.template($("script.open-form").html());
		$("#drawing-form").html(mainForm);
		var $openForm = $("#open-drawing-form");

		$openForm .find("button.cancel").on('click',function(){
			$newButton.show();
			$openButton.show();
			$openForm.remove();
		});	
	});
});