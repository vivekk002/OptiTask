import express, { type Response as ExpressResponse } from "express";
import authMiddleware from "../../utils/middleware.ts";
import type { AuthenticatedRequest, contentProps } from "../../utils/types.ts";
import { TaskModel } from "../../database/db.ts";

const router = express.Router();

router.get(
  "/content",
  authMiddleware,
  async (req: AuthenticatedRequest, res: ExpressResponse) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const content = await TaskModel.find({ userId });

      if (!content || content.length === 0) {
        return res.status(404).json({ message: "Content not found" });
      }

      return res
        .status(200)
        .json({ content, message: "Content fetched successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

router.post(
  "/content",
  authMiddleware,
  async (req: AuthenticatedRequest, res: ExpressResponse) => {
    try {
      const { title, description, status, priority } = req.body;
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const newContent = await TaskModel.create({
        title,
        description,
        status,
        priority,
        userId,
      });

      return res
        .status(200)
        .json({ newContent, message: "Content added successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

router.put(
  "/content/:id",
  authMiddleware,
  async (req: AuthenticatedRequest, res: ExpressResponse) => {
    try {
      const { title, description, status, priority } = req.body;

      const updatedContent = await TaskModel.updateOne(
        { _id: req.params.id },
        { title, description, status, priority },
      );

      if (!updatedContent) {
        return res.status(404).json({ message: "Content not found" });
      }

      return res
        .status(200)
        .json({ updatedContent, message: "Content updated successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

router.delete(
  "/content/:id",
  authMiddleware,
  async (req: AuthenticatedRequest, res: ExpressResponse) => {
    try {
      const deletedContent = await TaskModel.deleteOne({ _id: req.params.id });

      if (!deletedContent) {
        return res.status(404).json({ message: "Content not found" });
      }

      return res
        .status(200)
        .json({ deletedContent, message: "Content deleted successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

export default router;
