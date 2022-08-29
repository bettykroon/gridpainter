var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();

router.get("/", (req, res) => {
  req.app.locals.db.collection("colors").find().toArray()
  .then(result => {
    res.json(result);
  })
})

//Uppdaterar arrayen med färger i databasen
router.post("/", (req, res) => {
  console.log("req", req.body);
  req.app.locals.db.collection("colors").updateOne(
    {_id: ObjectId("630c82ea6b08834ec4cf10f5")},
    {$set: {colors: req.body}}
  )
  .then(result => {
    console.log(result);
  })
})

module.exports = router;
