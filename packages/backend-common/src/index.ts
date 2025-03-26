import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
// console.log(path.resolve(process.cwd(), "../../.env"))
export const JWT_SECRET = process.env.JWT_SECRET || "123123";
export const REDIS_AVIEN = process.env.REDIS_AVIEN || "";

// console.log(JWT_SECRET)
// console.log(process.env.REDIS_AVIEN);
// console.log(REDIS_AVIEN);