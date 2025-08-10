import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import { Readable } from 'stream';
import Plot from '../models/Plot.js';
import { authRequired, requireRole } from '../middleware/auth.js';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

function getBucket() {
  const db = mongoose.connection.db;
  return new GridFSBucket(db, { bucketName: 'images' });
}

// Public: list all plots with optional filters
router.get('/', async (req, res) => {
  try {
    const { q, minPrice, maxPrice } = req.query;
    const filter = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const plots = await Plot.find(filter).populate('seller', 'name email');
    res.json(plots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public: get plot by id
router.get('/:id', async (req, res) => {
  try {
    const plot = await Plot.findById(req.params.id).populate('seller', 'name email');
    if (!plot) return res.status(404).json({ message: 'Not found' });
    res.json(plot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public: stream image by GridFS id
router.get('/images/:id', async (req, res) => {
  try {
    const bucket = getBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.id);

    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).send('Not found');
    }
    const file = files[0];
    if (file.contentType) res.setHeader('Content-Type', file.contentType);

    const readStream = bucket.openDownloadStream(fileId);
    readStream.on('error', (e) => {
      console.error(e);
      res.status(500).end();
    });
    readStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Seller: create plot (multipart with images stored in GridFS)
router.post('/', authRequired, requireRole('seller'), upload.array('images', 12), async (req, res) => {
  try {
    let { title, description, price, coordinates } = req.body;

    if (typeof coordinates === 'string') {
      try { coordinates = JSON.parse(coordinates); } catch (_) { coordinates = []; }
    }

    if (!title || Number.isNaN(Number(price))) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const bucket = getBucket();

    const uploadedIds = [];
    for (const file of (req.files || [])) {
      const uploadStream = bucket.openUploadStream(file.originalname, { contentType: file.mimetype });
      await new Promise((resolve, reject) => {
        Readable.from(file.buffer)
          .pipe(uploadStream)
          .on('error', reject)
          .on('finish', () => {
            uploadedIds.push(uploadStream.id.toString());
            resolve();
          });
      });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrls = uploadedIds.map((id) => `${baseUrl}/api/plots/images/${id}`);

    const plot = await Plot.create({
      title,
      description: description || '',
      price: Number(price),
      coordinates: Array.isArray(coordinates) ? coordinates : [],
      images: imageUrls,
      seller: req.user.id,
    });
    res.status(201).json(plot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Seller: list own plots
router.get('/mine/list', authRequired, requireRole('seller'), async (req, res) => {
  try {
    const plots = await Plot.find({ seller: req.user.id });
    res.json(plots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
