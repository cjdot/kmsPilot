var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql2');
var bcrypt = require('bcryptjs');
var sql = require('mssql');

var User = require('../models/user');



// Register
router.get('/register', function(req, res){
	res.render('register');
});

var sqlconfig = {
	user: 'kmsadmin',
    password: 'KMSproject1',
    server: 'kempmspilot.database.windows.net', 
    database: 'kmspilot',
	options: {
		encrypt: true
	}
}

//PDF Builder
var config = {

	host: 'kmspilot2.mysql.database.azure.com',
	user: 'kmsadmin@kmspilot2',
	password: 'KMSproject1',
	database: 'kmspilot',
	port: 3306,
	ssl: true

};


// Login
router.get('/login', function(req, res){
	res.render('login');
});


//This function ensures that every route is authenticated with a user
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

// Register User
router.post('/register', function(req, res){
		
	var firstName = req.body.firstName;
  	var lastName = req.body.lastName;
	var email = req.body.email;
  	var password = req.body.password;
	var password2 = req.body.password2;
	var phoneNumber = req.body.phoneNumber;
	var permission = req.body.permission;

	// Validation
  	req.checkBody('firstName', 'First name is required').notEmpty();
  	req.checkBody('lastName', 'Last name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	req.checkBody('phoneNumber', 'Phone Number is required').notEmpty();
	req.checkBody('permission', 'Permission Level is required').notEmpty();

	var errors = req.validationErrors();
	var qry= 'INSERT INTO users (firstName, lastName, email, password, cellNumber, permissionLevel) VALUES( @firstName, @lastName, @email, @password, @cellNumber, @permissionLevel )'
	var qry1 = 'SELECT * FROM users'
	var qry2 = 'SELECT * FROM project'
	
	//This code below hashes the password to store in database
	let hash = bcrypt.hashSync(password, 10);

	//Establishing connection to the database
    const conn = new sql.ConnectionPool(sqlconfig);
	var request = new sql.Request(conn);

	if(errors){
		res.render('admin',{
			errors:errors
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
					request.input("password", sql.VarChar, hash);
					request.input("cellNumber", sql.VarChar, req.body.phoneNumber);
					request.input("permissionLevel", sql.VarChar, req.body.permission);
					
					request.query(qry, function (err, preresults0) {
						request.query(qry1, function (err, preresults1) {
							request.query(qry2, function (err, preresults2) {
							
								var results0 = preresults1.recordset;
								var results = preresults2.recordset;

								req.flash('success_msg', 'New User has been registered');		
								res.render('admin', {results0:results0, results:results});	
								conn.close();	

							});		
						});
					}); 				
				}
			});
		
	}
});



router.post('/login', function(req, res) {
	
	
	//Login form validation
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('login',{
			errors:errors
		});
	} else {


		var qry = 'SELECT email, password FROM users WHERE email = @email'
		
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
						request.input("email", sql.VarChar, req.body.email);

						request.query(qry, function(err, preresults, fields) {
							if (err) throw err;

							results = preresults.recordset;

							if (results.length > 0){	
								if (bcrypt.compareSync(req.body.password, results[0].password)){							
									req.login(results[0].email, results[0].password, function(err) {				
										res.redirect('/');
								})			
							} else {
								req.flash('error_msg', 'Incorrect Username or Password');
								res.redirect('/users/login')				
							} 
						} else {
						
							req.flash('error_msg', 'Incorrect Username or Password');
							res.redirect('/users/login');
						}	              
					});             				
				}
		});
	}
});

router.post('/forgot', function(req, res){

	/*
		I don't really know what I'm doing here, so feel free to rectify.
		The goal is to:
			- Compare forgot_email to the emails in the DB
			- If there is a match, change the password to a random string
			- Then execute the send function
			- Notify the user of success or failure
		Currently I am just trying to get it to give me something.
	*/

	//Email input present
	req.checkBody('forgot_email', 'Email is required for password reset').notEmpty();
	req.checkBody('forgot_email', 'Email is not valid').isEmail();

	var errors = req.validationErrors();

	if(errors){
		res.render('login',{
			errors:errors
		});
	} else {
		var qry3 = "SELECT email FROM users WHERE email = @forgot_email";
		var qry4 = "UPDATE users SET password = @temp_password WHERE email = @email"
		
		//Establishing connection to the database
		const conn = new sql.ConnectionPool(sqlconfig);
		var request = new sql.Request(conn);
		
		conn.connect(
			function (err) {
				if (err) {
					console.log("Forgot Password: connection cannot be made")
					throw err;
				}
				else {
						console.log("Forgot Password: connection made");
						request.input("forgot_email", sql.VarChar, req.body.forgot_email);

						request.query(qry3, function(err, preresults, fields) {
							if (err) throw err;

							results = preresults.recordset;

							if (results.length > 0){								
								console.log(results);
								
								var expr = /req.body.forgot_email/;
								var email_match = expr.test(results[0].email);
								console.log(email_match)

								if (email_match == true) {

									var temp_password = "";
									var possible = "ABCEFGHJKLMNPQRSTWXYZabcdefghijkmnpqrstuvwxyz23456789";

									for (var i = 0; i < 7; i++) {
										temp_password += possible.charAt(Math.floor(Math.random() * possible.length));
									}

									let hash = bcrypt.hashSync(temp_password, 10);
									//request.input("password", sql.VarChar, hash);

									console.log(temp_password) //Test
									console.log(hash) //Test

									/*request.query(qry4, function (err, preresults4) {
										var results4 = preresults4.recordset;
										req.flash('success_msg', 'Temporary password assigned. Please check your email.');			
										conn.close();	
									});*/

									conn.close();
								}
							} else {
								req.flash('error_msg', 'Email does not exist for any current user.');
								res.redirect('/users/login');
							}	              
					});             				
				}
		});
	}
});


router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});



//This is the passport code that we will use to securel authenticate our

/*passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));
*/


module.exports = router;

passport.serializeUser(function(email, done) {
  done(null, email);
});

passport.deserializeUser(function(email, done) {
    done(null, email);
});



