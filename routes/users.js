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

// Login
router.get('/login', function(req, res){
	res.render('login');
});


// Register User
router.post('/register', function(req, res){
		
	var firstName = req.body.firstName;
  var lastName = req.body.lastName;
	var email = req.body.email;
  var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
  req.checkBody('firstName', 'First name is required').notEmpty();
  req.checkBody('lastName', 'Last name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
        
        var newUser = {
					firstName: firstName,
					lastName: lastName,
					email: email,
					password: password
				}

				User.createUser(newUser, function(err, user){
				if(err) throw err;
				console.log(user);
				});

				req.flash('success_msg', 'You are registered and can now login');

				res.redirect('/users/login');
	}
});



router.post('/login', function(req, res) {
	
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
	
	var qry = 'SELECT email, password FROM account WHERE email = \'' + req.body.email + '\' limit 1'
	console.log(qry);
	conn.query( qry, function(err, results, fields){
		
		if (err) throw err;
		console.log(results[0].password);

		/*bcrypt.compare(results[0].password, hash, function(err, isMatch) {
			if(err) throw err;
			callback(null, isMatch);
		}); */	

		req.login(results[0].email, function(err) {
			
			res.redirect('/');
		})
		/*if (!err) {

			
			bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
				if(err) throw err;
				callback(null, isMatch);
			});
		} */
		//req.login()
	});

});

/*
router.post('/login', passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
	});
*/

router.get('/project', function(req, res) {
	if(!req.session.user) {
		return res.status(401).send();
	}

	return res.status(200).send("Super secret");
})

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;

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
passport.serializeUser(function(email, done) {
  done(null, email);
});

passport.deserializeUser(function(email, done) {
    done(null, email);
});

var config = {

	host: 'kmspilot.mysql.database.azure.com',
	user: 'kmsadmin@kmspilot',
	password: 'KMSproject1',
	database: 'kmspilot',
	port: 3306,
	ssl: true

};

