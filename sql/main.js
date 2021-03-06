// login
// params['id']
// params['pw']
exports.dao_login = function(evt, mysql_conn, params){
	// group
	var sql = "SELECT	`A`.`idx`, ";
	sql += "`A`.`id`, ";
	sql += "`A`.`pw`, ";
	sql += "`A`.`first_name`, ";
	sql += "`A`.`last_name`, ";
	sql += "`A`.`position`, ";
	sql += "`A`.`type`, ";
	sql += "`A`.`status`, ";
	sql += "`A`.`code`, ";
	sql += "md5('"+params['pw']+"') AS `input_pw` ";
	sql += "FROM `user` AS `A` ";
	sql += "WHERE `A`.`id` = '"+params['id']+"' ";

	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('login', err, rows);
	});
	return sql;
}

// check_email
// params['id']
exports.dao_check_email = function(evt, mysql_conn, params){
	// group
	var sql = "SELECT	COUNT(*) AS `cnt` ";
	sql += "FROM `user` AS `A` ";
	sql += "WHERE `A`.`id` = '"+params['id']+"' ";

	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('check_email', err, rows);
	});
	return sql;
}

// check_code
// params['code']
exports.dao_check_code = function(evt, mysql_conn, params){
	// group
	var sql = "SELECT	`idx`, ";
	sql += "`id`, ";
	sql += "`first_name`, ";
	sql += "`last_name` ";
	sql += "FROM `user` AS `A` ";
	sql += "WHERE `A`.`code` = '"+params['code']+"' ";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('check_code', err, rows);
	});
	return sql;
}

// mail_auth
// params['id']
exports.dao_mail_auth = function(evt, mysql_conn, params){
	// group
	var sql = "UPDATE `user` ";
	sql += "SET `status` = 'Y' ";
	sql += "WHERE `id` = '"+params['id']+"' ";

	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('mail_auth', err, rows);
	});
	return sql;
}


// sign_up
// params['id']
// params['pw']
// params['first_name']
// params['last_name']
// params['type']
// params['code']
exports.dao_sign_up = function(evt, mysql_conn, params){
	// group
	var sql = "INSERT INTO `user` ";
	sql += "SET `id` = '"+params['id']+"', ";
	sql += "`pw` = md5('"+params['pw']+"'), ";
	sql += "`first_name` = '"+params['first_name']+"', ";
	sql += "`last_name` = '"+params['last_name']+"', ";
	sql += "`type` = '"+params['type']+"', ";
	sql += "`code` = '"+params['code']+"' ";

	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('sign_up', err, rows);
	});
	return sql;
}