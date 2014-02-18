$(function(){
	var objects = [];
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

	function downloadFile(url){
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

	$('#new-shape').on('click', function(e){		
		var drawing = {};

		$('#new-shape, #open-shape').hide();
		var mainForm = _.template($("script.new-form").html());
		$("#drawing-form").html(mainForm);
		var $drawingForm = $("#new-drawing-form");

		$drawingForm .find("button.cancel").on('click',function(){			
			$('#new-shape, #open-shape').show();
			$("#new-drawing-form").remove();
			$("#new-shape-form").remove();
			objects = [];
		});	

		$drawingForm .find("button.preview").on('click',function(){
			drawing = getDTO($("#new-drawing-form").serializeArray());
			var width = drawing.width?drawing.width:500;
			var height = drawing.height?drawing.height:500;
			$("body").append('<div id="preview-drawing"></div>');
			$("#preview-drawing").dialog({
				modal: true,
				width: width,
				height: height,
				buttons: {
			        Close: function() {
			          $( this ).dialog( "close" );
			          $("#preview-drawing").remove();
			        }
		      	}
			});

			//create svg
			$("#preview-drawing").svg({
				onLoad: drawIntro, 
				width: width, 
				height: height
			});
		});	

		$drawingForm .find("button.save").on('click',function(e){			
			if($drawingForm[0].checkValidity()){//use HTML5 validation
				e.preventDefault();//don't submit form whitout processing
				drawing = getDTO($("#new-drawing-form").serializeArray());
				drawing['objects'] = objects;
				delete drawing.objectSelector;

				var form = $("<form></form>",{
					method:"POST",
					id:"tempForm",
					action:"draw/save.php",
					target : "_blank"
					//action:"javascript:;"
				});
				
				var hidden = $("<input></input", {
					name : "objects",
					type : "hidden",
					value : jQuery.param(drawing),
				});

				$(form).append(hidden);
				$("body").append(form);
				$(form).submit();
				$(form).remove();
				/*$.ajax({
					method: "POST",
					url: "draw/save.php",
					data: drawing,
					success: function(data){
						downloadFile(url);
					}
				})*/
			}			
		});			

		$drawingForm.find("select.objectSelector").change(function(e){						
			$("#new-shape-form").remove();
			var shape = $(this).val();
			switch(shape){
				case "circle":
					var circleForm = _.template($("script.circle-form-template").html());
					$("div#drawing-form").append(circleForm);
				break;
				case "line":
					var lineForm = _.template($("script.line-form-template").html());
					$("div#drawing-form").append(lineForm);
				break;
				default:
				break;
			}

			$("#new-shape-form").find("button.addObject").on('click', function(e){	
				if($("#new-shape-form")[0].checkValidity()){
					e.preventDefault();
					var dto = getShapeDTO($("#new-shape-form").serializeArray(), shape);				
					objects.push(dto);
					$drawingForm.find("select.objects").append('<option value="'+dto.type+'">'+dto.type+'</option>');
				}						
			});	
		});			
	});

	$('#open-shape').on('click', function(e){
		$('#new-shape, #open-shape').hide();
		var mainForm = _.template($("script.open-form").html());
		$("#drawing-form").html(mainForm);
		var $openForm = $("#open-drawing-form");

		$openForm .find("button.cancel").on('click',function(){
			$('#new-shape, #open-shape').show();
			$("#open-drawing-form").remove();
		});	

/*		$openForm .find("button.save").on('click',function(){
			//get file for uploading

			//send ajax	
			$.ajax({
				method: "POST",
				url: "http://0.0.0.0/drawing/open.php",
				data: JSON.stringify(dto),
				success: function(data){
					console.log("ajax open success!!");
				}
			})	
		});*/	
	});
});