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

// TODO: delete

module.exports.update = (req, res, next) => {
  req.body.user = req.currentUser;
  Product.findById(req.params.id)
    .then((product) => {
      if (product.user.toString() === req.currentUser.toString()) {
        return Product.findByIdAndUpdate(req.params.id, req.body)
          .then((p) => {
            res.json({});
          })
          .catch(next);
      } else {
        next(createError(403));
      }
    })
    .catch(next);
};

// TODO: create review

// TODO: delete review
