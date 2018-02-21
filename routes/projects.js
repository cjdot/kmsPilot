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

router.post('/updateProjectActivity', ensureAuthenticated, function (req, res) {

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
	var qry1 = 'UPDATE projectactivity SET activityDescription = ?, targetStartDate = ?, actualStartDate = ?, targetCompletionDate = ?, actualCompletionDate = ?, progress = ? WHERE projectActivityID = ?'


	/*
		conn.query( qry, [req.body.activityDescription, req.body.targetStartDate, req.body.actualStartDate, req.body.targetCompletionDate, req.body.projectActivityID], function(err, results, fields){
			if(err){console.log(err)};
		});
	
		conn.query( qry2, function(err, results, fields){
			res.render('project_details', {results:results});
		}); */

	var qry = 'SELECT * FROM project WHERE projectID = ?'

	var qry2 = 'SELECT * FROM projectactivity WHERE projectID = ?'
	var qry3 = 'SELECT * FROM kmsactionitem WHERE projectID = ?'
	var qry4 = 'SELECT * FROM externalactionitem WHERE projectID = ?'
	var qry5 = 'SELECT * FROM costsummary WHERE projectID = ?'
	var qry6 = 'SELECT * FROM pcolog WHERE projectID = ?'
	var updateType = 'updateProjectActivity'
	console.log(qry);
	conn.query(qry1, [req.body.activityDescription, req.body.targetStartDate, req.body.actualStartDate, req.body.targetCompletionDate, req.body.actualCompletionDate, req.body.progress, req.body.projectActivityID], function (err, results0, fields) {
		conn.query(qry, req.body.projectID, function (err, results, fields) {
			conn.query(qry2, req.body.projectID, function (err, results1, fields) {
				conn.query(qry3, req.body.projectID, function (err, results2, fields) {
					conn.query(qry4, req.body.projectID, function (err, results3, fields) {
						conn.query(qry5, req.body.projectID, function (err, results4, fields) {
							conn.query(qry6, req.body.projectID, function (err, results5, fields) {
								res.render('project_details', { updateType: updateType, results: results, results1: results1, results2: results2, results3: results3, results4: results4, results5: results5 });
							});
						});
					});
				});
			});
		});

	});

});

router.get('/project', ensureAuthenticated, function (req, res) {


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
	var qry2 = 'SELECT * FROM project'
	console.log(qry);

	conn.query(qry, function (err, results, fields) {
		//var userss = res.json(results);
		//console.log(results);
		conn.query(qry2, function (err, results1, fields) {
			res.render('project', { results: results, results1: results1 });
		});


	});
});

router.post('/project_details', ensureAuthenticated, function (req, res) {

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

	var qry = 'SELECT * FROM project WHERE projectID = ?' 
	var qry2 = 'SELECT * FROM projectactivity WHERE projectID = ?'
	var qry3 = 'SELECT * FROM kmsactionitem WHERE projectID = ?'
	var qry4 = 'SELECT * FROM externalactionitem WHERE projectID = ?'
	var qry5 = 'SELECT * FROM costsummary WHERE projectID = ?'
	var qry6 = 'SELECT * FROM pcolog WHERE projectID = ?'

	console.log(qry);

	conn.query(qry, req.body.projectID, function (err, results, fields) {
		conn.query(qry2, req.body.projectID, function (err, results1, fields) {
			conn.query(qry3, req.body.projectID, function (err, results2, fields) {
				conn.query(qry4, req.body.projectID, function (err, results3, fields) {
					conn.query(qry5, req.body.projectID, function (err, results4, fields) {
						conn.query(qry6, req.body.projectID, function (err, results5, fields) {
							res.render('project_details', { results: results, results1: results1, results2: results2, results3: results3, results4: results4, results5: results5 });
						});
					});
				});
			});
		});
	});
})


router.get('/myProjects', ensureAuthenticated, function (req, res) {


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

	conn.query(qry, function (err, results, fields) {
		//var userss = res.json(results);
		//console.log(results);
		res.render('project', { results: results });

	});
});

router.get('/details_actionItem', ensureAuthenticated, function (req, res) {


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

	conn.query(qry2, function (err, results, fields) {
		//var userss = res.json(results);
		//console.log(results);
		res.render('details_actionitem', { results: results });

	});
});



router.get('/details_clientreport', ensureAuthenticated, function (req, res) {




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

	conn.query(qry2, function (err, results, fields) {
		//var userss = res.json(results);
		//console.log(results);
		res.render('details_clientreport', { results: results });

	});
});

router.get('/details_costsummary', ensureAuthenticated, function (req, res) {




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

	conn.query(qry, function (err, results, fields) {
		//var userss = res.json(results);
		//console.log(results);
		res.render('details_costsummary', { results: results });

	});
});

router.get('/details_externalactionitem', ensureAuthenticated, function (req, res) {




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

	conn.query(qry, function (err, results, fields) {
		//var userss = res.json(results);
		//console.log(results);
		res.render('details_externalactionitem', { results: results });

	});
});

router.get('/details_pcolog', ensureAuthenticated, function (req, res) {




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

	conn.query(qry, function (err, results, fields) {
		//var userss = res.json(results);
		//console.log(results);
		res.render('details_pcolog', { results: results });

	});
});

router.get('/details_projectactivities', ensureAuthenticated, function (req, res) {




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

	conn.query(qry, function (err, results, fields) {
		//var userss = res.json(results);
		//console.log(results);
		res.render('details_projectactivities', { results: results });

	});
});

router.get('/details_projectoverview', ensureAuthenticated, function (req, res) {




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

	conn.query(qry, function (err, results, fields) {
		//var userss = res.json(results);
		//console.log(results);
		res.render('details_projectoverview', { results: results });

	});
});

router.post('/details_projectoverview', ensureAuthenticated, function (req, res) {

});

router.get('/userss', ensureAuthenticated, function (req, res) {


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

	conn.query(qry, function (err, results, fields) {
		//var userss = res.json(results);
		//console.log(results);
		res.render('userss', { results: results });

	});


});

//This function ensures that every route is authenticated with a user
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error_msg', 'You are not logged in');
		res.redirect('/users/login');
	}
}

passport.serializeUser(function (email, done) {
	done(null, email);
});

passport.deserializeUser(function (email, done) {
	done(null, email);
});

module.exports = router;