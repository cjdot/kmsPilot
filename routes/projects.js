var express = require('express');
var router = express.Router();
var passport = require('passport');
//I think we're using local Strategy incorrectly? Possibly not at all but the user is searialized and deseriabled
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

//These are the configuration settings to make the database connection to eventually query and return results to appropriate handlebars file
var config = {

	host: 'kmspilot2.mysql.database.azure.com',
	user: 'kmsadmin@kmspilot2',
	password: 'KMSproject1',
	database: 'kmspilot',
	port: 3306,
	ssl: true

};

//All of these query variables below are used to populate either the project details page or the project search page
//Each of these query's are used in just about every function below
var qry = 'SELECT * FROM project WHERE projectID = @projectID; '
var qry2 = 'SELECT * FROM projectactivity WHERE projectID = @projectID; '
var qry3 = 'SELECT * FROM kmsactionitem WHERE projectID = @projectID'
var qry4 = 'SELECT * FROM externalactionitem WHERE projectID = @projectID; '
var qry5 = 'SELECT * FROM lineitem WHERE projectID = @projectID; '
var qry6 = 'SELECT * FROM pco WHERE projectID = @projectID; '
var qry7 = 'SELECT * FROM orderset WHERE projectID = @projectID ORDER BY orderSet; '
var qry9 = 'SELECT divisionCategory, SUM(budget) AS budget, SUM(originalContractValue) AS originalContractValue, SUM(changeOrders) AS changeOrders, SUM(revisedContractValue) AS revisedContractValue, SUM(variance) AS variance, SUM(actualCostToDate) AS actualCostToDate, sum(remainingContractValue) remainingContractValue FROM lineitem WHERE projectID = @projectID GROUP BY divisionCategory; '
var qry10 = 'SELECT SUM(budget) AS budget, SUM(originalContractValue) AS originalContractValue, SUM(revisedContractValue) AS revisedContractValue, SUM(variance) AS variance, SUM(actualCostToDate) AS actualCostToDate, SUM(remainingContractValue) AS remainingContractValue FROM lineitem WHERE projectID = @projectID; '
var qry11 = 'SELECT SUM(budget) AS budget, SUM(originalContractValue) AS originalContractValue, SUM(changeOrders) AS changeOrders, SUM(revisedContractValue) AS revisedContractValue, SUM(variance) AS variance, SUM(actualCostToDate) AS actualCostToDate, sum(remainingContractValue) remainingContractValue FROM lineitem WHERE (divisionCategory=\'Allowances\' OR divisionCategory=\'FF&E\' OR divisionCategory=\'IT\' OR divisionCategory=\'Security\' OR divisionCategory=\'Consultants\' OR divisionCategory=\'Contingency\' OR divisionCategory=\'Owner Supplied Equipment\') AND projectID = @projectID; '
var qry12 = 'SELECT SUM(budget) AS budget, SUM(originalContractValue) AS originalContractValue, SUM(changeOrders) AS changeOrders, SUM(revisedContractValue) AS revisedContractValue, SUM(variance) AS variance, SUM(actualCostToDate) AS actualCostToDate, sum(remainingContractValue) remainingContractValue FROM lineitem WHERE (divisionCategory=\'Division 1 - General Conditions and Insurance\' OR divisionCategory=\'Division 2 - Site Construction\' OR divisionCategory=\'Division 3 - Concrete\' OR divisionCategory=\'Division 4 - Masonry\' OR divisionCategory=\'Division 5 - Metals\' OR divisionCategory=\'Division 6 - Carpentry and Millwork\' OR divisionCategory=\'Division 7 - Thermal and Moisture Protection\' OR divisionCategory=\'Division 8 - Doors and Windows\' OR divisionCategory=\'Division 9 - Finishes\' OR divisionCategory=\'Division 10 - Specialties\' OR divisionCategory=\'Division 11 - Equipment\' OR divisionCategory=\'Division 12 - Furnishings\' OR divisionCategory=\'Division 13 - Special Construction\' OR divisionCategory=\'Division 14 - Conveying Systems\' OR divisionCategory=\'Division 15 - Mechanical, Plumbing, HVAC, and Fire\' OR divisionCategory=\'Division 16 - Electrical\' ) AND projectID = @projectID; '

