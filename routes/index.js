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
	
	var qry1 = 'SELECT kmsactionitem.projectID, project.projectName, kmsactionitem.actionItemDescription, kmsactionitem.targetCompletionDate FROM kmsactionitem INNER JOIN project ON kmsactionitem.projectID = project.projectID ORDER BY kmsactionitem.targetCompletionDate DESC LIMIT 10';
	var qry2 = 'SELECT externalactionitem.projectID, project.projectName, externalactionitem.actionItemDescription, externalactionitem.targetCompletionDate FROM externalactionitem INNER JOIN project ON externalactionitem.projectID = project.projectID ORDER BY externalactionitem.targetCompletionDate DESC LIMIT 10';

	conn.query(qry1, function (err, results0, fields) { 
		conn.query(qry2, function (err, results, fields){
	
			res.render('index', {results0:results0, results:results});
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