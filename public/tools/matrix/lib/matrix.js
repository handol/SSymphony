var width = 100;
var height = 100;
var tmpClient = 0;	//현재 클라이언트 번호
//var _tmpGroup = "matrix-group-1";	//현재 그룹
var _tmpGroup = "group1";	//현재 그룹
var _toolName = "matrix";
var setupData = { row:0, col:0 }; // matrix 행, 열
var setupFlag = { data_init:true, row:false, col:false };
var optionId = { set:999999, row:999998, col:999997 };
var boxCount = 0; // lastId 가 세팅 되어 있는 input 이 있는 박스 갯수
var totalBoxCount = 0; // row * col 총 박스 갯수
var setFlag = 0;
var clientColor = new Array( "none", "#99FF99", "#CCCC99", "#0099FF", "#CCFFCC", "#FFFF66", "#FF9999", "#669999", "#9999FF", "#00CCCC", "#CC9900");	
var _key_code = null // 키 입력 값 저장

var inputFlag = 0;	//키입력 감지하기 위한 변수

////  _socket_matrix.io 서버의 해당 그룹에 접속  ////
//var _socket_matrix = io.connect('http://61.43.139.69:8000/group');	// socket.io 서버에 접속
//var _socket_matrix = io.connect('http://lyd.kr:8000/group');	// socket.io 서버에 접속
var _socket_matrix = io.connect('http://61.43.139.69:8000/group');


////  처음 창 오픈되었을 때 호출  ////
/*
$(document).ready(function() {
	resizeMatrix();
	$(window).resize(function(){
		resizeMatrix();
	});

	socket.emit('join_room', { group: _tmpGroup });
	////  서버에 초기 데이터 요청하는 함수  ////
	socket.emit('set_tree_data', { group: _tmpGroup, tool: _toolName });
	socket.emit('set_tree_option_data', { group: _tmpGroup, tool: _toolName });

	$(window).focus(function(){
		$('.writing').focus();
	});
	$('.matrix').click(function(){
		//console.log("focus");
		//$('.writing').focus();
	});
});
*/

function resizeMatrix(){
	width = $(window).width();
	height = $(window).height();
	$('.matrix').css({ width:width+"px", height:height+"px" });
}

function setMatrix(t){
	console.log( setupFlag );
	if( setupFlag.data_init == true )
	{
		setupData.row = $('#rowNum', $(t).parent() ).val();
		setupData.col = $('#colNum', $(t).parent() ).val();
		setupFlag.row = true;
		setupFlag.col = true;
		socket.emit('set_option_data', { group: _tmpGroup, tool: _toolName, id: optionId.row, option: "row", val: setupData.row });
		socket.emit('set_option_data', { group: _tmpGroup, tool: _toolName, id: optionId.col, option: "col", val: setupData.col });
		socket.emit('set_option_data', { group: _tmpGroup, tool: _toolName, id: optionId.set, option: "set", val: true });
		setDoMatrix();
	}
}

function setClear() {
	//if( confirm("정말 삭제하겠습니까?") ) {
		_socket_matrix.emit('set_init_tool_data', { group: _tmpGroup, tool: _toolName });		
		_socket_matrix.emit('set_option_data', { group: _tmpGroup, tool: _toolName, id: optionId.row, option: "row", val: false });
		_socket_matrix.emit('set_option_data', { group: _tmpGroup, tool: _toolName, id: optionId.col, option: "col", val: false });
		_socket_matrix.emit('set_option_data', { group: _tmpGroup, tool: _toolName, id: optionId.set, option: "set", val: false });
		setDoClear();
	//}
}

function setDoClear() {
	setupFlag.data_init = true;
	setupFlag.row = false;
	setupFlag.col = false;
	boxCount = 0;
	$('.matrix_table tbody').html("");
	$('.matrix_table colgroup').html("");
}

