const express = require("express")
const Product = require("../models/productModel")

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    let { name, category, page = 1, pagesize = 10, asc = 1 } = req.query;

    page = Number(page);
    pagesize = Number(pagesize);
    asc = Number(asc);

    const skip = (page - 1) * pagesize;

    const filter = {};

    if (name) {
      filter.name = {
        $regex: name,
        $options: "i",
      };
    }

    if (category) {
      filter.category = category;
    }

    const items = await Product.find(filter)
      .populate("category")
      .sort({ price: asc })
      .skip(skip)
      .limit(pagesize);

    const total = await Product.countDocuments(filter);

    res.json({
      data: items,
      currentPage: page,
      pageSize: pagesize,
      totalItems: total,
      totalPages: Math.ceil(total / pagesize),
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});


module.exports = router