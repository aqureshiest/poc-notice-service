import crypto from "crypto";

function generatePasscode(length: number = 6) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    let passcode = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charactersLength);
        passcode += characters.charAt(randomIndex);
    }

    return passcode;
}

const hashPasscode = (passcode: string): string => {
    return crypto.createHash("sha256").update(passcode).digest("hex");
};

export { generatePasscode, hashPasscode };
