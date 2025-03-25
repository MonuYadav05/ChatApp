import path from "path";
import dotenv from "dotenv";

// Load the .env file from the correct location
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const JWT_SECRET = process.env.JWT_SECRET || "135";
export const REDIS_AVIEN = process.env.REDIS_AVIEN || "";

console.log(JWT_SECRET)
console.log(process.env.REDIS_AVIEN);
console.log(REDIS_AVIEN);