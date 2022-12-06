const express = require("express");

const router = express.Router();

// Import de modèles
const Favorite = require("../models/Favorite");
const User = require("../models/User");

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
      await favorite.findByIdAndDelete(favorite._id);
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

module.exports = router;
