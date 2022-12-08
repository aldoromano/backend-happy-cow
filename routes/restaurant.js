const express = require("express");

const router = express.Router();

const restaurants = require("../assets/restaurants.json");

router.get("/restaurants", (req, res) => {
  // Récupération des paramètres
  const limit = Number(req.query.limit || 20);
  const page = Number(req.query.page || 1);
  const name = req.query.name || "";
  const type = req.query.type || "";

  console.log("restaurants /params -> ", limit, page, name, type);
  try {
    let data = [];
    let length = 0;

    if (type && type !== "All") {
      console.log("Filtre type");
      data = restaurants.filter((elem) => {
        return elem.type.toLowerCase().includes(type.toLowerCase());
      });
      length = data.length;
      data = data.slice((page - 1) * limit, (page - 1) * limit + limit);
    } else if (name) {
      console.log("Filtre name");
      data = restaurants.filter((elem) => {
        return elem.name.toLowerCase().includes(name.toLowerCase());
      });
      length = data.length;
      data = data.slice((page - 1) * limit, (page - 1) * limit + limit);
    } else {
      console.log("Filtre page");
      data = restaurants.slice((page - 1) * limit, (page - 1) * limit + limit);
      console.log(
        "Taille des données : ",
        data.length,
        " - ",
        (page - 1) * limit,
        " - ",
        (page - 1) * limit + limit
      );
      length = restaurants.length;
    }

    const obj = { length: length, data: data };
    return res.status(200).json(obj);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