function setDoMatrix() {
	if( setupFlag.data_init && setupFlag.row && setupFlag.col )
	{
		/*
		console.log("setDoMatrix : " + setupFlag.data_init );
		console.log("setDoMatrix row : " + setupData.row );
		console.log("setDoMatrix row flag : " + setupFlag.row );
		console.log("setDoMatrix row : " + setupData.col );
		console.log("setDoMatrix col flag : " + setupFlag.col );
		*/
		setupFlag.data_init = false;
		var tmpRow = setupData.row;
		var tmpCol = setupData.col;
		totalBoxCount = (tmpRow*1)*(tmpCol*1);

		var tmpMatrix = $('.matrix_table tbody');
		var colGroup =  $('.matrix_table colgroup');
		var tmpTag = "";
		var colWidth = $('.matrix_table').width() / ((tmpCol*1));

		var i=0, j=0;
		for (i=0; i<parseInt(tmpRow); i++) {
			tmpTag = "<tr class='row'></tr>";
			tmpMatrix.append(tmpTag);
			for (j=0; j<parseInt(tmpCol); j++) {
				if (i==0)
					colGroup.append("<col width='"+colWidth+"px'>");

				var tmpInsertRow = tmpMatrix.find('.row:last');
				tmpTag = "<td><div class='input_line matrix-box' parent='"+( (i*tmpCol)+j )+"'></div></td>";
				tmpInsertRow.append(tmpTag);
				_socket_matrix.emit('set_last_id', { group: _tmpGroup, tool: _toolName });
			}
		}
		$('.matrix_table tr:nth-child(even) td').css({width:colWidth+"px"});
		$('.matrix_table tr:nth-child(even) td:nth-child(even)').addClass("even");
		$('.matrix_table tr:nth-child(even) td:nth-child(odd)').addClass("c-even");
		$('.matrix_table tr:nth-child(odd) td:nth-child(even)').addClass("odd");
		$('.matrix_table tr:nth-child(odd) td:nth-child(odd)').addClass("c-odd");

		$('.matrix-box').click(function(e){
			if( e.target.localName == "div" )
				$('input:last', this).focus();					
		});
	}
}

// 키 입력 체크 함수 ( enter, backspace )
function keyDownCheck(t, e)
{
	var $div = $(t).parent();
	_key_code = e.keyCode;

	if( $(t).val().trim().length > 0  )
	{
		switch( _key_code )
		{
			case 13:
				addInput(t);
				break;
			case 9:
			case 38:
			case 40:
				addInput(t);
				return false;
				break;
		}
	}
	else if( $(t).val().trim().length < 1 && $("input",$div).length > 1 )
	{
		switch( _key_code )
		{
			case 8:
				delInput(t);
				return false;
				break;
			case 38:
				$(t).prev().focus();
				return false;
				break;
		}
	}
	return true;
}

function addInput(t)
{
	var $div = $(t).parent();
	var taskId = $(t).attr("taskid");
	var parent = $(t).parent().attr("parent");
	var idx = 0;
	$("input", $(t).parent()).each(function(i){
		if( $(this).attr("taskid") == taskId )
			idx = (i+1);
	});
	var val = $(t).val();
	_socket_matrix.emit('set_insert_tree_data', { group: _tmpGroup, tool: _toolName, id: taskId, parent: parent, index: idx, val: val });

	// 비어있는 input 박스 존재 유무 확인
	var existObj = null;
	$("input", $div).each(function(){
		if( $(this).val().trim().length < 1 )
			existObj = $(this);
	});
	// 아래 화살표
	if( existObj != null && _key_code == 40 )
		$(t).next().focus();
	// 위 화살표
	else if( existObj != null && _key_code == 38 )
		$(t).prev().focus();
	else if( existObj != null )
		existObj.focus();
	else
		_socket_matrix.emit('set_last_id', { group: _tmpGroup, tool: _toolName });
}

function delInput(t)
{
	var $div = $(t).parent();
	var taskId = $(t).attr("taskid");
	$(t).remove();
	_socket_matrix.emit('set_delete_tree_data', { group: _tmpGroup, tool: _toolName, id: taskId });
	$("input",$div).focus();
}

function makeInputbox(lastId, val)
{
	if( typeof(val) == "undefined" )
		val = "";
	var html = "<input taskid='"+lastId+"' type='text' class='matrix-input' name='matrix-input' onkeydown='javascript:return keyDownCheck(this, event);' onfocus='focusInput(this);' value='"+val+"'>";
	return html;
}

