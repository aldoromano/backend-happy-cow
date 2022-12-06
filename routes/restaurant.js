const express = require("express");

const router = express.Router();

const restaurants = require("../assets/restaurants.json");

router.get("/restaurants", (req, res) => {
  // Récupération des paramètres
  const limit = req.query.limit || 20;
  const page = req.query.page || 1;
  const name = req.query.name || "";
  const type = req.query.type || "";

  console.log("restaurants /params -> ", limit, page, name, type);
  try {
    let data = [];

    if (type) {
      data = restaurants.filter((elem) => {
        return elem.type.toLowerCase().includes(type.toLowerCase());
      });
    } else if (name) {
      data = restaurants.filter((elem) => {
        return elem.name.toLowerCase().includes(name.toLowerCase());
      });
    } else {
      data = restaurants.slice((page - 1) * limit, (page - 1) * limit + limit);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
