
	var window_height = $(window).height();
	/* chart colors default */
	var $chrt_border_color = "#efefef";
	var $chrt_grid_color = "#DDD"
	
	var $chrt_main = "#E24913";
	var $chrt_second = "#4b99cb";
	var $chrt_third = "#FF9F01";
	var $chrt_fourth = "#87BA17";
	var $chrt_fifth = "#BD362F";
	var $chrt_mono = "#000";

	var dialog = null;
	
	$(document).ready( function() {   
		init();

		setup_group_info();

		setup_timepicker();

		setup_all_buttons();

		setup_widgets_desktop();

		setup_charts();

		setup_meeting_template();

		setup_quick_meeting();
		
		enable_select2();
	}); 
	/* ---------------------------------------------------------------------- */
	/*	Init Start
	/* ---------------------------------------------------------------------- */
	function init()
	{
		$(window).resize(function(){
			window_height = $(window).height();
			$(".modal-body", dialog).css("max-height", window_height*0.7);
		});
	}
	/* ---------------------------------------------------------------------- */
	/*	Init End
	/* ---------------------------------------------------------------------- */

	/* ---------------------------------------------------------------------- */
	/*	Group Info Start
	/* ---------------------------------------------------------------------- */
	function setup_group_info()
	{
		$('#group-info .row-fluid [class*="span"]:nth-child(3)').css("margin-left","0");
	}
	/* ---------------------------------------------------------------------- */
	/*	Group Info End
	/* ---------------------------------------------------------------------- */

	/* ---------------------------------------------------------------------- */
	/*	Quick Meeting End
	/* ---------------------------------------------------------------------- */
	function setup_quick_meeting()
	{
		if ($('#start-btn1 .make').length){
			$('#start-btn1 .make').click(function(e) {
				e.preventDefault();
				$.get("/page/quick_meeting",null,function(html){
					dialog = bootbox.dialog(html, [{
						"label" : "Cancel",
						"class" : "btn-primary medium",
						"callback": function() {
							return true;
						}
					}]);
					$(".modal-body", dialog).css("max-height", window_height*0.7);
				},"html");
			});
		}// end if
	}
	/* ---------------------------------------------------------------------- */
	/*	Quick Meeting End
	/* ---------------------------------------------------------------------- */

	/* ---------------------------------------------------------------------- */
	/*	Meeting Planning
	/* ---------------------------------------------------------------------- */
	
	function set_meeting_planning()
	{
		var Options = {
			url: '/ajax/set_meeting_planning',
			type: 'POST',
			dataType: 'xml',
			resetForm: false,
			beforeSubmit: function(){

			},
			success: function(xml) {
				var Result = $(xml).find('Result').text();

				if( Result == "Successful" ) 
				{
					location.href="/page/meeting"
				}		
				else if( Result == "Error")
				{
					var Error_str = $(xml).find('Error_str').text();
					alert(Error_str);
				}
			}
		};
		$('#wizard-form').ajaxSubmit(Options);
	}

	function setup_meeting_template()
	{
		if ($('#start-btn .make').length ){

			$('#start-btn .make').click(function(e) {
				e.preventDefault();
				var search_input = '<input type="text" name="search" class="search">';
				$.get("/page/meeting_template",null,function(html){
					dialog = bootbox.dialog(html, [],{
						"header":search_input
					});
					$(".meeting-planning-node").on("mouseover", function(){
						var idx = $(this).attr("idx");
						$("#meeting-template .agenda-preview").hide();
						$("#meeting-template .agenda-preview[idx="+idx+"]").show();
					});

					$(".meeting-planning-node").on("click", function(){
						var idx = $(this).attr("idx");
						$("#meeting-template .meeting-template-view").hide();
						$("#meeting-template .meeting-setting").show();
						$("#meeting-template .meeting-agenda-edit").hide();
						var $target = $("#meeting-template .meeting-agenda-edit[idx="+idx+"]");
						$target.show();
						$("#meeting-template form[name=meeting_planning]").removeClass("active");
						$("form[name=meeting_planning]", $target).addClass("active");
					});

					$(".modal-body", dialog).css("max-height", window_height*0.7);
					$("#start-btn").animate({
						width: '90'
					}, 640);

					if ($('#datepicker-js').length){
						var now = new Date();
						$('#datepicker-js').datepicker({
							monthNames: [". 1",". 2",". 3",". 4",". 5",". 6",". 7",". 8",". 9",". 10",". 11",". 12"],
							showMonthAfterYear: true,
							prevText: "◀",
							nextText: "▶",
							minDate: now,
							dateFormat: "mm-dd-y-D",
							onSelect : function(dateText){
								var d = dateText.toString().split("-");
								$("#meeting-template input[name=meeting_date_m]").val(d[0]);
								$("#meeting-template input[name=meeting_date_d]").val(d[1]);
								$("#meeting-template input[name=meeting_date_y]").val(d[2]);
								$("#meeting-template input[name=meeting_date_w]").val(d[3]);
								$("#meeting-template input[name=meeting_date]").val("20"+d[2]+"-"+d[0]+"-"+d[1]);
							}
						});
						var day;
						switch(now.getDay())
						{
							case 0:
								day = "Sun";
								break;
							case 1:
								day = "Mon";
								break;
							case 2:
								day = "Tue";
								break;
							case 3:
								day = "Wed";
								break;
							case 4:
								day = "Thu";
								break;
							case 5:
								day = "Fri";
								break;
							case 6:
								day = "Sat";
								break;
						}
						$("#meeting-template input[name=meeting_date_m]").val(now.getMonth()+1);
						$("#meeting-template input[name=meeting_date_d]").val(now.getDate());
						$("#meeting-template input[name=meeting_date_y]").val(now.getFullYear().toString().substring(2,4));
						$("#meeting-template input[name=meeting_date_w]").val(day);
						$("#meeting-template input[name=meeting_date]").val(now.format("yyyy-mm-dd"));
					}
					if ($('.timepicker-input').length) {
						$('.timepicker-input').each(function(){
							var d_t;
							var name = $(this).attr("name");
							var d = new Date();
							switch(name)
							{
								case "meeting_start_time":
									d_t = (d.getHours()+1)+":00";
									break;
								case "meeting_end_time":
									d_t = (d.getHours()+2)+":00";
									break;
								default:
									d_t = false;
							}
							$(this).val(d_t);
							$(this).timepicker({
								minuteStep: 10,
								showMeridian: false,
								defaultTime: "value"
							});
						});
					}
					$(".ok-btn").on("click", function(){
						setMeetingPlanning();
					});
					$(".prev-btn").on("click", function(){
						$(".meeting-template-view").show();
						$(".meeting-setting").hide();
						$(".meeting-agenda-edit").hide();
					});
					// search
					initSearchMeetingPlanningBtn();
					// member search
					initSearchMemberForMeetingBtn();
				},"html");
			});
		}// end if
	}

	function setMeetingPlanning()
	{
		var Options = {
			url: '/page/set_meeting_planning',
			type: 'POST',
			dataType: 'json',
			resetForm: false,
			beforeSubmit: function(){},
			success: function(json) {
				if(json.result === "successful")
					location.href="/page/meeting?idx_meeting="+json.idx_meeting;
				else
					alert(json.msg);
			}
		};
		$("#meeting-template form[name=meeting_planning][class=active]").ajaxSubmit(Options);
	}
	var _search_meeting_planing_flag = false;
	function initSearchMeetingPlanningBtn()
	{
		var cb = function(t, val)
		{
			if( $(t).val() === val )
			{
				if( _search_meeting_planing_flag )
				{
					_search_meeting_planing_flag = false;
					searchMeetingPlanning(val);
				}
			}
		}

		$(".modal input[name=search]").keyup(function(){
			var val = $(this).val();
			_search_meeting_planing_flag = true;
			window.setTimeout(cb, 500, this, val)
		});
	}

	function searchMeetingPlanning(val)
	{
		var html = "";
		var params = {val:val};
		$.ajax({
			url: '/page/search_meeting_planning',
			type: 'POST',
			data: params,
			dataType: 'json',
			success: function(json) {
				console.log(json);
				var meeting_planning_html = "";
				var agenda_html = "";
				var c, agenda_len;
				if( json.meeting_planning )
				{
					for(var i=0;i<json.meeting_planning.length;i++)
					{
						meeting_planning_html += '<li title="'+json.meeting_planning[i].subject+'" onclick="javascript:show_setting_agenda(\''+json.meeting_planning[i].idx+'\');" idx="'+json.meeting_planning[i].idx+'" class="meeting-planning-node">'+json.meeting_planning[i].subject+'</li>';

						if( i === 0 )
							c = "show";
						else
							c = "hide";
						agenda_html += '<li class="agenda-preview '+c+'" idx="'+json.meeting_planning[i].idx+'">';
						agenda_html += '<div class="subject">'+json.meeting_planning[i].subject+'</div>';
						agenda_html += '<div class="goal">'+json.meeting_planning[i].goal+'</div><ul>';
						agenda_len = json.agenda[json.meeting_planning[i].idx].length
						for(var j=0;j<agenda_len;j++)
						{
							if( json.agenda[json.meeting_planning[i].idx][j].subject )
							{
								agenda_html += '<li><div class="process-subject">' + json.agenda[json.meeting_planning[i].idx][j].subject + '</div>';
								if( agenda_len !== (j+1)  )
									agenda_html += '<div class="process-arrow"></div>';
								agenda_html += '</li>';
							}
						}
						agenda_html += '</ul></li>';
					}
				}
				$("#meeting-template .meeting-template-body .left-body ul").html(meeting_planning_html);
				$("#meeting-template .meeting-template-body .right-body ul.agenda").html(agenda_html);
				$(".meeting-planning-node").mouseover(function(){
					var idx = $(this).attr("idx");
					$("#meeting-template .agenda-preview").hide();
					$("#meeting-template .agenda-preview[idx="+idx+"]").show();
				});
			}
		});
	}
	
	var _search_member_for_meeting_flag;
	function initSearchMemberForMeetingBtn()
	{
		var cb = function(t, val)
		{
			if( $(t).val() === val )
			{
				if( _search_member_for_meeting_flag )
				{
					_search_member_for_meeting_flag = false;
					searchMemberForMeeting(val);
				}
			}
		}
		$("#meeting-template input[name=member]").keyup(function(){
			var val = $(this).val();
			_search_member_for_meeting_flag = true;
			window.setTimeout(cb, 500, this, val)
		});
	}
	function searchMemberForMeeting(user_id)
	{
		var html = "";
		if( user_id.length > 0 )
		{
			$.ajax({
				url: '/page/search_user_for_meeting',
				type: 'POST',
				data: {user_id:user_id},
				dataType: 'json',
				success: function(json) {
					if( json.length > 0 )
					{
						var id_name;
						var id_name_html;
						html += '<div class="contents-title">Select to add.</div>';
						html += '<ul class="search-user-list fancy-scrollbar">';
						for(var i=0; i<json.length; i++)
						{
							id_name_html = '<span class="user_id">'+json[i].id+'</span>';
							if( json[i].last_name.length < 1 )
								id_name_html += '<span class="user_name">('+json[i].first_name.trim()+')</span>';
							else
								id_name_html += '<span class="user_name">('+json[i].first_name.trim()+' '+json[i].last_name.trim()+')</span>';
							id_name = json[i].id+'('+json[i].first_name+' '+json[i].last_name+')';
							html += '<li class="searched-user-node" idx="'+json[i].idx+'" title="'+id_name+'">'+id_name_html+'</li>';
						}
						html += '</ul>';
					}
					else
						html = '<div class="no-result">No results</div>';
					$("#light-popup").css({
						"display":"block",
						"top":"455px",
						"left":"335px",
						"z-index":"999999"
					});
					$("#light-popup .contents").html(html);
					$("#light-popup .searched-user-node").on("click", function(){
						var idx_user = $(this).attr("idx");
						var user_id = $(".user_id", this).html();
						var user_name = $(".user_name", this).html();
						addMemberForMeeting(idx_user, user_name);
					});
				}
			});
		}
		else
		{
			html = '<div class="no-result">No results</div>';
			$("#light-popup .contents").html(html);
		}
	}
	function addMemberForMeeting(idx_user, user_name)
	{
		user_name = user_name.replace("(","").replace(")","");
		var user_name_arr = user_name.split(" ");

		var html = "<span idx='"+idx_user+"' title='"+user_name+"'>";
		html += user_name_arr[0].substr(0,1);
		html += user_name_arr[1].substr(0,1)+"</span>";
		var input_html = "<input type='hidden' name='meeting_user_list[]' value='"+idx_user+"'>";
		$("#meeting-template .meeting-member-list").append(html);
		$("#meeting-template form[name=meeting_planning][class=active]").append(input_html);
		$("#meeting-template .meeting-member-list span").on("click",function(){
			delMemberForMeeting(idx_user);
		});
		initAddMemberPopdown();
	}
	function delMemberForMeeting(idx_user)
	{
		$("#meeting-template .meeting-member-list span[idx="+idx_user+"]").remove();
		$("#meeting-template form[name=meeting_planning][class=active] input[value="+idx_user+"]").remove();
	}

	// meeting planning page pointer
	var pmp = 0;

	function next_meeting_planning()
	{
		// page pointer 증가
		pmp++;
		show_meeting_planning(pmp)
	}

	function prev_meeting_planning()
	{
		// page pointer 감소
		pmp--;
		show_meeting_planning()
	}
	
	function show_meeting_planning()
	{
		switch(pmp)
		{
			case 0:
				show_meeting_template();
				break;
			case 1:
				$('#setting_agenda_1').addClass("step_show");
				$('#setting_agenda_1').removeClass("step_hidden");
				$('#setting_agenda_2').addClass("step_hidden");
				$('#setting_agenda_2').removeClass("step_show");
				$('#setting_agenda_3').addClass("step_hidden");
				$('#setting_agenda_3').removeClass("step_show");
				$(".modal-footer a.next", dialog).show();
				$(".modal-footer a.complete", dialog).hide();
				break;
			case 2:
				var meeting_subject = $('input[name=meeting_subject]');
				if(meeting_subject.val().trim().length < 1)
				{
					pmp--;
					meeting_subject.focus();
					return false;
				}
				$('#setting_agenda_1').addClass("step_hidden");
				$('#setting_agenda_1').removeClass("step_show");
				$('#setting_agenda_2').addClass("step_show");
				$('#setting_agenda_2').removeClass("step_hidden");
				$('#setting_agenda_3').addClass("step_show");
				$('#setting_agenda_3').removeClass("step_hidden");
				$(".modal-footer a.next", dialog).hide();
				$(".modal-footer a.complete", dialog).show();
				break;
			default:
				pmp = 0;
				show_meeting_template();
		}
	}

	function show_meeting_template()
	{
		$.get("/page/meeting_template", null,
		function(html){
			$(".modal-body", dialog).html(html);
			$(".modal-footer a.complete", dialog).hide();
			$(".modal-footer a.next", dialog).hide();
			$(".modal-footer a.prev", dialog).hide();
			$(".meeting-planning-node").mouseover(function(){
				var idx = $(this).attr("idx");
				$("#meeting-template .agenda-preview").hide();
				$("#meeting-template .agenda-preview[idx="+idx+"]").show();
			});
			$(".modal .search").focus();
			//setup_meeting_wizard();
		},"html");
	}
	
	// checkbox 와 muti selectbox 와 연동
	function select_item(item)
	{
		// step idx 
		var idx = $(item).parent().parent().parent().parent().parent().parent().attr("idx");
		var val = $(item).val();
		// option 선택
		var o = $("#inverse-tab"+idx+" select.with-search option[value="+val+"]", dialog);
		// select2 방식의 데이터 형식
		var data = {css:null, element:o, id:val, text:val};
		// close 버튼의 selector
		var close_selector = $("a.select2-search-choice-close."+val);
		if( $(item).attr("checked") == "checked" )
			$("#inverse-tab"+idx+" select.with-search", dialog).select2("onSelect",data);
		else if( $(item).attr("checked") != "checked" && close_selector.length !== 0 )
			$("#inverse-tab"+idx+" select.with-search", dialog).select2("unselect",close_selector);
	}

	function show_setting_agenda(idx)
	{
		// page pointer 증가
		pmp++;

		$(dialog).on("blur", "#agenda_step input[name=title]", function(){
			var idx = $(this).parent().parent().parent().attr("idx");
			if( $(this).val() == "" )
				$("#step-"+idx, dialog).html("Step "+idx);
			else
				$("#step-"+idx, dialog).html($(this).val());
		});

		// Load setting_agenda.html
		$.get("/page/setting_agenda",
		{	idx:idx	},
		function(html){
			$(".modal-body", dialog).html(html);
			$(".modal-footer a.next", dialog).show();
			$(".modal-footer a.prev", dialog).show();
			setup_meeting_wizard();
			setup_timepicker();
			//setup_datepicker();
			enable_select2();
		},"html");
	}
	
	// start_step_idx : 시작 step idx
	// step_cnt : step count
	function add_setting_agenda_step(start_step_idx, step_cnt)
	{
		$.get("/page/setting_agenda_step", {},
		function(step_html){
			for( var i=0; i<step_cnt; i++)
			{
				// step 에 내용 추가 및 아이디 부여
				$("#agenda_step .tab-content", dialog).append(step_html);
				$("#agenda_step fieldset:last", dialog).attr("id", "inverse-tab"+(start_step_idx+i));
				$("#agenda_step fieldset:last", dialog).attr("idx", (start_step_idx+i));
				// 타임 바 setup
				$("#agenda_step fieldset:last .timepicker-input", dialog).timepicker({
					minuteStep: 10,
					showMeridian: false,
					defaultTime: false
				});
				// 새로 추가된 step 활성화
				$("#agenda_step fieldset", dialog).removeClass("active");
				$("#agenda_step fieldset:last", dialog).addClass("active");
			}
			// 첫번째 step에 active (보여짐)
			if( $("#agenda_step fieldset.active", dialog).length == 0 )
				$("#agenda_step fieldset:first", dialog).addClass("active");
			enable_select2();
		},"html");
	}

	function add_process()
	{
		var len = $("#meeting-wizard ul li").length + 1;
		if( len === 1 )
			var active = "class='active'";
		else
			var active = "";
			
		var html = '<li '+active+'><span class="label badge-inverse">'+len+'</span><a id="step-'+len+'" href="#inverse-tab'+len+'" data-toggle="tab">Step '+len+'</a></li>';
		$("#meeting-wizard ul").append(html);
		$("#meeting-wizard ul li").removeClass("active");
		$("#meeting-wizard ul li:last").addClass("active");
		add_setting_agenda_step(len, 1);
	}
	
	function del_process()
	{
		$("#meeting-wizard ul li:last").remove();
		$("#agenda_step fieldset:last", dialog).remove();

		// active 된게 없으면
		if( $("#meeting-wizard ul li.active", dialog).length < 1 )
		{
			$("#meeting-wizard ul li:last").addClass("active");
			$("#agenda_step fieldset:last", dialog).addClass("active");
		}
	}

	/* ---------------------------------------------------------------------- */
	/*	Calendar
	/* ---------------------------------------------------------------------- */
		
	function setup_calendar() {

		if ($("#meeting-calendar").length) {
			var calendar = $('#meeting-calendar').fullCalendar({
				header: {
					left: 'title', //,today
					center: 'prev, next, today',
					right: 'month, agendaWeek, agenDay' //month, agendaDay, 
				},
				selectable: false,
				selectHelper: false,
				select: function(start, end, allDay) {
					var title = prompt('Event Title:');
					if (title) {
						calendar.fullCalendar('renderEvent',
							{
								title: title,
								start: start,
								end: end,
								allDay: allDay
							},
							false // make the event "stick"
						);
					}
					calendar.fullCalendar('unselect');
				},
				editable: false,
				events: events
			});
		};

		if ($("#group-calendar").length) {
			var date = new Date();
			var d = date.getDate();
			var m = date.getMonth();
			var y = date.getFullYear();
			
			var calendar = $('#group-calendar').fullCalendar({
				header: {
					left: 'title', //,today
					center: 'prev, next, today',
					right: 'month, agendaWeek, agenDay' //month, agendaDay, 
				},
				selectable: false,
				selectHelper: false,
				select: function(start, end, allDay) {
					var title = prompt('Event Title:');
					if (title) {
						calendar.fullCalendar('renderEvent',
							{
								title: title,
								start: start,
								end: end,
								allDay: allDay
							},
							false // make the event "stick"
						);
					}
					calendar.fullCalendar('unselect');
				},
				
				editable: false,
				events: events
			});
		};
		
		/* hide default buttons */
		$('.fc-header-right, .fc-header-center').hide();
	}	
	/* end calendar */

	/* ---------------------------------------------------------------------- */
	/*	All button functions
	/* ---------------------------------------------------------------------- */	
	
	function setup_all_buttons() {
		/* calendar buttons */

		$('div#calendar-buttons #btn-prev').click(function(){
		    $('#calendar .fc-button-prev').click();
		    return false;
		});
		
		$('div#calendar-buttons #btn-next').click(function(){
		    $('#calendar .fc-button-next').click();
		    return false; 
		});

		$('div#calendar-buttons #btn-today').click(function(){
		    $('#calendar .fc-button-today').click();
		    return false; 
		});
		
		$('div#calendar-buttons #btn-month').click(function(){
		    $('#calendar').fullCalendar('changeView', 'month');
		});
		
		$('div#calendar-buttons #btn-agenda').click(function(){
		    $('#calendar').fullCalendar('changeView', 'agendaWeek');
		});
		
		$('div#calendar-buttons #btn-day').click(function(){
		   $('#calendar').fullCalendar('changeView', 'agendaDay');
		});

		$('div#group-calendar-buttons #group-cal-btn-prev').click(function(){
		    $('#group-calendar .fc-button-prev').click();
		    return false;
		});
		
		$('div#group-calendar-buttons #group-cal-btn-next').click(function(){
		    $('#group-calendar .fc-button-next').click();
		    return false; 
		});

		$('div#group-calendar-buttons #group-cal-btn-today').click(function(){
		    $('#group-calendar .fc-button-today').click();
		    return false; 
		});
		
		$('div#group-calendar-buttons #group-cal-btn-month').click(function(){
		    $('#group-calendar').fullCalendar('changeView', 'month');
		});
		
		$('div#group-calendar-buttons #group-cal-btn-agenda').click(function(){
		    $('#group-calendar').fullCalendar('changeView', 'agendaWeek');
		});
		
		$('div#group-calendar-buttons #group-cal-btn-day').click(function(){
		   $('#group-calendar').fullCalendar('changeView', 'agendaDay');
		});
		
		/* end calendar buttons */

		/* reset widget */
		$('a#reset-widget').click(function(){
			resetWidget();
			return false;
		});
	}
	/* end all button functions */

	/* ---------------------------------------------------------------------- */
	/*	Widgets Desktop
	/* ---------------------------------------------------------------------- */	
	
	function setup_widgets_desktop() {

		if ($('#widget-grid-1').length){

			$('#widget-grid-1').jarvisWidgets({	
							
				grid: 'article',
				widgets: '.jarviswidget',
				localStorage: true,
				deleteSettingsKey: '#deletesettingskey-options',
				settingsKeyLabel: 'Reset settings?',
				deletePositionKey: '#deletepositionkey-options',
				positionKeyLabel: 'Reset position?',
				sortable: true,
				buttonsHidden: false,
				toggleButton: false,
				toggleClass: 'min-10 | plus-10',
				toggleSpeed: 200,
				onToggle: function(){},
				deleteButton: false,
				deleteClass: 'trashcan-10',
				deleteSpeed: 200,
				onDelete: function(){},
				editButton: false,
				editPlaceholder: '.jarviswidget-editbox',
				editClass: 'pencil-10 | edit-clicked',
				editSpeed: 200,
				onEdit: function(){},
				fullscreenButton: false,
				fullscreenClass: 'fullscreen-10 | normalscreen-10',	
				fullscreenDiff: 3,		
				onFullscreen: function(){},
				customButton: false,
				customClass: 'folder-10 | next-10',
				customStart: function(){ alert('Hello you, this is a custom button...') },
				customEnd: function(){ alert('bye, till next time...') },
				buttonOrder: '%refresh% %delete% %custom% %edit% %fullscreen% %toggle%',
				opacity: 1.0,
				dragHandle: '> header',
				placeholderClass: 'jarviswidget-placeholder',
				indicator: true,
				indicatorTime: 600,
				ajax: true,
				timestampPlaceholder:'.jarviswidget-timestamp',
				timestampFormat: 'Last update: %m%/%d%/%y% %h%:%i%:%s%',
			    refreshButton: true,
			    refreshButtonClass: 'refresh-10',
				labelError:'Sorry but there was a error:',
				labelUpdated: 'Last Update:',
				labelRefresh: 'Refresh',
				labelDelete: 'Delete widget:',
				afterLoad: function(){},
				rtl: false
				
			});
			
		} // end if
		
		if ($('#widget-grid-2').length){
			
			$('#widget-grid-2').jarvisWidgets({	
							
				grid: 'article',
				widgets: '.jarviswidget',
				localStorage: true,
				deleteSettingsKey: '#deletesettingskey-options',
				settingsKeyLabel: 'Reset settings?',
				deletePositionKey: '#deletepositionkey-options',
				positionKeyLabel: 'Reset position?',
				sortable: true,
				buttonsHidden: false,
				toggleButton: false,
				toggleClass: 'min-10 | plus-10',
				toggleSpeed: 200,
				onToggle: function(){},
				deleteButton: false,
				deleteClass: 'trashcan-10',
				deleteSpeed: 200,
				onDelete: function(){},
				editButton: false,
				editPlaceholder: '.jarviswidget-editbox',
				editClass: 'pencil-10 | edit-clicked',
				editSpeed: 200,
				onEdit: function(){},
				fullscreenButton: false,
				fullscreenClass: 'fullscreen-10 | normalscreen-10',	
				fullscreenDiff: 3,		
				onFullscreen: function(){},
				customButton: false,
				customClass: 'folder-10 | next-10',
				customStart: function(){ alert('Hello you, this is a custom button...') },
				customEnd: function(){ alert('bye, till next time...') },
				buttonOrder: '%refresh% %delete% %custom% %edit% %fullscreen% %toggle%',
				opacity: 1.0,
				dragHandle: '> header',
				placeholderClass: 'jarviswidget-placeholder',
				indicator: true,
				indicatorTime: 600,
				ajax: true,
				timestampPlaceholder:'.jarviswidget-timestamp',
				timestampFormat: 'Last update: %m%/%d%/%y% %h%:%i%:%s%',
			    refreshButton: true,
			    refreshButtonClass: 'refresh-10',
				labelError:'Sorry but there was a error:',
				labelUpdated: 'Last Update:',
				labelRefresh: 'Refresh',
				labelDelete: 'Delete widget:',
				afterLoad: function(){},
				rtl: false
				
			});
			
		} // end if
		
	}	
	/* end widgets desktop */

	/* ---------------------------------------------------------------------- */
	/*	Main charts
	/* ---------------------------------------------------------------------- */	
	function setup_charts() {
		/* bar chart */

		if ($("#bar-chart").length) {

			var data1 = [];
			for (var i = 0; i <= 4; i += 1)
				data1.push([i, parseInt(Math.random() * 100)]);

			var data2 = [];
			for (var i = 0; i <= 4; i += 1)
				data2.push([i, parseInt(Math.random() * 100)]);

			var data3 = [];
			for (var i = 0; i <= 4; i += 1)
				data3.push([i, parseInt(Math.random() * 100)]);

			var ds = new Array();

			ds.push({
				data : data1,
				bars : {
					show : true,
					barWidth : 0.2,
					order : 1,
				}
			});
			ds.push({
				data : data2,
				bars : {
					show : true,
					barWidth : 0.2,
					order : 2
				}
			});
			ds.push({
				data : data3,
				bars : {
					show : true,
					barWidth : 0.2,
					order : 3
				}
			});
			//Display graph
			$.plot($("#bar-chart"), ds, {
				colors : [$chrt_second, $chrt_fourth, "#666", "#BBB"],
				grid : {
					show : true,
					hoverable : true,
					clickable : true,
					tickColor : $chrt_border_color,
					borderWidth : 0,
					borderColor : $chrt_border_color,
				},
				legend : true,
				tooltip : true,
				tooltipOpts : {
					content : "<b>%x</b> = <span>%y</span>",
					defaultTheme : false
				}
			});
		}
		
		/* fill chart */
		if ($("#fill-chart").length) {
			var females = {
				'15%' : [[2, 84.8], [3, 93.7], [4, 100.6], [5, 105.8], [6, 113.3], [7, 119.3], [8, 124.3], [9, 131.4], [10, 136.9], [11, 143.8], [12, 149.4], [13, 151.2], [14, 152.3], [15, 155.9], [16, 154.7], [17, 157.0], [18, 156.1], [19, 155.4]],
				'90%' : [[2, 95.6], [3, 104.1], [4, 111.9], [5, 119.6], [6, 127.6], [7, 133.1], [8, 138.7], [9, 147.1], [10, 152.8], [11, 161.3], [12, 166.6], [13, 167.9], [14, 169.3], [15, 170.1], [16, 172.4], [17, 169.2], [18, 171.1], [19, 172.4]],
				'25%' : [[2, 87.2], [3, 95.9], [4, 101.9], [5, 107.4], [6, 114.8], [7, 121.4], [8, 126.8], [9, 133.4], [10, 138.6], [11, 146.2], [12, 152.0], [13, 153.8], [14, 155.7], [15, 158.4], [16, 157.0], [17, 158.5], [18, 158.4], [19, 158.1]],
				'10%' : [[2, 84.0], [3, 91.9], [4, 99.2], [5, 105.2], [6, 112.7], [7, 118.0], [8, 123.3], [9, 130.2], [10, 135.0], [11, 141.1], [12, 148.3], [13, 150.0], [14, 150.7], [15, 154.3], [16, 153.6], [17, 155.6], [18, 154.7], [19, 153.1]],
				'mean' : [[2, 90.2], [3, 98.3], [4, 105.2], [5, 112.2], [6, 119.0], [7, 125.8], [8, 131.3], [9, 138.6], [10, 144.2], [11, 151.3], [12, 156.7], [13, 158.6], [14, 160.5], [15, 162.1], [16, 162.9], [17, 162.2], [18, 163.0], [19, 163.1]],
				'75%' : [[2, 93.2], [3, 101.5], [4, 107.9], [5, 116.6], [6, 122.8], [7, 129.3], [8, 135.2], [9, 143.7], [10, 148.7], [11, 156.9], [12, 160.8], [13, 163.0], [14, 165.0], [15, 165.8], [16, 168.7], [17, 166.2], [18, 167.6], [19, 168.0]],
				'85%' : [[2, 94.5], [3, 102.8], [4, 110.4], [5, 119.0], [6, 125.7], [7, 131.5], [8, 137.9], [9, 146.0], [10, 151.3], [11, 159.9], [12, 164.0], [13, 166.5], [14, 167.5], [15, 168.5], [16, 171.5], [17, 168.0], [18, 169.8], [19, 170.3]],
				'50%' : [[2, 90.2], [3, 98.1], [4, 105.2], [5, 111.7], [6, 118.2], [7, 125.6], [8, 130.5], [9, 138.3], [10, 143.7], [11, 151.4], [12, 156.7], [13, 157.7], [14, 161.0], [15, 162.0], [16, 162.8], [17, 162.2], [18, 162.8], [19, 163.3]]
			};
			var dataset = [{
				label : 'SSymphony',
				data : females['mean'],
				lines : {
					show : true
				},
				color : "rgb(255,50,50)"
			}, {
				id : 'f15%',
				data : females['15%'],
				lines : {
					show : true,
					lineWidth : 0,
					fill : false
				},
				color : "rgb(255,50,50)"
			}, {
				id : 'f25%',
				data : females['25%'],
				lines : {
					show : true,
					lineWidth : 0,
					fill : 0.2
				},
				color : "rgb(255,50,50)",
				fillBetween : 'f15%'
			}, {
				id : 'f50%',
				data : females['50%'],
				lines : {
					show : true,
					lineWidth : 0.5,
					fill : 0.4,
					shadowSize : 0
				},
				color : "rgb(255,50,50)",
				fillBetween : 'f25%'
			}, {
				id : 'f75%',
				data : females['75%'],
				lines : {
					show : true,
					lineWidth : 0,
					fill : 0.4
				},
				color : "rgb(255,50,50)",
				fillBetween : 'f50%'
			}, {
				id : 'f85%',
				data : females['85%'],
				lines : {
					show : true,
					lineWidth : 0,
					fill : 0.2
				},
				color : "rgb(255,50,50)",
				fillBetween : 'f75%'
			}]
			$.plot($("#fill-chart"), dataset, {
				xaxis : {
					tickDecimals : 0
				},
				yaxis : {
					tickFormatter : function(v) {
						return Math.floor(v/24) ;
					}
				},
				legend: {
                    position: "ne", 
                    margin: [-5, -17]
                }
			});
		}
        /* end fill chart */

		/* site stats chart */
		if ($("#site-stats").length) {

			var SSymphony = [[1, 75], [3, 87], [4, 93], [5, 127], [6, 116]];
			//var visitors = [[1, 65], [3, 50], [4, 73], [5, 100], [6, 95]];

			var plot = $.plot($("#site-stats"), [{
				data : SSymphony,
				label : "SSymphony"
			},], {
				series : {
					lines : {
						show : true,
						lineWidth : 1,
						fill : true,
						fillColor : {
							colors : [{
								opacity : 0.1
							}, {
								opacity : 0.15
							}]
						}
					},
					points : {
						show : true
					},
					shadowSize : 0
				},
				xaxis : {
					mode : "time",
					tickLength : 10
				},

				yaxes : [{
					min : 20,
					tickLength : 5
				}],
				grid : {
					hoverable : true,
					clickable : true,
					tickColor : $chrt_border_color,
					borderWidth : 0,
					borderColor : $chrt_border_color,
				},
				tooltip : true,
				tooltipOpts : {
					content : "%s for <b>%x:00 hrs</b> was %y",
					dateFormat : "%y-%0m-%0d",
					defaultTheme : false
				},
				colors : [$chrt_main, $chrt_second],
				xaxis : {
					ticks : 15,
					tickDecimals : 2
				},
				yaxis : {
					ticks : 5,
					tickDecimals : 0
				},
				legend: {
                    position: "ne", 
                    margin: [-5, -17]
                }
			});
		}
		/* end site stats chart */

				/* site stats chart */

		if ($("#group-chart").length) {

			var pageviews = [[1, 75], [3, 87], [4, 93], [5, 127], [6, 116]];
			var visitors = [[1, 65], [3, 50], [4, 73], [5, 100], [6, 95]];

			var plot = $.plot($("#group-chart"), [{
				data : pageviews,
				label : "Your pageviews"
			}, {
				data : visitors,
				label : "Site visitors"
			}], {
				series : {
					lines : {
						show : true,
						lineWidth : 1,
						fill : true,
						fillColor : {
							colors : [{
								opacity : 0.1
							}, {
								opacity : 0.15
							}]
						}
					},
					points : {
						show : true
					},
					shadowSize : 0
				},
				xaxis : {
					mode : "time",
					tickLength : 10
				},

				yaxes : [{
					min : 20,
					tickLength : 5
				}],
				grid : {
					hoverable : true,
					clickable : true,
					tickColor : $chrt_border_color,
					borderWidth : 0,
					borderColor : $chrt_border_color,
				},
				tooltip : true,
				tooltipOpts : {
					content : "%s for <b>%x:00 hrs</b> was %y",
					dateFormat : "%y-%0m-%0d",
					defaultTheme : false
				},
				colors : [$chrt_main, $chrt_second],
				xaxis : {
					ticks : 15,
					tickDecimals : 2
				},
				yaxis : {
					ticks : 5,
					tickDecimals : 0
				},
				legend: {
                    position: "ne", 
                    margin: [-5, -17]
                }
			});
		}
		/* end site stats chart */
		
		/* sales chart */
		
		if ($("#saleschart").length) {
			var d = [[1196463600000, 0], [1196550000000, 0], [1196636400000, 0], [1196722800000, 77], [1196809200000, 3636], [1196895600000, 3575], [1196982000000, 2736], [1197068400000, 1086], [1197154800000, 676], [1197241200000, 1205], [1197327600000, 906], [1197414000000, 710], [1197500400000, 639], [1197586800000, 540], [1197673200000, 435], [1197759600000, 301], [1197846000000, 575], [1197932400000, 481], [1198018800000, 591], [1198105200000, 608], [1198191600000, 459], [1198278000000, 234], [1198364400000, 1352], [1198450800000, 686], [1198537200000, 279], [1198623600000, 449], [1198710000000, 468], [1198796400000, 392], [1198882800000, 282], [1198969200000, 208], [1199055600000, 229], [1199142000000, 177], [1199228400000, 374], [1199314800000, 436], [1199401200000, 404], [1199487600000, 253], [1199574000000, 218], [1199660400000, 476], [1199746800000, 462], [1199833200000, 500], [1199919600000, 700], [1200006000000, 750], [1200092400000, 600], [1200178800000, 500], [1200265200000, 900], [1200351600000, 930], [1200438000000, 1200], [1200524400000, 980], [1200610800000, 950], [1200697200000, 900], [1200783600000, 1000], [1200870000000, 1050], [1200956400000, 1150], [1201042800000, 1100], [1201129200000, 1200], [1201215600000, 1300], [1201302000000, 1700], [1201388400000, 1450], [1201474800000, 1500], [1201561200000, 546], [1201647600000, 614], [1201734000000, 954], [1201820400000, 1700], [1201906800000, 1800], [1201993200000, 1900], [1202079600000, 2000], [1202166000000, 2100], [1202252400000, 2200], [1202338800000, 2300], [1202425200000, 2400], [1202511600000, 2550], [1202598000000, 2600], [1202684400000, 2500], [1202770800000, 2700], [1202857200000, 2750], [1202943600000, 2800], [1203030000000, 3245], [1203116400000, 3345], [1203202800000, 3000], [1203289200000, 3200], [1203375600000, 3300], [1203462000000, 3400], [1203548400000, 3600], [1203634800000, 3700], [1203721200000, 3800], [1203807600000, 4000], [1203894000000, 4500]];
			for (var i = 0; i < d.length; ++i)
				d[i][0] += 60 * 60 * 1000;
			function weekendAreas(axes) {
				var markings = [];
				var d = new Date(axes.xaxis.min);
				// go to the first Saturday
				d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7))
				d.setUTCSeconds(0);
				d.setUTCMinutes(0);
				d.setUTCHours(0);
				var i = d.getTime();
				do {
					// when we don't set yaxis, the rectangle automatically
					// extends to infinity upwards and downwards
					markings.push({
						xaxis : {
							from : i,
							to : i + 2 * 24 * 60 * 60 * 1000
						}
					});
					i += 7 * 24 * 60 * 60 * 1000;
				} while (i < axes.xaxis.max);
				return markings;
			}
			var options = {
				xaxis : {
					mode : "time",
					tickLength : 5
				},
				series : {
					lines : {
						show : true,
						lineWidth : 1,
						fill : true,
						fillColor : {
							colors : [{
								opacity : 0.1
							}, {
								opacity : 0.15
							}]
						}
					},
                   //points: { show: true },
					shadowSize : 0
				},
				selection : {
					mode : "x"
				},
				grid : {
					hoverable : true,
					clickable : true,
					tickColor : $chrt_border_color,
					borderWidth : 0,
					borderColor : $chrt_border_color,
				},
				tooltip : true,
				tooltipOpts : {
					content : "Your sales for <b>%x</b> was <span>$%y</span>",
					dateFormat : "%y-%0m-%0d",
					defaultTheme : false
				},
				colors : [$chrt_second],
			};
			var plot = $.plot($("#saleschart"), [d], options);
		};
		
		/* end sales chart */
	}

	/* ---------------------------------------------------------------------- */
	/*	Setup_wizard_demo
	/* ---------------------------------------------------------------------- */	
	
	function setup_meeting_wizard() {
		if ($('#meeting_wizard').length) {
			$('#meeting_wizard').bootstrapWizard({
				'tabClass' : 'nav',
				'debug' : false,
				onShow : function(tab, navigation, index) {
					console.log('onShow');
				},
				onNext : function(tab, navigation, index) {
					console.log('onNext');
					if (index == 1) {
						// Make sure we entered the name
						if (!$('#name').val()) {
							//alert('You must enter your name');
							$('#name').focus();
							$('#name').closest('.control-group').removeClass('success');
							$('#name').closest('.control-group').addClass('error');
							return false;
						}
						if (!$('#lname').val()) {
							//alert('You must enter your last name');
							$('#lname').focus();
							$('#lname').closest('.control-group').removeClass('success');
							$('#lname').closest('.control-group').addClass('error');
							return false;
						}
					}
					$.jGrowl("Its nice to finally meet you! Please remember <b>"+$('#name').val()+",</b> this is only a demo. Not all the functions will work. For full documentation please see the link on top of the page", { 
						header: 'Hey there ' + $('#name').val()+'!', 
						sticky: true,
						theme: 'with-icon',
						easing: 'easeOutBack',
						animateOpen: { 
							height: "show"
						},
						animateClose: { 
							opacity: 'hide' 
						}
					});	
					// Set the name for the next tab
					//$('#inverse-tab3').html('Hello, ' + $('#name').val());

				},
				onPrevious : function(tab, navigation, index) {
					console.log('onPrevious');
				},
				onLast : function(tab, navigation, index) {
					console.log('onLast');
				},
				onTabClick : function(tab, navigation, index) {
					return true;
				},
				onTabShow : function(tab, navigation, index) {
					console.log('onTabShow');
					var $total = navigation.find('li').length;
					var $current = index + 1;
					var $percent = ($current / $total) * 100;
					$('#meeting_wizard').find('.bar').css({
						width : $percent + '%'
					});
				}
			});
		}// end if
	}
	
	/* end setup_wizard_demo */

	/* ---------------------------------------------------------------------- */
	/*	Setup_timepicker
	/* ---------------------------------------------------------------------- */	
	
	function setup_timepicker() {
		if ($('.timepicker-input').length) {
			$('.timepicker-input').each(function(){
				var d_t;
				var name = $(this).attr("name");
				var d = new Date();
				switch(name)
				{
					case "meeting_start_time":
						d_t = (d.getHours()+1)+":00";
						break;
					case "meeting_end_time":
						d_t = (d.getHours()+2)+":00";
						break;
					default:
						d_t = false;
				}
				$(this).timepicker({
					minuteStep: 10,
					showMeridian: false,
					defaultTime: d_t
				});
            });
		}
	}
	
	/* end setup_timepicker */
	
	/* ---------------------------------------------------------------------- */
	/*	Setup_datepicker
	/* ---------------------------------------------------------------------- */	
	
	function setup_datepicker() {
		if ($('#datepicker-js').length){
			var now = new Date();
			$('#datepicker-js').datepicker();
			$('#datepicker-js input').val(now.format("yyyy-mm-dd"));
		}// end if
	}	
	
	/* end setup_datepicker_demo */

	/* ---------------------------------------------------------------------- */
	/*	Enable Select2
	/* ---------------------------------------------------------------------- */
	
	function enable_select2() {
		if ($('select.with-search').length) {
			var s = $("select.with-search").select2();
		}
		if ($('input[type="checkbox"]').length) {
			$("input[type='checkbox']").uniform();
		}
		//$(".themed input[type='radio'], .themed input[type='checkbox'], .themed input[type='file'].file, .themed textarea").uniform();
	}
	
	/* end select2 */

	/* ---------------------------------------------------------------------- */
	/*	Activate_bt_accordion_hack
	/* ---------------------------------------------------------------------- */	
		
	$(function() {
		
		// credit: http://stackoverflow.com/questions/10918801/twitter-bootstrap-adding-a-class-to-the-open-accordion-title
	    $('.accordion').on('show', function (e) {
	         $(e.target).prev('.accordion-heading').find('.accordion-toggle').addClass('active');
	    });
	    
	    $('.accordion').on('hide', function (e) {
	        $(this).find('.accordion-toggle').not($(e.target)).removeClass('active');
	    });
	        
	});

	/* end activate_bt_accordion_hack */