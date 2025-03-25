import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

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

    const decode = jwt.verify(token, JWT_SECRET);
    if (!decode) {
        return NextResponse.json({
            success: false,
            message: "jwt expired"
        })
    }

    const user = await prisma.user.findFirst({
        where: {
            token: token
        }
    })
    if (!user) {
        return NextResponse.json({
            success: false,
            message: "user Not Found"
        })
        // return NextResponse.redirect(new URL("/signin", req.url))
    }
    return NextResponse.json({
        user: user
    });
}