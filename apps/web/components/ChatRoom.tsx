import axios from "axios"
import { BACKEND_URL } from "@/app/config";
import ChatRoomClient from "./ChatRoomClient";

async function getchats(roomId: number) {
    try {
        const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`)
        // console.log(res.data.chats)
        const messages: { message: string }[] = []
        res.data.chats.map((x: any) => messages.push({
            message: x.message
        }))
        return messages;
    } catch (err) {
        console.log("error in fetching old messages", err)
    }
}
export default async function ChatRoom({ roomId }: any) {
    console.log("hello from chatrom", roomId)
    const messages = await getchats(roomId)
    console.log(messages)
    if (!messages) {
        return <>Unable to Fetch Messages</>
    }
    return <ChatRoomClient roomId={roomId} messages={messages} />
} 