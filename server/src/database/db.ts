import mongoose, { Schema } from "mongoose";

const User = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

export const UserModel = mongoose.model("User", User);

const Task = new mongoose.Schema(
  {
    title: String,
    description: String,
    status: String,
    priority: String,
    userId: { ref: "User", type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

export const TaskModel = mongoose.model("Task", Task);
