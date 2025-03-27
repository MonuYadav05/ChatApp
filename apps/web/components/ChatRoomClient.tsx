'use client'
import { useEffect, useRef, useState } from 'react'
import { useSocket } from '@/hooks/useSocket'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, SmilePlus, User } from 'lucide-react'
import { Message } from '@/lib/types'
import { useSession } from 'next-auth/react'

export default function ChatRoomClient({
    roomId,
    Messages
}: {
    roomId: number
    Messages: Message[]
}) {
    const autoscrollRef = useRef<HTMLDivElement>(null)
    const { data: session } = useSession()
    const { socket, loading } = useSocket()
    // const [messages, setChats] = useState(messages);
    const [currentMessage, setCurrentMessage] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>(Messages)
    const scrollToBottom = () => {
        autoscrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (session && socket && socket.readyState === WebSocket.OPEN && !loading) {
            console.log('sending join room')
            console.log(session?.user?.name)
            socket.send(
                JSON.stringify({
                    type: 'join-room',
                    roomId: roomId,
                    userName: session?.user?.name
                })
            )

            socket.onmessage = event => {
                const parsedData = JSON.parse(event.data)
                if (parsedData.type == 'chat') {
                    console.log(parsedData)
                    const newMessage = {
                        message: parsedData.message,
                        createdAt: new Date(parsedData.createdAt),
                        userName: parsedData.userName
                    }
                    setMessages(prev => [...prev, newMessage])
                }
            }
        }
    }, [socket, loading, roomId])

    return (
        <div className='flex justify-center w-full h-[calc(100vh-3.5rem)] bg-background'>
            {/* Main Chat Area */}
            <div className='flex flex-col w-full md:w-[50vw]'>
                {/* Chat Header */}
                {/* <div className='h-14 border-b flex items-center px-4 bg-background'>
                    <h2 className='font-semibold flex items-center gap-2'>
                        <Users className='h-5 w-5' /> General
                    </h2>
                </div> */}

                {/* Messages */}
                <ScrollArea className='flex-1 md:px-4 px-1 pt-4 h-[calc(100vh-10rem)]'>
                    <div className='space-y-4'>
                        {messages.map((message, index) => {
                            const isSender = message.userName === session?.user?.name
                            //   @ts-ignore
                            const showAvatar = !isSender && (!messages[index - 1] || messages[index - 1].userName !== message.userName)
                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col ${isSender ? 'items-end' : 'items-start'
                                        }`}
                                >
                                    <div className='flex items-start  gap-2'>
                                        {!isSender && showAvatar && (
                                            <div className='h-8 w-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center'>
                                                <User className='h-4 w-4 text-primary' />
                                            </div>
                                        )}
                                        {(!isSender && showAvatar) && (
                                            <span className="text-xs font-medium text-muted-foreground ml-1 mb-1">
                                                {message.userName}
                                            </span>
                                        )}
                                    </div>
                                    <Card
                                        className={`p-2 m-[-4]  max-w-[75%] ${isSender
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-background ml-10 text-foreground'
                                            }`}
                                    >
                                        <div className='flex flex-col gap-1'>

                                            <div>
                                                <div className='flex items-center gap-2'>
                                                    <p className=' text-sm'>{message.message}</p>
                                                    <span className='text-xs mt-1 text-muted-foreground'>
                                                        {new Date(message.createdAt).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            )
                        })}
                        <div ref={autoscrollRef} />
                    </div>
                </ScrollArea>

                {/* Message Input */}
                <div className='p-4 border-t bg-background'>
                    <div className='flex gap-2'>
                        <Button variant='outline' size='icon'>
                            <SmilePlus className='h-4 w-4' />
                        </Button>
                        <Input
                            placeholder='Type your message...'
                            className='flex-1'
                            value={currentMessage}
                            onChange={e => setCurrentMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey && currentMessage.trim() !== "") {
                                    socket?.send(
                                        JSON.stringify({
                                            type: 'chat',
                                            message: currentMessage,
                                            roomId: roomId,
                                            userName: session?.user?.name
                                        })
                                    )
                                    setCurrentMessage("");
                                }
                            }}
                        />
                        <Button
                            size='icon'
                            onClick={() => {
                                if (currentMessage.trim() !== '') {
                                    socket?.send(
                                        JSON.stringify({
                                            type: 'chat',
                                            message: currentMessage,
                                            roomId: roomId,
                                            userName: session?.user?.name
                                        })
                                    )
                                    setCurrentMessage('')
                                }
                            }}
                        >
                            <Send className='h-4 w-4' />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
