import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true, 
      maxlength: 160 
    },
    content: { 
      type: String, 
      required: true 
    },
    tags: [{ 
      type: String, 
      index: true 
    }],
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    }
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1 });

export default mongoose.model('Post', postSchema);
