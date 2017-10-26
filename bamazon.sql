DROP DATABASE IF EXISTS bamazondb;

CREATE DATABASE bamazondb;
USE bamazondb; 	

CREATE TABLE products (
	id INT NOT NULL AUTO_INCREMENT, -- unique id for each product
	product_name VARCHAR(50) NULL,
	department_name VARCHAR(50) NULL,
	price DECIMAL(10,2) NULL, -- cost to customer
	stock_quantity INT NULL, -- how much of the product is available in stores	
	PRIMARY KEY (id) -- !!??!!??!! DOES THIS HAVE TO BE THE LAST ITEM IN THE LIST, OR CAN IT BE LOCATED IMMEDIATELY AFTER the ID INT IS CREATED??!!
);

-- /////////////////////////////////////////////////////////////////////////////////////
-- *******Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).************
-- INSERT INTO products (product_name, department_name, price, stock_quantity)
-- VALUES ("Swimsuit", "Summer Sports", 69.99, 200);

-- INSERT INTO products (product_name, department_name, price, stock_quantity)
-- VALUES ("Kayak", "Summer Sports", 349.99, 130);

-- INSERT INTO products (product_name, department_name, price, stock_quantity)
-- VALUES ("Football", "Fall Sports", 15.95, 1000);

-- INSERT INTO products (product_name, department_name, price, stock_quantity)
-- VALUES ("Rifle", "Wilderness Sports", 150, 200);

-- INSERT INTO products (product_name, department_name, price, stock_quantity)
-- VALUES ("Snowboard", "Winter Sports", 300, 180);

-- INSERT INTO products (product_name, department_name, price, stock_quantity)
-- VALUES ("Baseball Glove", "Spring Sports", 29.95, 1500);



-- /////////////////////////////////////////////////////////////////////////////////////
--  ////////////////////////// PERSONAL NOTES: //////////////////////////////////////
-- FYI:
-- ### Alternative way to insert more than one row
-- INSERT INTO products (flavor, price, quantity)
-- VALUES ("vanilla", 2.50, 100), ("chocolate", 3.10, 120), ("strawberry", 3.25, 75);

