import db from "@repo/db/client"

export const getChats = async (req: any, res: any) => {
    const roomId = req.params.roomId;
    const chats = await db.chat.findMany({
        where: {
            roomId: Number(roomId),
        },
        include: {
            user: true
        },
        orderBy: {
            createdAt: "asc"
        },
        take: 50,
    });
    res.json({
        chats
    })
}
