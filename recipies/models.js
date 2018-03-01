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
	}
});

RecipieSchema.methods.serialize = function() {
	return {
		id: this._id,
		name: this.name,
		ingredients: this.ingredients,
		instructions: this.instructions,
		createdBy: this.createdBy,
		public: this.public
	};
};

const Recipies = mongoose.model('Recipies', RecipieSchema);

module.exports = {Recipies};