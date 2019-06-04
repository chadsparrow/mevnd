const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Joi = require('@hapi/joi');

const CatalogSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  year: {
    type: String,
    required: true,
    trim: true
  },
  items: [{
    name: {
      type: String,
      trim: true
    },
    code: {
      type: String,
      trim: true,
      uppercase: true
    },
    sizes: [String],
    item_active: {
      type: Boolean
    },
    imageURL: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      trim: true,
      uppercase: true
    },
    usd_price: {
      type: Number
    },
    cad_price: {
      type: Number
    }
  }],
  catalog_active: {
    type: Boolean,
    default: false
  },
  season: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  }
});

function validateCatalog(catalog) {
  const schema = {
    brand: Joi.string().required().trim(true),
    year: Joi.string().min(4).max(4).required(),
    catalog_active: Joi.boolean(),
    season: Joi.string().required().trim(true)
  }
  return Joi.validate(catalog, schema);
}

function validateItem(item) {
  const schema = {
    name: Joi.string().required().trim(true),
    code: Joi.string().required().trim(true),
    sizes: Joi.array().items(Joi.string().trim(true)),
    item_active: Joi.boolean(),
    imageURL: Joi.string().trim(true),
    description: Joi.string().trim(true),
    category: Joi.string().required().trim(true),
    usd_price: Joi.number().precision(2).positive().required(),
    cad: Joi.number().precision(2).positive().required(),
  }
}

CatalogSchema.plugin(timestamps);
exports.Catalog = mongoose.model('catalogs', CatalogSchema);
exports.validateCatalog = validateCatalog;
exports.validateItem = validateItem;