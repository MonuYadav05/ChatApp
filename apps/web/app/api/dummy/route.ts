import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    console.log(req.url)
    return NextResponse.json({
        message: "hello world"
    })
}