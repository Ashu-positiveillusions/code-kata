const express = require("express");
const bodyParser = require("body-parser");
const route = require("./src/routes/route");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose
  .connect(
    "mongodb+srv://Ashu-positiveillusions:Z5j3yfzA8X2qa54e@cluster0.yf3ho.mongodb.net/loanApplication",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 4000, function () {
  console.log("Express app running on port " + (process.env.PORT || 4000));
});
