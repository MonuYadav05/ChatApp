import { CreateUserSchema, SigninSchema } from "@repo/common/types";
import db from "@repo/db/client";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";

export const signup = async (req: any, res: any) => {
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
}

export const signin = async (req: any, res: any) => {

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
}