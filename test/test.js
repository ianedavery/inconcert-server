'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const {app, runServer, closeServer} = require('../server');
const should = chai.should();
const {TEST_DATABASE_URL} = require('../config');
const {Recipies} = require('../recipies/models');

let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6IjVhOTVlN2UzMWJkNTdhNzc3NWMwMTBlYyIsInVzZXJuYW1lIjoiZW1pbGUifSwiaWF0IjoxNTE5NzczNjY3LCJleHAiOjE1MjAzNzg0NjcsInN1YiI6ImVtaWxlIn0.ymUxqhz-yr4OzvxoGKo4X4rPQR0yP-SixdhdVZ_tG-M';

chai.use(chaiHttp);

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function seedRecipiesData() {
  console.info('seeding recipies data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      name: 'bread',
      createdBy: 'emile',
      public: false
    });
  }
  console.log(seedData);
  return Recipies.insertMany(seedData);
}

describe('recipies API resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
  beforeEach(function() {
    return seedRecipiesData();
  });
  afterEach(function() {
    return tearDownDb();
  });
  after(function() {
    return closeServer();
  });
  describe('GET endpoint', function() {
  	it('should return all existing recipies', function() {
  		let res;
  		return chai.request(app)
  			.get('/api/recipies/')
  			.set('Authorization', 'Bearer ' + token)
  			.then(_res => {
  				res = _res;
  				res.should.have.status(200);
  				res.body.should.have.length.of.at.least(1);
  				return Recipies.count();
  			})
  			.then(count => {
  				res.body.should.have.lengthOf(count);
  			});
  	});
  });
  describe('POST endpoint', function() {
  	it('should post a new recipie', function() {
  		const newRecipie = {
  			name: 'banana bread',
  			ingredients: []
  		};
  		return chai.request(app)
  			.post('/api/recipies/')
  			.set('Authorization', 'Bearer ' + token)
  			.send(newRecipie)
  			.then(res => {
  				res.should.have.status(201);
  			});
  	});
  });
  describe('PUT endpoint', function() {
  	it('should update recipie', function() {
  		const updateData = {
 			name: 'zucchini bread',
  			ingredients: []
  		};
  		return Recipies
  			.findOne()
  			.then(post => {
  				updateData.id = post.id
  				return chai.request(app)
  					.put(`/api/recipies/${post.id}`)
  					.set('Authorization', 'Bearer ' + token)
  					.send(updateData);
  			})
  			.then(res => {
  				res.should.have.status(204);
  			});
  	});
  });
  describe('DELETE endpoint', function() {
  	it('should delete recipie', function() {
  		let post;
  		return Recipies
  			.findOne()
  			.then(_post => {
  				post = _post;
  				return chai.request(app)
  					.delete(`/api/recipies/${post.id}`)
  					.set('Authorization', 'Bearer ' + token);
  			})
  			.then(res => {
  				res.should.have.status(204);
  			});
  	});
  });
});