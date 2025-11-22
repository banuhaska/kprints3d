import mongoose from 'mongoose';

const shippingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  postalCode: String,
  cardLast4: String,
});

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        quantity: { type: Number, default: 1 },
      },
    ],
    shipping: shippingSchema,
    notes: String,
    priceQuote: Number,
    status: {
      type: String,
      enum: ['awaiting-price', 'priced', 'accepted', 'declined'],
      default: 'awaiting-price',
    },
  },
  { timestamps: true },
);

const Order = mongoose.model('Order', orderSchema);
export default Order;