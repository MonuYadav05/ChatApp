"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Hash, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Room {
    id: number;
    type: string;
    createdAt: Date;
    description: string | null;
    slug: string;
    adminId: string;
}

export default function RoomListing({ Rooms }: { Rooms: Room[] }) {

    const [rooms, setRooms] = useState<Room[]>([]);
    useEffect(() => {
        setRooms(Rooms);
    }, [Rooms]);

    return <div className="container mx-auto px-4 ">
        <ScrollArea className="h-[calc(100vh-1rem)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                    <Card key={room.id} className="hover:shadow-lg bg-background transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {room.type === "public" ? (
                                    <Hash className="h-5 w-5 text-primary" />
                                ) : (
                                    <Lock className="h-5 w-5 text-primary" />
                                )}
                                {room.slug}
                            </CardTitle>
                            <CardDescription>{room?.description}</CardDescription>
                        </CardHeader>
                        {/* <CardContent>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                {room.members} members
                            </div>
                        </CardContent> */}
                        <CardFooter className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                                Created {room.createdAt.toLocaleDateString()}
                            </span>
                            <Button >
                                <Link href={`/room/${room.slug}`}>Join Room</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    </div>
}