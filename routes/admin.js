var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql2');
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

var config = {

	host: 'kmspilot2.mysql.database.azure.com',
	user: 'kmsadmin@kmspilot2',
	password: 'KMSproject1',
	database: 'kmspilot',
	port: 3306,
	ssl: true

};


// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){


    console.log(req.session.permission)

	if(req.session.permission != 'admin' || req.session.permission != 'project manager') { res.redirect('/') }
	else {
	var qry1 = 'SELECT * FROM users'
	var qry2 = 'SELECT * FROM project'
	
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
                				
                request.query(qry1, function(err, preresults0, fields) {
                    request.query(qry2, function(err, preresults, fields) {	
						
						var results = preresults.recordset;
						var results0 = preresults0.recordset;
							
						res.render('admin', {results: results, results0: results0, permissionLevel: req.session.permission});	
						conn.close();				
                    });				              
                });
                 				
		}
	});	
}
});

router.post('/updateUser', function(req, res){

	
	
	
	console.log('this happened')
	var qry= 'UPDATE users SET firstName= @firstName, lastName = @lastname, email = @email, cellNumber = @cellNumber, permissionLevel = @permissionLevel WHERE userID = @userID'	
    var qry1 = 'SELECT * FROM users'
	var qry2 = 'SELECT * FROM project'
	var updateQry1 = 'SELECT * FROM users WHERE userID = @userID'
	var updateQry2 = 'UPDATE kmsactionitem SET activityOwner = @activityOwner WHERE activityOwner = @oldActivityOwner'
	
	var updateType = 'updateUser'
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
                
				request.input("firstName", sql.VarChar, req.body.firstName);
				request.input("lastName", sql.VarChar, req.body.lastName);
				request.input("email", sql.VarChar, req.body.email);
				request.input("cellNumber", sql.VarChar, req.body.cellNumber);
				request.input("permissionLevel", sql.VarChar, req.body.permissionLevel);
				request.input("userID", sql.Int, req.body.userID)
				request.input("activityOwner", sql.VarChar, req.body.firstName + ' ' + req.body.lastName)

				request.query(updateQry1, function (err, results8, fields) {
					
					request.input("oldActivityOwner", sql.VarChar, results8.recordset[0].firstName + ' ' + results8.recordset[0].lastName)

					request.query(updateQry2, function (err, resultsss, fields) {
						request.query(qry, function (err, resultss, fields) { 
                    		request.query(qry1, function(err, preresults0, fields) {
                        		request.query(qry2, function(err, preresults, fields) {	
														
									var results0 = preresults0.recordset;
									var results = preresults.recordset;

									res.render('admin', {results: results, results0: results0, updateType: updateType, permissionLevel: req.session.permission});	
									conn.close();		

								});
							});
                        });				              
                    });
                }); 				
			}
		});
	
});

router.post('/deleteUser', ensureAuthenticated, function(req, res){

	
    var qry = 'DELETE FROM USERS WHERE userID = @userID'
    var qry1 = 'SELECT * FROM users'
	var qry2 = 'SELECT * FROM project'

	//Establishing connection to the database
    const conn = new sql.ConnectionPool(sqlconfig);
	var request = new sql.Request(conn);
	var updateType = 'updateUser'
	conn.connect(
		function (err) {
			if (err) {
				console.log("!!!! Cannot Connect !!!! Error")
				throw err;
			}
			else {
                console.log("Connection established.");

				request.input("userID", sql.Int, req.body.userID)

				request.query(qry, function (err, resultss, fields) { 
                    request.query(qry1, function(err, preresults0, fields) {
                        request.query(qry2, function(err, preresults, fields) {	
														
							var results0 = preresults0.recordset;
							var results = preresults.recordset;

							res.render('admin', {results: results, results0: results0, updateType: updateType, permissionLevel: req.session.permission});	
							conn.close();				
                        });				              
                    });
                }); 				
			}
		}); 
});

