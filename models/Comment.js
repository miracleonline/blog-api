import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: { 
      type: String, 
      required: true, 
      maxlength: 500 
    },
    post: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Post', 
      required: true, 
      index: true 
    },
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    }
  },
  { timestamps: true }
);

export default mongoose.model('Comment', commentSchema);
