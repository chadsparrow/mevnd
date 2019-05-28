const express = require("express");
const router = express.Router();

const { Catalog, validateCatalog } = require("../models/Catalog");

// GET /api/catalogs
router.get("/", async (req, res) => {
  const catalogs = await Catalog.find().select('brand year season catalog_active');
  res.send(catalogs);
});

// GET /api/catalogs/:id
router.get("/:id", async (req, res) => {
  const catalog = await Catalog.findOne({ _id: req.params.id });
  if (!catalog) return res.status(404).send('Catalog with the given ID was not found.')
  res.send(catalog);
});

// GET /api/catalogs/:season
router.get("/year/:year", async (req, res) => {
  const catalogs = await Catalog.find({ year: req.params.year });
  res.send(catalogs);
});

// POST /api/catalogs
router.post("/", async (req, res) => {
  //Check for validation errors
  const { error } = validateCatalog(req.body);
  if (error) return res.status(400).send(error);

  // desctructure the req.body
  const {
    brand,
    year,
    catalog_active,
    season
  } = req.body

  // Check if catalog already exists
  try {
    const catalog = await Catalog.findOne({ brand, year, season });
    if (catalog) return res.status(400).send('Catalog already exists.');

    // Create new catalog object
    const newCatalog = new Catalog({
      brand,
      year,
      catalog_active,
      season
    });

    const savedCatalog = await newCatalog.save();
    res.send(`${savedCatalog.brand} ${savedCatalog.season} ${savedCatalog.year} is now in the database.`);

  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;