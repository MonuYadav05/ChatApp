import webSocket from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config"
import db from "@repo/db/client";
import { Worker, Queue } from "bullmq";
import IORedis from "ioredis";
import { REDIS_AVIEN } from "@repo/backend-common/config";

const redisConnection = new IORedis(REDIS_AVIEN, {
    maxRetriesPerRequest: null
});

const queue = new Queue("chats", { connection: redisConnection });


interface User {
    ws: webSocket,
    rooms: string[],
    userId: string,
    userName?: string,
}

const wss = new webSocket.Server({ port: 8080 });

const users: User[] = [];

const checkUser = async (token: string) => {
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

wss.on("connection", async (ws, request) => {
    const url = request.url;
    if (!url) return;
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = await queryParams.get("token") || "";

    const userId = await checkUser(token);
    if (!userId || userId == null) {
        ws.close();
        return;
    }
    users.push({
        userId,
        ws,
        rooms: [],
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
                user!.userName = parsedData.userName;
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

                users.map((user) => {
                    if (user.rooms.includes(roomId)) {
                        user.ws.send(JSON.stringify({
                            type: "chat",
                            message: message,
                            roomId,
                            userName: user.userName,
                            createdAt: new Date().toISOString(),
                        }));
                    }
                })
                await queue.add("chat", {
                    roomId,
                    message,
                    userId
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

const worker = new Worker("chats", async job => {
    if (job.name === "chat") {
        const { roomId, message, userId } = job.data;
        const newChat = await db.chat.create({
            data: {
                roomId: Number(roomId),
                message,
                userId,
            }
        });
    }
}, { connection: redisConnection })