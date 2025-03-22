import webSocket from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config"
import db from "@repo/db/client";

interface User {
    ws: webSocket,
    rooms: String[],
    userId: String,
}

const wss = new webSocket.Server({ port: 8080 });

const users: User[] = [];

const checkUser = (token: string) => {
    try {
        const decode = jwt.verify(token, JWT_SECRET);
        // console.log(decode)
        if (typeof (decode) == "string") {
            return null;
        }
        if (!decode || !(decode).id) {
            return null;
        }
        return decode.id;
    } catch (err) {
        console.log("error in ws auth", err);
        // return "not authorized";
    }
}

wss.on("connection", (ws, request) => {
    const url = request.url;
    if (!url) return;
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";

    const userId = checkUser(token);
    if (!userId || userId == null) {
        ws.close();
        return;
    }
    users.push({
        userId,
        ws,
        rooms: []
    })

    // console.log("usersaray", users)
    ws.on("message", async (data) => {
        let parsedData;
        if (typeof data !== "string") {
            parsedData = JSON.parse(data.toString());
        } else {
            parsedData = JSON.parse(data); // {type: "join-room", roomId: 1}
        }
        try {

            if (parsedData.type === "join-room") {
                const user = users.find(x => x.ws === ws);
                user?.rooms.push(parsedData.roomId);
            }

            if (parsedData.type == "leave-room") {
                const user = users.find((x) => x.ws == ws);
                if (!user) {
                    return;
                }
                user.rooms = user?.rooms.filter((x) => x != parsedData.roomId);
            }

            if (parsedData.type == "chat") {
                const roomId = parsedData.roomId;
                const message = parsedData.message;
                const newChat = await db.chat.create({
                    data: {
                        roomId: Number(roomId),
                        message,
                        userId,
                    }
                });

                const userName = await db.user.findUnique({
                    where: {
                        id: userId
                    },
                    select: {
                        name: true,
                    }
                })
                users.map((user) => {
                    if (user.rooms.includes(roomId)) {
                        user.ws.send(JSON.stringify({
                            type: "chat",
                            message: message,
                            roomId,
                            userName: userName?.name,
                            createdAt: newChat.createdAt.toISOString(),
                            id: newChat.id
                        }));
                    }
                })

            }
            // console.log(users)
        }
        catch (err) {
            console.log("error in message", err);
            // console.log(users)
            // ws.close(403, "not join");
        }
    })
})  