"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hash, Lock, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { FRONTEND_URL } from "@/app/config";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

interface Room {
    id: number;
    type: string;
    createdAt: Date;
    description: string | null;
    slug: string;
    adminId: string;
}

const handleDeleteRoom = async (room: Room) => {
    try {
        const res = await axios.delete(`${FRONTEND_URL}/api/room`, {
            data: {
                slug: room.slug
            }
        });
        if (res.data.success) {
            toast.success("Room Deleted Successfully");
            window.location.reload();
        }
        else {
            toast.error("Room Delete Failed");
        }
    } catch (err) {
        console.log(err)
    }
}

export default function RoomListing({ Rooms }: { Rooms: Room[] }) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const router = useRouter();

    useEffect(() => {
        setRooms(Rooms);
    }, [Rooms]);

    const handleCheckPass = async (e: React.FormEvent<HTMLFormElement>, roomId: number, slug: string) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;
        try {
            const res = await axios.post(`${FRONTEND_URL}/api/room/checkpass`, {
                roomId,
                password,
            });
            if (res.data.success) {
                toast.success("Password is correct");
                router.push(`/room/${slug}`);
            }
            else {
                toast.error("Password is incorrect");
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="container mx-auto px-4">
            <ScrollArea className="h-[calc(100vh-1rem)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rooms.map((room) => (
                        <Card key={room.id} className="hover:shadow-lg bg-background transition-shadow">
                            <div className="flex justify-between">
                                <CardHeader className="w-full">
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
                                <CardContent>
                                    <div onClick={() => handleDeleteRoom(room)} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Trash className="h-4 w-4 cursor-pointer" />
                                    </div>
                                </CardContent>
                            </div>
                            <CardFooter className="flex justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Created {room.createdAt.toLocaleDateString()}
                                </span>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button >Join Room</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Enter Room Password</DialogTitle>
                                            <DialogDescription>
                                                Please enter the password to join the room "{room.slug}".
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={(e) => handleCheckPass(e, room.id, room.slug)} className="space-y-3">
                                            <Input
                                                id="password"
                                                name="password"
                                                placeholder="Enter room password"
                                                required
                                            />
                                            <DialogFooter>
                                                <Button >Submit</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
