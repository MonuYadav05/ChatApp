import express from "express";
import jwt from "jsonwebtoken";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types";
import db from "@repo/db/client";
import cookieParser from "cookie-parser";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middlewares";
import cors from 'cors';
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.post("/api/signup", async (req, res) => {
    try {
        const parsedData = CreateUserSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.json({
                message: "invalid inputs",
                success: false,
            });
            return;
        }
        const User = await db.user.findFirst({
            where: {
                email: parsedData.data.email,
            },
        })
        console.log(User)
        if (User) {
            res.status(403).json({
                message: "User already exists with this email"
            })
            return;
        }
        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
        const user = await db.user.create({
            data: {
                email: parsedData.data.email,
                password: hashedPassword,
                name: parsedData.data.name,
            }
        })
        res.json({
            success: true,
            userId: user.id,
        })
    }
    catch (err) {
        console.log("error While Sign Up", err);
    }
})

app.post("/api/signin", async (req, res) => {
    try {
        const parsedData = SigninSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(403).json({
                message: "invalid inputs"
            });
            return;
        }
        const user = await db.user.findFirst({
            where: {
                email: parsedData.data.email,
            },
        })

        if (!user) {
            res.status(403).json({
                message: "User Does not exists with this email"
            })
            return;
        }
        if (user.password != parsedData.data.password) {
            res.json({
                message: "Password is incorrect"
            })
            return;
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        // res.cookie("token", token, {
        //     maxAge: 3600000
        // })
        res.json({
            token,
            success: true,
            message: "Login success"
        });

    }
    catch (err) {
        console.log("error in signin", err);
        res.send("error in signin");
        return;
    }
})

app.post("/api/room", middleware, async (req, res) => {
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
})

app.get("/chats/:roomId", async (req, res) => {
    const roomId = req.params.roomId;
    const chats = await db.chat.findMany({
        where: {
            roomId: Number(roomId),
        },
        include: {
            user: true
        },
        orderBy: {
            id: "desc"
        },
        take: 50,
    });
    res.json({
        chats
    })
})

app.post("/room/:slug", async (req, res) => {
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
    })
})

app.get("/", (req, res) => {
    res.send("hi there");
})
app.listen(4000, () => {
    console.log("http server is running on 4000");
})
