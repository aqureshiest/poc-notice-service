import jwt, { JwtPayload } from "jsonwebtoken";

const secretKey = process.env.JWT_SIGNING_KEY!;

function generateJwt(payload: any, expiresInHrs: number) {
    // JWT token expiration time
    const expiresIn = `${expiresInHrs}s`;

    // Generate the JWT token
    const token = jwt.sign(payload, secretKey, { expiresIn });
    console.log("Generated JWT token:", token);

    return token;
}

function verifyJwt(token: string): boolean {
    try {
        const decoded: string | JwtPayload = jwt.verify(token, secretKey);

        if (typeof decoded === "string") {
            console.log("JWT verification failed: Token is a string.");
            return false;
        }

        // Check if the token is expired
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            console.log("JWT token has expired.");
            return false;
        }

        console.log("JWT token is valid.");
        return true;
    } catch (error: any) {
        console.error("JWT verification failed:", error.message);
        return false;
    }
}

export { generateJwt, verifyJwt };
