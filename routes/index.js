var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

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
	
	var qry1 = 'SELECT kmsactionitem.projectID, project.projectName, kmsactionitem.actionItemDescription, kmsactionitem.targetCompletionDate FROM kmsactionitem INNER JOIN project ON kmsactionitem.projectID = project.projectID WHERE kmsactionitem.targetCompletionDate IS NOT NULL ORDER BY kmsactionitem.targetCompletionDate DESC LIMIT 10';
	var qry2 = 'SELECT externalactionitem.projectID, project.projectName, externalactionitem.actionItemDescription, externalactionitem.targetCompletionDate FROM externalactionitem INNER JOIN project ON externalactionitem.projectID = project.projectID WHERE externalactionitem.targetCompletionDate IS NOT NULL ORDER BY externalactionitem.targetCompletionDate DESC LIMIT 10';
	var qry3 = 'SELECT (COUNT(targetCompletionDate) - COUNT(actualCompletionDate)) AS totalTarget, COUNT(actualCompletionDate) AS totalActual FROM kmsactionitem'
	var qry4 = 'SELECT (COUNT(targetCompletionDate) - COUNT(actualCompletionDate)) AS totalTarget2, COUNT(actualCompletionDate) AS totalActual2 FROM externalactionitem'
	conn.query(qry1, function (err, results0, fields) { 
		conn.query(qry2, function (err, results, fields){
			conn.query(qry3, function (err, results1, fields){
				conn.query(qry4, function (err, results2, fields){

					res.render('index', {results0:results0, results:results, results1:results1, results2:results2});
				});
			});
		});
	});
});

