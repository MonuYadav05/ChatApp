"use client"
import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket"

export default function ChatRoomClient({ roomId, messages }: {
    roomId: number,
    messages: { message: string }[]
}) {

    const { socket, loading } = useSocket();
    const [chats, setChats] = useState(messages);
    const [currentMessage, setCurrentMessage] = useState<string>();

    useEffect(() => {
        if (socket && !loading) {
            socket.send(JSON.stringify({
                type: "join-room",
                roomId: roomId
            }));

            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if (parsedData.type == "chat") {
                    setChats((prev) => [...prev, { message: parsedData.message }])
                }
            }
        }

    }, [socket, loading, roomId])

    return <div>
        {chats.map((x, idx) => (<div key={idx}>{x.message}</div>))}
        <input style={{
            padding: "7px"
        }} className="mx-6 border border-b-amber-50 rounded-xl " type="text" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} placeholder="enter message" />
        <button style={{
            padding: "6px"
        }}
            className=" border-amber-50 border rounded-2xl  cursor-pointer" onClick={() => {
                socket?.send(JSON.stringify({
                    type: "chat",
                    message: currentMessage,
                    roomId: roomId
                }));
                setCurrentMessage("")

            }}>Send</button>
    </div>
}