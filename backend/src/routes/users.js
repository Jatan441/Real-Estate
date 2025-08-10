import express from 'express';
import { authRequired, requireRole } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/favorites', authRequired, requireRole('buyer'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({ path: 'favorites', populate: { path: 'seller', select: 'name email' } });
    res.json(user?.favorites || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/favorites/:plotId', authRequired, requireRole('buyer'), async (req, res) => {
  try {
    const { plotId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.favorites.some((id) => id.toString() === plotId)) {
      user.favorites.push(plotId);
      await user.save();
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/favorites/:plotId', authRequired, requireRole('buyer'), async (req, res) => {
  try {
    const { plotId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.favorites = user.favorites.filter((id) => id.toString() !== plotId);
    await user.save();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;


