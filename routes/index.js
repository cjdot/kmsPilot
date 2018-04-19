var express = require('express');
var router = express.Router();
var mysql = require('mysql2');
var sql = require('mssql');

var config = {

	host: 'kmspilot2.mysql.database.azure.com',
	user: 'kmsadmin@kmspilot2',
	password: 'KMSproject1',
	database: 'kmspilot',
	port: 3306,
	ssl: true

};


var sqlconfig = {
	user: 'kmsadmin',
    password: 'KMSproject1',
    server: 'kempmspilot.database.windows.net', 
    database: 'kmspilot',
	options: {
		encrypt: true
	}
}


// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	
	var qry1 = 'SELECT TOP 10 kmsactionitem.projectID, project.projectName, kmsactionitem.actionItemDescription, kmsactionitem.targetCompletionDate FROM kmsactionitem INNER JOIN project ON kmsactionitem.projectID = project.projectID INNER JOIN users ON kmsactionitem.activityOwner = CONCAT(users.firstName, \' \', users.lastName) WHERE kmsactionitem.actualCompletionDate IS NULL AND project.openProject = \'open\' AND kmsactionitem.targetCompletionDate IS NOT NULL AND kmsactionitem.targetCompletionDate >= GETDATE() AND kmsactionitem.targetCompletionDate <= DATEADD(day, 7, GETDATE()) AND users.email = @email ORDER BY kmsactionitem.targetCompletionDate DESC';
	var qry2 = 'SELECT DISTINCT TOP 10 externalactionitem.projectID, project.projectName, externalactionitem.actionItemDescription, externalactionitem.targetCompletionDate, users.email FROM project INNER JOIN externalactionitem ON project.projectID = externalactionitem.projectID INNER JOIN projectassignment ON project.projectID = projectassignment.projectID INNER JOIN users ON projectassignment.userID = users.userID WHERE externalactionitem.actualCompletionDate IS NULL AND project.openProject = \'open\' AND users.email = @email AND externalactionitem.targetCompletionDate IS NOT NULL AND externalactionitem.targetCompletionDate >= GETDATE() AND externalactionitem.targetCompletionDate <= DATEADD(day, 7, GETDATE()) ORDER BY externalactionitem.targetCompletionDate DESC';
	
	if (req.session.permission == 'admin' || req.session.permission == 'project manager') {
		
		var qry3 = 'SELECT COUNT(kmsactionitem.actualCompletionDate) AS complete, COUNT(CASE WHEN kmsactionitem.activityStartDate <= GETDATE() AND kmsactionitem.actualCompletionDate IS NULL THEN 1 END) AS inProgress, COUNT( CASE WHEN activityStartDate IS NULL AND actualCompletionDate IS NULL OR activityStartDate > GETDATE() AND actualCompletionDate IS NULL THEN 1 END) AS notStarted FROM kmsactionitem INNER JOIN project ON kmsactionitem.projectID = project.projectID WHERE project.openProject = \'open\''
		var qry4 = 'SELECT COUNT(actualCompletionDate) AS complete, COUNT(CASE WHEN externalactionitem.activityStartDate <= GETDATE() AND externalactionitem.actualCompletionDate IS NULL THEN 1 END) AS inProgress, COUNT( CASE WHEN activityStartDate IS NULL AND actualCompletionDate IS NULL OR activityStartDate > GETDATE() AND actualCompletionDate IS NULL THEN 1 END) AS notStarted FROM externalactionitem INNER JOIN project on externalactionitem.projectID = project.projectID WHERE project.openProject= \'open\''
		
	} else {
		
		var qry3 = 'SELECT COUNT(kmsactionitem.actualCompletionDate) AS complete, COUNT(CASE WHEN kmsactionitem.activityStartDate <= GETDATE() AND kmsactionitem.actualCompletionDate IS NULL THEN 1 END) AS inProgress, COUNT( CASE WHEN activityStartDate IS NULL AND actualCompletionDate IS NULL OR activityStartDate > GETDATE() AND actualCompletionDate IS NULL THEN 1 END) AS notStarted FROM kmsactionitem INNER JOIN project ON kmsactionitem.projectID = project.projectID INNER JOIN users ON CONCAT(users.firstName, \' \', users.lastName) = kmsactionitem.activityOwner WHERE project.openProject = \'open\' AND users.email = @email'
		var qry4 = 'SELECT SUM(sub.complete) AS complete, SUM(sub.inProgress) AS inProgress, SUM( sub.notStarted) AS notStarted FROM (SELECT COUNT(actualCompletionDate) AS complete, COUNT(CASE WHEN externalactionitem.activityStartDate <= GETDATE() AND externalactionitem.actualCompletionDate IS NULL THEN 1 END) AS inProgress, COUNT( CASE WHEN activityStartDate IS NULL AND actualCompletionDate IS NULL OR activityStartDate > GETDATE() AND actualCompletionDate IS NULL THEN 1 END) AS notStarted, pa.userID, pa.projectID FROM externalactionitem INNER JOIN (SELECT DISTINCT userID, projectID FROM projectassignment) pa ON externalactionitem.projectID = pa.projectID INNER JOIN project ON externalactionitem.projectID = project.projectID WHERE project.openProject = \'open\' AND userID = @userID GROUP BY pa.userID, pa.projectID) AS sub'

	}
	
	console.log(req.session.userID)
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
				
				request.input("userID", sql.Int, req.session.userID);
				request.input("email", sql.VarChar, req.user);

                request.query(qry1, function(err, preresults0, fields) {
                    request.query(qry2, function(err, preresults, fields) {	
						request.query(qry3, function(err, preresults1, fields) {
							request.query(qry4, function(err, preresults2, fields) {
						
								var results = preresults.recordset;
								var results0 = preresults0.recordset;
								var results1 = preresults1.recordset;
								var results2 = preresults2.recordset;

								console.log(req.session.permission)
								console.log(preresults2.recordset)
								res.render('index', {results0:results0, results:results, results1:results1, results2:results2, permissionLevel: req.session.permission});	
								conn.close();	
							
							});
						});			
                    });				              
            	});             				
			}
	});	
});

