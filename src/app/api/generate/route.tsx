import { NextRequest, NextResponse } from "next/server";
import { fetchTemplate, identifyTemplate } from "../../modules/template-service";
import { generatePDFFromHTML } from "../../modules/pdf-service";
import { uploadToS3 } from "../../modules/s3-service";
import { v4 as uuidv4 } from "uuid";
import { secureAndGetLink } from "@/app/modules/secure-service";
import Handlebars from "handlebars";

const generateUniqueFilename = (extension: string): string => {
    const uniqueId = uuidv4();
    return `${uniqueId}.${extension}`;
};

export async function POST(request: NextRequest) {
    const { product, notice_type, metadata, secure, secure_type, secure_code } =
        await request.json();

    // identify the notice template
    const templateId = await identifyTemplate({
        product,
        notice_type,
    });
    console.log("template identified", templateId);

    // fetch this template
    let template = await fetchTemplate(templateId);
    console.log("template fetched", template);

    // apply dynamic data to template
    template = Handlebars.compile(template)(metadata);
    console.log("template compiled", template);

    // generate pdf
    const pdf = await generatePDFFromHTML(template);
    console.log("pdf generated");

    if (secure) {
        const response = await secureAndGetLink(pdf, secure_type, secure_code);

        return NextResponse.json(response);
    } else {
        const filename = generateUniqueFilename("pdf");
        const link = await uploadToS3(filename, pdf);

        return NextResponse.json({ link });
    }
}