// Get Homepage
router.post('/', ensureAuthenticated, function(req, res){
	
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
	
	var dateRange = req.body.dateRange;
	
	var updateType
	if (dateRange == 'thisWeek'){
		
		var qry1 = 'SELECT kmsactionitem.projectID, project.projectName, kmsactionitem.actionItemDescription, kmsactionitem.targetCompletionDate FROM kmsactionitem INNER JOIN project ON kmsactionitem.projectID = project.projectID WHERE kmsactionitem.targetCompletionDate IS NOT NULL AND kmsactionitem.targetCompletionDate >= CURDATE() AND kmsactionitem.targetCompletionDate <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)  ORDER BY kmsactionitem.targetCompletionDate DESC LIMIT 10';
		var qry2 = 'SELECT externalactionitem.projectID, project.projectName, externalactionitem.actionItemDescription, externalactionitem.targetCompletionDate FROM externalactionitem INNER JOIN project ON externalactionitem.projectID = project.projectID WHERE externalactionitem.targetCompletionDate IS NOT NULL AND externalactionitem.targetCompletionDate >= CURDATE() AND externalactionitem.targetCompletionDate <= DATE_ADD(CURDATE(), INTERVAL 7 DAY) ORDER BY externalactionitem.targetCompletionDate DESC LIMIT 10';
		var qry3 = 'SELECT (COUNT(targetCompletionDate) - COUNT(actualCompletionDate)) AS totalTarget, COUNT(actualCompletionDate) AS totalActual FROM kmsactionitem'
		var qry4 = 'SELECT (COUNT(targetCompletionDate) - COUNT(actualCompletionDate)) AS totalTarget2, COUNT(actualCompletionDate) AS totalActual2 FROM externalactionitem'
		updateType = 'thisWeek'
	}

	else if (dateRange == 'thisWeek2'){
		
		var qry1 = 'SELECT kmsactionitem.projectID, project.projectName, kmsactionitem.actionItemDescription, kmsactionitem.targetCompletionDate FROM kmsactionitem INNER JOIN project ON kmsactionitem.projectID = project.projectID WHERE kmsactionitem.targetCompletionDate IS NOT NULL AND kmsactionitem.targetCompletionDate >= CURDATE() AND kmsactionitem.targetCompletionDate <= DATE_ADD(CURDATE(), INTERVAL 14 DAY)  ORDER BY kmsactionitem.targetCompletionDate DESC LIMIT 10';
		var qry2 = 'SELECT externalactionitem.projectID, project.projectName, externalactionitem.actionItemDescription, externalactionitem.targetCompletionDate FROM externalactionitem INNER JOIN project ON externalactionitem.projectID = project.projectID WHERE externalactionitem.targetCompletionDate IS NOT NULL AND externalactionitem.targetCompletionDate >= CURDATE() AND externalactionitem.targetCompletionDate <= DATE_ADD(CURDATE(), INTERVAL 14 DAY) ORDER BY externalactionitem.targetCompletionDate DESC LIMIT 10';
		var qry3 = 'SELECT (COUNT(targetCompletionDate) - COUNT(actualCompletionDate)) AS totalTarget, COUNT(actualCompletionDate) AS totalActual FROM kmsactionitem'
		var qry4 = 'SELECT (COUNT(targetCompletionDate) - COUNT(actualCompletionDate)) AS totalTarget2, COUNT(actualCompletionDate) AS totalActual2 FROM externalactionitem'
		updateType = 'thisWeek2'
	}
	
	else if (dateRange == 'thisMonth'){
		
		var qry1 = 'SELECT kmsactionitem.projectID, project.projectName, kmsactionitem.actionItemDescription, kmsactionitem.targetCompletionDate FROM kmsactionitem INNER JOIN project ON kmsactionitem.projectID = project.projectID WHERE kmsactionitem.targetCompletionDate IS NOT NULL AND kmsactionitem.targetCompletionDate >= CURDATE() AND kmsactionitem.targetCompletionDate <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)  ORDER BY kmsactionitem.targetCompletionDate DESC LIMIT 10';
		var qry2 = 'SELECT externalactionitem.projectID, project.projectName, externalactionitem.actionItemDescription, externalactionitem.targetCompletionDate FROM externalactionitem INNER JOIN project ON externalactionitem.projectID = project.projectID WHERE externalactionitem.targetCompletionDate IS NOT NULL AND externalactionitem.targetCompletionDate >= CURDATE() AND externalactionitem.targetCompletionDate <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) ORDER BY externalactionitem.targetCompletionDate DESC LIMIT 10';
		var qry3 = 'SELECT (COUNT(targetCompletionDate) - COUNT(actualCompletionDate)) AS totalTarget, COUNT(actualCompletionDate) AS totalActual FROM kmsactionitem'
		var qry4 = 'SELECT (COUNT(targetCompletionDate) - COUNT(actualCompletionDate)) AS totalTarget2, COUNT(actualCompletionDate) AS totalActual2 FROM externalactionitem'
		updateType = 'thisMonth'
	}
	
	else if (dateRange == 'pastDue'){
		
		var qry1 = 'SELECT kmsactionitem.projectID, project.projectName, kmsactionitem.actionItemDescription, kmsactionitem.targetCompletionDate FROM kmsactionitem INNER JOIN project ON kmsactionitem.projectID = project.projectID WHERE kmsactionitem.targetCompletionDate IS NOT NULL AND kmsactionitem.targetCompletionDate <= CURDATE() ORDER BY kmsactionitem.targetCompletionDate DESC LIMIT 10';
		var qry2 = 'SELECT externalactionitem.projectID, project.projectName, externalactionitem.actionItemDescription, externalactionitem.targetCompletionDate FROM externalactionitem INNER JOIN project ON externalactionitem.projectID = project.projectID WHERE externalactionitem.targetCompletionDate IS NOT NULL AND externalactionitem.targetCompletionDate <= CURDATE() ORDER BY externalactionitem.targetCompletionDate DESC LIMIT 10';
		var qry3 = 'SELECT (COUNT(targetCompletionDate) - COUNT(actualCompletionDate)) AS totalTarget, COUNT(actualCompletionDate) AS totalActual FROM kmsactionitem'
		var qry4 = 'SELECT (COUNT(targetCompletionDate) - COUNT(actualCompletionDate)) AS totalTarget2, COUNT(actualCompletionDate) AS totalActual2 FROM externalactionitem'
		updateType = 'pastDue'
	}
	
	else {
	
	var qry1 = 'SELECT kmsactionitem.projectID, project.projectName, kmsactionitem.actionItemDescription, kmsactionitem.targetCompletionDate FROM kmsactionitem INNER JOIN project ON kmsactionitem.projectID = project.projectID WHERE kmsactionitem.targetCompletionDate IS NOT NULL AND kmsactionitem.targetCompletionDate >= CURDATE() AND kmsactionitem.targetCompletionDate <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)  ORDER BY kmsactionitem.targetCompletionDate DESC LIMIT 10';
	var qry2 = 'SELECT externalactionitem.projectID, project.projectName, externalactionitem.actionItemDescription, externalactionitem.targetCompletionDate FROM externalactionitem INNER JOIN project ON externalactionitem.projectID = project.projectID WHERE externalactionitem.targetCompletionDate IS NOT NULL AND externalactionitem.targetCompletionDate >= CURDATE() AND externalactionitem.targetCompletionDate <= DATE_ADD(CURDATE(), INTERVAL 7 DAY) ORDER BY externalactionitem.targetCompletionDate DESC LIMIT 10';
	var qry3 = 'SELECT (COUNT(targetCompletionDate) - COUNT(actualCompletionDate)) AS totalTarget, COUNT(actualCompletionDate) AS totalActual FROM kmsactionitem'
	var qry4 = 'SELECT (COUNT(targetCompletionDate) - COUNT(actualCompletionDate)) AS totalTarget2, COUNT(actualCompletionDate) AS totalActual2 FROM externalactionitem'
}
		conn.query(qry1, function (err, results0, fields) { 
			conn.query(qry2, function (err, results, fields){
				conn.query(qry3, function (err, results1, fields){
					conn.query(qry4, function (err, results2, fields){
					
					res.render('index', {results0:results0, results:results, results1:results1, results2:results2, updateType:updateType});
				});
			});
		});
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