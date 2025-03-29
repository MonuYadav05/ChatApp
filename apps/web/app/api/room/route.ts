import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/client";
export async function DELETE(req:NextRequest ){
        const data = await req.json();
        try{
                const slug = data.slug;
         await db.room.delete({
                where:{
                        slug: slug
                },
        })
        return NextResponse.json({success: true});
        }
        catch(err){
                console.log("error in delete room",err)
                return NextResponse.json({success: false});
        }
}