// Get Homepage
router.post('/', ensureAuthenticated, function(req, res){
	
	var dateRange = req.body.dateRange;

	var updateType
	var qry3
	var qry4 
	
	if (req.session.permission == 'admin' || req.session.permission == 'project manager') {
		
		var qry3 = 'SELECT COUNT(kmsactionitem.actualCompletionDate) AS complete, COUNT(CASE WHEN kmsactionitem.activityStartDate <= GETDATE() AND kmsactionitem.actualCompletionDate IS NULL THEN 1 END) AS inProgress, COUNT( CASE WHEN activityStartDate IS NULL AND actualCompletionDate IS NULL OR activityStartDate > GETDATE() AND actualCompletionDate IS NULL THEN 1 END) AS notStarted FROM kmsactionitem INNER JOIN project ON kmsactionitem.projectID = project.projectID WHERE project.openProject = \'open\''
		var qry4 = 'SELECT COUNT(actualCompletionDate) AS complete, COUNT(CASE WHEN externalactionitem.activityStartDate <= GETDATE() AND externalactionitem.actualCompletionDate IS NULL THEN 1 END) AS inProgress, COUNT( CASE WHEN activityStartDate IS NULL AND actualCompletionDate IS NULL OR activityStartDate > GETDATE() AND actualCompletionDate IS NULL THEN 1 END) AS notStarted FROM externalactionitem INNER JOIN project on externalactionitem.projectID = project.projectID WHERE project.openProject= \'open\''
		
	} else {
		
		var qry3 = 'SELECT COUNT(kmsactionitem.actualCompletionDate) AS complete, COUNT(CASE WHEN kmsactionitem.activityStartDate <= GETDATE() AND kmsactionitem.actualCompletionDate IS NULL THEN 1 END) AS inProgress, COUNT( CASE WHEN activityStartDate IS NULL AND actualCompletionDate IS NULL OR activityStartDate > GETDATE() AND actualCompletionDate IS NULL THEN 1 END) AS notStarted FROM kmsactionitem INNER JOIN project ON kmsactionitem.projectID = project.projectID INNER JOIN users ON CONCAT(users.firstName, \' \', users.lastName) = kmsactionitem.activityOwner WHERE project.openProject = \'open\' AND users.email = @email'
		var qry4 = 'SELECT SUM(sub.complete) AS complete, SUM(sub.inProgress) AS inProgress, SUM( sub.notStarted) AS notStarted FROM (SELECT COUNT(actualCompletionDate) AS complete, COUNT(CASE WHEN externalactionitem.activityStartDate <= GETDATE() AND externalactionitem.actualCompletionDate IS NULL THEN 1 END) AS inProgress, COUNT( CASE WHEN activityStartDate IS NULL AND actualCompletionDate IS NULL OR activityStartDate > GETDATE() AND actualCompletionDate IS NULL THEN 1 END) AS notStarted, pa.userID, pa.projectID FROM externalactionitem INNER JOIN (SELECT DISTINCT userID, projectID FROM projectassignment) pa ON externalactionitem.projectID = pa.projectID INNER JOIN project ON externalactionitem.projectID = project.projectID WHERE project.openProject = \'open\' AND userID = @userID GROUP BY pa.userID, pa.projectID) AS sub'

	}
	
	if (dateRange == 'thisWeek'){
		
		var qry1 = 'SELECT TOP 10 kmsactionitem.projectID, project.projectName, kmsactionitem.actionItemDescription, kmsactionitem.targetCompletionDate FROM kmsactionitem INNER JOIN project ON kmsactionitem.projectID = project.projectID INNER JOIN users ON kmsactionitem.activityOwner = CONCAT(users.firstName, \' \', users.lastName) WHERE kmsactionitem.actualCompletionDate IS NULL AND project.openProject = \'open\' AND users.email = @email AND kmsactionitem.targetCompletionDate IS NOT NULL AND kmsactionitem.targetCompletionDate >= GETDATE() AND kmsactionitem.targetCompletionDate <= DATEADD(day, 7, GETDATE()) ORDER BY kmsactionitem.targetCompletionDate DESC';
		var qry2 = 'SELECT DISTINCT TOP 10 externalactionitem.projectID, project.projectName, externalactionitem.actionItemDescription, externalactionitem.targetCompletionDate, users.email FROM project INNER JOIN externalactionitem ON project.projectID = externalactionitem.projectID INNER JOIN projectassignment ON project.projectID = projectassignment.projectID INNER JOIN users ON projectassignment.userID = users.userID WHERE externalactionitem.actualCompletionDate IS NULL AND project.openProject = \'open\' AND users.email = @email AND externalactionitem.targetCompletionDate IS NOT NULL AND externalactionitem.targetCompletionDate >= GETDATE() AND externalactionitem.targetCompletionDate <= DATEADD(day, 7, GETDATE()) ORDER BY externalactionitem.targetCompletionDate DESC';
	

		updateType = 'thisWeek'
	}

	else if (dateRange == 'thisWeek2'){
		
		var qry1 = 'SELECT TOP 10 kmsactionitem.projectID, project.projectName, kmsactionitem.actionItemDescription, kmsactionitem.targetCompletionDate FROM kmsactionitem INNER JOIN project ON kmsactionitem.projectID = project.projectID INNER JOIN users ON kmsactionitem.activityOwner = CONCAT(users.firstname, \' \', users.lastName) WHERE kmsactionitem.actualCompletionDate IS NULL AND users.email = @email AND project.openProject = \'open\' AND kmsactionitem.targetCompletionDate IS NOT NULL AND kmsactionitem.targetCompletionDate >= GETDATE() AND kmsactionitem.targetCompletionDate <= DATEADD(day, 14, GETDATE())  ORDER BY kmsactionitem.targetCompletionDate DESC';
		var qry2 = 'SELECT DISTINCT TOP 10 externalactionitem.projectID, project.projectName, externalactionitem.actionItemDescription, externalactionitem.targetCompletionDate, users.email FROM project INNER JOIN externalactionitem ON project.projectID = externalactionitem.projectID INNER JOIN projectassignment ON project.projectID = projectassignment.projectID INNER JOIN users ON projectassignment.userID = users.userID WHERE externalactionitem.actualCompletionDate IS NULL AND project.openProject = \'open\' AND users.email = @email AND externalactionitem.targetCompletionDate IS NOT NULL AND externalactionitem.targetCompletionDate >= GETDATE() AND externalactionitem.targetCompletionDate <= DATEADD(day, 14, GETDATE()) ORDER BY externalactionitem.targetCompletionDate DESC';

		updateType = 'thisWeek2'
	}
	
	else if (dateRange == 'thisMonth'){
		
		var qry1 = 'SELECT TOP 10 kmsactionitem.projectID, project.projectName, kmsactionitem.actionItemDescription, kmsactionitem.targetCompletionDate FROM kmsactionitem INNER JOIN project ON kmsactionitem.projectID = project.projectID INNER JOIN users ON kmsactionitem.activityOwner = CONCAT(users.firstName, \' \', users.lastName) WHERE kmsactionitem.actualCompletionDate IS NULL AND users.email = @email AND project.openProject = \'open\' AND kmsactionitem.targetCompletionDate IS NOT NULL AND kmsactionitem.targetCompletionDate >= GETDATE() AND kmsactionitem.targetCompletionDate <= DATEADD(day, 30, GETDATE())  ORDER BY kmsactionitem.targetCompletionDate DESC';
		var qry2 = 'SELECT DISTINCT TOP 10 externalactionitem.projectID, project.projectName, externalactionitem.actionItemDescription, externalactionitem.targetCompletionDate, users.email FROM project INNER JOIN externalactionitem ON project.projectID = externalactionitem.projectID INNER JOIN projectassignment ON project.projectID = projectassignment.projectID INNER JOIN users ON projectassignment.userID = users.userID WHERE externalactionitem.actualCompletionDate IS NULL AND project.openProject = \'open\' AND users.email = @email AND externalactionitem.targetCompletionDate IS NOT NULL AND externalactionitem.targetCompletionDate >= GETDATE() AND externalactionitem.targetCompletionDate <= DATEADD(day, 30, GETDATE()) ORDER BY externalactionitem.targetCompletionDate DESC';

		updateType = 'thisMonth'
	}
	
	else if (dateRange == 'pastDue'){
		
		var qry1 = 'SELECT TOP 10 kmsactionitem.projectID, project.projectName, kmsactionitem.actionItemDescription, kmsactionitem.targetCompletionDate FROM kmsactionitem INNER JOIN project ON kmsactionitem.projectID = project.projectID INNER JOIN users ON kmsactionitem.activityOwner = CONCAT(users.firstName, \' \', users.lastName) WHERE kmsactionitem.actualCompletionDate IS NULL AND users.email = @email AND project.openProject = \'open\' AND kmsactionitem.targetCompletionDate IS NOT NULL AND kmsactionitem.targetCompletionDate <= GETDATE() ORDER BY kmsactionitem.targetCompletionDate DESC';
		var qry2 = 'SELECT DISTINCT TOP 10 externalactionitem.projectID, project.projectName, externalactionitem.actionItemDescription, externalactionitem.targetCompletionDate FROM project INNER JOIN externalactionitem ON project.projectID = externalactionitem.projectID INNER JOIN projectassignment ON project.projectID = projectassignment.projectID INNER JOIN users ON projectassignment.userID = users.userID WHERE externalactionitem.actualCompletionDate IS NULL AND project.openProject = \'open\' AND externalactionitem.targetCompletionDate IS NOT NULL AND externalactionitem.targetCompletionDate <= GETDATE() AND users.email = @email ORDER BY externalactionitem.targetCompletionDate DESC';

		updateType = 'pastDue'
	}
	
	else {
	
	var qry1 = 'SELECT TOP 10 kmsactionitem.projectID, project.projectName, kmsactionitem.actionItemDescription, kmsactionitem.targetCompletionDate FROM kmsactionitem INNER JOIN project ON kmsactionitem.projectID = project.projectID INNER JOIN users ON kmsactionitem.activityOwner = CONCAT(users.firstName, \' \', users.lastName) WHERE kmsactionitem.actualCompletionDate IS NULL AND users.email = @email AND project.openProject = \'open\' AND kmsactionitem.targetCompletionDate IS NOT NULL AND kmsactionitem.targetCompletionDate >= GETDATE() AND kmsactionitem.targetCompletionDate <= DATEADD(day, 7, GETDATE())  ORDER BY kmsactionitem.targetCompletionDate DESC';
	var qry2 = 'SELECT TOP 10 externalactionitem.projectID, project.projectName, externalactionitem.actionItemDescription, externalactionitem.targetCompletionDate FROM externalactionitem INNER JOIN project ON externalactionitem.projectID = project.projectID WHERE externalactionitem.actualCompletionDate IS NULL AND project.openProject = \'open\' AND externalactionitem.targetCompletionDate IS NOT NULL AND externalactionitem.targetCompletionDate >= GETDATE() AND externalactionitem.targetCompletionDate <= DATEADD(day, 7, GETDATE()) ORDER BY externalactionitem.targetCompletionDate DESC';

	
	}
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
				
				request.input("userID", sql.Int, req.session.userID)
				request.input("email", sql.VarChar, req.user);
				
                request.query(qry1, function(err, preresults0, fields) {
                    request.query(qry2, function(err, preresults, fields) {	
						request.query(qry3, function(err, preresults1, fields) {
							request.query(qry4, function(err, preresults2, fields) {
														
								var results0 = preresults0.recordset;
								var results = preresults.recordset;
								var results1 = preresults1.recordset;
								var results2 = preresults2.recordset;

								res.render('index', {results0:results0, results:results, results1:results1, results2:results2, updateType:updateType, permissionLevel: req.session.permission});	
								conn.close();	
							
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