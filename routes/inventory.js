var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/inventorylist', function(req, res, next) {

	var sqlite3 = require('sqlite3').verbose();
	var fs = require("fs");
	var file = "inventory.db";
	var exists = fs.existsSync(file);

	db = new sqlite3.Database(file);

	db.serialize(function() {
  		if(!exists) {
    		db.run("CREATE TABLE Inventory (boxid INTEGER, name TEXT)");
    		db.run("Insert into Inventory VALUES (1,'Testbox')");
  		}
	});
console.log("/inventorylist");

	db.serialize(function() { 
  		db.all("SELECT boxid, name FROM Inventory", function(err, row) {
      		res.json(row);
  		});
	});
	db.close();
});

/*
 * POST to addbox
 */
router.post('/addbox', function(req, res) {
	var sqlite3 = require('sqlite3').verbose();
	var file = "inventory.db";
	var db = new sqlite3.Database(file);
	
	var boxid = req.body.id;
	var boxName = req.body.name;
    console.log("/addbox");
    db.run("Insert into Inventory VALUES (" + boxid +",'" + boxName + "')",function(err, row){  
    	res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
    db.close();
});

/*
 * DELETE to deletebox.
 */
router.delete('/deletebox/:id', function(req, res) {
	var sqlite3 = require('sqlite3').verbose();
	var file = "inventory.db";
	var db = new sqlite3.Database(file);

	var boxid = req.params.id;
    var sqlstm = "Delete from Inventory where boxid = " + boxid;

     console.log("/deletebox/:" + boxid);
    db.run(sqlstm, function(err, row){  	
    	res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
    db.close();
});

module.exports = router;
