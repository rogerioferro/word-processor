
wp_papers ={"a0":{"title":"A0(84,1cm x  118,9cm)","width":"841mm","height":"1189mm"},
			"a1":{"title":"A1(59,4cm x  84,1cm)","width":"594mm","height":"841mm"},
			"a2":{"title":"A2(42,0cm x  59,4cm)","width":"420mm","height":"594mm"},
			"a3":{"title":"A3(29,7cm x  42,0cm)","width":"297mm","height":"420mm"},
			"a4":{"title":"A4(21,0cm x  29,7cm)","width":"210mm","height":"297mm"},
			"a5":{"title":"A5(14,8cm x  21,0cm)","width":"148mm","height":"210mm"},
			"a6":{"title":"A6(10,5cm x  14,8cm)","width":"105mm","height":"148mm"},
			"a7":{"title":"A7(7,4cm x  10,5cm)","width":"74mm","height":"105mm"},
			"a8":{"title":"A8(5,2cm x  7,4cm)","width":"52mm","height":"74mm"},
			"a9":{"title":"A9(3,7cm x  5,2cm)","width":"37mm","height":"52mm"},
			"a10":{"title":"A10(2,6cm x  3,7cm)","width":"26mm","height":"37mm"}};

function wp_get_paper_dropdown (id,sel_key) {
	var dropdown = '<select id="'+id+'">';	
	for (var key in wp_papers){
		dropdown += '<option value="'+key+'" ';
		if (key == sel_key) dropdown += 'selected';
		dropdown += '>'+wp_papers[key].title+'</option>';
	}	
	dropdown += '</select>';
	return dropdown;
}
			
function wp_create_test_bar (wp){
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
	var o = wp.getOrientation();
	var radio = '<input name="'+bar_id+'-radio" type="radio" value="portrait"';
	if (o=='portrait') radio+=' checked'
	radio += '> Portrait <input name="'+bar_id+'-radio" type="radio" value="landscape"'
	if (o=='landscape') radio+=' checked'
	radio += '> Landscape]'
	
	$('<div id="'+bar_id+'"> [#'+id+'-test bar] </div>').prependTo('#'+id)
		.css(bar_css)
		.append("Paper:")
		.append(wp_get_paper_dropdown(bar_id+'-paper',wp.getPaper()))
		.append(radio)
		.append("Color:")
		.append('<input id="'+bar_id+'-color" type="color" value="'+wp.getColor()+'" >')
		.append('<button id="'+bar_id+'-apply"type="button"> Apply </button>')
		.append("Page:")
		.append('<button id="'+bar_id+'-add"type="button"> + </button>')
		.append('<button id="'+bar_id+'-remove"type="button"> - </button>');

	$("#"+bar_id+"-apply").click(function(){
		var paper = $("#"+bar_id+"-paper").val();
		var color = $("#"+bar_id+"-color").val();
		var orientation =  $('input:radio[name="'+bar_id+'-radio"]:checked').val();
		wp.changePageAttr(paper,orientation,color);
	});

	$("#"+bar_id+"-add").click(function(){
		wp.addPage();
	});
	$("#"+bar_id+"-remove").click(function(){
		wp.removePage();
	});
}

function wp_ed (id){
    //private
	var _cssrules 		= $("<style type='text/css'> </style>").appendTo("head");
    var _id 			= id;
	var _ruler_id		= _id+'-ruler';
	var _sheet_id		= _id+'-sheet';
	var _n_page			= 1;
	var _has_test_bar	= 0;
	var _paper			= "a8";
	var _orientation	= "portrait";
	var _color			= "#ffffff";
	
	var w = wp_papers[_paper].width;
	var h = wp_papers[_paper].height;			
	if (_orientation == 'landscape') {
		var tmp = w;
		w = h;
		h = tmp;
	}

	/*add ruler id to css*/
	_cssrules.append("#"+_ruler_id+"{width:"+w+";height:15px;position:relative;background-color:white;margin-top:15px;margin-bottom:8px;margin-left:auto;margin-right:auto;border-color:rgba(0,0,0,.1);border-style:solid;border-width:1px;font-size:70%;text-align:center;}");
	/*create ruler*/
	$('<div id="'+_ruler_id+'"> to put the ruler here </div>').appendTo('#'+id);

	/*add sheet class to css*/
	_cssrules.append("."+_sheet_id+"{width:"+w+";height:"+h+";background-color:"+_color+";position:relative;margin-top:0px;margin-bottom:5px;margin-left:auto;margin-right:auto;border-color:rgba(0,0,0,.2);border-style:solid;border-width:1px;}");
	/*create sheet*/
	$('<div id="'+_sheet_id+_n_page.toString()+'">Page 1</div>').addClass(_sheet_id).appendTo('#'+_id);
	
	//public
	return{
		getID : function(){
			return _id;
		},
		addPage : function(){
			_n_page++;
			var n_str = _n_page.toString();
			$('<div id="'+_sheet_id+n_str+'">Page '+n_str+'</div>').addClass(_sheet_id).appendTo('#'+_id);
		},
		removePage : function(){
			if (_n_page > 1){
				var page = "#"+_sheet_id+_n_page.toString();
				$(page).remove();
				_n_page--;
			}
		},
		changePageAttr: function(paper, orientation, color){			
			if (paper in wp_papers) _paper = paper;
			if (orientation in {'portrait':1,'landscape':1}) _orientation = orientation;
			if (/^#[0-9A-F]{6}$/i.test(color)) _color = color;
						
			var w = wp_papers[_paper].width;
			var h = wp_papers[_paper].height;			
			if (_orientation == 'landscape') {
				var tmp = w;
				w = h;
				h = tmp;
			}
			_cssrules.append("#"+_ruler_id+"{width:"+w+"}");
			_cssrules.append("."+_sheet_id+"{width:"+w+";height:"+h+";background-color:"+_color+"}");
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
		},
		getPaper: function(){return _paper},
		getOrientation: function(){return _orientation},
		getColor: function(){return _color}
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

