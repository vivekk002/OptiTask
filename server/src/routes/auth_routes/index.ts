import express from "express";
import { z } from "zod";
import { UserModel } from "../../database/db.ts";
import bcrypt from "bcrypt";
import type { loginPropesTypes } from "../../utils/types.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authMiddleware, { addToBlacklist } from "../../utils/middleware.ts";
dotenv.config();

const router = express.Router();
const jwtsecret: string = (() => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET");
  }

  return process.env.JWT_SECRET;
})();

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 8 characters long"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 8 characters long"),
});

function generateToken(userId: string): string {
  const payload = { id: userId };

  const token = jwt.sign(payload, jwtsecret, { expiresIn: "30min" });
  return token;
}

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const validation = registerSchema.safeParse({ name, email, password });
    if (!validation.success) {
      return res.status(400).json({
        error: validation.error.message,
        issues: validation.error.issues,
      });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword: string = await hashPassword(password);

    await UserModel.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User signed up successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      return res.status(400).json({
        error: validation.error.message,
        issues: validation.error.issues,
      });
    }

    const user: loginPropesTypes | null = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user._id.toString());

    res.status(201).json({
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      message: "User signed in successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/logout", authMiddleware, async (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    addToBlacklist(token);
  }
  try {
    res.clearCookie("token");

    res.status(201).json({
      message: "User signed out successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
