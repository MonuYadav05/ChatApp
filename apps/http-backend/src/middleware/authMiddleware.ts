import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
// require("dotenv").config;
import { JWT_SECRET } from "@repo/backend-common/config";

interface authReq extends Request {
    userId: String;
}
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"] || "";
    // console.log(token)
    // const token = req.cookies.token;

    const decode = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (decode) {
        // @ts-ignore
        req.userId = decode.id;
        next();
    }
    else res.status(403).json({
        error: "Unothorized"
    })
}