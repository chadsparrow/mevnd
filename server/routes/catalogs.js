const express = require('express');
const router = express.Router();

const { Catalog, validateCatalog, validateItem } = require('../models/Catalog');

// GET /api/catalogs
router.get('/', async (req, res) => {
  try {
    const catalogs = await Catalog.find().select('brand year season catalog_active');
    if (catalogs && catalogs.length === 0) return res.send({ msg: 'There are no catalogs in the database.' });
    res.send(catalogs);
  } catch (error) {
    console.log(error.message);
  }
});

// GET /api/catalogs/:id
router.get('/:id', async (req, res) => {
  try {
    const catalog = await Catalog.findOne({ _id: req.params.id });
    if (!catalog) return res.status(404).send({ msg: 'Catalog with the given ID was not found.' });
    res.send(catalog);
  } catch (error) {
    console.log(error.message);
  }
});

// POST /api/catalogs
router.post('/', async (req, res) => {
  const { error } = validateCatalog(req.body);
  if (error) return res.status(400).send(error);

  try {
    const { brand, year, catalog_active, season } = req.body;

    const catalog = await Catalog.findOne({ brand, year, season });
    if (catalog) return res.status(400).send({ msg: 'Catalog already exists.' });

    const newCatalog = new Catalog({
      brand,
      year,
      catalog_active,
      season
    });

    const savedCatalog = await newCatalog.save();
    res.send({ msg: `${savedCatalog.brand} ${savedCatalog.season} ${savedCatalog.year} is now in the database.` });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
