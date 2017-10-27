var mysql = require('mysql');
var fs = require('fs');
var inquirer = require('inquirer');
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
	// console.log("Connection thread id = " + connection.threadID + ". \n"); //!!!!!WHY IS THE THEAD stating it is UNDEFINED???
	// console.log("connection successful!");
	startBamazon(); // asking the user type to determine the inquirer flow;
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CUSTOMER: 
//PART 1.)
var userName;
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
                 		userName = answers.name;
                 		inquirer.prompt({
	                        name: "userType",
	                        type: "list",
	                        message: "Hi there, " + userName + ". Are you a [Customer] a [Manager], or a [Supervisor]?",
	                        choices: ["Customer", "Manager", "Supervisor"]
                		}).then(userType); //
            		}
                 });
            } 
            else {
                userName = answers.name;
                inquirer.prompt({
                        name: "userType",
                        type: "list",
                        message: "Hi there, " + userName + ". Are you a [Customer] a [Manager], or a [Supervisor]?",
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
	  	startManager(); //-->>> CREATE THIS FUNCTION...
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
function showTable(inputCheck) {
    console.log("\nHELLO " + userName + "! Welcome to Bamazon, where you can buy things as quickly as you decide you need them." +
        "\n Here are the products available today: \n\nNOTE: Please press [CTL + C] at any time to cancel and exit.\n");
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

            	if (inputCheck === "Manager") {
			    	console.log("Do you have any additional command? Press [CTR + C] anytime to exit.");
			    	startManager();
			    }
			    else {
	       			console.log("Press [ENTER] to continue.");
	       		}
            }
        }
    );
}  


//PART 3.)
function startCustomer(results) { //CAN PASS THRU the results from above, since it was ...included as a CALLBACK!!!!
    // console.log("the results.length is: " + results.lenght); //WHY is this underfiend IF it is passed through as callback parameter....?!?!?!?!?!!!!!
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
            	// console.log("Your input is returning TRUE....!"); //error-handling
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
		              	
		              	// for (var i of results) { //Why can't this locate results??
		              	// 	if (i.id === id){
		              	// 		console.log("this is i.id" + i.id);
		              	// 		console.log("\nYou have selected " + amount + " items of " + i.product_name
		              	// 		 + ", which is Product ID #: " + id + ".");
		              	// 	}
		              	// }		  

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
	startCustomer();
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

					console.log("\n" + userName + ", your total comes to: $" + total + " USD. \n");
					console.log("---------------------------------------------------------------------------------------------------"
					 + "\n---------------------------------------------------------------------------------------------------\n" 
					 + "\nCongratulations, " + userName + ", on your purchase of " + amount + " " + i.product_name + "(s) (Product ID #" + i.id +
					 ") !!  \nBamazon now has " + i.stock_quantity + " units left in our inventory. Would you like to buy some more?\n"
					 +"\nJust remember, whenever you have the urge to shop, shop Bamazon! \nWe are a judgement-free zone and enourage retail-therapy.\n"
					 + "\n---------------------------------------------------------------------------------------------------"
					 + "\n---------------------------------------------------------------------------------------------------\n\n"
					 + "\nPress [ENTER] or [SPACEBAR] to continue.");
				}
			}
	});
	// console.log("3.) This is the connection SQL query that is currently running: " + query.sql); //ERROR-HANDLING //displays (console.log's) the query that is currently being run...
	
	continueOn(); //WHY DOES THIS BRING BACK THE DOUBLING ERRORS /BUGS????
	// showTable(); //WHY DOES passing this func here, reduce the doubling bugs????
}

function continueOn() {
	inquirer.prompt({
        name: "continueOn",
        type: "confirm",
        message: "Would you like to continue buying? Press [Y] for'Yes', and [N] for 'No.'\n",
    }).then(function(answers){
       		if (answers.continueOn !== true) { 
               	console.log("Take care. See you again soon!");
                connection.end(showTable);
            } 
            else {   
            	showTable();
            }
      });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//MANAGER:
////PART 1.) 
function startManager(answers) {
	inquirer.prompt({
		name: "managerOptions",
        message: "Which action would you like to take?",
      	type: "list",
      	choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
	
	}).then(function(answers) {
		switch(answers.managerOptions) {
			case "View Products for Sale": 
				var inputCheck = "Manager";
				showTable(inputCheck);
				break;

			case "View Low Inventory": 
				lowInventoryView(); //MAKE THIS FUNCTION
				break;

			case "Add to Inventory": 
				addStock(); //MAKE THIS FUNCTION
				break;

			case "Add New Product": 
				addItem(); //MAKE THIS FUNCTION
				break;
		}
	});
}


////PART 2.) 
function lowInventoryView() {
	var lowItems = [];
	var query = connection.query(
		"SELECT * FROM products", function(error, results) {
			if (error) throw error;
			else {
				for (var i = 0; i < results.length; i++) {
					if(results[i].stock_quantity <= 150) {
						lowItems.push(results[i].product_name);
					}
				}
				var parsedItems = lowItems.toString();
				if (parsedItems !== []){
					console.log("\n\nThe following items are funning low: " + parsedItems + ".\n");
				}
				else {
					console.log("\n\nNo itemse are low, at this time.\n");
				}
			}
		}
	)
	console.log("\nDo you have any additional command? Press [CTR + C] anytime to exit.");
	startManager();
}

////PART 3.)
function addItem() {
	var id;
	var query = connection.query(
		"SELECT * FROM products", function(error, results) {
			if (error) throw error;
			else {
				id = results.length;
			}
	});
	inquirer.prompt([{
		name: "name",
		message: "What item would you like to add?",
		type: "input",
		},{
		name: "department",
		message: "In which department does this item belong?",
		type: "input",
		},{
		name: "price",
		message: "How much will this item cost?",
		type: "input",
		},{
		name: "stock",
		message: "What number is the starting inventory?",
		type: "input",			
	}]).then(function(answers){
		var query = connection.query(
			"INSERT INTO products SET ?",
			[{
				product_name: answers.name,
			},
			{
				department_name: answers.department,
			},
			{
				price: answers.price,
			},
			{
				stock_quantity: answers.stock,
			},
			{
				id: id, //so that the new item will be the last number in the array.
			}],
			function(error,results) {
				if(error) throw error;
			}	
	)});
};

////PART 4.)
function addStock () {
	var stockItemID;
	var newAmount;
	var query = connection.query(
		"SELECT * FROM products", function(error, results) {
			if(error) throw error;
			else{
				inquirer.prompt([{
					name: "addStock",
					message: "To which product would you like to add stock?",
					type: "input",
				},{
					name: "addAmount",
					message: "How much stock would you like to increase the stock?",
					type: "input",
				}]).then(function(answers){
					// console.log(stockItemID);
					for (var i in results) {
						if (i.product_name === answers.addStock) {
							stockItemID = i.id;
							console.log("stockItemID = " + stockItemID);
							newAmount = (answers.addAmount + i.stock_quantity);
						}
					}
					if(stockItemID = undefined) {
						console.log("Please select a valid and available product in our inventory.");
					}
					addUp(stockItemID, newAmount);
				});
			}
		}
	);
};
function addUp(stockItemID, newAmount) {
	var query = connection.query(
		"UPDATE products SET ? WHERE ?",
		[{
			stock_quantity: newAmount
		},
		{
			id: stockItemID,
		}],
		function(error,results) {
			if(error) throw error;
		}
	);
	console.log("The current stock-quantity for Product ID #" + stockItemID + " is:" + newAmount + ".");
}