import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    // console.log(url)
    const token = url.searchParams.get("token");
    if (!token) {
        return NextResponse.json({
            success: false,
            message: "in get user"
        })
        // return NextResponse.redirect(new URL("/signin", req.url))
    }

    const user = await prisma.user.findFirst({
        where: {
            token: token
        }
    })
    if (!user) {
        return NextResponse.json({
            success: false,
            message: "in get user"
        })
        // return NextResponse.redirect(new URL("/signin", req.url))
    }
    return NextResponse.json({
        user: user
    });
}