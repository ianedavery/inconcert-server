'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const {app, runServer, closeServer} = require('../server');
const should = chai.should();
const {TEST_DATABASE_URL} = require('../config');
const {Recipies} = require('../recipies/models');

let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6IjVhOTM1Yjk4MTk1YzE4NGFjZWMwNjBjMiIsInVzZXJuYW1lIjoiZGhhbmkifSwiaWF0IjoxNTE5NjA2NjgwLCJleHAiOjE1MjAyMTE0ODAsInN1YiI6ImRoYW5pIn0.iSIEGUkUcC4cGwnIRf_LGMDepU0YbBJeWSlazBAZM3Y';

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
      name: faker.lorem.sentence(),
      createdBy: 'me'
    });
  }
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
  				
  			});
  	});
  });
});