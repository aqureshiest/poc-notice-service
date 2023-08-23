import { generatePasscode, hashPasscode } from "./passcode-service";
import { downloadFile, exists, uploadToS3 } from "./s3-service";
import { v4 as uuidv4 } from "uuid";

const secureAndGetLink = async (
    pdf: any,
    secure_type: string = "code",
    secure_code: string = ""
) => {
    // code + key must match for verification

    // code can be shared with the user
    const code = secure_code ? secure_code : generatePasscode();
    // hashed code should not be shared with the user
    const hashed = hashPasscode(code);
    // this key is public and can be shared with the user
    const uuid = uuidv4();

    // append hashed passcode to filename
    const filename = `${hashed}.pdf`;

    // store in S3
    const link = await uploadToS3(filename, { key: uuid }, pdf);

    return {
        link: `http://localhost:3000/api/retrieve?key=${uuid}&code=${code}`,
        code,
    };
};

const authenticateAndGrantAccess = async (code: string, key: string) => {
    // hash the code
    const hashed = hashPasscode(code);

    // check if this object exists in the s3 store
    const fileExists = await exists(`${hashed}.pdf`);

    if (fileExists) {
        const data = await downloadFile(`${hashed}.pdf`);

        // verify key in metadata
        if (data.Metadata?.key == key) {
            return data;
        }
        throw new Error("incorrect key");
    }
    throw new Error("incorrect code");
};

export { secureAndGetLink, authenticateAndGrantAccess };
