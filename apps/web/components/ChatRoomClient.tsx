"use client"
import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/hooks/useSocket"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, SmilePlus, User, Users } from "lucide-react";
import { Message } from "@/lib/types";



export default function ChatRoomClient({ roomId, Messages }: {
    roomId: number,
    Messages: Message[]
}) {

    const autoscrollRef = useRef<HTMLDivElement>(null);

    const { socket, loading } = useSocket();
    // const [messages, setChats] = useState(messages);
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>(Messages);
    const scrollToBottom = () => {
        autoscrollRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (socket && !loading) {
            socket.send(JSON.stringify({
                type: "join-room",
                roomId: roomId
            }));

            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if (parsedData.type == "chat") {
                    const newMessage = { message: parsedData.message, createdAt: new Date(parsedData.createdAt), id: parsedData.id, userName: parsedData.userName }
                    setMessages((prev) => [...prev, newMessage])
                }
            }
        }

    }, [socket, loading, roomId])


    return <div className="flex justify-center  h-[calc(100vh-3.5rem)]  bg-background">

        {/* Main Chat Area */}
        <div className=" flex flex-col w-[50vw]">
            {/* Chat Header */}
            <div className="h-14 border-b flex items-center px-4 bg-background">
                <h2 className="font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5" /> General
                </h2>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-4 pt-4 h-[calc(100vh-10rem)]" >
                <div className="space-y-4" >
                    {messages.map((message) => (
                        <Card key={message.id} className="p-4 bg-background">
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{message.userName}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(message.createdAt).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm">{message.message}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                    <div ref={autoscrollRef} />
                </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-background ">
                <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                        <SmilePlus className="h-4 w-4" />
                    </Button>
                    <Input placeholder="Type your message..." className="flex-1" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} />
                    <Button size="icon" onClick={() => {
                        socket?.send(JSON.stringify({
                            type: "chat",
                            message: currentMessage,
                            roomId: roomId
                        }));
                        setCurrentMessage("")
                    }}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
}