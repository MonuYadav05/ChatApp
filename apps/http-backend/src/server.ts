import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { createServer } from "http"
import routes from "./routes";
import { websocketController } from "./websocket";

const app = express();

const server = createServer(app);

websocketController(server);


app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // Allow requests with no origin (like mobile apps, Postman)
        return callback(null, true);
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use("/", routes);

app.get("/hi", (req, res) => {
    res.send("hi there");
})
server.listen(4000, () => {
    console.log("http + websocket server is running on 4000");
})
