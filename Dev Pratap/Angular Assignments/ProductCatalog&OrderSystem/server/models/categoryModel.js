const mongoose = require("mongoose")

const catSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  description: { type: String},
});

const category = mongoose.model('category', catSchema);
module.exports = category
