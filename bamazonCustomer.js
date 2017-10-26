var mysql = require('mysql');
var fs = require('fs');
var inquirer = require('inquirer');
// var table = require('console.table');  //don't use this table, when the one below is being used.
var Table = require('cli-table');

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "Batman123",
	database: 'bamazondb'
});

connection.connect(function(error) {
	if(error){
		console.log("\nYou have a connetion error. Please reference the following error and diagnose it below. - " + error + "\n");
		throw error;
	} 
	console.log("Connection thread id = " + connection.threadID + ". \n"); //WHY IS THE THEAD stating it is UNDEFINED???
	startBamazon(); // asking the user type to determine the inquirer flow;
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//PART 1.)
var customerName;
///////////////// INITAL PROMPTS - USER TYPE & PATH DETERMINATION ////////////////////////////// 
function startBamazon() { //Determines user-type and piping into the appropriate function flow.
    inquirer.prompt({
        name: "name",
        message: "Hello there. What is your name?"
    })
    .then(function(answers) {
            if (!answers.name) {
                console.log("Sorry, we must know who is interested in our inventory.\n ");
                 inquirer.prompt({
       				 name: "name",
			        message: "Please state your name."
			    }).then(function(answers) {
                 	if(!answers.name){
                 		console.log("Sorry, we do need your name to start. Please come back when you're ready to shop!");
                 		connection.end();
                 	}
                 	else{
                 		customerName = answers.name;
                 		inquirer.prompt({
	                        name: "userType",
	                        type: "list",
	                        message: "Hi there, " + customerName + ". Are you a [Customer] a [Manager], or a [Supervisor]?",
	                        choices: ["Customer", "Manager", "Supervisor"]
                		}).then(userType); //
            		}
                 });
            } 
            else {
                customerName = answers.name;
                inquirer.prompt({
                        name: "userType",
                        type: "list",
                        message: "Hi there, " + customerName + ". Are you a [Customer] a [Manager], or a [Supervisor]?",
                        choices: ["Customer", "Manager", "Supervisor"]
                }).then(userType); //
            }
    });
}

//PART 2.)a)
function userType(answers) { //WHY is this not able to IDENTIFY and ANSWERS passed through the ".then(usertype)" referece to this function above????!!!!
	if (answers.userType === "Customer") {
	    showTable(); //displayProducts
		startCustomer(); // calling our first function in the 'Product State Functions' series created below...
	} 
	else if (answers.userType === "Manager") {
		showTable(); //displayProducts
	  	//startSupervisor(); -->>> CREATE THIS FUNCTION...
	}
	else if (answers.userType === "Supervisor") {
		return;
		showTable();
		//displayDepartment(); -->>>> CREATE THIS FUNCTION...
		//startSupervisor(); -->>> CREATE THIS FUNCTION...
	} else {
		connection.end(showTable);
	}
};

//Part 2.)b)
function showTable() {
    console.log("\n " + customerName + "! Welcome to Bamazon, where you can buy things as quickly as you decide you need them." +
        "\n Here are the products available today: \n");
    // console.log("I'm inside the showTable function");
    var table = new Table({
	    	chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
			, 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
			, 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
			, 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
	});
    connection.query(
        "SELECT * FROM products", function(error, results) {
			if(error) throw error;
			else {
	            for (var i = 0; i < results.length; i++) {       	
	                table.push(
	                	[results[i].id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
	                );
            	}
            	console.log(table.toString());
            	startCustomer();
            }
        }
    );
}  


//PART 3.)
function startCustomer() {
    inquirer.prompt([{
        name: "customerProductSelect",
        message: "Which product would you like to purchase? \nPlease reference the product by its ID Number (the number in the left-most column). \n", //error-handling
        validate: function(input) {
        	// console.log("\nThis is the FIRST input(item ID): " + input); //error-handling
        	// console.log("This is the parseInt(input):" + parseInt(input)); //error-handling

            if (parseInt(input) === NaN) { //|| parseInt(input) > 50 -->>>> WHY IS THE NaN NOT passing into this function AT ALL????
                console.log("\n Please try again. You must reference the Product by it's ID #."); //USER Feed-back.
                // console.log("Your input is returning 'NaN'.") //error-handling
                return false;
            } 
            else if (parseInt(input) !== NaN && parseInt(input) <= 50) {
            	console.log("Your input is returning TRUE....!"); //error-handling
            	return true;
            }
        }
 	},{
        name: "purchaseAmount",
        message: "How many units of this product would you like to buy?",
      	validate: function(input) {
       		if (parseInt(input) === NaN) {
           		return false;
           	}                         
           	else if (parseInt(input) !== NaN) {
               	// console.log("\nTHIS is SECOND input (AMOUNT of item): " + input); //error-handling
              	return true;
			}
		}
	}]).then(function(answers) {
		    			var id =  answers.customerProductSelect;
		              	var amount = answers.purchaseAmount;

		             	console.log("\nYou have selected " + amount + " items of Product ID #: " + id + ".");
		                	
		              	// console.log("You have passed into the answers..."); //error-handling
		             	checkAmount(id, amount); //this passes into the PART 4.) function below.
	});
};


// PART 4.)
function checkAmount(id, amount) {
	// console.log("We'll be right back, we're collecting your items! \n") //USER Feed-back.
	
	// console.log("this is the id: " + id); //ERROR-HANDLING ==> (To ensure this value is the same as in the startCustomer() function)
	// console.log("this is the amount: " + amount); //ERROR-HANDLING ==> (To ensure this value is the same as in the startCustomer() function.)

	var query = connection.query(
		"SELECT * FROM products WHERE ?",{id: id}, function(error,results) {
			if (error) throw error;
			else {
				for (var i = 0; i < results.length; i++) {
          			if (results[i].stock_quantity >= amount) {
          				// console.log("You requested the following amount: " + amount);  //error-handeling
          				// console.log("We currently have this amount in stock: " + results[i].stock_quantity);  //user-feedback
          				var newInventory = results[i].stock_quantity - amount;
          				// console.log(newInventory); //error-handeling
          				updateProduct(id, amount, newInventory);
          			}
          			else {
          				return console.log("Sorry, but there is an insufficient quantity! We currently only have "+ results[i].stock_quantity + " of your items left.");
          			}	
				}
			}
	});
	// console.log("1.) This is the connection SQL query that is currently running: " + query.sql); //ERROR-HANDLING //displays (console.log's) the query that is currently being run...
}

//  PART 5a.) - displays the full cost of item(s) purchased
function updateProduct(id, amount, newInventory) {
	// console.log("Updating the quantity of Product ID #" + id + " in our inventory... \n"); //USER Feed-back.
	
	var query = connection.query(
		"UPDATE products SET ? WHERE ?",
		[{
			stock_quantity: newInventory
		},
		{
			id: id,
		}],
		function(error,results) {
			if(error) throw error;
			// console.log(results.affectedRows + " product row(s) updated in the inventory table. \n"); //DEV UPDATE //error-handling
		}
	);
	// console.log("2.) This is the connection SQL query that is currently running: " + query.sql); //ERROR-HANDLING //displays (console.log's) the query that is currently being run...
	
	var query = connection.query(
		"SELECT * FROM products WHERE ?",{id: id}, function(error,results) {
			if (error) throw error;
			else {
				for (var i of results) {
					var price = i.price;
          			var total = price * amount;

					console.log(customerName + ", your total comes to: $" + total + " USD. \n\n(Press [ENTER] to confirm your purchase.)\n\n");
					console.log("---------------------------------------------------------------------------------------------------"
					 + "\n---------------------------------------------------------------------------------------------------\n" 
					 + "\nCongratulations, " + customerName + ", on your purchase of " + amount + " " + i.product_name + "(s) (Product ID #" + i.id +
					 ") !!  \nBamazon now has " + i.stock_quantity + " units left in our inventory. Would you like to buy some more?\n\nJust remember, when you want to buy on a whim, buy bulk, and buy at Bamazon!\n"
					 + "\n---------------------------------------------------------------------------------------------------"
					 + "\n---------------------------------------------------------------------------------------------------\n\n");
				}
			}
	});
	// console.log("3.) This is the connection SQL query that is currently running: " + query.sql); //ERROR-HANDLING //displays (console.log's) the query that is currently being run...
}







////////////////////////////////////////////////////////////
// Option XXXXX  === BUILD OUT PRODUCT INFO.
function buildProduct() {
	console.log("Inserting new product: " + product_name + "... \n");
	var query = connection.query(
		"INSERT INTO products SET ?", {
			product_name: product_name, //PRODUCT_NAME GOES HERE, ie: "Swimsuit",
			department_name: department_name, //DEPARTMENT_NAME GOES HERE, ie: "Summer Sport",
			price: price, //PRICE GOES HERE, ie: 98.90",
			stock_quantity: stock_quantity, //PRODUCT_NAME GOES HERE, ie: "2000"
			id: id
		},
		function(error, results){
			if(error){
				throw error;
			}

			console.log(results.affectedRows + " product inserted! \n");
			updateProduct();
		}
	);
	console.log("This is the connection SQL query that is currently running: " + query.sql) //logs the query that is being currently run...
};



// Option xxxxx === DELETE PRODUCT
function deleteProduct() {
	console.log("Deleting all " + product_name + ". \n")
	connection.query(
		"DELETE FROM products WHERE ?", {
			id: id, //id GOES HERE, ie: "10",
		},
		function(error,results) {
			if(error){
				throw error;
			}
			console.log(results.affectedRows + " product deleted. \n");
			readProduct();
		}
	);
}

// Option xxxxx === READ PRODUCT INFO
function readProduct() {
	console.log("Selecting all products in inventory... \n");
	connection.query( //The asterik ('*') represents "ALL"/"EVERYTHING"...
		"SELECT * FROM products", function(error,results) {
		if(error){
			throw error;
		}
		console.log(results);
		connection.end(); //FROM NPM SQL ???!!!!!!!?!??!?!??!????!!!!????
		}
	);
}

////////////////////////////////////////////////////////////










// PART 3 REFERENCE:
// for (var i = 0; i < bamazondatabase.length; i++) {
// 		var values = [product_name, price, id];
// };
// console.table(['Product', 'Price', 'Product ID'], values); //OR should I use "table", since that is thwat the Variable name is (/has to be be???.. cannot be in ". - notation")
// This is an example of what the table SHOULD return...
// name  age
// ----  ---
// max   20 
// joe   30

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

// PRODUCT STATE FUNCTIONS....

////////////////////////////////////////////////////////////
// 
// 

////REFERENCE:
// var CURRENT_TIMESTAMP = mysql.raw('CURRENT_TIMESTAMP()');
// var sql = mysql.format('UPDATE posts SET modified = ? WHERE id = ?', [CURRENT_TIMESTAMP, 42]);
// console.log(sql); // UPDATE posts SET modified = CURRENT_TIMESTAMP() WHERE id = 42