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

var routes = require('./routes/index');
var users = require('./routes/users');
var projects = require('./routes/projects');
var admin = require('./routes/admin');

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
Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
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

app.use(express.static('public/css'));

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});