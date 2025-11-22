import express from 'express';
import Item from '../models/Item.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await Item.find().sort({ createdAt: -1 });
  res.json(items);
});

const normalizeMedia = (media = []) =>
  Array.isArray(media)
    ? media
        .filter((entry) => entry?.url)
        .map((entry) => ({
          url: entry.url,
          type: entry.type === 'video' ? 'video' : 'image',
        }))
    : [];

const deriveCoverImage = (imageUrl, media) =>
  imageUrl || media.find((entry) => entry.type === 'image')?.url || '';

router.post('/', protect, requireAdmin, async (req, res) => {
  const { title, description, price, imageUrl, files, media } = req.body;

  if (!title || price === undefined) {
    return res.status(400).json({ message: 'Title and price are required' });
  }

  const normalizedMedia = normalizeMedia(media);
  const coverImage = deriveCoverImage(imageUrl, normalizedMedia);

  const item = await Item.create({
    title,
    description,
    price,
    imageUrl: coverImage,
    media: normalizedMedia,
    files,
  });
  res.status(201).json(item);
});

router.put('/:id', protect, requireAdmin, async (req, res) => {
  const updates = { ...req.body };
  if (updates.media) {
    const normalizedMedia = normalizeMedia(updates.media);
    updates.media = normalizedMedia;
    updates.imageUrl = deriveCoverImage(updates.imageUrl, normalizedMedia);
  } else if (updates.imageUrl) {
    updates.imageUrl = updates.imageUrl;
  }

  const item = await Item.findByIdAndUpdate(req.params.id, updates, { new: true });

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  res.json(item);
});

router.delete('/:id', protect, requireAdmin, async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  res.json({ message: 'Item removed' });
});

export default router;

