import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
// require("dotenv").config;
import { JWT_SECRET } from "@repo/backend-common/config";

interface authReq extends Request {
    userId: String;
}
export function middleware(req: authReq, res: Response, next: NextFunction) {
    const token = req.headers["authorization"] || "";

    const decode = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (decode) {
        req.userId = decode.userId;
        next();
    }
    else res.status(403).json({
        error: "Unothorized"
    })
}