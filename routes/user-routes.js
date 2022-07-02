const { User, Thought } = require("../models");
const router = require("express").Router();


router.post("/create", ({ body }, res) => {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
});


router.get("/all", (req, res) => {
    User.findAll({})
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbUserData) => {
        res.json(dbUserData);
      })
      .catch((err) => {
        res.json(err);
      });
});
  
router.get("/:id", ({ params }, res) => {
    User.findOne({ _id: params.id })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
});

router.delete("/delete/:id", ({ params }, res) => {
  User.findOneAndDelete({ _id: params.id }).then((dbUserData) => {
    if (!dbUserData) {
      res.status(404).json({ message: "No user found with this id!" });
    }
    Thought.deleteMany({ userId: params.id })
      .then((dbUserData) => {
        res.json(dbUserData);
        return;
      })
      .catch((err) => res.status(400).json(err));
  });
});

module.exports = router;
  