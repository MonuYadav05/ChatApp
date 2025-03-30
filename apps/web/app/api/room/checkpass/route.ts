import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/client";

export async function POST(req: NextRequest) {
    const data = await req.json();
    const {password , roomId} = data;
    try{
        const room = await db.room.findFirst({
            where: {
                id: roomId,
                password: password
            }
        });
        if (!room) {
            return NextResponse.json({
                success: false
            });
        }
        return NextResponse.json({
            success: true
        });
    }catch(err){
        return NextResponse.json({success: false});
    }
}