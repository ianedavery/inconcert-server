'use strict';

require('dotenv').config();
const config = require('../config');
const jwt = require('express-jwt');
const express = require('express');
const bodyParser = require('body-parser');
const {Recipies} = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

router.use(bodyParser.json());

jwt({secret: config.JWT_SECRET});

router.get('/', (req, res) => {
	return Recipies
	  .find({"createdBy": req.user.username})
	  .then(recipies => {
	  	res.json(recipies.map(recipie => recipie.serialize()));
	  })
	  .catch(err => {
	  	console.error(err);
	  	res.status(500).json({message: 'Internal Server Error'});
	  });
});

router.get('/public', (req, res) => {
	return Recipies
	  .find({"public": true})
	  .then(recipies => {
	  	res.json(recipies.map(recipie => recipie.serialize()));
	  })
	  .catch(err => {
	  	console.error(err);
	  	res.status(500).json({message: 'Internal Server Error'});
	  });
});

router.get('/:id', (req, res) => {
	console.log(req.params.id);
	return Recipies
	  .find({"_id": req.params.id})
	  .then(recipies => {
	  	res.json(recipies.map(recipie => recipie.serialize()));
	  })
	  .catch(err => {
	  	console.error(err);
	  	res.status(500).json({message: 'Internal Server Error'});
	  });
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['name', 'ingredients'];
	const missingField = requiredFields.find(field => !(field in req.body));
	if(missingField) {
		return res.status(422).json({
			message: `\`${missingField}\` is missing from your request.`
		});
	}
	const stringFields = ['name'];
	const nonStringField = stringFields.find(field => field in req.body && typeof req.body[field] !== 'string');
	if(nonStringField) {
		return res.status(422).json({
			message: `\`${nonStringField}\` is not a string.`
		});
	}
	const fieldSizes = {
		name: {
			min: 1
		}
	};
	const fieldTooSmall = Object.keys(fieldSizes).find(field => 
		'min' in fieldSizes[field] && req.body[field].trim().length < fieldSizes[field].min);
	if(fieldTooSmall) {
		return res.status(422).json({
			message: `\`${fieldTooSmall}\` is not long enough.`
		});
	}
	Recipies
	  .create({
		  name: req.body.name,
		  ingredients: req.body.ingredients,
		  instructions: req.body.instructions,
		  createdBy: req.user.username,
		  public: false
	  })
	  .then(recipie => res.status(201).json(recipie.serialize()))
	  .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'});
    });
});

router.put('/:id', (req, res) => {
	if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({
			error: `Request path id ${req.params.id} and request body id ${req.body.id} values must match`
		});
	}
	const updated = {};
	const updatableFields = ['name', 'ingredients', 'instructions', 'public'];
	updatableFields.forEach(field => {
		if(field in req.body) {
			updated[field] = req.body[field];
		}
	});
	Recipies
		.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
		.then(updatedRecipies => res.status(204).end())
		.catch(err => res.status(500).json({error: 'Something went wrong'}));
});

router.delete('/:id', (req, res) => {
	Recipies
	  .findByIdAndRemove(req.params.id)
	  .then(() => {
	  	res.status(204).json({message: 'success'});
	  })
	  .catch(err => {
	  	console.error(err);
	  	res.status(500).json({message: 'Internal Server Error'});
	  });
});

module.exports = {router};