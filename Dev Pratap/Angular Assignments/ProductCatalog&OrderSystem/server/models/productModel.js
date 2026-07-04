const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock:{ type: Number, required: true },
  image:{ type: String},
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true
  }
});

const Product = mongoose.model('Products', productSchema);
module.exports = Product;
