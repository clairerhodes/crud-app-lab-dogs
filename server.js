// ============================================ import modules here! ============================================ // 
const dotenv = require("dotenv"); // require package
dotenv.config(); // loads environment variables from .env file

const express = require("express");
const mongoose = require("mongoose"); // require mongoose
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path"); // require path to style

const app = express();

mongoose.connect(process.env.MONGODB_URI); // connect to MongoDB using string in .env file
// log connection status to terminal upon start
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

// add middleware
app.use(express.urlencoded({ extended: false })); // expects data to be coming in from a form, extracts it and puts into JS object which is attached to req.body
// ez access to our data via route handlers
app.use(methodOverride("_method"));
// app.use(morgan("dev")); // commented out since terminal getting crowded with additional info
app.use(express.static(path.join(__dirname, "public"))); // adding middleware to serve static files from directory

// import dog model
const Dog = require("./models/dog.js");






// ============================================ build my routes ============================================ // 
// GET / to route to the home page and connect to index.ejs
app.get("/", async (req, res) => {
    res.render("home.ejs");
});

// GET /dogs to show a list of all the dogs at the rescue
app.get("/dogs", async (req, res) => {
    const allDogs = await Dog.find();
    // console.log(allDogs); // log our doggies!
    // res.send("List of dogs at our rescue!")
    res.render("dogs/index.ejs", { dogs: allDogs});
});

// POST /dogs to add a new dog to the list
app.post("/dogs", async (req, res) => {
    // console.log(req.body); 
    if(req.body.fixed === 'on'){  // if box is checked, 
        req.body.fixed = true
    } else {
        req.body.fixed = false
    };
    if(req.body.readyToAdopt === 'on'){
        req.body.readyToAdopt = true
    } else {
        req.body.readyToAdopt = false
    };
    // pass object into Dog.create aka add a new fruit to our list
    await Dog.create(req.body); // send info back to our database once the data is provided
    res.redirect("/dogs"); // redirects user back to home page so they can see the dog show up after creation
});

// GET /dogs/new to send user to form to add a new dog
app.get("/dogs/new", async (req, res) => {
    res.render("dogs/new.ejs");
}); 

// make a SHOW route to look up a specific dog by ID
app.get("/dogs/:dogId", async (req, res) => {
    const foundDog = await Dog.findById(req.params.dogId);
    // res.send(`This route renders a show page for dog id: ${foundDog}`);
    res.render('dogs/show.ejs', { dog: foundDog})
});

// make a DELETE route to delete specific dog
app.delete("/dogs/:dogId", async (req, res) => {
    await Dog.findByIdAndDelete(req.params.dogId); // find dog by ID and delete
    // res.send(req.params.dogId)
    res.redirect('/dogs'); // redirect to dogs page
});

// make an edit route to show form of a specific dog that already exists in system
// GET localhost:3002/:dogId/edit
app.get("/dogs/:dogId/edit", async (req, res) => {
    // res.send('edit page') // check that my route is working properly
    const foundDog = await Dog.findById(req.params.dogId); // get specific dog using its ID
    res.render('dogs/edit.ejs', { dog: foundDog});
});

// make a route that updates the details of a specific dog
app.put("/dogs/:dogId", async (req, res) => {
    // format checkbox data
    if(req.body.fixed === 'on'){  // if box is checked, 
        req.body.fixed = true
    } else {
        req.body.fixed = false
    };
    if(req.body.readyToAdopt === 'on'){
        req.body.readyToAdopt = true
    } else {
        req.body.readyToAdopt = false
    };
    // say what you're updating in database and then pass in req.body
    await Dog.findByIdAndUpdate(req.params.dogId, req.body);
    // res.send(req.body);
    res.redirect('/dogs');
})

// create port listener at bottom of js page!
app.listen(3002, () => {
    console.log("Listening on port 3002");
});