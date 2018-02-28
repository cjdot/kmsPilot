var bcrypt = require('bcryptjs');
var mysql = require('mysql2');


module.exports.createUser = function(newUser, callback){
	
	var firstName = newUser.firstName;
	var lastName = newUser.lastName;
	var email = newUser.email;

	//This code below hashes the password to store in database
	let hash = bcrypt.hashSync(newUser.password, 10);

	//This executes the insert statement			
	queryDatabase(newUser.firstName, newUser.lastName, newUser.email, hash, newUser.phoneNumber, newUser.permission)
}

module.exports.updateUser = function(newUser, callback){
	
	var firstName = newUser.firstName;
	var lastName = newUser.lastName;
	var email = newUser.email;


	//This executes the insert statement			
	queryUpdateDatabase(newUser.firstName, newUser.lastName, newUser.email, newUser.phoneNumber, newUser.permission, newUser.userID)
}

var loginEmail;
var loginPass;

module.exports.tryLogin = function(emailPass, callback){
	loginEmail = emailPass.email
	loginPass = emailPass.pass
	var retrievedCreds = retrieveLogin(loginEmail, loginPass)
	
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

function queryDatabase(firstName, lastName, email, password, phoneNumber, permission){
	var qry = 'INSERT INTO user (firstName, lastName, email, password, cellNumber, permissionLevel) VALUES(\'' + firstName + '\', \'' + lastName + '\', \'' + email + '\', \'' + password + '\', \'' + phoneNumber + '\', \'' + permission + '\')'
	var qry2= 'INSERT INTO user (firstName, lastName, email, password, cellNumber, permissionLevel) VALUES( ?, ?, ?, ?, ?, ?)'
	
	//USE qry2 in production to prevent SQL injection
	console.log(qry);
	conn.query( qry2, [firstName, lastName, email, password, phoneNumber, permission], function(err, results, fields){
		if (err) throw err;
		console.log('Query Executed', results);
	})

}


var config = {

	host: 'kmspilot.mysql.database.azure.com',
	user: 'kmsadmin@kmspilot',
	password: 'KMSproject1',
	database: 'kmspilot',
	port: 3306,
	ssl: true

};

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