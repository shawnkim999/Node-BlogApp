import { Request, Response } from "express";
import prisma from "../lib/Prisma";
import { Post } from "../models/Post";

export const getAllPosts = async (req:Request, res:Response): Promise<void> => {
    try {
        const posts = await prisma.post.findMany();
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
}

// export const createPost = async (req:Request, res:Response): Promise<void> => {
//     try {
//         const { title, content } = req.body as Post;

//         if (!title || !content ) {
//             res.status(404).send('Missing required fields');
//             return;
//         }

//         const newPost = await prisma.post.create({
//             data: {
//                 title,
//                 content
//             },
//         });
//         res.send(201).json(newPost);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Server error");
//     }
// }