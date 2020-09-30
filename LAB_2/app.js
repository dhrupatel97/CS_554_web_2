const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const static = express.static(__dirname + "/public");
const configRoutes = require("./routes");

const exphbs = require("express-handlebars");

app.use("/public", static);

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//view engine
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//using routes 
configRoutes(app);


app.listen(5000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:5000");
});