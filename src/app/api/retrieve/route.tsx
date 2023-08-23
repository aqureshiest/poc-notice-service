import { NextRequest, NextResponse } from "next/server";
import { authenticateAndGrantAccess } from "@/app/modules/secure-service";

export async function GET(request: NextRequest, res: NextResponse) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key") || "";
    const code = searchParams.get("code") || "";

    try {
        const data = await authenticateAndGrantAccess(code, key);
        const nextResponse = new NextResponse(data.Body as any, {});
        return nextResponse;
    } catch (e: any) {
        return new Response(e.message, {
            status: 500,
        });
    }
}
