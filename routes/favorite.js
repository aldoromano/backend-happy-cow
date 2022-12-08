const express = require("express");

const router = express.Router();

// Import de modèles
const Favorite = require("../models/Favorite");
const User = require("../models/User");

// Fichier des restaurants
const restaurants = require("../assets/restaurants.json");

router.post("/user/isfavorite", async (req, res) => {
  console.log("isfavorite ->> ", req.body);
  const { placeId, token } = req.body;
  console.log("placeID / token ->> ", placeId, " - ", token);

  try {
    // Contrôle du placeID
    // 1 - obligatoire
    if (!placeId) {
      return res.status(400).json({ message: "PlaceId mandatory" });
    }

    // Contrôle du token
    // 2 - Obligatoire
    if (!token) {
      return res.status(400).json({ message: "Token mandatory" });
    }

    // Vérification du token
    // 3 - Doit  exister
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(400).json({ message: "Credentials are incorrect" });
    }

    const favorite = await Favorite.findOne({
      placeId: placeId,
      userId: user._id,
    });
    // console.log("favorite length", favorite.length);

    res.status(200).json({ existing: favorite ? "yes" : "no" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/favorite", async (req, res) => {
  console.log("user/favorite... -> ", req.body);
  const { placeId, token } = req.body;
  try {
    // Contrôle du placeID
    // 1 - obligatoire
    if (!placeId) {
      return res.status(400).json({ message: "PlaceId mandatory" });
    }

    // Contrôle du token
    // 2 - Obligatoire
    if (!token) {
      return res.status(400).json({ message: "Token mandatory" });
    }

    // Vérification du token
    // 3 - Doit  exister
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(400).json({ message: "Credentials are incorrect" });
    }

    const favorite = await Favorite.findOne({
      placeId: placeId,
      userId: user._id,
    });

    if (favorite) {
      console.log("suppression ->> ", favorite._id);
      await Favorite.findByIdAndDelete(favorite._id);
    } else {
      const newFavorite = new Favorite({
        placeId: placeId,
        userId: user._id,
      });

      await newFavorite.save();
    }

    res.status(200).json({ message: "Successfully done..." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/favorites", async (req, res) => {
  console.log("user/favorites ... -> ", req.body);
  const { token } = req.body;
  try {
    // Contrôle du token
    // 1 - Obligatoire
    if (!token) {
      return res.status(400).json({ message: "Token mandatory" });
    }

    // Vérification du token
    // 2 - Doit  exister
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(400).json({ message: "Credentials are incorrect" });
    }

    const favorites = await Favorite.find(
      {
        userId: user._id,
      },
      { placeId: 1, _id: 0 }
    );

    console.log("Nombre de favoris ->> ", favorites);

    const favoriteRestaurants = restaurants.filter((elem, index) => {
      //return favorites.includes(elem.placeId);

      let matchCount = 0;
      for (let i = 0; i < favorites.length; i++) {
        // console.log(
        //   "Comparaison : ",
        //   favorites[i].placeId.toString(),
        //   " - ",
        //   elem.placeId.toString()
        // );

        if (favorites[i].placeId.toString() === elem.placeId.toString()) {
          matchCount++;
        }
      }
      if (matchCount) return true;
      else return false;
    });

    console.log("Nombre de restaurants trouvés", favoriteRestaurants.length);
    res.status(200).json(favoriteRestaurants);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
