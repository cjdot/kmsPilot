var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql2');

var config = {

    host: 'kmspilot.mysql.database.azure.com',
    user: 'kmsadmin@kmspilot',
    password: 'KMSproject1',
    database: 'kmspilot',
    port: 3306,
    ssl: true

};

router.post('/updateProjectActivity', ensureAuthenticated, function(req, res){

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
	console.log(req.body.projectActivityID)
	var qry = 'UPDATE projectactivity SET activityDescription = ?, targetStartDate = ?, actualStartDate = ?, targetCompletionDate = ? WHERE projectActivityID = ?'
	var qry2 = 'SELECT * FROM projectactivity'
	console.log(qry);

	conn.query( qry, [req.body.activityDescription, req.body.targetStartDate, req.body.actualStartDate, req.body.targetCompletionDate, req.body.projectActivityID], function(err, results, fields){
		if(err){console.log(err)};
	});

	conn.query( qry2, function(err, results, fields){
		res.render('details_projectactivities', {results:results});
	});
	
});

router.get('/project', ensureAuthenticated, function(req, res){


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
	
	var qry = 'SELECT * FROM project'
	console.log(qry);

	conn.query( qry, function(err, results, fields){
		//var userss = res.json(results);
		//console.log(results);
		res.render('project', {results:results});
		
	});
});

router.get('/myProjects', ensureAuthenticated, function(req, res){


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
	
	var qry = 'SELECT project.projectID, project.clientName, project.projectName, project.projectedBudget, project.serviceType, project.location FROM project INNER JOIN projectassignment ON project.projectID = projectassignment.projectID INNER JOIN user ON projectassignment.userID = user.userID WHERE email = \'' + req.user + '\''
	console.log(qry);

	conn.query( qry, function(err, results, fields){
		//var userss = res.json(results);
		//console.log(results);
		res.render('project', {results:results});
		
	});
});

router.get('/details_actionItem', ensureAuthenticated, function(req, res){


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
	
	var qry = 'SELECT * FROM kmsactionitem WHERE activityOwner = \'' + req.user + '\''
	var qry2 = 'SELECT * FROM kmsactionitem'
	console.log(qry2);

	conn.query( qry2, function(err, results, fields){
		//var userss = res.json(results);
		//console.log(results);
		res.render('details_actionitem', {results:results});
		
	});
});



router.get('/details_clientreport', ensureAuthenticated, function(req, res){
	
	


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
	
	var qry = 'SELECT * FROM kmsactionitem WHERE activityOwner = \'' + req.user + '\''
	var qry2 = 'SELECT * FROM kmsactionitem'
	console.log(qry2);

	conn.query( qry2, function(err, results, fields){
		//var userss = res.json(results);
		//console.log(results);
		res.render('details_clientreport', {results:results});
		
	});
});

router.get('/details_costsummary', ensureAuthenticated, function(req, res){
	
	


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
	
	var qry = 'SELECT * FROM costsummary'
	console.log(qry);

	conn.query( qry, function(err, results, fields){
		//var userss = res.json(results);
		//console.log(results);
		res.render('details_costsummary', {results:results});
		
	});
});

router.get('/details_externalactionitem', ensureAuthenticated, function(req, res){
	
	


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
	
	var qry = 'SELECT * FROM externalacitonitem'
	console.log(qry);

	conn.query( qry, function(err, results, fields){
		//var userss = res.json(results);
		//console.log(results);
		res.render('details_externalactionitem', {results:results});
		
	});
});

router.get('/details_pcolog', ensureAuthenticated, function(req, res){
	
	


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
	
	var qry = 'SELECT * FROM pco'
	console.log(qry);

	conn.query( qry, function(err, results, fields){
		//var userss = res.json(results);
		//console.log(results);
		res.render('details_pcolog', {results:results});
		
	});
});

router.get('/details_projectactivities', ensureAuthenticated, function(req, res){
	
	


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
	
	var qry = 'SELECT * FROM projectactivity'
	console.log(qry);

	conn.query( qry, function(err, results, fields){
		//var userss = res.json(results);
		//console.log(results);
		res.render('details_projectactivities', {results:results});
		
	});
});

router.get('/details_projectoverview', ensureAuthenticated, function(req, res){
	
	


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
	
	var qry = 'SELECT * FROM project'
	console.log(qry);

	conn.query( qry, function(err, results, fields){
		//var userss = res.json(results);
		//console.log(results);
		res.render('details_projectoverview', {results:results});
		
	});
});

router.get('/userss', ensureAuthenticated, function(req, res){


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
	
	var qry = 'SELECT * FROM user'
	console.log(qry);

	conn.query( qry, function(err, results, fields){
		//var userss = res.json(results);
		//console.log(results);
		res.render('userss', {results:results});	
		
	});

		
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

passport.serializeUser(function(email, done) {
    done(null, email);
  });
  
  passport.deserializeUser(function(email, done) {
      done(null, email);
  });

  module.exports = router;