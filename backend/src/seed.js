import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import fetch from 'node-fetch';
import { GridFSBucket } from 'mongodb';
import Plot from './models/Plot.js';
import User from './models/User.js';

dotenv.config();

async function uploadImageFromUrl(bucket, url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch image');
  const contentType = res.headers.get('content-type') || 'image/jpeg';
  const filename = url.split('/').pop() || 'image.jpg';
  return new Promise(async (resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, { contentType });
    res.body
      .pipe(uploadStream)
      .on('error', reject)
      .on('finish', () => resolve(uploadStream.id.toString()));
  });
}

async function main() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/plotify';
  await mongoose.connect(mongoUri);

  const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'images' });

  const email = 'seller@plotify.dev';
  let seller = await User.findOne({ email });
  if (!seller) {
    const hashed = await bcrypt.hash('password123', 10);
    seller = await User.create({ name: 'Demo Seller', email, password: hashed, role: 'seller' });
    console.log('Created seller user: seller@plotify.dev / password123');
  } else {
    console.log('Seller user already exists.');
  }

  const samples = [
    {
      title: 'Greenfield Acres',
      description: 'Lush green plots ideal for farmhouse development.',
      price: 45000,
      imageUrls: [
        'https://images.unsplash.com/photo-1528747045269-390fe33c19d4',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
      ],
    },
    {
      title: 'Riverside Meadow',
      description: 'Scenic plot by the river with stunning views.',
      price: 78000,
      imageUrls: [
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
      ],
    },
    {
      title: 'Sunset Ridge',
      description: 'Elevated land perfect for a holiday home.',
      price: 99000,
      imageUrls: [
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d',
      ],
    },
  ];

  const baseUrl = 'http://localhost:5000';

  for (const s of samples) {
    const exists = await Plot.findOne({ title: s.title });
    if (!exists) {
      const ids = [];
      for (const img of s.imageUrls) {
        try {
          const id = await uploadImageFromUrl(bucket, img);
          ids.push(id);
        } catch (e) {
          console.warn('Image fetch failed:', e.message);
        }
      }
      const images = ids.map((id) => `${baseUrl}/api/plots/images/${id}`);
      await Plot.create({ title: s.title, description: s.description, price: s.price, images, coordinates: [], seller: seller._id });
      console.log(`Inserted sample plot: ${s.title}`);
    } else {
      console.log(`Sample plot already exists: ${s.title}`);
    }
  }

  await mongoose.disconnect();
  console.log('Seeding complete.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
