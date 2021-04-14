const createError = require("http-errors");
const Product = require("../models/Product.model");

module.exports.list = (req, res, next) => {
  const criteria = {};
  const { category, search } = req.query;

  if (search) {
    criteria.name = new RegExp(search, "i");
  }

  if (category) {
    criteria.categories = { $in: [category] };
  }

  Product.find(criteria)
    .then((products) => res.json(products))
    .catch(next);
};

module.exports.get = (req, res, next) => {
  Product.findById(req.params.id)
    .then((product) => {
      if (!product) {
        next(createError(404, "Product not found"));
      } else {
        res.json(product);
      }
    })
    .catch(next);
};

module.exports.create = (req, res, next) => {
  req.body.user = req.currentUser;

  Product.create(req.body)
    .then((product) => res.status(201).json(product))
    .catch(next);
};

module.exports.update = (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.path;
  }

  Product.findById(req.params.id)
    .then((product) => {
      if (!product) {
        next(createError(404));
        return;
      }
      if (product.user.toString() !== req.currentUser.toString()) {
        next(createError(403));
        return;
      }
      Object.entries(req.body).forEach(([key, value]) => {
        if (key === "categories") {
          value = value.split(",");
        }
        product[key] = value;
      });
      return product.save().then(() => res.json({}));
    })
    .catch(next);
};
// TODO: delete

// TODO: create review

// TODO: delete review
