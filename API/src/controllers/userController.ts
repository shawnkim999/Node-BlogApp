import { Request, Response } from "express";
import prisma from "../lib/Prisma";
import { User } from "../models/User";
import { getCache, setCache, deleteCache } from "../services/redisService";

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const userCache = `user:me:${userId}`

    try {
        const cachedUser = await getCache<User>(userCache);

        if (cachedUser) {
            res.json(cachedUser);
            return;
        }
        
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true
            }
        })

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        };

        await setCache(userCache, user);
        res.json(user);
    } catch (error) {
        console.error("Failed to get user by ID: ", error);
        res.status(500).json({ error: "Server error" });
    }
}

export const updateUser = async (req:Request, res:Response): Promise<void> => {
    const userId = Number(req.params.id);
    const { username, email } = req.body;

    if (req.user!.userId !== userId) {
        res.status(403).json({ error: "Unauthorized to update this user" });
        return;
    }
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                username,
                email
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true
            }
        });

        await deleteCache(`user:${userId}`);
        await deleteCache(`user:me:${userId}`);
        
        res.json(updatedUser);
    } catch (error) {
        console.error("Failed to update user:", error);
        res.status(500).json({ error: "Server error" });
    }
}

export const deleteUser = async (req:Request, res:Response): Promise<void> => {
    const userId = Number(req.params.id);

    if (req.user!.userId !== userId) {
        res.status(403).json({ error: "Unauthorized to delete this user" });
        return;
    }
    try {
        await prisma.user.delete({ where: { id:userId } });

        await deleteCache(`user:${userId}`);
        await deleteCache(`user:me:${userId}`);

        res.status(204).send();
    } catch (error) {
        console.error("Failed to delete user:", error);
        res.status(500).json({ error: "Server error" });
    }
}