router.post('/newProjectActivity', ensureAuthenticated, function (req, res) {
		
	var targetStartDate = req.body.targetStartDate
	var actualStartDate = req.body.actualStartDate
	var targetCompletionDate = req.body.targetCompletionDate
	var actualCompletionDate = req.body.actualCompletionDate
	var progress = req.body.progress

	//Places a null value in each of the fields if there is not a value entered
	if (req.body.targetStartDate == ""){targetStartDate = null};
	if (req.body.actualStartDate == ""){actualStartDate = null};
	if (req.body.targetCompletionDate == ""){targetCompletionDate = null};
	if (req.body.actualCompletionDate == ""){actualCompletionDate = null};
	if (req.body.progress == ""){progress = null};
	//Inserts data into the projectactivity table within the database
	var qry1 = 'INSERT INTO projectactivity (activityDescription, targetStartDate, actualStartDate, targetCompletionDate, actualCompletionDate, progress, activityNotes, projectID) VALUES (@activityDescription, @targetStartDate, @actualStartDate, @targetCompletionDate, @actualCompletionDate, @progress, @activityNotes, @projectID); ' 	
	var updateType = 'updateProjectActivity'

	//Establishing connection to the database
    const conn = new sql.ConnectionPool(sqlconfig);
	var request = new sql.Request(conn);
	
	console.log(null)
	console.log(progress)
	console.log(req.body.progress)

	conn.connect(
		function (err) {
			if (err) {
				console.log("!!!! Cannot Connect !!!! Error")
				throw err;
			}
			else {
                console.log("Connection established.");
                
				request.input("activityDescription", sql.VarChar, req.body.activityDescription);
				request.input("targetStartDate", sql.Date, targetStartDate);
				request.input("actualStartDate", sql.Date,actualStartDate);
				request.input("targetCompletionDate", sql.Date, targetCompletionDate);
				request.input("actualCompletionDate", sql.Date, actualCompletionDate);
				request.input("progress", sql.Int, progress)
				request.input("activityNotes", sql.VarChar, req.body.activityNotes)
				request.input("projectID", sql.Int, req.body.projectID)

				request.query(qry1, function (err, results0, fields) {
					request.query(qry, function (err, results, fields) {
						request.query(qry2, function (err, results1, fields) {
							request.query(qry3, function (err, results2, fields) {
								request.query(qry4, function (err, results3, fields) {
									request.query(qry5, function (err, results4, fields) {
										request.query(qry6, function (err, results5, fields) {
											request.query(qry7, function (err, results6, fields) {												
												request.query(qry9, function (err, results8, fields) {
													request.query(qry10, function (err, results9, fields) {
														request.query(qry11, function (err, results10, fields) {
															request.query(qry12, function (err, results11, fields) {													
																
															res.render('project_details', {results10: results10.recordset, results11: results11.recordset, results9: results9.recordset, results8: results8.recordset, updateType: updateType, results: results.recordset, results1: results1.recordset, results2: results2.recordset, results3: results3.recordset, results4: results4.recordset, results5: results5.recordset, results6: results6.recordset });
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
				});
			}); 
		}
	});
});

router.post('/updateProjectActivity', ensureAuthenticated, function (req, res) {
	
	var qry1 = 'UPDATE projectactivity SET activityDescription = @activityDescription, targetStartDate = @targetStartDate, actualStartDate = @actualStartDate, targetCompletionDate = @targetCompletionDate, actualCompletionDate = @actualCompletionDate, progress = @progress, activityNotes = @activityNotes WHERE projectActivityID = @projectActivityID'
	var updateType = 'updateProjectActivity'

	var targetStartDate = req.body.targetStartDate
	var actualStartDate = req.body.actualStartDate
	var targetCompletionDate = req.body.targetCompletionDate
	var actualCompletionDate = req.body.actualCompletionDate
	var progress = req.body.progress

	//Places a null value in each of the fields if there is not a value entered
	if (req.body.targetStartDate == ""){targetStartDate = null};
	if (req.body.actualStartDate == ""){actualStartDate = null};
	if (req.body.targetCompletionDate == ""){targetCompletionDate = null};
	if (req.body.actualCompletionDate == ""){actualCompletionDate = null};
	if (req.body.progress == ""){progress = null};

	//Updates data in the projectactivity table within the database
	

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
                
				request.input("activityDescription", sql.VarChar, req.body.activityDescription);
				request.input("targetStartDate", sql.Date, targetStartDate);
				request.input("actualStartDate", sql.Date, actualStartDate);
				request.input("targetCompletionDate", sql.Date, targetCompletionDate);
				request.input("actualCompletionDate", sql.Date, actualCompletionDate);
				request.input("progress", sql.Int, progress)
				request.input("activityNotes", sql.VarChar, req.body.activityNotes)
				request.input("projectActivityID", sql.Int, req.body.projectActivityID)
				request.input("projectID", sql.Int, req.body.projectID)

				request.query(qry1, function (err, results0, fields) {
					request.query(qry, function (err, results, fields) {
						request.query(qry2, function (err, results1, fields) {
							request.query(qry3, function (err, results2, fields) {
								request.query(qry4, function (err, results3, fields) {
									request.query(qry5, function (err, results4, fields) {
										request.query(qry6, function (err, results5, fields) {
											request.query(qry7, function (err, results6, fields) {												
												request.query(qry9, function (err, results8, fields) {
													request.query(qry10, function (err, results9, fields) {
														request.query(qry11, function (err, results10, fields) {
															request.query(qry12, function (err, results11, fields) {											

															res.render('project_details', {results10: results10.recordset, results11: results11.recordset, results9: results9.recordset, results8: results8.recordset, updateType: updateType, results: results.recordset, results1: results1.recordset, results2: results2.recordset, results3: results3.recordset, results4: results4.recordset, results5: results5.recordset, results6: results6.recordset });
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
				});
			});
		}
	});
});

router.post('/deleteProjectActivity', ensureAuthenticated, function (req, res) {
	
	
	
	//Deletes data from the projectactivity table within the database
	var qry1 = 'DELETE FROM projectactivity WHERE projectActivityID = @projectActivityID'
	var updateType = 'updateProjectActivity'

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
                
				request.input("projectActivityID", sql.Int, req.body.projectActivityID)
				request.input("projectID", sql.Int, req.body.projectID)

				request.query(qry1, function (err, results0, fields) {
					request.query(qry, function (err, results, fields) {
						request.query(qry2,  function (err, results1, fields) {
							request.query(qry3, function (err, results2, fields) {
								request.query(qry4, function (err, results3, fields) {
									request.query(qry5, function (err, results4, fields) {
										request.query(qry6, function (err, results5, fields) {
											request.query(qry7, function (err, results6, fields) {												
												request.query(qry9, function (err, results8, fields) {
													request.query(qry10, function (err, results9, fields) {
														request.query(qry11, function (err, results10, fields) {
															request.query(qry12, function (err, results11, fields) {
														
															res.render('project_details', {results10: results10.recordset, results11: results11.recordset, results9: results9.recordset, results8: results8.recordset,  updateType: updateType, results: results.recordset, results1: results1.recordset, results2: results2.recordset, results3: results3.recordset, results4: results4.recordset, results5: results5.recordset, results6: results6.recordset });
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
				});
			});
		}
	});
});

router.post('/newActionItem', ensureAuthenticated, function (req, res) {
		
	var activityStartDate = req.body.activityStartDate
	var targetCompletionDate = req.body.targetCompletionDate
	var actualCompletionDate = req.body.actualCompletionDate

	//Places a null value in each of the fields if there is not a value entered
	if (req.body.activityStartDate == ""){activityStartDate = null};
	if (req.body.targetCompletionDate == ""){targetCompletionDate = null};
	if (req.body.actualCompletionDate == ""){actualCompletionDate = null};
	
	//Inserts data into the kmsactionitem table within the database
	var qry1 = 'INSERT INTO kmsactionitem (actionItemDescription, activityOwner, activityStartDate, targetCompletionDate, actualCompletionDate, actionItemNotes, projectID) VALUES (@actionItemDescription, @activityOwner, @activityStartDate, @targetCompletionDate, @actualCompletionDate, @actionItemNotes, @projectID)'
	var updateType = 'updateActionItem'

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
                
				request.input("actionItemDescription", sql.VarChar, req.body.actionItemDescription);
				request.input("activityOwner", sql.VarChar, req.body.activityOwner);
				request.input("activityStartDate", sql.Date, activityStartDate);
				request.input("targetCompletionDate", sql.Date, targetCompletionDate);
				request.input("actualCompletionDate", sql.Date, actualCompletionDate);
				request.input("actionItemNotes", sql.VarChar, req.body.actionItemNotes);
				request.input("projectID", sql.Int, req.body.projectID);

				request.query(qry1,  function (err, results0, fields) {
					request.query(qry, function (err, results, fields) {
						request.query(qry2, function (err, results1, fields) {
							request.query(qry3, function (err, results2, fields) {
								request.query(qry4, function (err, results3, fields) {
									request.query(qry5, function (err, results4, fields) {
										request.query(qry6, function (err, results5, fields) {
											request.query(qry7, function (err, results6, fields) {										
												request.query(qry9, function (err, results8, fields) {
													request.query(qry10, function (err, results9, fields) {
														request.query(qry11, function (err, results10, fields) {
															request.query(qry11, function (err, results11, fields) {
															
															res.render('project_details', {results10: results10.recordset, results11: results11.recordset, results9: results9.recordset, results8: results8.recordset, updateType: updateType, results: results.recordset, results1: results1.recordset, results2: results2.recordset, results3: results3.recordset, results4: results4.recordset, results5: results5.recordset, results6: results6.recordset });
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
				});
			});				
		}
	});	
});

router.post('/updateActionItem', ensureAuthenticated, function (req, res) {
	
	//Updates data in the kmsactionitem table within the database
	var qry1 = 'UPDATE kmsactionitem SET actionItemDescription = @actionItemDescription, activityOwner = @activityOwner, activityStartDate = @activityStartDate, targetCompletionDate = @targetCompletionDate, actualCompletionDate = @actualCompletionDate, actionItemNotes = @actionItemNotes WHERE kmsActionItemID = @kmsActionItemID'
	var updateType = 'updateActionItem'

	var activityStartDate = req.body.activityStartDate
	var targetCompletionDate = req.body.targetCompletionDate
	var actualCompletionDate = req.body.actualCompletionDate

	//Places a null value in each of the fields if there is not a value entered
	if (req.body.activityStartDate == ""){activityStartDate = null};
	if (req.body.targetCompletionDate == ""){targetCompletionDate = null};
	if (req.body.actualCompletionDate == ""){actualCompletionDate = null};

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
                
				request.input("actionItemDescription", sql.VarChar, req.body.actionItemDescription);
				request.input("activityOwner", sql.VarChar, req.body.activityOwner);
				request.input("activityStartDate", sql.Date, activityStartDate);
				request.input("targetCompletionDate", sql.Date, targetCompletionDate);
				request.input("actualCompletionDate", sql.Date, actualCompletionDate);
				request.input("actionItemNotes", sql.VarChar, req.body.actionItemNotes);
				request.input("kmsActionItemID", sql.Int, req.body.kmsActionItemID);
				request.input("projectID", sql.Int, req.body.projectID);

				request.query(qry1,  function (err, results0, fields) {
					request.query(qry, function (err, results, fields) {
						request.query(qry2, function (err, results1, fields) {
							request.query(qry3, function (err, results2, fields) {
								request.query(qry4, function (err, results3, fields) {
									request.query(qry5, function (err, results4, fields) {
										request.query(qry6, function (err, results5, fields) {
											request.query(qry7, function (err, results6, fields) {												
												request.query(qry9, function (err, results8, fields) {
													request.query(qry10, function (err, results9, fields) {
														request.query(qry11, function (err, results10, fields) {
															request.query(qry12, function (err, results11, fields) {											

															res.render('project_details', {results10: results10.recordset, results11: results11.recordset, results9: results9.recordset, results8: results8.recordset, updateType: updateType, results: results.recordset, results1: results1.recordset, results2: results2.recordset, results3: results3.recordset, results4: results4.recordset, results5: results5.recordset, results6: results6.recordset });
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
				});
			});				
		}
	});	
});

router.post('/deleteActionItem', ensureAuthenticated, function (req, res) {
	
	//Deletes data from the kmsactionitem table within the database
	var qry1 = 'DELETE FROM kmsactionitem WHERE kmsActionItemID = @kmsActionItemID'
	var updateType = 'updateActionItem'

	var activityStartDate = req.body.activityStartDate
	var targetCompletionDate = req.body.targetCompletionDate
	var actualCompletionDate = req.body.actualCompletionDate

	//Places a null value in each of the fields if there is not a value entered
	if (req.body.activityStartDate == ""){activityStartDate = null};
	if (req.body.targetCompletionDate == ""){targetCompletionDate = null};
	if (req.body.actualCompletionDate == ""){actualCompletionDate = null};

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
 
				request.input("kmsActionItemID", sql.Int, req.body.kmsActionItemID);
				request.input("projectID", sql.Int, req.body.projectID);

				request.query(qry1,  function (err, results0, fields) {
					request.query(qry, function (err, results, fields) {
						request.query(qry2, function (err, results1, fields) {
							request.query(qry3, function (err, results2, fields) {
								request.query(qry4, function (err, results3, fields) {
									request.query(qry5, function (err, results4, fields) {
										request.query(qry6, function (err, results5, fields) {
											request.query(qry7, function (err, results6, fields) {											
												request.query(qry9, function (err, results8, fields) {
													request.query(qry10, function (err, results9, fields) {
														request.query(qry11, function (err, results10, fields) {
															request.query(qry12, function (err, results11, fields) {

															res.render('project_details', {results10: results10.recordset, results11: results11.recordset, results9: results9.recordset, results8: results8.recordset, updateType: updateType, results: results.recordset, results1: results1.recordset, results2: results2.recordset, results3: results3.recordset, results4: results4.recordset, results5: results5.recordset, results6: results6.recordset });
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
				});
			});				
		}
	});	
});

router.post('/newExternalActionItem', ensureAuthenticated, function (req, res) {
	
	var qry1 = 'INSERT INTO externalactionitem (actionItemDescription, activityOwner, activityStartDate, targetCompletionDate , actualCompletionDate, actionItemNotes, projectID) VALUES(@actionItemDescription, @activityOwner, @activityStartDate, @targetCompletionDate, @actualCompletionDate, @actionItemNotes, @projectID)'
	var updateType = 'updateExternalActionItem'

	var activityStartDate = req.body.activityStartDate
	var targetCompletionDate = req.body.targetCompletionDate
	var actualCompletionDate = req.body.actualCompletionDate

	//Places a null value in each of the fields if there is not a value entered
	if (req.body.activityStartDate == ""){activityStartDate = null};
	if (req.body.targetCompletionDate == ""){targetCompletionDate = null};
	if (req.body.actualCompletionDate == ""){actualCompletionDate = null};

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
                
				request.input("actionItemDescription", sql.VarChar, req.body.actionItemDescription);
				request.input("activityOwner", sql.VarChar, req.body.activityOwner);
				request.input("activityStartDate", sql.Date, activityStartDate);
				request.input("targetCompletionDate", sql.Date, targetCompletionDate);
				request.input("actualCompletionDate", sql.Date, actualCompletionDate);
				request.input("actionItemNotes", sql.VarChar, req.body.actionItemNotes);
				request.input("projectID", sql.Int, req.body.projectID);

				request.query(qry1,  function (err, results0, fields) {
					request.query(qry, function (err, results, fields) {
						request.query(qry2, function (err, results1, fields) {
							request.query(qry3, function (err, results2, fields) {
								request.query(qry4, function (err, results3, fields) {
									request.query(qry5, function (err, results4, fields) {
										request.query(qry6, function (err, results5, fields) {
											request.query(qry7, function (err, results6, fields) {											
												request.query(qry9, function (err, results8, fields) {
													request.query(qry10, function (err, results9, fields) {
														request.query(qry11, function (err, results10, fields) {
															request.query(qry12, function (err, results11, fields) {

															res.render('project_details', {results10: results10.recordset, results11: results11.recordset, results9: results9.recordset, results8: results8.recordset, updateType: updateType, results: results.recordset, results1: results1.recordset, results2: results2.recordset, results3: results3.recordset, results4: results4.recordset, results5: results5.recordset, results6: results6.recordset });
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
				});
			});				
		}
	});
});

router.post('/updateExternalActionItem', ensureAuthenticated, function (req, res) {
	
	//Updates data in the kmsactionitem table within the database
	var qry1 = 'UPDATE externalactionitem SET actionItemDescription = @actionItemDescription, activityOwner = @activityOwner, activityStartDate = @activityStartDate, targetCompletionDate = @targetCompletionDate, actualCompletionDate = @actualCompletionDate, actionItemNotes = @actionItemNotes WHERE externalActionItemID = @externalActionItemID'
	var updateType = 'updateExternalActionItem'

	var activityStartDate = req.body.activityStartDate
	var targetCompletionDate = req.body.targetCompletionDate
	var actualCompletionDate = req.body.actualCompletionDate

	//Places a null value in each of the fields if there is not a value entered
	if (req.body.activityStartDate == ""){activityStartDate = null};
	if (req.body.targetCompletionDate == ""){targetCompletionDate = null};
	if (req.body.actualCompletionDate == ""){actualCompletionDate = null};

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
                
				request.input("actionItemDescription", sql.VarChar, req.body.actionItemDescription);
				request.input("activityOwner", sql.VarChar, req.body.activityOwner);
				request.input("activityStartDate", sql.Date, activityStartDate);
				request.input("targetCompletionDate", sql.Date, targetCompletionDate);
				request.input("actualCompletionDate", sql.Date, actualCompletionDate);
				request.input("actionItemNotes", sql.VarChar, req.body.actionItemNotes);
				request.input("externalActionItemID", sql.Int, req.body.externalActionItemID);
				request.input("projectID", sql.Int, req.body.projectID);

				request.query(qry1,  function (err, results0, fields) {
					request.query(qry, function (err, results, fields) {
						request.query(qry2, function (err, results1, fields) {
							request.query(qry3, function (err, results2, fields) {
								request.query(qry4, function (err, results3, fields) {
									request.query(qry5, function (err, results4, fields) {
										request.query(qry6, function (err, results5, fields) {
											request.query(qry7, function (err, results6, fields) {												
												request.query(qry9, function (err, results8, fields) {
													request.query(qry10, function (err, results9, fields) {
														request.query(qry11, function (err, results10, fields) {
															request.query(qry12, function (err, results11, fields) {														

															res.render('project_details', {results10: results10.recordset, results11: results11.recordset, results9: results9.recordset, results8: results8.recordset, updateType: updateType, results: results.recordset, results1: results1.recordset, results2: results2.recordset, results3: results3.recordset, results4: results4.recordset, results5: results5.recordset, results6: results6.recordset });
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
				});
			});				
		}
	});
});


router.post('/deleteExternalActionItem', ensureAuthenticated, function (req, res) {
	
	//Deletes data from the kmsactionitem table within the database
	var qry1 = 'DELETE FROM externalactionitem WHERE externalActionItemID = @externalActionItemID'
	var updateType = 'updateExternalActionItem'

	var activityStartDate = req.body.activityStartDate
	var targetCompletionDate = req.body.targetCompletionDate
	var actualCompletionDate = req.body.actualCompletionDate

	//Places a null value in each of the fields if there is not a value entered
	if (req.body.activityStartDate == ""){activityStartDate = null};
	if (req.body.targetCompletionDate == ""){targetCompletionDate = null};
	if (req.body.actualCompletionDate == ""){actualCompletionDate = null};

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
 
				request.input("externalActionItemID", sql.Int, req.body.externalActionItemID);
				request.input("projectID", sql.Int, req.body.projectID);

				request.query(qry1,  function (err, results0, fields) {
					request.query(qry, function (err, results, fields) {
						request.query(qry2, function (err, results1, fields) {
							request.query(qry3, function (err, results2, fields) {
								request.query(qry4, function (err, results3, fields) {
									request.query(qry5, function (err, results4, fields) {
										request.query(qry6, function (err, results5, fields) {
											request.query(qry7, function (err, results6, fields) {												
												request.query(qry9, function (err, results8, fields) {
													request.query(qry10, function (err, results9, fields) {
														request.query(qry11, function (err, results10, fields) {
															request.query(qry12, function (err, results11, fields) {

															res.render('project_details', {results10: results10.recordset, results11: results11.recordset, results9: results9.recordset, results8: results8.recordset, updateType: updateType, results: results.recordset, results1: results1.recordset, results2: results2.recordset, results3: results3.recordset, results4: results4.recordset, results5: results5.recordset, results6: results6.recordset });
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
				});
			});				
		}
	});	
});

router.post('/newCostSummary', ensureAuthenticated, function (req, res) {
	
	
	var qry1 = 'INSERT INTO lineitem (divisionCategory, lineItemBreakdown, originalContractValue, budget, changeOrders, actualCostToDate, projectID) VALUES (@divisionCategory, @lineItemBreakdown, @originalContractValue, @budget, @changeOrders, @actualCostToDate, @projectID)'
	var updateType = 'updateCostSummary'
	
	//Establishing connection to the database
    const conn = new sql.ConnectionPool(sqlconfig);
	var request = new sql.Request(conn);

	var budget = req.body.budget
	var originalContractValue = req.body.originalContractValue
	var changeOrders = req.body.changeOrders
	var actualCostToDate = req.body.actualCostToDate

	//Places a null value in each of the fields if there is not a value entered
	if (req.body.budget == ""){budget = null};
	if (req.body.originalContractValue == ""){originalContractValue = null};
	if (req.body.changeOrders == ""){changeOrders = null};
	if (req.body.actualCostToDate == ""){actualCostToDate = null};
	
	conn.connect(

		function (err) {
			if (err) {
				console.log("!!!! Cannot Connect !!!! Error")
				throw err;
			}
			else {
                console.log("Connection established.");
                
				request.input("divisionCategory", sql.VarChar, req.body.divisionCategory);
				request.input("lineItemBreakdown", sql.VarChar, req.body.lineItemBreakdown);
				request.input("originalContractValue", sql.Decimal, originalContractValue);
				request.input("budget", sql.Decimal, budget);
				request.input("changeOrders", sql.Decimal, changeOrders);
				request.input("actualCostToDate", sql.Decimal, actualCostToDate);
				request.input("projectID", sql.Int, req.body.projectID);

				request.query(qry1, function (err, results0, fields) {					
					request.query(qry, function (err, results, fields) {						
						request.query(qry2, function (err, results1, fields) {							
							request.query(qry3, function (err, results2, fields) {								
								request.query(qry4, function (err, results3, fields) {
									request.query(qry5, function (err, results4, fields) {
										request.query(qry6, function (err, results5, fields) {
											request.query(qry7, function (err, results6, fields) {												
												request.query(qry9, function (err, results8, fields) {
													request.query(qry10, function (err, results9, fields) {
														request.query(qry11, function (err, results10, fields) {
															request.query(qry12, function (err, results11, fields) {										

															res.render('project_details', {results10: results10.recordset, results11: results11.recordset, results9: results9.recordset, results8: results8.recordset, updateType: updateType, results: results.recordset, results1: results1.recordset, results2: results2.recordset, results3: results3.recordset, results4: results4.recordset, results5: results5.recordset, results6: results6.recordset });
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
				});
			});				
		}
	});
});

router.post('/updateCostSummary', ensureAuthenticated, function (req, res) {
	
	
	var qry1 = 'UPDATE lineitem SET divisionCategory = @divisionCategory, lineItemBreakdown = @lineItemBreakdown, originalContractValue = @originalContractValue, budget = @budget, changeOrders = @changeOrders, actualCostToDate = @actualCostToDate WHERE lineItemID = @lineItemID'
	var updateType = 'updateCostSummary'

	
	//Establishing connection to the database
    const conn = new sql.ConnectionPool(sqlconfig);
	var request = new sql.Request(conn);
	
	var budget = req.body.budget
	var originalContractValue = req.body.originalContractValue
	var changeOrders = req.body.changeOrders
	var actualCostToDate = requ.body.actualCostToDate

	//Places a null value in each of the fields if there is not a value entered
	if (req.body.budget == ""){budget = null};
	if (req.body.originalContractValue == ""){originalContractValue = null};
	if (req.body.changeOrders == ""){changeOrders = null};
	if (req.body.actualCostToDate == ""){actualCostToDate = null};

	conn.connect(

		function (err) {
			if (err) {
				console.log("!!!! Cannot Connect !!!! Error")
				throw err;
			}
			else {
                console.log("Connection established.");
                
				request.input("divisionCategory", sql.VarChar, req.body.divisionCategory);
				request.input("lineItemBreakdown", sql.VarChar, req.body.lineItemBreakdown);
				request.input("originalContractValue", sql.Decimal, originalContractValue);
				request.input("budget", sql.Decimal, budget);
				request.input("changeOrders", sql.Decimal, changeOrders);
				request.input("actualCostToDate", sql.Decimal, actualCostToDate);
				request.input("lineItemID", sql.Int, req.body.lineItemID);
				request.input("projectID", sql.Int, req.body.projectID);

				request.query(qry1,  function (err, results0, fields) {
					request.query(qry, function (err, results, fields) {
						request.query(qry2, function (err, results1, fields) {
							request.query(qry3, function (err, results2, fields) {
								request.query(qry4, function (err, results3, fields) {
									request.query(qry5, function (err, results4, fields) {
										request.query(qry6, function (err, results5, fields) {
											request.query(qry7, function (err, results6, fields) {												
												request.query(qry9, function (err, results8, fields) {
													request.query(qry10, function (err, results9, fields) {
														request.query(qry11, function (err, results10, fields) {
															request.query(qry12, function (err, results11, fields) {

															res.render('project_details', {results10: results10.recordset, results11: results11.recordset, results9: results9.recordset, results8: results8.recordset, updateType: updateType, results: results.recordset, results1: results1.recordset, results2: results2.recordset, results3: results3.recordset, results4: results4.recordset, results5: results5.recordset, results6: results6.recordset });
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
				});
			});				
		}
	});
});

router.post('/deleteCostSummary', ensureAuthenticated, function (req, res) {
	
	
	var qry1 = 'DELETE FROM lineitem WHERE lineItemID = @lineItemID'
	var updateType = 'updateCostSummary'

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
                
				request.input("lineItemID", sql.Int, req.body.lineItemID);
				request.input("projectID", sql.Int, req.body.projectID);

				request.query(qry1,  function (err, results0, fields) {
					request.query(qry, function (err, results, fields) {
						request.query(qry2, function (err, results1, fields) {
							request.query(qry3, function (err, results2, fields) {
								request.query(qry4, function (err, results3, fields) {
									request.query(qry5, function (err, results4, fields) {
										request.query(qry6, function (err, results5, fields) {
											request.query(qry7, function (err, results6, fields) {												
												request.query(qry9, function (err, results8, fields) {
													request.query(qry10, function (err, results9, fields) {
														request.query(qry11, function (err, results10, fields) {
															request.query(qry12, function (err, results11, fields) {

															res.render('project_details', {results10: results10.recordset, results11: results11.recordset, results9: results9.recordset, results8: results8.recordset, updateType: updateType, results: results.recordset, results1: results1.recordset, results2: results2.recordset, results3: results3.recordset, results4: results4.recordset, results5: results5.recordset, results6: results6.recordset });
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
				});
			});				
		}
	});
});

router.post('/newPCO', ensureAuthenticated, function (req, res) {
	
	
	var dueDate = req.body.dueDate
	var toKMSDate = req.body.toKMSDate
	var kmsReviewedDate = req.body.kmsReviewedDate
	var clientApprovedDate = req.body.clientApprovedDate
	var pcoValue = req.body.pcoValue
	var contingencyAmount = req.body.contingencyAmount
	var costSavingsAmount = req.body.costSavingsAmount
	var changeOrders = req.body.changeOrders
	var pcoNumber = req.body.pcoNumber

	if (req.body.dueDate == ""){dueDate = null};
	if (req.body.toKMSDate == ""){toKMSDate = null};
	if (req.body.kmsReviewedDate == ""){kmsReviewedDate = null};
	if (req.body.clientApprovedDate == ""){clientApprovedDate = null};
	if (req.body.pcoValue == ""){pcoValue = null};
	if (req.body.contingencyAmount == ""){contingencyAmount = null};
	if (req.body.costSavingsAmount == ""){costSavingsAmount = null};
	if (req.body.changeOrders == ""){changeOrders = null};
	if (req.body.pcoNumber == ""){pcoNumber = null};

	//Inserts data into the pco table within the database
	var qry1 = 'INSERT INTO pco (pcoNumber, pcoDescription, dueDate, toKMSDate, kmsReviewedDate, clientApprovedDate, pcoValue, contingencyAmount, costSavingsAmount, changeOrders, pcoStatus, comments, projectID) VALUES (@pcoNumber, @pcoDescription, @dueDate, @toKMSDate, @kmsReviewedDate, @clientApprovedDate, @pcoValue, @contingencyAmount, @costSavingsAmount, @changeOrders, @pcoStatus, @comments, @projectID)'
	var updateType = 'updatePCO'
	
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
                
				request.input("pcoNumber", sql.Int, pcoNumber);
				request.input("pcoDescription", sql.VarChar, req.body.pcoDescription);
				request.input("dueDate", sql.Date, dueDate);
				request.input("toKMSDate", sql.Date, toKMSDate);
				request.input("kmsReviewedDate", sql.Date, kmsReviewedDate);
				request.input("clientApprovedDate", sql.Date, clientApprovedDate);
				request.input("pcoValue", sql.Decimal, pcoValue);
				request.input("contingencyAmount", sql.Decimal, contingencyAmount);
				request.input("costSavingsAmount", sql.Decimal, costSavingsAmount);
				request.input("changeOrders", sql.Decimal, changeOrders);
				request.input("pcoStatus", sql.VarChar, req.body.pcoStatus);
				request.input("comments", sql.VarChar, req.body.comments);
				request.input("projectID", sql.Int, req.body.projectID);

				request.query(qry1,  function (err, results0, fields) {
					request.query(qry, function (err, results, fields) {
						request.query(qry2, function (err, results1, fields) {
							request.query(qry3, function (err, results2, fields) {
								request.query(qry4, function (err, results3, fields) {
									request.query(qry5, function (err, results4, fields) {
										request.query(qry6, function (err, results5, fields) {
											request.query(qry7, function (err, results6, fields) {												
												request.query(qry9, function (err, results8, fields) {
													request.query(qry10, function (err, results9, fields) {

													res.render('project_details', {results9: results9.recordset, results8: results8.recordset, updateType: updateType, results: results.recordset, results1: results1.recordset, results2: results2.recordset, results3: results3.recordset, results4: results4.recordset, results5: results5.recordset, results6: results6.recordset });
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

router.post('/updatePCO', ensureAuthenticated, function (req, res) {
	
	
	var qry1 = 'UPDATE pco SET pcoNumber = @pcoNumber, pcoDescription = @pcoDescription, dueDate = @dueDate, toKMSDate = @toKMSDate, kmsReviewedDate = @kmsReviewedDate, clientApprovedDate = @clientApprovedDate, pcoValue = @pcoValue, contingencyAmount = @contingencyAmount, costSavingsAmount = @costSavingsAmount, changeOrders = @changeOrders, pcoStatus = @pcoStatus, comments = @comments WHERE pcoID = @pcoID'
	var updateType = 'updatePCO'

	var dueDate = req.body.dueDate
	var toKMSDate = req.body.toKMSDate
	var kmsReviewedDate = req.body.kmsReviewedDate
	var clientApprovedDate = req.body.clientApprovedDate
	var pcoValue = req.body.pcoValue
	var contingencyAmount = req.body.contingencyAmount
	var costSavingsAmount = req.body.costSavingsAmount
	var changeOrders = req.body.changeOrders
	var pcoNumber = req.body.pcoNumber

	if (req.body.dueDate == ""){dueDate = null};
	if (req.body.toKMSDate == ""){toKMSDate = null};
	if (req.body.kmsReviewedDate == ""){kmsReviewedDate = null};
	if (req.body.clientApprovedDate == ""){clientApprovedDate = null};
	if (req.body.pcoValue == ""){pcoValue = null};
	if (req.body.contingencyAmount == ""){contingencyAmount = null};
	if (req.body.costSavingsAmount == ""){costSavingsAmount = null};
	if (req.body.changeOrders == ""){changeOrders = null};
	if (req.body.pcoNumber == ""){pcoNumber = null};

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
                
				request.input("pcoNumber", sql.Int, pcoNumber);
				request.input("pcoDescription", sql.VarChar, req.body.pcoDescription);
				request.input("dueDate", sql.Date, dueDate);
				request.input("toKMSDate", sql.Date, toKMSDate);
				request.input("kmsReviewedDate", sql.Date, kmsReviewedDate);
				request.input("clientApprovedDate", sql.Date, clientApprovedDate);
				request.input("pcoValue", sql.Decimal, pcoValue);
				request.input("contingencyAmount", sql.Decimal, contingencyAmount);
				request.input("costSavingsAmount", sql.Decimal, costSavingsAmount);
				request.input("changeOrders", sql.Decimal, changeOrders);
				request.input("pcoStatus", sql.VarChar, req.body.pcoStatus);
				request.input("comments", sql.VarChar, req.body.comments);
				request.input("pcoID", sql.Int, req.body.pcoID)
				request.input("projectID", sql.Int, req.body.projectID);

				request.query(qry1,  function (err, results0, fields) {
					request.query(qry, function (err, results, fields) {
						request.query(qry2, function (err, results1, fields) {
							request.query(qry3, function (err, results2, fields) {
								request.query(qry4, function (err, results3, fields) {
									request.query(qry5, function (err, results4, fields) {
										request.query(qry6, function (err, results5, fields) {
											request.query(qry7, function (err, results6, fields) {												
												request.query(qry9, function (err, results8, fields) {
													request.query(qry10, function (err, results9, fields) {

													res.render('project_details', {results9: results9.recordset, results8: results8.recordset, updateType: updateType, results: results.recordset, results1: results1.recordset, results2: results2.recordset, results3: results3.recordset, results4: results4.recordset, results5: results5.recordset, results6: results6.recordset });
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


router.post('/deletePCO', ensureAuthenticated, function (req, res) {
	

	var qry1 = 'DELETE FROM pco WHERE pcoID = @pcoID'
	var updateType = 'updatePCO'
	
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
                
				request.input("pcoID", sql.Int, req.body.pcoID)
				request.input("projectID", sql.Int, req.body.projectID);

				request.query(qry1,  function (err, results0, fields) {
					request.query(qry, function (err, results, fields) {
						request.query(qry2, function (err, results1, fields) {
							request.query(qry3, function (err, results2, fields) {
								request.query(qry4, function (err, results3, fields) {
									request.query(qry5, function (err, results4, fields) {
										request.query(qry6, function (err, results5, fields) {
											request.query(qry7, function (err, results6, fields) {												
												request.query(qry9, function (err, results8, fields) {
													request.query(qry10, function (err, results9, fields) {															

													res.render('project_details', {results9: results9.recordset, results8: results8.recordset, updateType: updateType, results: results.recordset, results1: results1.recordset, results2: results2.recordset, results3: results3.recordset, results4: results4.recordset, results5: results5.recordset, results6: results6.recordset });
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


router.get('/project', ensureAuthenticated, function (req, res) {

	//Establishing connection to the database
    const conn = new sql.ConnectionPool(sqlconfig);
	var request = new sql.Request(conn);

	var tempqry = 'SELECT * FROM project'
	var tempqry2 = 'SELECT * FROM project'

	conn.connect(

		function (err) {
			if (err) {
				console.log("!!!! Cannot Connect !!!! Error")
				throw err;
			}
			else {
                console.log("Connection established.");
                
				request.input("projectID", sql.Int, req.body.projectID);

				request.query(tempqry, function (err, results, fields) {
					request.query(tempqry2, function (err, results1, fields) {

						res.render('project', { results: results.recordset, results1: results1.recordset });
						conn.close();
					});
				});
			}
	});	
});

router.post('/project_details', ensureAuthenticated, function (req, res) {

	
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
								
				request.query(qry, function (err, results, fields) {
					request.query(qry2, function (err, results1, fields) {
						request.query(qry3, function (err, results2, fields) {
							request.query(qry4, function (err, results3, fields) {
								request.query(qry5, function (err, results4, fields) {
									request.query(qry6, function (err, results5, fields) {
										request.query(qry7, function (err, results6, fields) {											
											request.query(qry9, function (err, results8, fields) {
												request.query(qry10, function (err, results9, fields) {
													request.query(qry11, function (err, results10, fields) {
														request.query(qry12, function (err, results11, fields) {
																													
														res.render('project_details', {results11: results11.recordset, results10: results10.recordset, results9: results9.recordset, results8: results8.recordset, results: results.recordset, results1: results1.recordset, results2: results2.recordset, results3: results3.recordset, results4: results4.recordset, results5: results5.recordset, results6: results6.recordset });
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
			}); 
		}
	});	
});


router.get('/myProjects', ensureAuthenticated, function (req, res) {

	//Establishing connection to the database
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