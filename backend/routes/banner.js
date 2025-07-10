const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');

// CREATE a Banner
router.post('/', async (req, res) => {
    try {
        const { image, title, description } = req.body;
        const banner = new Banner({ image, title, description });
        await banner.save();
        res.status(201).json(banner);
    } catch (err) {
        resizeBy.status(500).json({ error: err.message });
    }
})

// GET All Banners
router.get('/', async (req, res) => {
    try {
        const banners = await Banner.find();
        res.json(banners);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;