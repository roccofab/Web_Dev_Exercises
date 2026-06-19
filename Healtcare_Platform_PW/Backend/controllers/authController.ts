import { Request, Response } from "express";
import { comparePassword } from "../utils/bcryptUtils";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken";
import { prisma } from "../config/connection";

/***
 * @swagger
 * POST/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user using email and password and returns a JWT token.
  *     tags:
  *       - Auth
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required:
  *               - email
  *               - password
  *             properties:
  *               email:
  *                 type: string
  *                 example: admin@test.com
  *               password:
  *                 type: string
  *                 example: password123
  *     responses:
  *       200:
  *         description: Login successful
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: Login successful
  *                 token:
  *                   type: string
  *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  *                 user:
  *                   type: object
  *                   properties:
  *                     id:
  *                       type: integer
  *                       example: 1
  *                     name:
  *                       type: string
  *                       example: John Doe
  *                     email:
  *                       type: string
  *                       example: admin@test.com
  *                     role:
  *                       type: string
  *                       example: ADMIN
  *       400:
  *         description: Missing email or password
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: Email and password are required
  *       401:
  *         description: Invalid credentials
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: Invalid credentials
  *       500:
  *         description: Server error
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: Server error while logging in
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        console.log("=== LOGIN ATTEMP ===");
        console.log("Email received:", email);
        console.log("Password received:", password);

        if (!email || !password)
            return res.status(400).json({ message: 'Email and password are required' });

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            console.log("User not found for email:", email);
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        console.log("Hash retrieved from DB:", user.password);

        const isPasswordValid = await comparePassword(password, user.password)


        console.log("Bcrypt Match:", isPasswordValid);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const token = generateToken(
            user.id,
            user.role
        )

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        return res.status(500).json({ message: 'Server error while logging in' });
    }
}
