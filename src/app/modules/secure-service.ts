import { generatePasscode, hashPasscode } from "./passcode-service";
import { downloadFile, exists, uploadToS3 } from "./s3-service";

const secureAndGetLink = async (
    pdf: any,
    secure_type: string = "code",
    secure_code: string = ""
) => {
    const code = secure_code ? secure_code : generatePasscode();
    const hashed = hashPasscode(code);

    // append hashed passcode to filename
    const filename = `${hashed}.pdf`;

    // store in S3
    const link = await uploadToS3(filename, pdf);

    return {
        link: `http://localhost:3000/api/retrieve?code=${code}`,
        code,
    };
};

const authenticateAndGrantAccess = async (code: string) => {
    // hash the code
    const hashed = hashPasscode(code);

    // check if this object exists in the s3 store
    const fileExists = await exists(`${hashed}.pdf`);

    if (fileExists) {
        const data = await downloadFile(`${hashed}.pdf`);
        return data;
    }
    return null;
};

export { secureAndGetLink, authenticateAndGrantAccess };
