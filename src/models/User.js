import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true }, // primary key behavior
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // encrypted in resolver
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export default mongoose.model("User", userSchema);