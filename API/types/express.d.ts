import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        // add any other fields you attach to req.user here
      };
    }
  }
}