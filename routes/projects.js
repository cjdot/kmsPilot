var express = require('express');
var router = express.Router();
var passport = require('passport');
//I think we're using local Strategy incorrectly? Possibly not at all but the user is searialized and deseriabled
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql2');

//These are the configuration settings to make the database connection to eventually query and return results to appropriate handlebars file
var config = {

	host: 'kmspilot.mysql.database.azure.com',
	user: 'kmsadmin@kmspilot',
	password: 'KMSproject1',
	database: 'kmspilot',
	port: 3306,
	ssl: true

};

//All of these query variables below are used to populate either the project details page or the project search page
//Each of these query's are used in just about every function below
var qry = 'SELECT * FROM project WHERE projectID = ?'
var qry2 = 'SELECT * FROM projectactivity WHERE projectID = ?'
var qry3 = 'SELECT * FROM kmsactionitem WHERE projectID = ?'
var qry4 = 'SELECT * FROM externalactionitem WHERE projectID = ?'
var qry5 = 'SELECT * FROM lineitem INNER JOIN costsummarysubheader ON lineitem.subheaderID = costsummarysubheader.subheaderID WHERE lineitem.projectID = ?'
var qry6 = 'SELECT * FROM pco WHERE projectID = ?'
var qry7 = 'SELECT COUNT(lineItemID), divisionCategory FROM lineitem WHERE projectID = ? AND divisionCategory IS NOT NULL GROUP BY divisionCategory'
var qry8 = 'SELECT * FROM costsummarysubheader WHERE projectID = ?'

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
		});
	
	var targetStartDate = req.body.targetStartDate
	var actualStartDate = req.body.actualStartDate
	var targetCompletionDate = req.body.targetCompletionDate
	var actualCompletionDate = req.body.actualCompletionDate

	if (req.body.targetStartDate == ""){targetStartDate = null};
	if (req.body.actualStartDate == ""){actualStartDate = null};
	if (req.body.targetCompletionDate == ""){targetCompletionDate = null};
	if (req.body.actualCompletionDate == ""){actualCompletionDate = null};
	
	var qry1 = 'INSERT INTO projectactivity SET activityDescription = ?, targetStartDate = ?, actualStartDate = ?, targetCompletionDate = ?, actualCompletionDate = ?, progress = ?, activityNotes = ?, projectID = ?'	
	var updateType = 'updateProjectActivity'

	conn.query(qry1, [req.body.activityDescription, targetStartDate, actualStartDate, targetCompletionDate, actualCompletionDate, req.body.progress, req.body.activityNotes, req.body.projectID] , function (err, results0, fields) {
		conn.query(qry, req.body.projectID, function (err, results, fields) {
			conn.query(qry2, req.body.projectID, function (err, results1, fields) {
				conn.query(qry3, req.body.projectID, function (err, results2, fields) {
					conn.query(qry4, req.body.projectID, function (err, results3, fields) {
						conn.query(qry5, req.body.projectID, function (err, results4, fields) {
							conn.query(qry6, req.body.projectID, function (err, results5, fields) {
								conn.query(qry7, req.body.projectID, function (err, results6, fields) {
									conn.query(qry8, req.body.projectID, function (err, results7, fields) {
										
										res.render('project_details', { results7: results7, updateType: updateType, results: results, results1: results1, results2: results2, results3: results3, results4: results4, results5: results5, results6: results6 });
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
		});
	
	var targetStartDate = req.body.targetStartDate
	var actualStartDate = req.body.actualStartDate
	var targetCompletionDate = req.body.targetCompletionDate
	var actualCompletionDate = req.body.actualCompletionDate

	if (req.body.targetStartDate == ""){targetStartDate = null};
	if (req.body.actualStartDate == ""){actualStartDate = null};
	if (req.body.targetCompletionDate == ""){targetCompletionDate = null};
	if (req.body.actualCompletionDate == ""){actualCompletionDate = null};
	
	var qry1 = 'UPDATE projectactivity SET activityDescription = ?, targetStartDate = ?, actualStartDate = ?, targetCompletionDate = ?, actualCompletionDate = ?, progress = ?, activityNotes = ? WHERE projectActivityID = ?'
	var updateType = 'updateProjectActivity'

	conn.query(qry1, [req.body.activityDescription, targetStartDate, actualStartDate, targetCompletionDate, actualCompletionDate, req.body.progress, req.body.activityNotes, req.body.projectActivityID], function (err, results0, fields) {
		conn.query(qry, req.body.projectID, function (err, results, fields) {
			conn.query(qry2, req.body.projectID, function (err, results1, fields) {
				conn.query(qry3, req.body.projectID, function (err, results2, fields) {
					conn.query(qry4, req.body.projectID, function (err, results3, fields) {
						conn.query(qry5, req.body.projectID, function (err, results4, fields) {
							conn.query(qry6, req.body.projectID, function (err, results5, fields) {
								conn.query(qry7, req.body.projectID, function (err, results6, fields) {
									conn.query(qry8, req.body.projectID, function (err, results7, fields) {
									
										res.render('project_details', { results7: results7, results6: results6, updateType: updateType, results: results, results1: results1, results2: results2, results3: results3, results4: results4, results5: results5 });	
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
	});
	
	var qry1 = 'DELETE FROM projectactivity WHERE projectActivityID = ?'
	var updateType = 'updateProjectActivity'

	conn.query(qry1, req.body.projectActivityID, function (err, results0, fields) {
		conn.query(qry, req.body.projectID, function (err, results, fields) {
			conn.query(qry2, req.body.projectID, function (err, results1, fields) {
				conn.query(qry3, req.body.projectID, function (err, results2, fields) {
					conn.query(qry4, req.body.projectID, function (err, results3, fields) {
						conn.query(qry5, req.body.projectID, function (err, results4, fields) {
							conn.query(qry6, req.body.projectID, function (err, results5, fields) {
								conn.query(qry7, req.body.projectID, function (err, results6, fields) {
									conn.query(qry8, req.body.projectID, function (err, results7, fields) {
																		
										res.render('project_details', { results7: results7, results6: results6, updateType: updateType, results: results, results1: results1, results2: results2, results3: results3, results4: results4, results5: results5 });
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
		});
	
	var activityStartDate = req.body.targetStartDate
	var targetCompletionDate = req.body.targetCompletionDate
	var actualCompletionDate = req.body.actualCompletionDate

	if (req.body.activityStartDate == ""){activityStartDate = null};
	if (req.body.targetCompletionDate == ""){targetCompletionDate = null};
	if (req.body.actualCompletionDate == ""){actualCompletionDate = null};
	
	var qry1 = 'INSERT INTO kmsactionitem SET actionItemDescription = ?, activityOwner = ?, activityStartDate = ?, targetCompletionDate = ?, actualCompletionDate = ?, actionItemNotes = ?, projectID = ?'
	var updateType = 'updateActionItem'

	conn.query(qry1, [req.body.actionItemDescription, req.body.activityOwner, activityStartDate, targetCompletionDate, actualCompletionDate, req.body.actionItemNotes, req.body.projectID], function (err, results0, fields) {
		conn.query(qry, req.body.projectID, function (err, results, fields) {
			conn.query(qry2, req.body.projectID, function (err, results1, fields) {
				conn.query(qry3, req.body.projectID, function (err, results2, fields) {
					conn.query(qry4, req.body.projectID, function (err, results3, fields) {
						conn.query(qry5, req.body.projectID, function (err, results4, fields) {
							conn.query(qry6, req.body.projectID, function (err, results5, fields) {
								conn.query(qry7, req.body.projectID, function (err, results6, fields) {
									conn.query(qry8, req.body.projectID, function (err, results7, fields) {
										
										res.render('project_details', { results7: results7, results6: results6, updateType: updateType, results: results, results1: results1, results2: results2, results3: results3, results4: results4, results5: results5 });
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
	});
	
	var activityStartDate = req.body.targetStartDate
	var targetCompletionDate = req.body.targetCompletionDate
	var actualCompletionDate = req.body.actualCompletionDate

	if (req.body.activityStartDate == ""){activityStartDate = null};
	if (req.body.targetCompletionDate == ""){targetCompletionDate = null};
	if (req.body.actualCompletionDate == ""){actualCompletionDate = null};

	var qry1 = 'UPDATE kmsactionitem SET actionItemDescription = ?, activityOwner = ?, activityStartDate = ?, targetCompletionDate = ?, actualCompletionDate = ?, actionItemNotes = ? WHERE kmsActionItemID = ?'
	var updateType = 'updateActionItem'

	conn.query(qry1, [req.body.actionItemDescription, req.body.activityOwner, activityStartDate, targetCompletionDate, actualCompletionDate, req.body.actionItemNotes, req.body.kmsActionItemID], function (err, results0, fields) {
		conn.query(qry, req.body.projectID, function (err, results, fields) {
			conn.query(qry2, req.body.projectID, function (err, results1, fields) {
				conn.query(qry3, req.body.projectID, function (err, results2, fields) {
					conn.query(qry4, req.body.projectID, function (err, results3, fields) {
						conn.query(qry5, req.body.projectID, function (err, results4, fields) {
							conn.query(qry6, req.body.projectID, function (err, results5, fields) {
								conn.query(qry7, req.body.projectID, function (err, results6, fields) {
									conn.query(qry8, req.body.projectID, function (err, results7, fields) {
									
										res.render('project_details', { results7: results7, results6: results6, updateType: updateType, results: results, results1: results1, results2: results2, results3: results3, results4: results4, results5: results5 });
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
	});
	
	var qry1 = 'DELETE FROM kmsactionitem WHERE kmsActionItemID = ?'
	var updateType = 'updateActionItem'

	conn.query(qry1, req.body.kmsActionItemID, function (err, results0, fields) {
		conn.query(qry, req.body.projectID, function (err, results, fields) {
			conn.query(qry2, req.body.projectID, function (err, results1, fields) {
				conn.query(qry3, req.body.projectID, function (err, results2, fields) {
					conn.query(qry4, req.body.projectID, function (err, results3, fields) {
						conn.query(qry5, req.body.projectID, function (err, results4, fields) {
							conn.query(qry6, req.body.projectID, function (err, results5, fields) {
								conn.query(qry7, req.body.projectID, function (err, results6, fields) {
									conn.query(qry8, req.body.projectID, function (err, results7, fields) {

										res.render('project_details', { results7: results7, results6: results6, updateType: updateType, results: results, results1: results1, results2: results2, results3: results3, results4: results4, results5: results5 });
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
		});
	
	var activityStartDate = req.body.targetStartDate
	var targetCompletionDate = req.body.targetCompletionDate
	var actualCompletionDate = req.body.actualCompletionDate

	if (req.body.activityStartDate == ""){activityStartDate = null};
	if (req.body.targetCompletionDate == ""){targetCompletionDate = null};
	if (req.body.actualCompletionDate == ""){actualCompletionDate = null};

	var qry1 = 'INSERT INTO externalactionitem SET actionItemDescription = ?, activityOwner = ?, activityStartDate = ?, targetCompletionDate = ?, actualCompletionDate = ?, actionItemNotes = ?, projectID = ?'
	var updateType = 'updateExternalActionItem'

	conn.query(qry1, [req.body.actionItemDescription, req.body.activityOwner, activityStartDate, targetCompletionDate, actualCompletionDate, req.body.actionItemNotes, req.body.projectID], function (err, results0, fields) {
		conn.query(qry, req.body.projectID, function (err, results, fields) {
			conn.query(qry2, req.body.projectID, function (err, results1, fields) {
				conn.query(qry3, req.body.projectID, function (err, results2, fields) {
					conn.query(qry4, req.body.projectID, function (err, results3, fields) {
						conn.query(qry5, req.body.projectID, function (err, results4, fields) {
							conn.query(qry6, req.body.projectID, function (err, results5, fields) {
								conn.query(qry7, req.body.projectID, function (err, results6, fields) {
									conn.query(qry8, req.body.projectID, function (err, results7, fields) {
										
										res.render('project_details', { results7: results7, results6: results6, updateType: updateType, results: results, results1: results1, results2: results2, results3: results3, results4: results4, results5: results5 });
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
		});

	var activityStartDate = req.body.targetStartDate
	var targetCompletionDate = req.body.targetCompletionDate
	var actualCompletionDate = req.body.actualCompletionDate

	if (req.body.activityStartDate == ""){activityStartDate = null};
	if (req.body.targetCompletionDate == ""){targetCompletionDate = null};
	if (req.body.actualCompletionDate == ""){actualCompletionDate = null};

	var qry1 = 'UPDATE externalactionitem SET actionItemDescription = ?, activityOwner = ?, activityStartDate = ?, targetCompletionDate = ?, actualCompletionDate = ?, actionItemNotes = ? WHERE externalActionItemID = ?'
	var updateType = 'updateExternalActionItem'

	conn.query(qry1, [req.body.actionItemDescription, req.body.activityOwner, activityStartDate, targetCompletionDate, actualCompletionDate, req.body.actionItemNotes, req.body.externalActionItemID], function (err, results0, fields) {
		conn.query(qry, req.body.projectID, function (err, results, fields) {
			conn.query(qry2, req.body.projectID, function (err, results1, fields) {
				conn.query(qry3, req.body.projectID, function (err, results2, fields) {
					conn.query(qry4, req.body.projectID, function (err, results3, fields) {
						conn.query(qry5, req.body.projectID, function (err, results4, fields) {
							conn.query(qry6, req.body.projectID, function (err, results5, fields) {
								conn.query(qry7, req.body.projectID, function (err, results6, fields) {
									conn.query(qry8, req.body.projectID, function (err, results7, fields) {
										
										res.render('project_details', { results7: results7, results6: results6, updateType: updateType, results: results, results1: results1, results2: results2, results3: results3, results4: results4, results5: results5 });
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
		});

	var qry1 = 'DELETE FROM externalactionitem WHERE externalActionItemID = ?'
	var updateType = 'updateExternalActionItem'

	conn.query(qry1, req.body.externalActionItemID, function (err, results0, fields) {
		conn.query(qry, req.body.projectID, function (err, results, fields) {
			conn.query(qry2, req.body.projectID, function (err, results1, fields) {
				conn.query(qry3, req.body.projectID, function (err, results2, fields) {
					conn.query(qry4, req.body.projectID, function (err, results3, fields) {
						conn.query(qry5, req.body.projectID, function (err, results4, fields) {
							conn.query(qry6, req.body.projectID, function (err, results5, fields) {
								conn.query(qry7, req.body.projectID, function (err, results6, fields) {
									conn.query(qry8, req.body.projectID, function (err, results7, fields) {

										res.render('project_details', { results7: results7, results6: results6, updateType: updateType, results: results, results1: results1, results2: results2, results3: results3, results4: results4, results5: results5 });
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
		});
	
	var qry1 = 'INSERT INTO lineitem SET divisionCategory = ?, lineItemBreakdown = ?, originalContractValue = ?, budget = ?, changeOrders = ?, actualCostToDate = ?, subheaderID = ?, projectID = ?'
	var updateType = 'updateCostSummary'
	
	conn.query(qry1, [req.body.divisionCategory, req.body.lineItemBreakdown, req.body.originalContractValue, req.body.budget, req.body.changeOrders, req.body.actualCostToDate, req.body.subheaderID, req.body.projectID], function (err, results0, fields) {
		conn.query(qry, req.body.projectID, function (err, results, fields) {
			conn.query(qry2, req.body.projectID, function (err, results1, fields) {
				conn.query(qry3, req.body.projectID, function (err, results2, fields) {
					conn.query(qry4, req.body.projectID, function (err, results3, fields) {
						conn.query(qry5, req.body.projectID, function (err, results4, fields) {
							conn.query(qry6, req.body.projectID, function (err, results5, fields) {
								conn.query(qry7, req.body.projectID, function (err, results6, fields) {
									conn.query(qry8, req.body.projectID, function (err, results7, fields) {

									res.render('project_details', { results7: results7, results6: results6, updateType: updateType, results: results, results1: results1, results2: results2, results3: results3, results4: results4, results5: results5 });
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
		});
	
	var qry1 = 'UPDATE lineitem SET divisionCategory = ?, lineItemBreakdown = ?, originalContractValue = ?, budget = ?, changeOrders = ?, actualCostToDate = ?, subheaderID = ? WHERE lineItemID = ?'
	var updateType = 'updateCostSummary'
	console.log(req.body.divisionCategory)
	conn.query(qry1, [req.body.divisionCategory, req.body.lineItemBreakdown, req.body.originalContractValue, req.body.budget, req.body.changeOrders, req.body.actualCostToDate, req.body.subheaderID, req.body.lineItemID], function (err, results0, fields) {
		conn.query(qry, req.body.projectID, function (err, results, fields) {
			conn.query(qry2, req.body.projectID, function (err, results1, fields) {
				conn.query(qry3, req.body.projectID, function (err, results2, fields) {
					conn.query(qry4, req.body.projectID, function (err, results3, fields) {
						conn.query(qry5, req.body.projectID, function (err, results4, fields) {
							conn.query(qry6, req.body.projectID, function (err, results5, fields) {
								conn.query(qry7, req.body.projectID, function (err, results6, fields) {
									conn.query(qry8, req.body.projectID, function (err, results7, fields) {

										res.render('project_details', { results7: results7, results6: results6, updateType: updateType, results: results, results1: results1, results2: results2, results3: results3, results4: results4, results5: results5, results6:results6 });
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
		});
	
	var qry1 = 'DELETE FROM lineitem WHERE lineItemID = ?'
	var updateType = 'updateCostSummary'

	conn.query(qry1, req.body.lineItemID, function (err, results0, fields) {
		conn.query(qry, req.body.projectID, function (err, results, fields) {
			conn.query(qry2, req.body.projectID, function (err, results1, fields) {
				conn.query(qry3, req.body.projectID, function (err, results2, fields) {
					conn.query(qry4, req.body.projectID, function (err, results3, fields) {
						conn.query(qry5, req.body.projectID, function (err, results4, fields) {
							conn.query(qry6, req.body.projectID, function (err, results5, fields) {
								conn.query(qry7, req.body.projectID, function (err, results6, fields) {
									conn.query(qry8, req.body.projectID, function (err, results7, fields) {

										res.render('project_details', { results7: results7, results6: results6, updateType: updateType, results: results, results1: results1, results2: results2, results3: results3, results4: results4, results5: results5 });
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
		});
	
	var dueDate = req.body.dueDate
	var toKMSDate = req.body.toKMSDate
	var kmsReviewedDate = req.body.kmsReviewedDate
	var clientApprovedDate = req.body.clientApprovedDate

	if (req.body.dueDate == ""){activityStartDate = null};
	if (req.body.toKMSDate == ""){targetCompletionDate = null};
	if (req.body.kmsReviewedDate == ""){actualCompletionDate = null};
	if (req.body.clientApprovedDate == ""){clientApprovedDate = null};

	var qry1 = 'INSERT INTO pco SET pcoNumber = ?, pcoDescription = ?, dueDate = ?, toKMSDate = ?, kmsReviewedDate = ?, clientApprovedDate = ?, pcoValue = ?, contingencyAmount = ?, costSavingsAmount = ?, changeOrders = ?, pcoStatus = ?, comments = ?, projectID = ?'
	var updateType = 'updatePCO'
	
	conn.query(qry1, [req.body.pcoNumber, req.body.pcoDescription, dueDate, toKMSDate, kmsReviewedDate, clientApprovedDate, req.body.pcoValue, req.body.contingencyAmount, req.body.costSavingsAmount, req.body.changeOrders, req.body.pcoStatus, req.body.comments, req.body.projectID], function (err, results0, fields) {
		conn.query(qry, req.body.projectID, function (err, results, fields) {
			conn.query(qry2, req.body.projectID, function (err, results1, fields) {
				conn.query(qry3, req.body.projectID, function (err, results2, fields) {
					conn.query(qry4, req.body.projectID, function (err, results3, fields) {
						conn.query(qry5, req.body.projectID, function (err, results4, fields) {
							conn.query(qry6, req.body.projectID, function (err, results5, fields) {
								conn.query(qry7, req.body.projectID, function (err, results6, fields) {
									conn.query(qry8, req.body.projectID, function (err, results7, fields) {

										res.render('project_details', { results7: results7, results6: results6, updateType: updateType, results: results, results1: results1, results2: results2, results3: results3, results4: results4, results5: results5 });
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
		});
	
	var dueDate = req.body.dueDate
	var toKMSDate = req.body.toKMSDate
	var kmsReviewedDate = req.body.kmsReviewedDate
	var clientApprovedDate = req.body.clientApprovedDate

	if (req.body.dueDate == ""){activityStartDate = null};
	if (req.body.toKMSDate == ""){targetCompletionDate = null};
	if (req.body.kmsReviewedDate == ""){actualCompletionDate = null};
	if (req.body.clientApprovedDate == ""){clientApprovedDate = null};

	var qry1 = 'UPDATE pco SET pcoNumber = ?, pcoDescription = ?, dueDate = ?, toKMSDate = ?, kmsReviewedDate = ?, clientApprovedDate = ?, pcoValue = ?, contingencyAmount = ?, costSavingsAmount = ?, changeOrders = ?, pcoStatus = ?, comments = ? WHERE pcoID = ?'
	var updateType = 'updatePCO'

	conn.query(qry1, [req.body.pcoNumber, req.body.pcoDescription, dueDate, toKMSDate, kmsReviewedDate, clientApprovedDate, req.body.pcoValue, req.body.contingencyAmount, req.body.costSavingsAmount, req.body.changeOrders, req.body.pcoStatus, req.body.comments, req.body.pcoID], function (err, results0, fields) {
		conn.query(qry, req.body.projectID, function (err, results, fields) {
			conn.query(qry2, req.body.projectID, function (err, results1, fields) {
				conn.query(qry3, req.body.projectID, function (err, results2, fields) {
					conn.query(qry4, req.body.projectID, function (err, results3, fields) {
						conn.query(qry5, req.body.projectID, function (err, results4, fields) {
							conn.query(qry6, req.body.projectID, function (err, results5, fields) {
								conn.query(qry7, req.body.projectID, function (err, results6, fields) {
									conn.query(qry8, req.body.projectID, function (err, results7, fields) {

										res.render('project_details', { results7: results7, results6: results6, updateType: updateType, results: results, results1: results1, results2: results2, results3: results3, results4: results4, results5: results5 });
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
		});
	
	var qry1 = 'DELETE FROM pco WHERE pcoID = ?'
	var updateType = 'updatePCO'
	
	conn.query(qry1, req.body.pcoID, function (err, results0, fields) {
		conn.query(qry, req.body.projectID, function (err, results, fields) {
			conn.query(qry2, req.body.projectID, function (err, results1, fields) {
				conn.query(qry3, req.body.projectID, function (err, results2, fields) {
					conn.query(qry4, req.body.projectID, function (err, results3, fields) {
						conn.query(qry5, req.body.projectID, function (err, results4, fields) {
							conn.query(qry6, req.body.projectID, function (err, results5, fields) {
								conn.query(qry7, req.body.projectID, function (err, results6, fields) {
									conn.query(qry8, req.body.projectID, function (err, results7, fields) {

										res.render('project_details', { results7: results7, results6: results6, updateType: updateType, results: results, results1: results1, results2: results2, results3: results3, results4: results4, results5: results5 });
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

router.post('/newSubheader', ensureAuthenticated, function (req, res) {
	
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

	var qry1 = 'INSERT INTO costsummarysubheader SET subheaderName = ?, divisionCategory = ?, projectID = ?'
	var updateType = 'updateCostSummary'
	
	conn.query(qry1, [req.body.subheaderName,  req.body.divisionCategory, req.body.projectID], function (err, results0, fields) {
		conn.query(qry, req.body.projectID, function (err, results, fields) {
			conn.query(qry2, req.body.projectID, function (err, results1, fields) {
				conn.query(qry3, req.body.projectID, function (err, results2, fields) {
					conn.query(qry4, req.body.projectID, function (err, results3, fields) {
						conn.query(qry5, req.body.projectID, function (err, results4, fields) {
							conn.query(qry6, req.body.projectID, function (err, results5, fields) {
								conn.query(qry7, req.body.projectID, function (err, results6, fields) {
									conn.query(qry8, req.body.projectID, function (err, results7, fields) {

										res.render('project_details', { results7: results7, results6: results6, updateType: updateType, results: results, results1: results1, results2: results2, results3: results3, results4: results4, results5: results5 });
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
		});

	var tempqry = 'SELECT * FROM project'
	var tempqry2 = 'SELECT * FROM project'

	conn.query(tempqry, function (err, results, fields) {
		conn.query(tempqry2, function (err, results1, fields) {
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
		});

	conn.query(qry, req.body.projectID, function (err, results, fields) {
		conn.query(qry2, req.body.projectID, function (err, results1, fields) {
			conn.query(qry3, req.body.projectID, function (err, results2, fields) {
				conn.query(qry4, req.body.projectID, function (err, results3, fields) {
					conn.query(qry5, req.body.projectID, function (err, results4, fields) {
						conn.query(qry6, req.body.projectID, function (err, results5, fields) {
							conn.query(qry7, req.body.projectID, function (err, results6, fields) {
								conn.query(qry8, req.body.projectID, function (err, results7, fields) {
									console.log(results4);
									res.render('project_details', { results7: results7, results: results, results1: results1, results2: results2, results3: results3, results4: results4, results5: results5, results6:results6 });
								});
							});
						});
					});
				});
			});
		});
	});
});


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
		});

	var tempqry = 'SELECT project.projectID, project.clientName, project.projectName, project.projectedBudget, project.serviceType, project.location FROM project INNER JOIN projectassignment ON project.projectID = projectassignment.projectID INNER JOIN user ON projectassignment.userID = user.userID WHERE email = ?'

	conn.query(tempqry, req.user, function (err, results, fields) {
		res.render('project', { results: results });
	});
});

//This searches the projects on the project search page. Could use some optimization to include searching client names as well as project naem
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
		});

	var tempsearch = '%' + req.body.searchForm + '%'
	var tempqry = 'SELECT * FROM project WHERE projectName LIKE ?'
	var tempqry2 = 'SELECT * FROM project WHERE projectName LIKE ?'

	conn.query(tempqry, tempsearch, function (err, results, fields) {
		conn.query(tempqry2, tempsearch, function (err, results1, fields) {
			res.render('project', { results: results, results1: results1 });
		});
	});
});


//This function ensures that every route is authenticated with a user otherwise it will direct the person browsing to the login screen
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error_msg', 'You are not logged in');
		res.redirect('/users/login');
	}
}

//These two function use passport to set the global variable user to authenticate throughtout a session??
passport.serializeUser(function (email, done) {
	done(null, email);
});

passport.deserializeUser(function (email, done) {
	done(null, email);
});

module.exports = router;