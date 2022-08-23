const mongoose = require ("mongoose")

const GrupparbeteSchema = mongoose.Schema({
    img : String
})
module.exports = mongoose.model("grupp", GrupparbeteSchema)