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

router.post('/newProjectActivity', ensureAuthenticated, function (req, res) {
	
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
	
	var targetStartDate = req.body.targetStartDate
	var actualStartDate = req.body.actualStartDate
	var targetCompletionDate = req.body.targetCompletionDate
	var actualCompletionDate = req.body.actualCompletionDate

	if (req.body.targetStartDate == ""){targetStartDate = null};
	if (req.body.actualStartDate == ""){actualStartDate = null};
	if (req.body.targetCompletionDate == ""){targetCompletionDate = null};
	if (req.body.actualCompletionDate == ""){actualCompletionDate = null};
	
	var qry1 = 'INSERT INTO projectactivity SET activityDescription = ?, targetStartDate = ?, actualStartDate = ?, targetCompletionDate = ?, actualCompletionDate = ?, progress = ?, projectID = ?'	
	var qry = 'SELECT * FROM project WHERE projectID = ?'
	var qry2 = 'SELECT * FROM projectactivity WHERE projectID = ?'
	var qry3 = 'SELECT * FROM kmsactionitem WHERE projectID = ?'
	var qry4 = 'SELECT * FROM externalactionitem WHERE projectID = ?'
	var qry5 = 'SELECT * FROM lineitemsummary WHERE projectID = ?'
	var qry6 = 'SELECT * FROM pco WHERE projectID = ?'
	var updateType = 'updateProjectActivity'
	
	
	console.log('This is happening :' + req.body.actualCompletionDate);
	//if (req.body.actualCompletionDate = '');

	console.log(qry);

	conn.query(qry1, [req.body.activityDescription, targetStartDate, actualStartDate, targetCompletionDate, actualCompletionDate, req.body.progress, req.body.projectID] , function (err, results0, fields) {
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

	
	var targetStartDate = req.body.targetStartDate
	var actualStartDate = req.body.actualStartDate
	var targetCompletionDate = req.body.targetCompletionDate
	var actualCompletionDate = req.body.actualCompletionDate

	if (req.body.targetStartDate == ""){targetStartDate = null};
	if (req.body.actualStartDate == ""){actualStartDate = null};
	if (req.body.targetCompletionDate == ""){targetCompletionDate = null};
	if (req.body.actualCompletionDate == ""){actualCompletionDate = null};
	
	var qry1 = 'UPDATE projectactivity SET activityDescription = ?, targetStartDate = ?, actualStartDate = ?, targetCompletionDate = ?, actualCompletionDate = ?, progress = ? WHERE projectActivityID = ?'

	var qry = 'SELECT * FROM project WHERE projectID = ?'
	console.log(qry);
	var qry2 = 'SELECT * FROM projectactivity WHERE projectID = ?'
	var qry3 = 'SELECT * FROM kmsactionitem WHERE projectID = ?'
	var qry4 = 'SELECT * FROM externalactionitem WHERE projectID = ?'
	var qry5 = 'SELECT * FROM lineitemsummary WHERE projectID = ?'
	var qry6 = 'SELECT * FROM pco WHERE projectID = ?'
	var updateType = 'updateProjectActivity'
	console.log('This is happening :' + req.body.actualCompletionDate);
	//if (req.body.actualCompletionDate = '');

	console.log(qry);
	conn.query(qry1, [req.body.activityDescription, targetStartDate, actualStartDate, targetCompletionDate, actualCompletionDate, req.body.progress, req.body.projectActivityID], function (err, results0, fields) {
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

router.post('/deleteProjectActivity', ensureAuthenticated, function (req, res) {
	
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
	var qry1 = 'DELETE FROM projectactivity WHERE projectActivityID = ?'

	var qry = 'SELECT * FROM project WHERE projectID = ?'
	console.log(qry);
	var qry2 = 'SELECT * FROM projectactivity WHERE projectID = ?'
	var qry3 = 'SELECT * FROM kmsactionitem WHERE projectID = ?'
	var qry4 = 'SELECT * FROM externalactionitem WHERE projectID = ?'
	var qry5 = 'SELECT * FROM lineitem WHERE projectID = ?'
	var qry6 = 'SELECT * FROM pco WHERE projectID = ?'
	var updateType = 'updateProjectActivity'
	console.log('This is happening :' + req.body.actualCompletionDate);
	//if (req.body.actualCompletionDate = '');

	console.log(qry);
	conn.query(qry1, req.body.projectActivityID, function (err, results0, fields) {
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

router.post('/newActionItem', ensureAuthenticated, function (req, res) {
	
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
	
	var activityStartDate = req.body.targetStartDate
	var targetCompletionDate = req.body.targetCompletionDate
	var actualCompletionDate = req.body.actualCompletionDate

	if (req.body.activityStartDate == ""){activityStartDate = null};
	if (req.body.targetCompletionDate == ""){targetCompletionDate = null};
	if (req.body.actualCompletionDate == ""){actualCompletionDate = null};
	
	var qry1 = 'INSERT INTO kmsactionitem SET actionItemDescription = ?, activityOwner = ?, activityStartDate = ?, targetCompletionDate = ?, actualCompletionDate = ?, actionItemNotes = ?, projectID = ?'
	var qry = 'SELECT * FROM project WHERE projectID = ?'
	var qry2 = 'SELECT * FROM projectactivity WHERE projectID = ?'
	var qry3 = 'SELECT * FROM kmsactionitem WHERE projectID = ?'
	var qry4 = 'SELECT * FROM externalactionitem WHERE projectID = ?'
	var qry5 = 'SELECT * FROM lineitemsummary WHERE projectID = ?'
	var qry6 = 'SELECT * FROM pco WHERE projectID = ?'
	var updateType = 'updateProjectActivity'
	
	console.log('This is happening :' + req.body.actualCompletionDate);
	//if (req.body.actualCompletionDate = '');

	console.log(qry);
	conn.query(qry1, [req.body.actionItemDescription, req.body.activityOwner, activityStartDate, targetCompletionDate, actualCompletionDate, req.body.actionItemNotes, req.body.projectID], function (err, results0, fields) {
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

router.post('/updateActionItem', ensureAuthenticated, function (req, res) {
	
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
	
	var activityStartDate = req.body.targetStartDate
	var targetCompletionDate = req.body.targetCompletionDate
	var actualCompletionDate = req.body.actualCompletionDate

	if (req.body.activityStartDate == ""){activityStartDate = null};
	if (req.body.targetCompletionDate == ""){targetCompletionDate = null};
	if (req.body.actualCompletionDate == ""){actualCompletionDate = null};

	var qry1 = 'UPDATE kmsactionitem SET actionItemDescription = ?, activityOwner = ?, activityStartDate = ?, targetCompletionDate = ?, actualCompletionDate = ?, actionItemNotes = ? WHERE kmsActionItemID = ?'

	var qry = 'SELECT * FROM project WHERE projectID = ?'
	console.log(qry);
	var qry2 = 'SELECT * FROM projectactivity WHERE projectID = ?'
	var qry3 = 'SELECT * FROM kmsactionitem WHERE projectID = ?'
	var qry4 = 'SELECT * FROM externalactionitem WHERE projectID = ?'
	var qry5 = 'SELECT * FROM lineitem WHERE projectID = ?'
	var qry6 = 'SELECT * FROM pco WHERE projectID = ?'
	var updateType = 'updateActionItem'

	//if (req.body.actualCompletionDate = '');

	console.log(qry);
	conn.query(qry1, [req.body.actionItemDescription, req.body.activityOwner, activityStartDate, targetCompletionDate, actualCompletionDate, req.body.actionItemNotes, req.body.kmsActionItemID], function (err, results0, fields) {
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

router.post('/deleteActionItem', ensureAuthenticated, function (req, res) {
	
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
	var qry1 = 'DELETE FROM kmsactionitem WHERE kmsActionItemID = ?'

	var qry = 'SELECT * FROM project WHERE projectID = ?'
	console.log(qry);
	var qry2 = 'SELECT * FROM projectactivity WHERE projectID = ?'
	var qry3 = 'SELECT * FROM kmsactionitem WHERE projectID = ?'
	var qry4 = 'SELECT * FROM externalactionitem WHERE projectID = ?'
	var qry5 = 'SELECT * FROM lineitem WHERE projectID = ?'
	var qry6 = 'SELECT * FROM pco WHERE projectID = ?'
	var updateType = 'updateActionItem'
	console.log('This is happening :' + req.body.actualCompletionDate);
	//if (req.body.actualCompletionDate = '');

	console.log(qry);
	conn.query(qry1, req.body.kmsActionItemID, function (err, results0, fields) {
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

router.post('/newExternalActionItem', ensureAuthenticated, function (req, res) {
	
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
	
	var activityStartDate = req.body.targetStartDate
	var targetCompletionDate = req.body.targetCompletionDate
	var actualCompletionDate = req.body.actualCompletionDate

	if (req.body.activityStartDate == ""){activityStartDate = null};
	if (req.body.targetCompletionDate == ""){targetCompletionDate = null};
	if (req.body.actualCompletionDate == ""){actualCompletionDate = null};

	var qry1 = 'INSERT INTO externalactionitem SET actionItemDescription = ?, activityOwner = ?, activityStartDate = ?, targetCompletionDate = ?, actualCompletionDate = ?, actionItemNotes = ?, projectID = ?'

	var qry = 'SELECT * FROM project WHERE projectID = ?'
	console.log(qry);
	var qry2 = 'SELECT * FROM projectactivity WHERE projectID = ?'
	var qry3 = 'SELECT * FROM kmsactionitem WHERE projectID = ?'
	var qry4 = 'SELECT * FROM externalactionitem WHERE projectID = ?'
	var qry5 = 'SELECT * FROM lineitem WHERE projectID = ?'
	var qry6 = 'SELECT * FROM pco WHERE projectID = ?'
	var updateType = 'updateExternalActionItem'
	console.log('This is happening :' + req.body.actualCompletionDate);
	//if (req.body.actualCompletionDate = '');

	console.log(qry);
	conn.query(qry1, [req.body.actionItemDescription, req.body.activityOwner, activityStartDate, targetCompletionDate, actualCompletionDate, req.body.actionItemNotes, req.body.projectID], function (err, results0, fields) {
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

router.post('/updateExternalActionItem', ensureAuthenticated, function (req, res) {
	
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

	var activityStartDate = req.body.targetStartDate
	var targetCompletionDate = req.body.targetCompletionDate
	var actualCompletionDate = req.body.actualCompletionDate

	if (req.body.activityStartDate == ""){activityStartDate = null};
	if (req.body.targetCompletionDate == ""){targetCompletionDate = null};
	if (req.body.actualCompletionDate == ""){actualCompletionDate = null};

	var qry1 = 'UPDATE externalactionitem SET actionItemDescription = ?, activityOwner = ?, activityStartDate = ?, targetCompletionDate = ?, actualCompletionDate = ?, actionItemNotes = ? WHERE externalActionItemID = ?'

	var qry = 'SELECT * FROM project WHERE projectID = ?'
	console.log(qry);
	var qry2 = 'SELECT * FROM projectactivity WHERE projectID = ?'
	var qry3 = 'SELECT * FROM kmsactionitem WHERE projectID = ?'
	var qry4 = 'SELECT * FROM externalactionitem WHERE projectID = ?'
	var qry5 = 'SELECT * FROM lineitem WHERE projectID = ?'
	var qry6 = 'SELECT * FROM pco WHERE projectID = ?'
	var updateType = 'updateExternalActionItem'
	console.log('This is happening :' + req.body.actualCompletionDate);
	//if (req.body.actualCompletionDate = '');

	console.log(qry);
	conn.query(qry1, [req.body.actionItemDescription, req.body.activityOwner, activityStartDate, targetCompletionDate, actualCompletionDate, req.body.actionItemNotes, req.body.externalActionItemID], function (err, results0, fields) {
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

router.post('/deleteExternalActionItem', ensureAuthenticated, function (req, res) {
	
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
	var qry1 = 'DELETE FROM externalactionitem WHERE externalActionItemID = ?'

	var qry = 'SELECT * FROM project WHERE projectID = ?'
	console.log(qry);
	var qry2 = 'SELECT * FROM projectactivity WHERE projectID = ?'
	var qry3 = 'SELECT * FROM kmsactionitem WHERE projectID = ?'
	var qry4 = 'SELECT * FROM externalactionitem WHERE projectID = ?'
	var qry5 = 'SELECT * FROM lineitem WHERE projectID = ?'
	var qry6 = 'SELECT * FROM pco WHERE projectID = ?'
	var updateType = 'updateExternalActionItem'
	console.log('This is happening :' + req.body.actualCompletionDate);
	//if (req.body.actualCompletionDate = '');

	console.log(qry);
	conn.query(qry1, req.body.externalActionItemID, function (err, results0, fields) {
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

router.post('/newCostSummary', ensureAuthenticated, function (req, res) {
	
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
	var qry1 = 'INSERT INTO lineitem SET costSummaryCategoryID = ?, lineItemBreakdown = ?, lineItemTotals = ?, budget = ?, committed = ?, changeOrders = ?, anticipatedCost = ?, actualCostToDate = ?, dollarsRemaining = ?, projectID = ?'

	var qry = 'SELECT * FROM project WHERE projectID = ?'
	console.log(qry);
	var qry2 = 'SELECT * FROM projectactivity WHERE projectID = ?'
	var qry3 = 'SELECT * FROM kmsactionitem WHERE projectID = ?'
	var qry4 = 'SELECT * FROM externalactionitem WHERE projectID = ?'
	var qry5 = 'SELECT * FROM lineitem WHERE projectID = ?'
	var qry6 = 'SELECT * FROM pco WHERE projectID = ?'
	var updateType = 'updateCostSummary'
	console.log('This is happening :' + req.body.actualCompletionDate);
	//if (req.body.actualCompletionDate = '');

	console.log(qry);
	conn.query(qry1, [req.body.costSummaryCategoryID, req.body.lineItemBreakdown, req.body.lineItemTotals, req.body.budget, req.body.committed, req.body.changeOrders, req.body.anticipatedCost, req.body.actualCostToDate, req.body.dollarsRemaining, req.body.projectID], function (err, results0, fields) {
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

router.post('/updateCostSummary', ensureAuthenticated, function (req, res) {
	
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
	var qry1 = 'UPDATE lineitem SET costSummaryCategoryID = ?, lineItemBreakdown = ?, lineItemTotals = ?, budget = ?, committed = ?, changeOrders = ?, anticipatedCost = ?, actualCostToDate = ?, dollarsRemaining = ? WHERE lineItemID = ?'

	var qry = 'SELECT * FROM project WHERE projectID = ?'
	console.log(qry);
	var qry2 = 'SELECT * FROM projectactivity WHERE projectID = ?'
	var qry3 = 'SELECT * FROM kmsactionitem WHERE projectID = ?'
	var qry4 = 'SELECT * FROM externalactionitem WHERE projectID = ?'
	var qry5 = 'SELECT * FROM lineitem WHERE projectID = ?'
	var qry6 = 'SELECT * FROM pco WHERE projectID = ?'
	var updateType = 'updateCostSummary'
	console.log('This is happening :' + req.body.actualCompletionDate);
	//if (req.body.actualCompletionDate = '');

	console.log(qry);
	conn.query(qry1, [req.body.costSummaryCategoryID, req.body.lineItemBreakdown, req.body.lineItemTotals, req.body.budget, req.body.committed, req.body.changeOrders, req.body.anticipatedCost, req.body.actualCostToDate, req.body.dollarsRemaining, req.body.lineItemID], function (err, results0, fields) {
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

router.post('/deleteCostSummary', ensureAuthenticated, function (req, res) {
	
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
	var qry1 = 'DELETE FROM lineitem WHERE lineItemID = ?'

	var qry = 'SELECT * FROM project WHERE projectID = ?'
	console.log(qry);
	var qry2 = 'SELECT * FROM projectactivity WHERE projectID = ?'
	var qry3 = 'SELECT * FROM kmsactionitem WHERE projectID = ?'
	var qry4 = 'SELECT * FROM externalactionitem WHERE projectID = ?'
	var qry5 = 'SELECT * FROM lineitem WHERE projectID = ?'
	var qry6 = 'SELECT * FROM pco WHERE projectID = ?'
	var updateType = 'updateCostSummary'
	//if (req.body.actualCompletionDate = '');

	console.log(req.body.lineItemID);
	conn.query(qry1, req.body.lineItemID, function (err, results0, fields) {
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

router.post('/newPCO', ensureAuthenticated, function (req, res) {
	
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
	
	var dueDate = req.body.dueDate
	var toKMSDate = req.body.toKMSDate
	var kmsReviewedDate = req.body.kmsReviewedDate
	var clientApprovedDate = req.body.clientApprovedDate

	if (req.body.dueDate == ""){activityStartDate = null};
	if (req.body.toKMSDate == ""){targetCompletionDate = null};
	if (req.body.kmsReviewedDate == ""){actualCompletionDate = null};
	if (req.body.clientApprovedDate == ""){clientApprovedDate = null};

	var qry1 = 'INSERT INTO pco SET pcoNumber = ?, pcoDescription = ?, dueDate = ?, toKMSDate = ?, kmsReviewedDate = ?, clientApprovedDate = ?, pcoValue = ?, contingencyAmount = ?, costSavingsAmount = ?, changeOrders = ?, pcoStatus = ?, comments = ?, projectID = ?'

	var qry = 'SELECT * FROM project WHERE projectID = ?'
	console.log(qry);
	var qry2 = 'SELECT * FROM projectactivity WHERE projectID = ?'
	var qry3 = 'SELECT * FROM kmsactionitem WHERE projectID = ?'
	var qry4 = 'SELECT * FROM externalactionitem WHERE projectID = ?'
	var qry5 = 'SELECT * FROM lineitem WHERE projectID = ?'
	var qry6 = 'SELECT * FROM pco WHERE projectID = ?'
	var updateType = 'updatePCO'
	console.log('This is happening :' + req.body.actualCompletionDate);
	//if (req.body.actualCompletionDate = '');

	console.log(qry);
	conn.query(qry1, [req.body.pcoNumber, req.body.pcoDescription, dueDate, toKMSDate, kmsReviewedDate, clientApprovedDate, req.body.pcoValue, req.body.contingencyAmount, req.body.costSavingsAmount, req.body.changeOrders, req.body.pcoStatus, req.body.comments, req.body.projectID], function (err, results0, fields) {
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

router.post('/updatePCO', ensureAuthenticated, function (req, res) {
	
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
	
	var dueDate = req.body.dueDate
	var toKMSDate = req.body.toKMSDate
	var kmsReviewedDate = req.body.kmsReviewedDate
	var clientApprovedDate = req.body.clientApprovedDate

	if (req.body.dueDate == ""){activityStartDate = null};
	if (req.body.toKMSDate == ""){targetCompletionDate = null};
	if (req.body.kmsReviewedDate == ""){actualCompletionDate = null};
	if (req.body.clientApprovedDate == ""){clientApprovedDate = null};

	var qry1 = 'UPDATE pco SET pcoNumber = ?, pcoDescription = ?, dueDate = ?, toKMSDate = ?, kmsReviewedDate = ?, clientApprovedDate = ?, pcoValue = ?, contingencyAmount = ?, costSavingsAmount = ?, changeOrders = ?, pcoStatus = ?, comments = ? WHERE pcoID = ?'

	var qry = 'SELECT * FROM project WHERE projectID = ?'
	console.log(qry);
	var qry2 = 'SELECT * FROM projectactivity WHERE projectID = ?'
	var qry3 = 'SELECT * FROM kmsactionitem WHERE projectID = ?'
	var qry4 = 'SELECT * FROM externalactionitem WHERE projectID = ?'
	var qry5 = 'SELECT * FROM lineitem WHERE projectID = ?'
	var qry6 = 'SELECT * FROM pco WHERE projectID = ?'
	var updateType = 'updatePCO'
	console.log('This is happening :' + req.body.actualCompletionDate);
	//if (req.body.actualCompletionDate = '');

	console.log(qry);
	conn.query(qry1, [req.body.pcoNumber, req.body.pcoDescription, dueDate, toKMSDate, kmsReviewedDate, clientApprovedDate, req.body.pcoValue, req.body.contingencyAmount, req.body.costSavingsAmount, req.body.changeOrders, req.body.pcoStatus, req.body.comments, req.body.pcoID], function (err, results0, fields) {
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

router.post('/deletePCO', ensureAuthenticated, function (req, res) {
	
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
	var qry1 = 'DELETE FROM pco WHERE pcoID = ?'

	var qry = 'SELECT * FROM project WHERE projectID = ?'
	console.log(qry);
	var qry2 = 'SELECT * FROM projectactivity WHERE projectID = ?'
	var qry3 = 'SELECT * FROM kmsactionitem WHERE projectID = ?'
	var qry4 = 'SELECT * FROM externalactionitem WHERE projectID = ?'
	var qry5 = 'SELECT * FROM lineitem WHERE projectID = ?'
	var qry6 = 'SELECT * FROM pco WHERE projectID = ?'
	var updateType = 'updatePCO'
	console.log('This is happening :' + req.body.actualCompletionDate);
	//if (req.body.actualCompletionDate = '');

	console.log(qry);
	conn.query(qry1, req.body.pcoID, function (err, results0, fields) {
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
	var qry5 = 'SELECT * FROM lineitem WHERE projectID = ?'
	var qry6 = 'SELECT * FROM pco WHERE projectID = ?'

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


router.post('/searchProject', ensureAuthenticated, function (req, res) {


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
	var search = '%' + req.body.searchForm + '%'
	var qry = 'SELECT * FROM project WHERE projectName LIKE ?'
	var qry2 = 'SELECT * FROM project WHERE projectName LIKE ?'
	console.log(qry);

	conn.query(qry, search, function (err, results, fields) {
		//var userss = res.json(results);
		//console.log(results);
		conn.query(qry2, search, function (err, results1, fields) {
			res.render('project', { results: results, results1: results1 });
		});
	});
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