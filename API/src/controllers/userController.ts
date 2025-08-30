import { Request, Response } from "express";
import prisma from "../lib/Prisma";
import { User } from "../models/User";
import { getCache, setCache, deleteCache } from "../services/redisService";

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const cachedUsers = await getCache<User[]>("users");

        if (cachedUsers) {
            res.json(cachedUsers);
            return;
        }
        
        const users = await prisma.user.findMany();

        await setCache("users", users);
        res.json(users);
    } catch (error) {
        console.error("Failed to get all users: ", error);
        res.status(500).json({ error: "Failed to retrieve users" });
    }
}

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body as User;

        if (!username || !email || !password) {
            res.status(404).send("Missing required fields");
            return;
        };

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password
            }
        });

        await deleteCache("users");

        res.send(201).json(newUser);
    } catch (error) {
        console.error("Failed to create user: ", error);
        res.status(500).json({ error: "Failed to create user" });
    }
}