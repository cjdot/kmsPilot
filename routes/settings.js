var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var sql = require('mssql');
var bcrypt = require('bcryptjs');

var sqlconfig = {
	user: 'kmsadmin',
	password: 'KMSproject1',
	server: 'kempmspilot.database.windows.net',
	database: 'kmspilot',
	options: {
		encrypt: true
	}
}

router.get('/', ensureAuthenticated, function (req, res) {
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

				request.query(qry1, function (err, results, fields) {

					res.render('settings', { permissionLevel: req.session.permission, results: results.recordset });
					conn.close();
				});

			}
		});
});

router.post('/updateUser', function (req, res) {

	var qry = 'UPDATE users SET firstName= @firstName, lastName = @lastname, email = @email, cellNumber = @cellNumber WHERE userID = @userID'
	var qryy = 'UPDATE users SET firstName= @firstName, lastName = @lastname, email = @email, cellNumber = @cellNumber, password = @password WHERE userID = @userID'
	var qry1 = 'SELECT * FROM users WHERE userID = @userID'
	var updateNameqry = 'UPDATE kmsactionitem SET activityOwner = @activityOwner WHERE activityOwner = @oldActivityOwner'

	//Establishing connection to the database
	const conn = new sql.ConnectionPool(sqlconfig);
	var request = new sql.Request(conn);

	//This code below hashes the password to store in database
	let hash = bcrypt.hashSync(req.body.password, 10);

	if (req.body.password == '') {
		req.checkBody('firstName', 'First name is required').notEmpty();
		req.checkBody('lastName', 'Last name is required').notEmpty();
		req.checkBody('email', 'Email is required').notEmpty();
		req.checkBody('email', 'Email is not valid').isEmail();
		req.checkBody('cellNumber', 'Phone Number is required').notEmpty();

		var errors = req.validationErrors();

		if (errors) {
			conn.connect(
				function (err) {
					if (err) {
						console.log("!!!! Cannot Connect !!!! Error")
						throw err;
					}
					else {
						console.log("Connection established.");

						request.input("userID", sql.Int, req.body.userID);
						

						request.query(qry1, function (err, results, fields) {

							res.render('settings', { permissionLevel: req.session.permission, results: results.recordset, errors: errors });
							conn.close();
							
						});
					}
				});


		} else {
			
			conn.connect(
				function (err) {
					if (err) {
						console.log("!!!! Cannot Connect !!!! Error")
						throw err;
					}
					else {
						console.log("Connection established.");

						request.input("firstName", sql.VarChar, req.body.firstName);
						request.input("lastName", sql.VarChar, req.body.lastName);
						request.input("email", sql.VarChar, req.body.email);
						request.input("cellNumber", sql.VarChar, req.body.cellNumber);
						request.input("userID", sql.Int, req.body.userID)
						request.input("activityOwner", sql.VarChar, req.body.firstName + ' ' + req.body.lastName)

						request.query(qry1, function (err, results8, fields) {
							
							request.input("oldActivityOwner", sql.VarChar, results8.recordset[0].firstName + ' ' + results8.recordset[0].lastName)

							request.query(updateNameqry, function (err, resultsss, fields) {
								request.query(qry, function (err, results0, fields) {
									request.query(qry1, function (err, results, fields) {

									res.render('settings', { permissionLevel: req.session.permission, results: results.recordset });
									conn.close();

									});
								});
							});
						});
					}
				});
		}
	}
	else { 
		req.checkBody('firstName', 'First name is required').notEmpty();
		req.checkBody('lastName', 'Last name is required').notEmpty();
		req.checkBody('email', 'Email is required').notEmpty();
		req.checkBody('email', 'Email is not valid').isEmail();
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
		req.checkBody('cellNumber', 'Phone Number is required').notEmpty();

		var errors = req.validationErrors();

		if (errors) {
			conn.connect(
				function (err) {
					if (err) {
						console.log("!!!! Cannot Connect !!!! Error")
						throw err;
					}
					else {
						console.log("Connection established.");

						request.input("email", sql.VarChar, req.user);
						

						request.query(qry, function (err, results, fields) {

							res.render('settings', { permissionLevel: req.session.permission, results: results.recordset, errors: errors });
							conn.close();

						});
					}
				});


		} else {
			conn.connect(
				function (err) {
					if (err) {
						console.log("!!!! Cannot Connect !!!! Error")
						throw err;
					}
					else {
						console.log("Connection established.");

						request.input("firstName", sql.VarChar, req.body.firstName);
						request.input("lastName", sql.VarChar, req.body.lastName);
						request.input("email", sql.VarChar, req.body.email);
						request.input("cellNumber", sql.VarChar, req.body.cellNumber);
						request.input("userID", sql.Int, req.body.userID);
						request.input("password", sql.VarChar, hash);
						request.input("activityOwner", sql.VarChar, req.body.firstName + ' ' + req.body.lastName)

						request.query(qry1, function (err, results8, fields) {

							request.input("oldActivityOwner", sql.VarChar, results8.recordset[0].firstName + ' ' + results8.recordset[0].lastName)

							request.query(updateNameqry, function (err, resultsss, fields) {
								request.query(qryy, function (err, results0, fields) {
									request.query(qry1, function (err, results, fields) {

									res.render('settings', { permissionLevel: req.session.permission, results: results.recordset });
									conn.close();
									
									});
								});
							});
						});
					}
				});
		}
	}


});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error_msg', 'You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;