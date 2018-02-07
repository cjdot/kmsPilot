var bcrypt = require('bcryptjs');
var mysql = require('mysql2');

// User Schema

var firstName;
var lastName;
var email;
var password;

//Might not need
/*module.exports.function User = function(firstName, lastName, email, password){
	this.firstName = firstName;
	this.lastName = lastName;
	this.email = email;
	this.password = password;
}/*

/*var UserSchema = {
	firstName: {
		type: String,
	},
	firstName: {
		type: String,
	},
	password: {
		type: String
	},
	email: {
		type: String,
		index: true
	}
} */

//var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	
	firstName = newUser.firstName;
	lastName = newUser.lastName;
	email = newUser.email;
	password = newUser.password;
	
	
	queryDatabase(firstName, lastName, email, password);
	//This code below hashes the password to store in database

	/*bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
	*/
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

function queryDatabase(firstName, lastName, email, password){
	var qry = 'INSERT INTO account (firstName, lastName, email, password) VALUES(\'' + firstName + '\', \'' + lastName + '\', \'' + email + '\', \'' + password + '\')'
	console.log(qry)
	conn.query( qry, function(err, results, fields){
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