var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql2');
var bcrypt = require('bcryptjs');

var User = require('../models/user');



// Register
router.get('/register', function(req, res){
	res.render('register');
});

//PDF Builder
var config = {

	host: 'kmspilot2.mysql.database.azure.com',
	user: 'kmsadmin@kmspilot2',
	password: 'KMSproject1',
	database: 'kmspilot',
	port: 3306,
	ssl: true

};

router.get('/builder', ensureAuthenticated, function (req, res) {
	
	const conn = new mysql.createConnection(config);
	conn.connect(
		function (err) {
			if (err) {
				console.log("!!!! Cannot Connect !!! Error:");
				throw err;
			}
			else {
				console.log("Connection established.");
			}
		}

	)

	var qry1 = 'SELECT * FROM user'
    var qry2 = 'SELECT * FROM project'
    
    conn.query(qry1, function (err, results0, fields) { 
        conn.query(qry2, function (err, results, fields){

            res.render('builder', {results0:results0, results:results});
        });
	});
	
});

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

	if(errors){
		res.render('admin',{
			errors:errors
		});
	} else {
        
        

		//This code below hashes the password to store in database
		let hash = bcrypt.hashSync(password, 10);

		//This executes the insert statement			
		//queryDatabase(newUser.firstName, newUser.lastName, newUser.email, hash, newUser.phoneNumber, newUser.permission)

		const conn = new mysql.createConnection(config);
		conn.connect(
		function (err) {
			if (err) {
				console.log("!!!! Cannot Connect !!! Error:");
				throw err;
			}
			else {
				console.log("Connection established.");
			}
		});

		var qry2= 'INSERT INTO user (firstName, lastName, email, password, cellNumber, permissionLevel) VALUES( ?, ?, ?, ?, ?, ?)'
		console.log(firstName + ' ' + lastName + ' ' + email + ' ' + hash + ' ' + phoneNumber + ' ' + permission)
		conn.query( qry2, [firstName, lastName, email, hash, phoneNumber, permission], function(err, results, fields){
			if (err) throw err;
			console.log(results)
			req.flash('success_msg', 'New User has been registered');
			res.redirect('/admin');			
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

        var config = {

			host: 'kmspilot.mysql.database.azure.com',
			user: 'kmsadmin@kmspilot',
			password: 'KMSproject1',
			database: 'kmspilot',
			port: 3306,
			ssl: true
		
		};

		const conn = new mysql.createConnection(config);
        conn.connect(
			function (err) {
				if (err) {
					console.log("!!!! Cannot Connect !!! Error:");
					throw err;
				}
				else {
					console.log("Connection established.");
				}
			}
		
		)
		
		var qry = 'SELECT email, password FROM user WHERE email = ?'
		console.log(qry);
		conn.query( qry, req.body.email, function(err, results, fields){
			
			if (err) throw err;
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



