import mongoose from "mongoose";

const resourceSchema = mongoose.Schema({
  course: {
    type: String,
    required: true,
    enum: ["CSE370", "CSE470", "CSE471"]
  },
  resources: [String],
  isApproved: {
    type: Boolean,
    default: false
  },
  resourceId: {
    type: Number,
    unique: true,
    required: true
  }
}, { timestamps: true });

const Resource = mongoose.models.resources || mongoose.model("resources", resourceSchema);

export default Resource;