import { NextRequest, NextResponse } from "next/server";
import { authenticateAndGrantAccess } from "@/app/modules/secure-service";

export async function GET(request: NextRequest, res: NextResponse) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code") || "";

    const data = await authenticateAndGrantAccess(code);
    if (data) {
        console.log("Code matched, redirecting to file");

        const nextResponse = new NextResponse(data.Body as any, {});
        return nextResponse;
    } else {
        console.log("wrong code");
        return new Response("Wrong code", {
            status: 401,
        });
    }
}
