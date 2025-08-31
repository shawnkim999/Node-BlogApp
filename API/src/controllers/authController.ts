import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../lib/Prisma";

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

export const userLogin = async (req:Request, res:Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password required' });
        return;
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            res.status(400).json({ error: 'Invalid email credentials' });
            return;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(400).json({ error: 'Invalid password credentials' });
            return;
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token })
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
}

export const userSignup = async (req:Request, res:Response): Promise<void> => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ error: 'Username, email, and password are required' });
        return;
    }
    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        });

        if (existingUser) {
            res.status(400).json({ error: 'Email or username already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword }
        });

        res.status(201).json({ message: 'User created', userId: user.id });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Signup failed' });
    }
}