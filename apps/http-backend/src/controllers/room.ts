import { CreateRoomSchema } from "@repo/common/types";
import db from "@repo/db/client";

export const createRoom = async (req: any, res: any) => {
    try {
        console.log(req.body)
        const parsedData = CreateRoomSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(403).json({
                message: "invalid inputs"
            });
            return;
        }
        // @ts-ignore
        const userId = req.userId;
        console.log("descritioj", parsedData.data.description)
        const room = await db.room.create({
            data: {
                slug: parsedData.data.name,
                description: parsedData.data.description,
                type: parsedData.data.type,
                adminId: userId,
            }
        })
        res.json({
            "roomId": room.id,
            "success": true
        })
    }
    catch (err) {
        console.log("error in room creation", err);
        res.send("room already exists");
        return;
    }
}

export const getRoom = async (req: any, res: any) => {
    const slug = req.params.slug;
    const room = await db.room.findFirst({
        where: {
            slug: slug
        }
    });
    if (!room) {
        res.json({
            success: false,
        })
        return;
    }
    res.json({
        roomId: room.id
    });
};
