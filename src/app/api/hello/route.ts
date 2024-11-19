import { type NextRequest } from "next/server";
import { env } from "~/env";

export async function GET(request: NextRequest) {
    const headerKey = request.headers.get("control-key")

    if (headerKey !== env.CONTROL_KEY) {
        return new Response("Unauthorized", { status: 401 })
    }

    return Response.json({ message: 'Hello World' })

}