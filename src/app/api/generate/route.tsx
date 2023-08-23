import { NextRequest, NextResponse } from "next/server";
import { fetchTemplate, identifyTemplate } from "../../modules/template-service";
import { generatePDFFromHTML } from "../../modules/pdf-service";
import { secureAndGetLink } from "@/app/modules/secure-service";
import Handlebars from "handlebars";

export async function POST(request: NextRequest) {
    const { product, notice_type, metadata, secure, secure_type, secure_code, download } =
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

    // secure documents are uploaded to S3 and a passcode embedded link is returned
    if (secure) {
        const response = await secureAndGetLink(pdf, secure_type, secure_code);

        return NextResponse.json(response);
    }
    // unsecured document can be downloaded
    else if (download) {
        return new NextResponse(pdf as any, {});
    }

    return NextResponse.json({ message: "nothing was done" });
}
