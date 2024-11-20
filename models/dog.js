// models/dog.js
const mongoose = require("mongoose"); // require package

// define the schema for fruit describing properties and characteristics of what the fruit object should include
// ex. property: name with data type of: string
const dogSchema = new mongoose.Schema({
    name: String,
    breed: String,
    sex: String,
    age: Number,
    fixed: Boolean, // spayed/neutuered?
    readyToAdopt: Boolean,
});

// link the schema to a model to connect the defined structure to our database
const Dog = mongoose.model("Dog", dogSchema);
// use capital letter for database model name (ex. Dog, not dog)

// export the model so we can use it in other places in our application
module.exports = Dog;

// last step: import model into server.js file 