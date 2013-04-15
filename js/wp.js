
function wp_create_test_bar (wp)
{
	var bar_css = {
		"position"			: "relative",
		"background-color"	: "#aaaaaa",
		"margin-top"		: "5px",
		"margin-bottom"		: "5px",
		"margin-left"		: "auto",
		"margin-right"		: "auto",  
		"border-color"		: "#000000",
		"border-style"		: "solid",
		"border-width"		: "1px",  
	}
	var id = wp.getID();
	var bar_id = id+'-test_bar';
	
	$('<div id="'+bar_id+'"> [#'+id+'-test bar] </div>').prependTo('#'+id)
		.css(bar_css)
		.append("Width:")
		.append('<input id="'+bar_id+'-width" type="number" value="500" >')
		.append("Height:")
		.append('<input id="'+bar_id+'-height" type="number" value="300" >')
		.append("Color:")
		.append('<input id="'+bar_id+'-color" type="color" value="#ffffff" >')
		.append('<button id="'+bar_id+'-apply"type="button"> Apply </button>')
		.append("Page:")
		.append('<button id="'+bar_id+'-add"type="button"> + </button>')
		.append('<button id="'+bar_id+'-remove"type="button"> - </button>');

	$("#"+bar_id+"-apply").click(function(){
		var w = $("#"+bar_id+"-width").val();
		var h = $("#"+bar_id+"-height").val();
		var c = $("#"+bar_id+"-color").val();
		wp.changePageAttr(w,h,c);
	});

	$("#"+bar_id+"-add").click(function(){
		wp.addPage();
	});
	$("#"+bar_id+"-remove").click(function(){
		wp.removePage();
	});
}

function wp_ed (id)
{
    //private
	var _cssrules 		= $("<style type='text/css'> </style>").appendTo("head");
    var _id 			= id;
	var _ruler_id		= _id+'-ruler';
	var _sheet_id		= _id+'-sheet';
	var _n_page			= 1;
	var _has_test_bar	= 0;

	/*add ruler id to css*/
	_cssrules.append("#"+_ruler_id+"{width:500px;height:15px;position:relative;background-color:white;margin-top:15px;margin-bottom:8px;margin-left:auto;margin-right:auto;border-color:rgba(0,0,0,.1);border-style:solid;border-width:1px;font-size:70%;text-align:center;}");
	/*create ruler*/
	$('<div id="'+_ruler_id+'"> to put the ruler here </div>').appendTo('#'+id);

	/*add sheet class to css*/
	_cssrules.append("."+_sheet_id+"{width:500px;height:300px;position:relative;margin-top:0px;margin-bottom:5px;margin-left:auto;margin-right:auto;background-color:white;border-color:rgba(0,0,0,.2);border-style:solid;border-width:1px;}");
	/*create sheet*/
	$('<div id="'+_sheet_id+_n_page.toString()+'">Page 1</div>').addClass(_sheet_id).appendTo('#'+_id);
	
	//public
	return{
		getID : function(){
			return _id;
		},
		addPage : function(){
			_n_page = _n_page + 1;
			var n_str = _n_page.toString();
			$('<div id="'+_sheet_id+n_str+'">Page '+n_str+'</div>').addClass(_sheet_id).appendTo('#'+_id);
		},
		removePage : function(){
			if (_n_page > 1){
				var page = "#"+_sheet_id+_n_page.toString();
				$(page).remove();
				_n_page = _n_page - 1;
			}
		},
		changePageAttr: function(width, height, color){
			var w = width.toString()+"px";
			var h = height.toString()+"px";
			_cssrules.append("#"+_ruler_id+"{width:"+w+"}");
			_cssrules.append("."+_sheet_id+"{width:"+w+";height:"+h+";background-color:"+color+"}");
		},
		showTestBar: function(){
			if (_has_test_bar == 0){
				_has_test_bar = 1;
				wp_create_test_bar (this);
			}
		},
		hideTestBar: function(){
			if (_has_test_bar == 1){
				_has_test_bar = 0;
				var bar = "#"+_id+'-test_bar';
				$(bar).remove();
			}		
		}		
	};
}

var wp = {
	editors  : {},
	fn_start : function() {},
	ready	 : function (callback) {
		this.fn_start = callback;
	}
};


$(document).ready(function(){
	$(function(){
		$('.wp-editor').each(function(){
			var id = $(this).attr('id');
			wp.editors[id] = new wp_ed(id);
		});
		wp.fn_start();
	});
});


function wp_show_test_bar(id){
	wp.editors[id].showTestBar();
}

