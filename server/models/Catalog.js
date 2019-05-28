const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Joi = require('@hapi/joi');

const CatalogSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    uppercase: true
  },
  year: {
    type: String,
    required: true
  },
  items: [{
    name: {
      type: String
    },
    code: {
      type: String
    },
    sizes: [String],
    item_active: {
      type: Boolean
    },
    imageURL: {
      type: String
    },
    description: {
      type: String
    },
    category: {
      type: String
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
    required: true
  }
});

function validateCatalog(catalog) {
  const schema = {
    brand: Joi.string().required(),
    year: Joi.string().min(4).max(4).required(),
    catalog_active: Joi.boolean(),
    season: Joi.string().required()
  }
  return Joi.validate(catalog, schema);
}

CatalogSchema.plugin(timestamps);
exports.Catalog = mongoose.model('catalogs', CatalogSchema);
exports.validateCatalog = validateCatalog;