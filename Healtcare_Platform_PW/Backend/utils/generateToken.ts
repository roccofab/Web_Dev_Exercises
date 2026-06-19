import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export interface jwtPayload {
    userId: number;
    role: string;
}

export const generateToken = (
    userId: number,
    role: string
): string => {
    const secret = process.env.JWT_SECRET

    if(!secret)
        throw new Error('JWT_SECRET is not defined in environment variables');

    
    const payload: jwtPayload = {
        userId,
        role
    };

    return jwt.sign(payload, secret, {expiresIn: '1h'});
}