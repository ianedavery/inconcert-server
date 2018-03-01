'user strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const RecipieSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	ingredients: [{
		ingredient: String,
		measurement: String
	}],
	instructions: {
		type: String
	},
	createdBy: {
		type: String,
		required: true
	},
	public: {
		type: Boolean,
		required: true
	},
	rating: {
		type: Number
	},
	numberOfRatings: {
		type: Number
	}
});

RecipieSchema.methods.serialize = function() {
	return {
		id: this._id,
		name: this.name,
		ingredients: this.ingredients,
		instructions: this.instructions,
		createdBy: this.createdBy,
		public: this.public,
		rating: this.rating,
		numberOfRatings: this.numberOfRatings
	};
};

const Recipies = mongoose.model('Recipies', RecipieSchema);

module.exports = {Recipies};