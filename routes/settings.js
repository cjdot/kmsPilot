var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var sql = require('mssql');

var sqlconfig = {
	user: 'kmsadmin',
    password: 'KMSproject1',
    server: 'kempmspilot.database.windows.net', 
    database: 'kmspilot',
	options: {
		encrypt: true
	}
}

router.get('/', ensureAuthenticated, function(req, res){
    console.log(req.user);
	
	var qry1 = 'SELECT * FROM users WHERE email = @email'
	
	//Establishing connection to the database
    const conn = new sql.ConnectionPool(sqlconfig);
	var request = new sql.Request(conn);
	
	conn.connect(
		function (err) {
			if (err) {
				console.log("!!!! Cannot Connect !!!! Error")
				throw err;
			}
			else {
				console.log("Connection established.");
				
				request.input("email", sql.VarChar, req.user);
                				
                request.query(qry1, function(err, results, fields) {
							
					res.render('settings', {results: results.recordset});
					conn.close();					              
                });
                 				
		}
	});	
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;