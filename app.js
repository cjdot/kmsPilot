var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var Handlebars = require('handlebars');
var HandlebarsIntl = require('handlebars-intl');
var expressValidator = require('express-validator');
var session = require('express-session');
var MySQLStore = require('express-mysql-session') (session);
var MsSqlStore = require('mssql-session-store')(session);
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var moment = require('moment');
var sql = require('mssql');
var NumeralHelper = require("handlebars.numeral");

var cron = require('node-cron');
const nodemailer = require('nodemailer');

var routes = require('./routes/index');
var users = require('./routes/users');
var projects = require('./routes/projects');
var admin = require('./routes/admin');
var settings = require('./routes/settings');
var report = require('./routes/report');


// Init App
var app = express();

var sqlconfig = {
	user: 'kmsadmin',
    password: 'KMSproject1',
    server: 'kempmspilot.database.windows.net', 
    database: 'kmspilot',
	options: {
		encrypt: true
	}
}

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));


HandlebarsIntl.registerWith(Handlebars);
NumeralHelper.registerHelpers(Handlebars);
Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('ifGreater', function(arg1, arg2, options) {
  return (arg1 > arg2) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('ifLess', function(arg1, arg2, options) {
  return (arg1 < arg2) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('formatTime', function (date, format) {
  var mmnt = moment(date);
  return mmnt.format(format);
});




// Express Session
app.use(session({

    //NEED TO CHANGE THE 'secret' VARIABLE AND STORE IN ENCRYPTED CONFIG FILE NOT IN THIS FILE HERE
    //NEEDS TO BE SOMETHING THAT NO ONE CAN GUESS 'asdlfkhj34087yfkjasf023rhb'
    secret: 'secret',
    saveUninitialized: false,
    resave: false,
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.project = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);
app.use('/projects', projects);
app.use('/admin', admin);
app.use('/settings', settings);
app.use('/report', report);

app.use(express.static('public/css'));

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});

//Email Notification Push
cron.schedule('00 00 04 * * 0-6', function(){ //Runs every day at 04:00:00 AM | FOR TESTING USE: */15 * * * * *

  //Gets KMS action items due in one week
  var qryPush = "DECLARE @NewLineChar AS CHAR(2) = CHAR(13) + CHAR(10) SELECT kmsactionitem.activityOwner, kmsactionitem.targetCompletionDate, STRING_AGG(CONCAT('Project Number: ', project.projectNumber, ' Project Name: ', project.projectName, ' Description: ', kmsactionitem.actionItemDescription), @NewLineChar) AS activityDescription, users.email, kmsactionitem.notified FROM kmsactionitem INNER JOIN users ON kmsactionitem.activityOwner = users.firstName + ' ' + users.lastName INNER JOIN  project ON kmsactionitem.projectID = project.projectID WHERE kmsactionitem.targetCompletionDate IS NOT NULL AND DATEADD(day, 6, CONVERT(date, GETDATE())) = kmsactionitem.targetCompletionDate AND kmsactionitem.notified IS NULL GROUP BY users.email, kmsactionitem.activityOwner, kmsactionitem.targetCompletionDate, kmsactionitem.notified";
  //Disables due in one week notification for KMS action items
  var qryPush2 = "UPDATE kmsactionitem SET kmsactionitem.notified = '1' WHERE kmsactionitem.targetCompletionDate IS NOT NULL AND DATEADD(day, 6, CONVERT(date, GETDATE())) = kmsactionitem.targetCompletionDate AND kmsactionitem.notified IS NULL";
  //Gets KMS action items added yesterday
  var qryPush3 = "DECLARE @NewLineChar AS CHAR(2) = CHAR(13) + CHAR(10) SELECT kmsactionitem.activityOwner, CONVERT(date, kmsactionitem.dateStampKMSActionItem) AS dateAdded, STRING_AGG(CONCAT('Project Number: ', project.projectNumber, ' Project Name: ', project.projectName, ' Description: ', kmsactionitem.actionItemDescription), @NewLineChar) AS activityDescription, users.email, kmsactionitem.addNotified FROM kmsactionitem INNER JOIN users ON kmsactionitem.activityOwner = users.firstName + ' ' + users.lastName INNER JOIN  project ON kmsactionitem.projectID = project.projectID WHERE kmsactionitem.addNotified IS NULL AND CONVERT(date, kmsactionitem.dateStampKMSActionItem) = DATEADD(day, -1, CONVERT(date, GETDATE())) GROUP BY users.email, kmsactionitem.activityOwner, kmsactionitem.addNotified, kmsactionitem.dateStampKMSActionItem";
  //Disables day after add notification for KMS action items
  var qryPush4 = "UPDATE kmsactionitem SET kmsactionitem.addNotified = '1' WHERE kmsactionitem.addNotified IS NULL";

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

				request.query(qryPush, function (err, preResultsPush, fields) {
          var resultsPush = preResultsPush.recordset;

          let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
              user: 'i5af5oi3t3dmcvwf@ethereal.email',
              pass: 'SYNKbQJZwYwURQJEfs'
            }
          });

          for(var i = 0; i < (resultsPush.length); i++) {

            transporter.sendMail({from: 'jkemp@kempms.net',
                                  to: resultsPush[i].email,
                                  subject: 'KMS Action Item Notice',
                                  text: 'Hello ' + resultsPush[i].activityOwner + ',\r\n\r\nIn one week, you have the following action item(s) due:\r\n\r\n' + resultsPush[i].activityDescription
                                 }, (error, info) => {
                                  if (error) {
                                    return console.log(error);
                                  }
                                  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); //Ethereal only
                                }); 
          };
          request.query(qryPush2, function (err, preResultsPush2, fields) {
            request.query(qryPush3, function (err, preResultsPush3, fields) {

              var resultsPush3 = preResultsPush3.recordset;

              for(var a = 0; a < (resultsPush3.length); a++) {

                transporter.sendMail({from: 'jkemp@kempms.net',
                                      to: resultsPush3[a].email,
                                      subject: 'KMS Action Item Notice',
                                      text: 'Hello ' + resultsPush3[a].activityOwner + ',\r\n\r\nYesterday, you were assigned to the following action item(s):\r\n\r\n' + resultsPush3[a].activityDescription
                                     }, (error, info) => {
                                      if (error) {
                                        return console.log(error);
                                      }
                                      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); //Ethereal only
                                    }); 
              };

              request.query(qryPush4, function (err, preResultsPush4, fields) {
                conn.close();
              });
            });
          });
			  }); 
		  }
    }
  );
});