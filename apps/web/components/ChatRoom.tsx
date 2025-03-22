import axios from "axios"
import { BACKEND_URL } from "@/app/config";
import ChatRoomClient from "./ChatRoomClient";
import { Message } from "@/lib/types";


async function getchats(roomId: number) {
    try {
        const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`)
        const messages: Message[] = [];
        res.data.chats.map((x: any) => {
            messages.push({
                id: x?.id,
                createdAt: new Date(x.createdAt),
                message: x?.message,
                userName: x?.user?.name,
            })
        })
        return messages;
    } catch (err) {
        console.log("error in fetching old messages", err)
    }
}
export default async function ChatRoom({ roomId }: any) {
    console.log("hello from chatrom", roomId)
    const messages = await getchats(roomId)
    if (!messages) {
        return <>Unable to Fetch Messages</>
    }
    return <ChatRoomClient roomId={roomId} Messages={messages} />
} 