// 이전에 작성중이였던 box를 찾아서 input 추가
function addInputbox( lastId , val )
{
	// 작성중이였던 input select
	var $input = $('.writing');
	$input.removeClass("writing");
	// 작성중이였던 div select
	var $div = $input.parent();
	var parent = $div.attr("parent");
	$div.append(makeInputbox(lastId, val));
	var h = $div.height();
	var td_obj = $div.parent().parent();
	$("div.matrix-box", td_obj).css("min-height", h+"px");

	// tab 키로 확장 했을 경우
	if( _key_code == 9 )
	{
		if( $('div[parent='+((parent*1)+1)+'] input:last').length > 0 )
			$('div[parent='+((parent*1)+1)+'] input:last').focus();
		else
			$('div[parent=0] input:last').focus();
	}
	// ↑
	else if( _key_code == 38 )
		$input.prev().focus();
	// ↓
	else if( _key_code == 40 )
		$input.next().focus();
	else
		$('input:last', $div).focus();
}

// 동기화를 위한 원격에서 input 요청
function addRemoteInputbox( lastId , val, parent, index )
{
	if( val.trim().length > 0 )
	{
		var $div = $(".matrix-box[parent="+parent+"]");
		// 데이터 수정일 때,
		if( $("input[taskid="+lastId+"]", $div).length > 0 )
		{
			$("input[taskid="+lastId+"]", $div).val(val);
		}
		// 데이터 추가 일 때,
		else
		{
			var len = $("input", $div).length;
			var emtpyInput = $("input[value='']", $div).length;
			if( len < 1 )
				$($div).append(makeInputbox(lastId, val));
			else if( len == 1 && emtpyInput > 0 )
				$("input", $div).before(makeInputbox(lastId, val));
			else if( len > 1 && emtpyInput > 0 )
				$("input:eq("+(len-2)+")",$div).after(makeInputbox(lastId, val));
			else if( len > 0 )
				$("input:eq("+(len-1)+")",$div).after(makeInputbox(lastId, val));
		}
	}
}

// 초기 box 생성시 input 생성
function setupBox(lastId)
{
	var $div = $(".matrix-box:not(input):eq("+boxCount+")");
	$div.append(makeInputbox(lastId, ""));
	boxCount++;
}

function focusInput(t)
{
	var taskId = $(t).attr("taskid");
	_socket_matrix.emit('set_input_data', { group: _tmpGroup, tool: _toolName, id: taskId, index: 0, client: tmpClient });
	if( $(".writing") == t )
		console.log("=");
	$(".writing").each(function(){
		//addInput( $(this) );
//		console.log( $(this).val() );
		$(this).removeClass("writing");
	});
	$(t).addClass("writing");
}

function setOption(data)
{
	if( data.option == "row" && data.val != "false" )
	{
		setupFlag.row = true;
		setupData.row = data.val;
		setDoMatrix();
	}
	else if( data.option == "row" && data.val == "false" )
	{
		setupFlag.row = false;
		setupData.row = 0;
	}
	else if( data.option == "col" && data.val != "false" )
	{
		setupFlag.col = true;
		setupData.col = data.val;
		setDoMatrix();
	}
	else if( data.option == "col" && data.val == "false" )
	{
		setupFlag.col = false;
		setupData.col = 0;
	}
	else if( data.option == "set" && data.val )
		setDoMatrix();
	else if( data.option == "set" && !data.val )
		setDoClear();
}

_socket_matrix.on('get_tree_data', function (data) {
	index = $(".matrix-box[parent="+data.parent+"]").length;
	addRemoteInputbox(data.id, data.val, data.parent, index);
});
_socket_matrix.on('get_client', function (data) {
	tmpClient = data.client;
});
// matrix setup
_socket_matrix.on('get_init_tool_data', function (data) {
	setupFlag.data_init = true;
});
_socket_matrix.on('get_tree_option_data', function (data) {
	setOption(data);
});
_socket_matrix.on('get_option_data', function (data) {
	setOption(data);
});

_socket_matrix.on('get_insert_tree_data', function (data) {
	addRemoteInputbox(data.id, data.val, data.parent, data.index);
});

_socket_matrix.on('get_delete_tree_data', function (data) {
	$("input[taskid="+data.id+"]").remove();
});

_socket_matrix.on('get_last_id', function (data) {
	var tmpTool = data.tool; 
	lastId = data.last;
	if( totalBoxCount != boxCount )
	{
		setupBox(lastId);
		$(".matrix-input:first").focus();
	}
	else
		addInputbox(lastId, "");
});

/*
_socket_matrix.on('get_input_data', function (data) {
//	console.log( data.client );
//	console.log( data.id );
});
*/