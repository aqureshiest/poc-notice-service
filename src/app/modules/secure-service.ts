import { generateJwt, verifyJwt } from "./jwt-service";
import { downloadFile, exists, uploadToS3 } from "./s3-service";
import { v4 as uuidv4 } from "uuid";

const secureAndGetLink = async (pdf: any, secure_type: string = "jwt", expiresInS: number) => {
    // this key is public and can be shared with the user
    const uuid = uuidv4();

    // append hashed passcode to filename
    const filename = `${uuid}.pdf`;

    // generate a JWT token for access
    const jwtToken = generateJwt({ key: uuid }, expiresInS);

    // store in S3
    await uploadToS3(filename, { token: jwtToken }, pdf);

    return {
        link: `http://localhost:3000/api/retrieve?key=${uuid}`,
    };
};

const authenticateAndGrantAccess = async (key: string, validateToken: boolean = true) => {
    // check if this object exists in the s3 store
    const fileExists = await exists(`${key}.pdf`);
    if (fileExists) {
        const data = await downloadFile(`${key}.pdf`);
        if (!validateToken) {
            return data;
        }

        // extract jwt token from metadata
        const jwtToken = data.Metadata?.token;
        if (jwtToken && verifyJwt(jwtToken)) {
            return data;
        }
        throw new Error("Access to this link has expired");
    }
    throw new Error("incorrect key");
};

export { secureAndGetLink, authenticateAndGrantAccess };
