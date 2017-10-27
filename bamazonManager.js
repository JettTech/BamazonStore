var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnect({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "Batman123",
	database: "bamazon"
})

connection.connnect(function(error){
	if (error) throw error;
	else {console.log("connection successful!")};
})