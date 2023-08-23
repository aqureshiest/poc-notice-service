import crypto from "crypto";

const generatePasscode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashPasscode = (passcode: string): string => {
    return crypto.createHash("sha256").update(passcode).digest("hex");
};

export { generatePasscode, hashPasscode };
