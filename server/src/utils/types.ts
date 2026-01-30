import type { Request } from "express";

export interface loginPropesTypes {
  email: string;
  password: string;
  _id: string;
  name: string;
}

export interface registerPropesTypes {
  name: string;
  email: string;
  password: string;
}

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export interface contentProps {
  title: string;
  description: string;
  status: string;
  priority: string;
  userId: string;
}
