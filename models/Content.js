import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['music', 'book', 'yoga'],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    // For music/yoga: YouTube embed URL or direct URL
    url: { type: String, default: '' },
    // For books: link to resource
    link: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    duration: { type: String, default: '' }, // "30 MIN", "45 pages", etc.
    tag: { type: String, default: '' }, // "Calm", "Beginner", etc.
    author: { type: String, default: '' }, // for books
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema);
export default Content;
