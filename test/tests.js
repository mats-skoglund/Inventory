var expect = require("chai").expect;
var should = require('should');
var assert = require('assert');
var request = require('supertest');  
var server = 'http://localhost:3000';

var inv = require('../routes/inventory.js');

describe("Inventory", function(){
	it('Should list all boxes on /inventorylist GET', function(done){
		request(server)
		.get('/inventory/inventorylist')
		.end(function(err, res){
			res.should.have.property('status',200);
			res.should.be.json;
			done();
		});
	});
	it('Should add a single box on /addbox POST',function(done){
		request(server)
		.post('/inventory/addbox')
		.send({'id': 5,'name': 'Lur'})
		.end(function(err, res){
				res.should.have.property('status', 200);
				res.should.be.json;
				done();	
		});
	});
	it('Should not add a single box when id already exists on /addbox POST',function(done){
		request(server)
		.post('/inventory/addbox')
		.send({'id': 5,'name': 'Double'})
		.end(function(err, res){
				res.should.have.property('status', 200);
				res.should.be.json;
				done();	
		});
	});
	it('Should delete a single box on /deletebox/id DELETE',function(done){
		request(server)
		.delete('/inventory/deletebox/5')
		.end(function(err, res){
				res.should.have.property('status', 200);
				res.should.be.json;
				done();			
		});
	});
});
