import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], default: 'image' },
  },
  { _id: false },
);

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    imageUrl: { type: String, default: '' },
    media: { type: [mediaSchema], default: [] },
    files: [{ name: String, url: String }],
  },
  { timestamps: true },
);

const Item = mongoose.model('Item', itemSchema);
export default Item;

