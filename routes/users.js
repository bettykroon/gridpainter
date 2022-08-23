var express = require('express');
var router = express.Router();
const mongoose = require("mongoose")
const grupparbete = require("../model/test")

/* GET users listing. */
////Bara ett test för att se att det fungerar////
router.get('/', async(req, res, next) =>{
  const grupper = await grupparbete.find()
  res.status(200).json(grupper)
  
});
router.post("/", async(req, res)=>{
  const grupp = new grupparbete(req.body)
  await grupp.save();
  res.status(201).json(grupp)
})

module.exports = router;