router.post('/registerProject', ensureAuthenticated, function(req, res){

    var qry = 'INSERT INTO PROJECT (clientName, projectName, location, serviceType, targetStartDate, targetCompletionDate, openProject, projectNumber) VALUES (@clientName, @projectName, @location, @serviceType, @targetStartDate, @targetCompletionDate, \'open\', @projectNumber) DECLARE @ID int set @ID = SCOPE_IDENTITY() INSERT INTO kmsActionItem (actionItemDescription, projectID) VALUES(\'Contract Signed\', @ID), (\'Business Plan Complete\', @ID), (\'Project Management Plan Complete\', @ID)';
	var qry1 = 'SELECT * FROM users'
    var qry2 = 'SELECT * FROM project'
    
	var targetCompletionDate = req.body.targetCompletionDate
	var targetStartDate = req.body.targetStartDate

	if (req.body.targetStartDate == ""){targetStartDate = null};
    if (req.body.targetCompletionDate == ""){targetCompletionDate = null};

	var updateType = 'updateProject'
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
                
				request.input("clientName", sql.VarChar, req.body.clientName);
				request.input("openProject", sql.VarChar, req.body.openProject);
                request.input("projectName", sql.VarChar, req.body.projectName);
            	request.input("location", sql.VarChar, req.body.location);
                request.input("serviceType", sql.VarChar, req.body.serviceType);
            	request.input("targetStartDate", sql.Date, targetStartDate);
				request.input("targetCompletionDate", sql.Date, targetCompletionDate);
				request.input("projectNumber", sql.VarChar, req.body.projectNumber);
				
				request.query(qry, function (err, resultss, fields) { 
                    request.query(qry1, function(err, preresults0, fields) {
                        request.query(qry2, function(err, preresults, fields) {	
							
							var results = preresults.recordset;
							var results0 = preresults0.recordset;
							
							res.render('admin', {results: results, results0: results0, updateType: updateType, permissionLevel: req.session.permission});	
							conn.close();				
                        });				              
                    });
                }); 				
			}
		});
});

router.post('/updateProject', ensureAuthenticated, function(req, res){

	console.log(req.body.openProject)

	var targetCompletionDate = req.body.targetCompletionDate
	var targetStartDate = req.body.targetStartDate

	if (req.body.targetStartDate == ""){targetStartDate = null};
    if (req.body.targetCompletionDate == ""){targetCompletionDate = null};

    var qry = 'UPDATE PROJECT SET openProject = @openProject, clientName = @clientName, projectName = @projectName, location = @location, serviceType = @serviceType, targetStartDate = @targetStartDate, targetCompletionDate = @targetCompletionDate, projectNumber = @projectNumber WHERE projectID = @projectID'
    var qry1 = 'SELECT * FROM users'
	var qry2 = 'SELECT * FROM project'
	
	var updateType = 'updateProject'

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
                
				request.input("clientName", sql.VarChar, req.body.clientName);
                request.input("projectName", sql.VarChar, req.body.projectName);
            	request.input("location", sql.VarChar, req.body.location);
                request.input("serviceType", sql.VarChar, req.body.serviceType);
            	request.input("targetStartDate", sql.Date, targetStartDate);
                request.input("targetCompletionDate", sql.Date, targetCompletionDate);
				request.input("openProject", sql.VarChar, req.body.openProject);
				request.input("projectNumber", sql.VarChar, req.body.projectNumber);
				request.input("projectID", sql.Int, req.body.projectID);

				request.query(qry, function (err, resultss, fields) { 
                    request.query(qry1, function(err, preresults0, fields) {
                        request.query(qry2, function(err, preresults, fields) {	
							
							var results = preresults.recordset;
							var results0 = preresults0.recordset;
							
							res.render('admin', {results: results, results0: results0, updateType: updateType, permissionLevel: req.session.permission});	
							conn.close();				
                        });				              
                    });
                }); 				
			}
		});

});

router.post('/deleteProject', ensureAuthenticated, function(req, res){

	
	var delqry1 = 'DELETE FROM projectactivity WHERE projectID = @projectID'
	var delqry7 = 'DELETE FROM lineitem WHERE projectID = @projectID'
	var delqry2 = 'DELETE FROM kmsActionItem WHERE projectID = @projectID'
	var delqry3 = 'DELETE FROM externalactionitem WHERE projectID = @projectID'
	var delqry4 = 'DELETE FROM costsummary WHERE projectID = @projectID'
	var delqry5 = 'DELETE FROM pco WHERE projectID = @projectID'
	var delqry6 = 'DELETE FROM projectassignment WHERE projectID = @projectID'
	var delqry = 'DELETE FROM PROJECT WHERE projectID = @projectID'

    var qry1 = 'SELECT * FROM users'
    var qry2 = 'SELECT * FROM project'

	var updateType = 'updateProject'
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

				request.input("projectID", sql.Int, req.body.projectID);

				request.query(delqry1, function (err, resultss, fields) { 
					request.query(delqry7, function (err, resultssss, fields) { 
					request.query(delqry2, function (err, resultss, fields) { 
						request.query(delqry3, function (err, resultss, fields) {
							request.query(delqry4, function (err, resultss, fields) {
								request.query(delqry5, function (err, resultss, fields) {
									request.query(delqry6, function (err, resultss, fields) {
										
										request.query(delqry, function (err, resultss, fields) {	
																				
											request.query(qry1, function(err, preresults0, fields) {
                        						request.query(qry2, function(err, preresults, fields) {	
							
														var results = preresults.recordset;
														var results0 = preresults0.recordset;
							
														res.render('admin', {results: results, results0: results0, updateType: updateType, permissionLevel: req.session.permission});	
														conn.close();

													});
												});
											});
										});
									});	
								});	
							});		
                        });				              
                    });
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