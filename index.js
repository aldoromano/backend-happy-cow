const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

const routeUser = require("./routes/user");
const routeFavorite = require("./routes/favorite");
const routeRestaurant = require("./routes/restaurant");
app.use(routeUser);
app.use(routeFavorite);
app.use(routeRestaurant);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server Happy Cow started on port ", process.env.PORT);
});
