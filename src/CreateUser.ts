import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import prisma from "../lib/prisma";
import jwt from 'jsonwebtoken';


export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, name, password, userImage } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Email and Password are required!',
            });
            return;
        }


        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'User already exists with this email!',
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                userImage
            },
        });

        const jwtSecret = process.env.JWT_SECRET as string;

        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not configured in environment variables.');
        }

        const accessToken = jwt.sign({ id: newUser.id, email: newUser.email },
            jwtSecret, { expiresIn: '7d' }
        );

        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({
            success: true,
            message: 'user created successfully!',
            token: accessToken,
            data: userWithoutPassword,
        });


    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to create user',
            error: error.message,
        });

    }
}