import "dotenv/config"
import jwt, { type JwtPayload } from "jsonwebtoken"

interface UserPayload {
    id: string,
    username: string,
    email: string
}

const secret = `${process.env.SECRET_KEY}`;

export function generateToken(payload: UserPayload): string {
    const token = jwt.sign(payload, secret, {expiresIn: '1h'});
    return token
};

export function generateRefreshToken(payload: UserPayload): string {
    const token = jwt.sign(payload, secret, {expiresIn: '1d'});
    return token
};

export function exportPayload(token: string): JwtPayload | string {
    try {
        const payload = jwt.verify(token, secret);
        return payload
    }
    catch (error) {
        throw new Error("Invalid token");
    }
}

export function isTokenExpired(exp: number): boolean {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    return currentTimeInSeconds > exp;
}