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


// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
    console.log(req.user);
    
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

            res.render('admin', {results0:results0, results:results});
        });
    });

	
});

router.post('/updateUser', function(req, res){
		
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

	var qry= 'UPDATE user SET firstName= ?, lastName = ?, email = ?, cellNumber = ?, permissionLevel = ? WHERE userID = ?'
	
    var qry1 = 'SELECT * FROM user'
    var qry2 = 'SELECT * FROM project'

    conn.query(qry, [req.body.firstName, req.body.lastName, req.body.email, req.body.cellNumber, req.body.permissionLevel, req.body.userID], function (err, resultsNeutral, fields) { 
        conn.query(qry1, function (err, results0, fields) {
            conn.query(qry2, function (err, results, fields) {
                res.render('admin', {results0: results0, results: results});
            });
        });
        
    }); 
});

router.post('/deleteUser', ensureAuthenticated, function(req, res){
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

    
	var targetCompletionDate = req.body.targetCompletionDate
	var targetStartDate = req.body.targetStartDate

	if (req.body.targetStartDate == ""){targetStartDate = null};
    if (req.body.targetCompletionDate == ""){targetCompletionDate = null};

    var qry = 'DELETE FROM USER WHERE userID = ?'
    var qry1 = 'SELECT * FROM user'
    var qry2 = 'SELECT * FROM project'

    conn.query(qry, req.body.userID, function (err, results, fields) { 
        conn.query(qry1, function (err, results0, fields) {
            conn.query(qry2, function (err, results, fields) {
                res.render('admin', {results0: results0, results: results});
            });
        });
        
    }); 
});

router.post('/registerProject', ensureAuthenticated, function(req, res){
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

    
	var targetCompletionDate = req.body.targetCompletionDate
	var targetStartDate = req.body.targetStartDate

	if (req.body.targetStartDate == ""){targetStartDate = null};
    if (req.body.targetCompletionDate == ""){targetCompletionDate = null};

	var insertQuery= 'INSERT INTO kmsActionItem (actionItemDescription, projectID) VALUES(\'Contract Signed\', LAST_INSERT_ID()), (\'Business Plan Complete\', LAST_INSERT_ID() ), (\'Project Management Plan Complete\', LAST_INSERT_ID() ); '
    var qry = 'INSERT INTO PROJECT (clientName, projectName, location, serviceType, targetStartDate, targetCompletionDate, projectedBudget, contractAmount) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
	var qry1 = 'SELECT * FROM user'
    var qry2 = 'SELECT * FROM project'

    conn.query(qry, [req.body.clientName, req.body.projectName, req.body.location, req.body.serviceType, targetStartDate, targetCompletionDate, req.body.projectedBudget, req.body.contractAmount], function (err, results, fields) { 
		conn.query(insertQuery, function (err, results00, fields) {
			conn.query(qry1, function(err, results0, fields) {
				conn.query(qry2, function(err, results, fields) {	

					res.render('admin', {results0: results0, results: results});
				});				              
            });
        });       
    }); 
});

router.post('/updateProject', ensureAuthenticated, function(req, res){
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

    
	var targetCompletionDate = req.body.targetCompletionDate
	var targetStartDate = req.body.targetStartDate

	if (req.body.targetStartDate == ""){targetStartDate = null};
    if (req.body.targetCompletionDate == ""){targetCompletionDate = null};

    var qry = 'UPDATE PROJECT SET clientName = ?, projectName = ?, location = ?, serviceType = ?, targetStartDate = ?, targetCompletionDate = ?, projectedBudget = ?, contractAmount = ? WHERE projectID = ?'
    var qry1 = 'SELECT * FROM user'
    var qry2 = 'SELECT * FROM project'

    conn.query(qry, [req.body.clientName, req.body.projectName, req.body.location, req.body.serviceType, targetStartDate, targetCompletionDate, req.body.projectedBudget, req.body.contractAmount, req.body.projectID], function (err, results, fields) { 
        conn.query(qry1, function (err, results0, fields) {
            conn.query(qry2, function (err, results, fields) {
                res.render('admin', {results0: results0, results: results});
            });
        });
        
    }); 
});

router.post('/deleteProject', ensureAuthenticated, function(req, res){
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
	
	var delqry1 = 'DELETE FROM projectactivity WHERE projectID = ?'
	var delqry2 = 'DELETE FROM kmsActionItem WHERE projectID = ?'
	var delqry3 = 'DELETE FROM externalactionitem WHERE projectID = ?'
	var delqry4 = 'DELETE FROM costsummary WHERE projectID = ?'
	var delqry5 = 'DELETE FROM pcolog WHERE projectID = ?'
	var delqry = 'DELETE FROM PROJECT WHERE projectID = ?'

    var qry1 = 'SELECT * FROM user'
    var qry2 = 'SELECT * FROM project'

    conn.query(delqry1, req.body.projectID, function (err, results000, fields) { 
		conn.query(delqry2, req.body.projectID, function (err, results0000, fields) { 
			conn.query(delqry3, req.body.projectID, function (err, results00000, fields) { 
				conn.query(delqry4, req.body.projectID, function (err, results000000, fields) { 
					conn.query(delqry5, req.body.projectID, function (err, results0000000, fields) { 
						conn.query(delqry, req.body.projectID, function (err, results0000000, fields) { 
        					conn.query(qry1, function (err, results0, fields) {
            					conn.query(qry2, function (err, results, fields) {
			   
									res.render('admin', {results0: results0, results: results});
								});
							});
						});
					});
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