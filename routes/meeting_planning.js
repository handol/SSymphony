/*
 * GET select_meeting_template
 */
var mysql_conn = require('../sql/mysql_server').mysql_conn;
var util = require('../lib/util');
var EventEmitter = require('events').EventEmitter;


exports.set_meeting_planning = function(req, res){
	var evt = new EventEmitter();
	var dao_c = require('../sql/common');
	var dao_mp = require('../sql/meeting_planning');
	var post = util.regroup_post_for_meeting_planning(req.body);
	var unit_cnt = 0;
	var unit_2_cnt = 0;
	var complete_flag = 0;

	// 트랜젝션 실행
	dao_c.dao_begin_work(evt, mysql_conn);

	// 트랜젝션 실행 후
	evt.on('begin_work', function(err, rows){
		if(err) throw err;

		// unit 쿼리 실행 - Insert meeting_planning
		dao_mp.dao_set_meeting_planning(evt, mysql_conn, post[0]);

		evt.on('query_unit_1', function(err, rows){
			if(err)
				dao_c.dao_rollback(evt, mysql_conn);
			else
			{
				var idx_meeting = rows.insertId;
				// unit 쿼리 실행 - Insert agenda
				for( var i=0; i<post.length; i++ )
				{
					// set order 
					post[i]['order'] = (i+1);
					dao_mp.dao_set_meeting_planning_agenda(evt, mysql_conn, post[i]);
				}
				evt.on('query_unit_2', function(err, rows){
					if(err) 
						dao_c.dao_rollback(evt, mysql_conn);
					else
					{
						unit_cnt++;
						if( post.length == unit_cnt )
						{
							complete_flag++;
							if( complete_flag == 2 )
							{
								// 트랜젝션 커밋 실행
								dao_c.dao_commit(evt, mysql_conn);
								// 트랜젝션 커밋 실행 후
								evt.on('commit', function(err, rows){
									if(err) throw err;
									res.render('ajax/set_meeting_planning', {result:"successful"} );
								});
							}
						}
					}
				});
				// unit_2 쿼리 실행 - Insert relation_user_meeting
				if( typeof(post[0].users) != "undefined" && typeof(post[0].users) == "string" )
				{
					var unit_2_total_cnt = 1;
					post[0].users = { user:post[0].users, idx_meeting:idx_meeting };
					dao_mp.dao_set_meeting_planning_users(evt, mysql_conn, post[0].users);
				}
				else if( typeof(post[0].users) != "undefined" && typeof(post[0].users) == "object" )
				{
					var unit_2_total_cnt = post[0].users.length;
					for( var i=0; i<unit_2_total_cnt; i++ )
					{
						post[0].users[i] = { user:post[0].users[i], idx_meeting:idx_meeting };
						dao_mp.dao_set_meeting_planning_users(evt, mysql_conn, post[0].users[i]);
					}
				}
				evt.on('query_unit_3', function(err, rows){
					if(err) 
						dao_c.dao_rollback(evt, mysql_conn);
					else
					{
						unit_2_cnt++;
						if( unit_2_total_cnt == unit_2_cnt  )
						{
							complete_flag++;
							if( complete_flag == 2 )
							{
								// 트랜젝션 커밋 실행
								dao_c.dao_commit(evt, mysql_conn);
								// 트랜젝션 커밋 실행 후
								evt.on('commit', function(err, rows){
									if(err) throw err;
									res.render('ajax/set_meeting_planning', {result:"successful"} );
								});
							}
						}
					}
				});
			}
		});

		evt.on('rollback', function(err, rows){
			if(err) throw err;
			res.render('ajax/set_meeting_planning', {result:"failed"} );
		});
	});
};

exports.meeting_template = function(req, res){
	var evt = new EventEmitter();
	var dao_mp = require('../sql/meeting_planning');
	// params['idx_owner']
	// params['idx_owner_type']
	var params = { idx_owner:null, idx_owner_type:null }
	dao_mp.dao_meeting_template(evt, mysql_conn, params);
	evt.on('meeting_template', function(err, rows){
		if(err) throw err;
		res.render('select_meeting_template', {result:rows} );
	});
};

exports.setting_agenda = function(req, res){
	var evt = new EventEmitter();
	var dao_mp = require('../sql/meeting_planning');
	var dao_gi = require('../sql/group_info');
	// params['idx_owner']
	// params['idx_owner_type']
	// params['idx_meeting_planning']
	// params['idx_group']
	var params = { idx_owner:null, idx_owner_type:null, idx_meeting_planning:req.param('idx'), idx_group:1 }
	var complete_flag = 0;
	var result = { agenda:{}, users:{}, tools:{} };
	
	dao_mp.dao_load_agenda(evt, mysql_conn, params);
	evt.on('setting_agenda', function(err, rows){
		if(err) throw err;
		complete_flag++;
		result.agenda = rows;
		if( complete_flag == 3 )
			res.render('setting_agenda', {result:result} );
	});

	dao_mp.dao_load_tools(evt, mysql_conn, params);
	evt.on('load_tools', function(err, rows){
		if(err) throw err;
		complete_flag++;
		result.tools = rows;
		if( complete_flag == 3 )
			res.render('setting_agenda', {result:result} );
	});
	
	dao_gi.dao_group_info_member(evt, mysql_conn, params);
	evt.on('group_info_member', function(err, rows){
		if(err) throw err;
		complete_flag++;
		result.users = rows;
		if( complete_flag == 3 )
			res.render('setting_agenda', {result:result} );
	});


};

exports.setting_agenda_step = function(req, res){
	res.render('setting_agenda_step');
};
