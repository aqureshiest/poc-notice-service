import { NextRequest, NextResponse } from "next/server";
import { authenticateAndGrantAccess } from "@/app/modules/secure-service";
import { headers } from "next/headers";

/**
 * @swagger
 * /api/retrieve:
 *   get:
 *     summary: Retrieve a secure document
 *     description: Retrieves a document using the provided key.
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         description: The key to access the document.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A successful response with the document.
 *       500:
 *         description: Internal server error.
 */
export async function GET(request: NextRequest, res: NextResponse) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key") || "";

    // for external user, access must be validated - the header is set by firewall
    // internal users will bypass the firewall so there should be no header
    const headersList = headers();
    const validateAccess = headersList.has("VALIDATE_ACCESS");

    try {
        const data = await authenticateAndGrantAccess(key, validateAccess);
        const nextResponse = new NextResponse(data.Body as any, {});
        return nextResponse;
    } catch (e: any) {
        return new Response(e.message, {
            status: 500,
        });
    }
}
