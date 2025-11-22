import express from 'express';
import Order from '../models/Order.js';
import Item from '../models/Item.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  const { items, shipping, notes } = req.body;

  if (!items?.length || !shipping?.name) {
    return res.status(400).json({ message: 'Missing order details' });
  }

  const hydratedItems = await Promise.all(
    items.map(async ({ itemId, quantity }) => {
      const item = await Item.findById(itemId);
      if (!item) {
        throw new Error(`Item ${itemId} not found`);
      }
      return { item: item._id, quantity: quantity || 1 };
    }),
  );

  try {
    const order = await Order.create({
      customer: req.user._id,
      items: hydratedItems,
      shipping: {
        ...shipping,
        cardLast4: shipping.cardNumber?.slice(-4),
      },
      notes,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  const query = req.user.role === 'admin' ? {} : { customer: req.user._id };
  const orders = await Order.find(query)
    .populate('items.item')
    .populate('customer', 'name email');
  res.json(orders);
});

router.patch('/:id/price', protect, requireAdmin, async (req, res) => {
  const { priceQuote } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { priceQuote, status: 'priced' },
    { new: true },
  ).populate('items.item');

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(order);
});

router.patch('/:id/decision', protect, async (req, res) => {
  const { decision } = req.body;

  const order = await Order.findOne({ _id: req.params.id, customer: req.user._id });
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (!['accept', 'decline'].includes(decision)) {
    return res.status(400).json({ message: 'Invalid decision' });
  }

  order.status = decision === 'accept' ? 'accepted' : 'declined';
  await order.save();

  res.json(order);
});

export default router;